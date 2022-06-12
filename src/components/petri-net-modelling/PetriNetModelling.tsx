import { useState, useRef, useCallback, useEffect } from 'react'
import ReactFlow, {
    Controls,
    Background,
    ControlButton,
    addEdge,
    Node,
    ReactFlowProvider,
    ReactFlowInstance,
    Edge,
    Connection,
    NodeChange,
    applyNodeChanges,
    applyEdgeChanges,
    EdgeChange,
} from 'react-flow-renderer'
import Grid4x4Icon from '@mui/icons-material/Grid4x4'
import SideBar from './Sidebar'
import ActionButtons from './ActionButtons'
import PlaceNode from './PlaceNode'
import TransitionNode from './TransitionNode'
import TextField from '@mui/material/TextField'
import { useParams } from 'react-router-dom'
import { getPetriNetById } from '../../api/petri-net-modelling'
import { toast } from 'react-toastify'
import ChangeNodeDialog from './modals/ChangeNodeDialog'
import { Token } from '../../models/PetrinetModels'

const nodeTypes = { placeNode: PlaceNode, transitionNode: TransitionNode }

let nextNodeId = 1
const getNextNodeId = () => `${nextNodeId++}`
const nodeIdsToTypes = new Map<string, string>()

export interface NodeDataProbs {
    name: string
    setSelectedNode: (value: Node) => void
    numberOfTokens?: number
    tokens?: Token[]
}

export interface EdgeDataProbs {
    name: string
}

export default function PetriNetModelling() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [showBackground, setShowBackground] = useState(false)
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)

    // Petri Net state
    const [nodes, setNodes] = useState<Node<NodeDataProbs>[]>([])
    const [edges, setEdges] = useState<Edge<EdgeDataProbs>[]>([])
    const [petriNetName, setPetriNetName] = useState<string>('untitled')
    const { petriNetId } = useParams()

    useEffect(() => {
        if (petriNetId !== 'new') {
            fetchPetriNet()
        }
    }, [petriNetId])

    const fetchPetriNet = async () => {
        const response = await getPetriNetById(Number(petriNetId))
        if (response.successful) {
            const nodes = response.data.places.map((p) => {
                const position = p.position
                    ? p.position
                    : { x: Math.random() * 300, y: Math.random() * 300 }
                return {
                    id: p.id.toString(),
                    type: PlaceNode.displayName,
                    position: position,
                    data: {
                        name: p.name,
                        setSelectedNode: setSelectedNode,
                    },
                } as Node
            })
            nodes.push(
                ...response.data.transitions.map((t) => {
                    const position = t.position
                        ? t.position
                        : { x: Math.random() * 300, y: Math.random() * 300 }
                    return {
                        id: t.id.toString(),
                        type: TransitionNode.displayName,
                        position: position,
                        data: {
                            name: t.name,
                            setSelectedNode: setSelectedNode,
                        },
                    } as Node<NodeDataProbs>
                })
            )
            setNodes(nodes)
            const newEdges = response.data.arcs.map((a) => {
                return {
                    id: `${Math.random() * 100}`,
                    source: a.sourceNode.toString(),
                    target: a.targetNode.toString(),
                    animated: true,
                } as Edge<EdgeDataProbs>
            })
            setEdges(newEdges)

            setPetriNetName(response.data.name)
            response.data.places.forEach((n) =>
                nodeIdsToTypes.set(`${n.id}`, PlaceNode.displayName ?? 'default')
            )
            response.data.transitions.forEach((n) =>
                nodeIdsToTypes.set(`${n.id}`, PlaceNode.displayName ?? 'default')
            )
            nextNodeId = Math.max(...nodes.map((n) => Number(n.id))) + 1
            toast.success('Retrieved petri net')
        } else {
            toast.error('Could not retrieve petri net')
        }
    }

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    )

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    )

    const onConnect = useCallback(
        (params: Connection | Edge) => {
            setEdges((eds) => {
                const edge: Connection | Edge = {
                    ...params,
                    animated: true,
                }
                if (edge.source === null) {
                    return eds
                }
                if (edge.target === null) {
                    return eds
                }
                if (nodeIdsToTypes.get(edge.source) !== nodeIdsToTypes.get(edge.target)) {
                    return addEdge(edge, eds)
                } else {
                    return eds
                }
            })
        },
        [setEdges]
    )

    const onRemoveNode = (id: string) => {
        nodeIdsToTypes.delete(id)
        setNodes(nodes.filter((node) => node.id !== id))
        setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id))
    }

    const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event: React.DragEvent<HTMLDivElement>) => {
            if (reactFlowWrapper && reactFlowWrapper.current && reactFlowInstance) {
                event.preventDefault()

                const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()

                const type = event.dataTransfer.getData('application/reactflow')

                // check if the dropped element is valid
                if (typeof type === 'undefined' || !type) {
                    return
                }
                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds?.left,
                    y: event.clientY - reactFlowBounds.top,
                })
                const nodeId = getNextNodeId()
                const newNode: Node<NodeDataProbs> = {
                    id: nodeId,
                    type,
                    position,
                    data: { name: `${type} node ${nodeId}`, setSelectedNode: setSelectedNode },
                }
                nodeIdsToTypes.set(nodeId, type)
                setNodes((nds) => nds.concat(newNode))
            }
        },
        [reactFlowInstance, setNodes]
    )

    return (
        <>
            <SideBar openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
            <TextField
                label="Petri Net name"
                variant="outlined"
                size="small"
                style={{
                    backgroundColor: 'white',
                    position: 'absolute',
                    zIndex: '5',
                    top: '75px',
                    left: openDrawer ? '200px' : '85px',
                    transition: 'left 0.225s cubic-bezier(0.4, 0, 0.6, 1) 0s',
                }}
                value={petriNetName}
                onChange={(e) => setPetriNetName(e.target.value)}
            />
            <ActionButtons
                style={{
                    position: 'absolute',
                    zIndex: '5',
                    top: '75px',
                    right: '40px',
                }}
                nodes={nodes}
                edges={edges}
                petriNetId={petriNetId ?? ''}
                petriNetName={petriNetName}
                setNodes={setNodes}
                setEdges={setEdges}
                setSelectedNode={setSelectedNode}
            />
            <ReactFlowProvider>
                <div className="reactflow-wrapper" ref={reactFlowWrapper}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        onInit={setReactFlowInstance}
                        onDrop={onDrop}
                        onDragOver={onDragOver}
                        fitView
                        style={{ height: '100vh' }}
                        nodeTypes={nodeTypes}
                    >
                        <Controls style={{ bottom: '40px', right: '30px', left: 'auto' }}>
                            <ControlButton
                                onClick={() => setShowBackground(!showBackground)}
                                title="show grid background"
                            >
                                <Grid4x4Icon />
                            </ControlButton>
                        </Controls>
                        {showBackground && <Background />}
                    </ReactFlow>
                </div>
            </ReactFlowProvider>

            {/* Modals/Dialogs */}
            <ChangeNodeDialog
                selectedNode={selectedNode}
                onClose={() => setSelectedNode(null)}
                onDelete={() => {
                    if (selectedNode) onRemoveNode(selectedNode.id)
                    setSelectedNode(null)
                }}
            />
        </>
    )
}
