import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import { Dialog, DialogTitle, List, ListItem, ListItemAvatar, Avatar, Tooltip } from '@mui/material'
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CloseIcon from '@mui/icons-material/Close'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone'
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone'
import { getPetriNetById, savePetriNet } from '../../api/petri-net-modelling'
import { toast } from 'react-toastify'
import { PetriNet, Place, Transition, Arc } from '../../models/PetrinetModels'
import ReactFlow, { Node, Edge } from 'react-flow-renderer'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'

interface ActionButtons {
    style?: React.CSSProperties | undefined
    nodes: Node<Node<any>[]>[]
    edges: Edge<any>[]
    setNodes: any
    setEdges: any
    setSelectedNode: any
}

const { Dragger } = Upload

const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file
        if (status !== 'uploading') {
            console.log(info.file, info.fileList)
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`)
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files)
    },
}

export interface UploadDialogProps {
    open: boolean
    onClose: () => void
}

function UploadDialog(props: UploadDialogProps) {
    const { onClose, open } = props

    const handleClose = () => {
        console.log('closing upload modal')
    }

    return (
        <Dialog PaperProps={{ sx: { width: '50%' } }} onClose={handleClose} open={open}>
            <DialogTitle>
                Upload file
                {onClose ? (
                    <IconButton
                        aria-label="close"
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                ) : null}
            </DialogTitle>
            <div style={{ margin: '30px 80px 50px 80px' }}>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">
                        Support for a single or bulk upload. Strictly prohibit from uploading
                        company data or other band files
                    </p>
                </Dragger>
            </div>
        </Dialog>
    )
}

export default function ActionButtons({
    style,
    nodes,
    edges,
    setNodes,
    setEdges,
    setSelectedNode,
}: ActionButtons) {
    const [ulpoadModalOpen, setUploadModalOpen] = useState(false)

    const handleClickUpload = () => {
        setUploadModalOpen(true)
    }

    const handleCloseUploadModal = () => {
        setUploadModalOpen(false)
    }

    const getCurrentPetriNet = () => {
        const petriNet = {} as PetriNet
        petriNet.id = 0
        // TODO: Retrieve name of PetriNet
        petriNet.name = 'PetriNetTest'
        petriNet.arcs = []
        petriNet.places = []
        petriNet.transitions = []
        nodes.forEach(function (node: Node<Node<any>[]>) {
            if (node.type === 'place') {
                const place = {} as Place
                place.placeId = Number(node.id)
                const placeData: any = node.data
                place.name = placeData.title ?? placeData.label
                place.name += place.placeId
                // TODO: retrieve number of tokens
                place.numberOfTokens = 0
                petriNet.places.push(place)
            } else {
                const transition = {} as Transition
                transition.transitionId = Number(node.id)
                const transData: any = node.data
                transition.name = transData.title ?? transData.label
                transition.name += transition.transitionId
                petriNet.transitions.push(transition)
            }
        })
        edges.forEach(function (edge: Edge<any>) {
            console.log(edge)
            const arc = {} as Arc
            arc.id = Number(edge.id)
            arc.sourceNode = Number(edge.source)
            arc.targetNode = Number(edge.target)
            petriNet.arcs.push(arc)
        })
        return petriNet
    }

    const loadPetriNet = (petriNet: PetriNet) => {
        const nodes: any = []
        const edges: any = []
        petriNet.places.forEach(function (place) {
            nodes.push({
                id: place.placeId.toString(),
                type: 'place',
                position: { x: 0, y: 0 },
                data: { label: place.name, setSelectedNode: setSelectedNode },
            })
        })

        petriNet.transitions.forEach(function (transition) {
            nodes.push({
                id: transition.transitionId.toString(),
                type: 'transition',
                position: { x: 0, y: 0 },
                data: { label: transition.name, setSelectedNode: setSelectedNode },
            })
        })

        petriNet.arcs.forEach(function (arc) {
            edges.push({
                id: arc.id.toString(),
                source: arc.sourceNode.toString(),
                target: arc.targetNode.toString(),
            })
        })
        setNodes(nodes)
        setEdges(edges)
    }

    return (
        <div style={style}>
            <Tooltip title="Delete">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Save">
                <IconButton
                    onClick={async () => {
                        /*const response1 = await getPetriNetById(1)
                        if (response1.successful) {
                            console.log(response1.data)
                        }*/
                        const petriNet = getCurrentPetriNet()
                        //console.log(JSON.stringify(petriNet))
                        const response = await savePetriNet(petriNet)
                        if (response.successful) {
                            toast.success(response.status)
                        } else {
                            // TODO: message is always just "Something went wrong"
                            toast.error(response.message)
                        }
                    }}
                    sx={{ margin: '0px 5px 0px 5px' }}
                >
                    <SaveIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Upload">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }} onClick={handleClickUpload}>
                    <UploadTwoToneIcon sx={{ color: 'blue' }} />
                </IconButton>
            </Tooltip>
            <UploadDialog open={ulpoadModalOpen} onClose={handleCloseUploadModal} />
            <Tooltip title="Download">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }}>
                    <FileDownloadTwoToneIcon sx={{ color: 'blue' }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Validate">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }}>
                    <CheckCircleTwoToneIcon sx={{ color: 'blue' }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Simulate">
                <IconButton sx={{ margin: '0px 5px 0px 0px' }}>
                    <PlayArrowTwoToneIcon sx={{ color: 'green' }} />
                </IconButton>
            </Tooltip>
        </div>
    )
}
