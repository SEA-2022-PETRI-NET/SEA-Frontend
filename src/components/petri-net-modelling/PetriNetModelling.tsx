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
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import TextField from '@mui/material/TextField'
import { useParams } from 'react-router-dom'
import { getPetriNetById } from '../../api/petri-net-modelling'
import { toast } from 'react-toastify'

const nodeTypes = { placeNode: PlaceNode, transitionNode: TransitionNode }

let id = 1
const getId = () => `${id++}`
const idToType = new Map()

export default function PetriNetModelling() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [showBackground, setShowBackground] = useState(false)
    const [nodes, setNodes] = useState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)

    const { petriNetId } = useParams()

    const isValidConnection = (connection: Connection) =>
        typeof connection.source !== typeof connection.target

    useEffect(() => {
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
                            label: `${PlaceNode.displayName} node`,
                            setSelectedNode: setSelectedNode,
                        },
                    } as Node
                })
                nodes.concat(
                    response.data.transitions.map((t) => {
                        const position = t.position
                            ? t.position
                            : { x: Math.random() * 300, y: Math.random() * 300 }
                        return {
                            id: t.id.toString(),
                            type: TransitionNode.displayName,
                            position: position,
                            data: {
                                label: `${PlaceNode.displayName} node`,
                                setSelectedNode: setSelectedNode,
                            },
                        } as Node
                    })
                )
                setNodes(nodes)
                toast.success('Retrieved petri net')
            } else {
                toast.error('Could not retrieve petri net')
            }
        }
        if (petriNetId !== 'new') {
            fetchPetriNet()
        }
    }, [petriNetId])

    const onNodesChange = useCallback(
        (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
        [setNodes]
    )

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
        [setEdges]
    )

    const onConnect = useCallback(
        (params: Connection | Edge) =>
            setEdges((eds) => {
                const edge: Connection | Edge = {
                    ...params,
                    animated: true,
                }
                if (idToType.get(edge.source) !== idToType.get(edge.target)) {
                    return addEdge(edge, eds)
                } else {
                    return eds
                }
            }),
        [setEdges]
    )
    /*     const onRemoveEdge = useCallback(
        (id: string) => setEdges((eds) => eds.filter((ed) => ed.id !== id)),
        []
    ) */
    const onRemoveNode = (id: string) => {
        setNodes(nodes.filter((node) => node.id !== id))
        setEdges(edges.filter((edge) => edge.source !== id && edge.target !== id))
    }

    const onDragOver = useCallback((event: any) => {
        event.preventDefault()
        event.dataTransfer.dropEffect = 'move'
    }, [])

    const onDrop = useCallback(
        (event: any) => {
            if (reactFlowWrapper && reactFlowWrapper.current && reactFlowInstance) {
                event.preventDefault()

                const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect()

                const type = event.dataTransfer.getData('application/reactflow')

                // check if the dropped element is valid
                if (typeof type === 'undefined' || !type) {
                    return
                }
                idToType.set(id.toString(), type)

                const position = reactFlowInstance.project({
                    x: event.clientX - reactFlowBounds?.left,
                    y: event.clientY - reactFlowBounds.top,
                })
                const newNode: Node = {
                    id: getId(),
                    type,
                    position,
                    data: { label: `${type} node`, setSelectedNode: setSelectedNode },
                }

                setNodes((nds) => nds.concat(newNode))
            }
        },
        [reactFlowInstance, setNodes]
    )

    return (
        <>
            <SideBar openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
            <ActionButtons
                style={{
                    position: 'absolute',
                    zIndex: '5',
                    top: '75px',
                    right: '40px',
                }}
                nodes={nodes}
                edges={edges}
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
            <Dialog open={!!selectedNode} onClose={() => setSelectedNode(null)}>
                <DialogTitle style={{ cursor: 'move' }}>
                    {selectedNode?.data.title ? selectedNode?.data.title : selectedNode?.data.label}
                    <IconButton
                        aria-label="close"
                        onClick={() => setSelectedNode(null)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <TextField
                            id="outlined-basic"
                            label="Title"
                            variant="outlined"
                            value={selectedNode?.data.title}
                        />
                        <TextField
                            id="outlined-basic"
                            label="Tokens"
                            type="number"
                            variant="outlined"
                        />
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <IconButton
                        sx={{ margin: '0px 5px 0px 5px' }}
                        onClick={() => {
                            if (selectedNode) onRemoveNode(selectedNode.id)
                            setSelectedNode(null)
                        }}
                    >
                        <DeleteIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    )
}
