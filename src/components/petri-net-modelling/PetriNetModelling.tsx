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
    OnConnectStartParams,
    NodeChange,
    applyNodeChanges,
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

export interface NodeDataProps {
    name: string
    setSelectedNode: (value: Node<NodeDataProps>) => void
    numberOfTokens?: number
    tokens?: Token[]
}

export interface EdgeDataProps {
    name: string
}

let connectionSource = ''
let connectionFromTop = true

export default function PetriNetModelling() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [showBackground, setShowBackground] = useState(false)
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)

    // Petri Net state
    const [nodes, setNodes] = useState<Node<NodeDataProps>[]>([])
    const [edges, setEdges] = useState<Edge<EdgeDataProps>[]>([])
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
            const fetchedNodes = response.data.places.map((p) => {
                const position = p.position
                    ? p.position
                    : { x: Math.random() * 300, y: Math.random() * 300 }
                return {
                    id: p.placeId.toString(),
                    type: PlaceNode.displayName,
                    position: position,
                    data: {
                        name: p.name,
                        setSelectedNode: setSelectedNode,
                    },
                } as Node
            })
            fetchedNodes.push(
                ...response.data.transitions.map((t) => {
                    const position = t.position
                        ? t.position
                        : { x: Math.random() * 300, y: Math.random() * 300 }
                    return {
                        id: t.transitionId.toString(),
                        type: TransitionNode.displayName,
                        position: position,
                        data: {
                            name: t.name,
                            setSelectedNode: setSelectedNode,
                        },
                    } as Node<NodeDataProps>
                })
            )
            setNodes(fetchedNodes)
            const fetchedEdges = response.data.arcs.map((a) => {
                return {
                    source: a.sourceNode.toString(),
                    target: a.targetNode.toString(),
                    animated: true,
                } as Edge<EdgeDataProps>
            })
            setEdges(fetchedEdges)

            setPetriNetName(response.data.name)
            response.data.places.forEach((n) =>
                nodeIdsToTypes.set(`${n.placeId}`, PlaceNode.displayName ?? 'default')
            )
            response.data.transitions.forEach((n) =>
                nodeIdsToTypes.set(`${n.transitionId}`, TransitionNode.displayName ?? 'default')
            )
            nextNodeId = Math.max(...fetchedNodes.map((n) => Number(n.id))) + 1
            toast.success('Retrieved petri net')
        } else {
            toast.error('Could not retrieve petri net')
        }
    }

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    )

    function onChangeSelectedNode(id: string | undefined, data: NodeDataProps) {
        setSelectedNode((n) => {
            return { ...n, data: data } as Node
        })
        setNodes((nds) =>
            nds.map((node) => {
                if (node.id !== id) {
                    return node
                }

                return {
                    ...node,
                    data: data,
                }
            })
        )
    }

    const onConnectStart = (event: React.MouseEvent, { nodeId }: OnConnectStartParams) => {
        if (nodeId && reactFlowWrapper && reactFlowWrapper.current && reactFlowInstance) {
            event.preventDefault()
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            const sourceNode = nodes.find((node) => node.id === nodeId)
            connectionSource = nodeId
            const mousePosition = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds?.left,
                y: event.clientY - reactFlowBounds.top,
            })
            if (sourceNode && mousePosition.y - 10 <= sourceNode?.position.y) {
                connectionFromTop = true
            } else {
                connectionFromTop = false
            }
        }
    }

    const onConnectEnd = (event: MouseEvent) => {
        if (reactFlowWrapper && reactFlowWrapper.current && reactFlowInstance) {
            event.preventDefault()
            const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()
            const mousePosition = reactFlowInstance.project({
                x: event.clientX - reactFlowBounds?.left,
                y: event.clientY - reactFlowBounds.top,
            })

            let foundCloseNode = false

            for (const node of nodes) {
                if (!node.width || !node.height) {
                    break
                }
                if (
                    node.position.x < mousePosition.x &&
                    mousePosition.x < node.position.x + node.width &&
                    node.position.y - 10 < mousePosition.y &&
                    mousePosition.y < node.position.y + node.height + 10
                ) {
                    foundCloseNode = true
                    break
                }
            }
            if (!foundCloseNode) {
                const newNodePosition = {
                    x: mousePosition.x - 48,
                    y: mousePosition.y,
                }
                const newNodeId = getNextNodeId()
                let newNodeType = PlaceNode.displayName
                console.log(nodeIdsToTypes.get(connectionSource))
                if (nodeIdsToTypes.get(connectionSource) === PlaceNode.displayName) {
                    newNodeType = TransitionNode.displayName
                }
                const newNode: Node = {
                    id: newNodeId,
                    type: newNodeType,
                    position: newNodePosition,
                    data: {
                        label: `${newNodeType} node`,
                        setSelectedNode: setSelectedNode,
                    },
                }
                const newEdge: Edge = {
                    id: 'e' + connectionSource + '-' + newNodeId,
                    source: connectionSource,
                    target: newNodeId,
                    animated: true,
                }
                if (connectionFromTop) {
                    newEdge.id = 'e' + newNodeId + '-' + connectionSource
                    newEdge.source = newNodeId
                    newEdge.target = connectionSource
                    if (newNode.type === PlaceNode.displayName) {
                        newNode.position.y -= 96
                    } else {
                        newNode.position.y -= 176
                    }
                }

                if (newNodeType) {
                    nodeIdsToTypes.set(newNodeId, newNodeType)
                }
                setNodes((nds) => nds.concat(newNode))
                setEdges((eds) => eds.concat(newEdge))
            }
        }
    }

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
        setNodes((nds) => nds.filter((node) => node.id !== id))
        setEdges((edgs) => edgs.filter((edge) => edge.source !== id && edge.target !== id))
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
                const newNode: Node<NodeDataProps> = {
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
                        onConnect={onConnect}
                        onConnectStart={onConnectStart}
                        onConnectEnd={onConnectEnd}
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
                changeSelectedNode={onChangeSelectedNode}
            />
        </>
    )
}
