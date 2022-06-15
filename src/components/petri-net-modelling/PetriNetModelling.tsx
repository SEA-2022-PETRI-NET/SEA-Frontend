import { useState, useEffect, useRef, useCallback } from 'react'
import ReactFlow, {
    Controls,
    Background,
    ControlButton,
    addEdge,
    useNodesState,
    useEdgesState,
    Node,
    ReactFlowProvider,
    ReactFlowInstance,
    Edge,
    Connection,
    applyEdgeChanges,
    EdgeChange,
    HandleType,
    OnConnectStartParams,
    HandleElement,
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

// import initialEdges from './initialEdges'
const initialEdges = [
    { id: 'e1-2', source: '99', target: '99' },
    { id: 'e2-3', source: '99', target: '99', animated: true },
]

const nodeTypes = { place: PlaceNode, transition: TransitionNode }

let id = 1
const getId = () => `${id++}`
const idToType = new Map()

export default function PetriNetModelling() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [showBackground, setShowBackground] = useState(false)
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([])
    const [edges, setEdges] = useState(initialEdges)

    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    const [connectionSource, setConnectionSource] = useState<string | null>(null)

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
                console.log(id, type)

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

    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            console.log('edge changes 1:', changes)
            return setEdges((eds) => {
                console.log('edge changes 2:', changes)
                return applyEdgeChanges(changes, eds)
            })
        },
        [setEdges]
    )

    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

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
                        onConnectStart={(
                            event: React.MouseEvent,
                            { nodeId, handleType }: OnConnectStartParams
                        ) => {
                            setConnectionSource(nodeId)
                            console.log('connect start from', nodeId, event)
                        }}
                        onConnectStop={(event: MouseEvent) => console.log('connect stop', event)}
                        onConnectEnd={async (event: MouseEvent) => {
                            console.log('connect end (from', connectionSource, ')', event)

                            if (reactFlowWrapper && reactFlowWrapper.current && reactFlowInstance) {
                                event.preventDefault()
                                const reactFlowBounds =
                                    reactFlowWrapper.current.getBoundingClientRect()
                                const mousePosition = reactFlowInstance.project({
                                    x: event.clientX - reactFlowBounds?.left,
                                    y: event.clientY - reactFlowBounds.top,
                                })

                                console.log('mouse pos:', mousePosition)

                                let foundCloseNode = false

                                for (const node of nodes) {
                                    if (!node.width || !node.height) {
                                        break
                                    }
                                    console.log(
                                        'node x',
                                        node.position.x,
                                        'y',
                                        node.position.y,
                                        'width',
                                        node.width,
                                        'height',
                                        node.height,
                                        node
                                    )
                                    node.handleBounds?.source?.forEach((element: HandleElement) => {
                                        console.log(element)
                                    })
                                    node.handleBounds?.target?.forEach((element: HandleElement) => {
                                        console.log(element)
                                    })

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
                                    console.log('creating new node..')
                                    const newNodePosition = {
                                        x: mousePosition.x - 48,
                                        y: mousePosition.y,
                                    }
                                    const newNode: Node = {
                                        id: getId(),
                                        type: 'place',
                                        position: newNodePosition,
                                        data: {
                                            // label: `${type} node`,
                                            label: `new node`,
                                            setSelectedNode: setSelectedNode,
                                        },
                                    }

                                    setNodes((nds) => nds.concat(newNode))
                                }
                            }
                        }}
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
