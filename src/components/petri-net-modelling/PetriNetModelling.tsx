import { useState, useRef, useCallback } from 'react'
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
    MarkerType,
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

export default function PetriNetModelling() {
    const reactFlowWrapper = useRef<HTMLDivElement>(null)
    const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)
    const [openDrawer, setOpenDrawer] = useState(false)
    const [showBackground, setShowBackground] = useState(false)
    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([])
    const [edges, setEdges, onEdgesChange] = useEdgesState([])
    const [selectedNode, setSelectedNode] = useState<Node | null>(null)

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
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
