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
    const [openPlaceDialog, setOpenPlaceDialog] = useState(false)

    const onConnect = useCallback((params: any) => setEdges((eds) => addEdge(params, eds)), [])

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
                    data: { label: `${type} node`, setOpenDialog: setOpenPlaceDialog },
                }

                setNodes((nds) => nds.concat(newNode))
            }
        },
        [reactFlowInstance]
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
            <Dialog open={openPlaceDialog} onClose={() => setOpenPlaceDialog(false)}>
                <DialogTitle style={{ cursor: 'move' }}>
                    Subscribe
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenPlaceDialog(false)}
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
                        To subscribe to this website, please enter your email address here. We will
                        send updates occasionally.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <IconButton
                        sx={{ margin: '0px 5px 0px 5px' }}
                        onClick={() => console.log('delete')}
                    >
                        <DeleteIcon />
                    </IconButton>
                </DialogActions>
            </Dialog>
        </>
    )
}
