import { useState, useRef, useCallback } from 'react'
import ReactFlow, {
    Controls,
    Background,
    ControlButton,
    addEdge,
    useNodesState,
    Node,
    ReactFlowProvider,
    ReactFlowInstance,
    Edge,
    Connection,
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

const nodeTypes = { place: PlaceNode, transition: TransitionNode }

let id = 1
const getId = () => `${id++}`
const idToType = new Map<string | null, string>()

let connectionSource = ''
let connectionFromTop = true

export default function PetriNetModelling() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [showBackground, setShowBackground] = useState(false)
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([])
    const [edges, setEdges] = useState<Edge[]>([])

    const [selectedNode, setSelectedNode] = useState<Node | null>(null)
    // const [connectionSource, setConnectionSource] = useState<string | null>(null)

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
                        onConnect={onConnect}
                        onConnectStart={(
                            event: React.MouseEvent,
                            { nodeId, handleType }: OnConnectStartParams
                        ) => {
                            if (
                                nodeId &&
                                reactFlowWrapper &&
                                reactFlowWrapper.current &&
                                reactFlowInstance
                            ) {
                                event.preventDefault()
                                const reactFlowBounds =
                                    reactFlowWrapper.current.getBoundingClientRect()
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
                        }}
                        onConnectEnd={async (event: MouseEvent) => {
                            if (reactFlowWrapper && reactFlowWrapper.current && reactFlowInstance) {
                                event.preventDefault()
                                const reactFlowBounds =
                                    reactFlowWrapper.current.getBoundingClientRect()
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
                                    const newNodeId = getId()
                                    let newNodeType = 'place'
                                    if (idToType.get(connectionSource) === 'place') {
                                        newNodeType = 'transition'
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
                                        if (newNode.type === 'place') {
                                            newNode.position.y -= 96
                                        } else {
                                            newNode.position.y -= 176
                                        }
                                    }

                                    idToType.set(newNodeId, newNodeType)
                                    setNodes((nds) => nds.concat(newNode))
                                    setEdges((eds) => eds.concat(newEdge))
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
