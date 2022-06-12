import { useState } from 'react'
import IconButton from '@mui/material/IconButton'
import { Tooltip } from '@mui/material'
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone'
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone'
import {
    savePetriNet,
    updatePetriNet,
    validatePetriNet,
    deletePetriNet,
} from '../../api/petri-net-modelling'
import { toast } from 'react-toastify'
import { PetriNet, Place, Transition, Arc } from '../../models/PetrinetModels'
import { Node, Edge } from 'react-flow-renderer'
import UploadPetriNetDialog from './modals/UploadPetriNetDialog'
import { useNavigate, useParams } from 'react-router-dom'
import { EdgeDataProbs, NodeDataProbs } from './PetriNetModelling'
import PlaceNode from './PlaceNode'
import TransitionNode from './TransitionNode'

interface ActionButtons {
    style?: React.CSSProperties | undefined
    nodes: Node<NodeDataProbs>[]
    edges: Edge<EdgeDataProbs>[]
    petriNetId: string
    petriNetName: string
    setNodes: (nodes: Node<NodeDataProbs>[]) => void
    setEdges: (edges: Edge<EdgeDataProbs>[]) => void
    setSelectedNode: (value: Node) => void
}

export default function ActionButtons({
    style,
    nodes,
    edges,
    petriNetName,
    petriNetId,
    setNodes,
    setEdges,
    setSelectedNode,
}: ActionButtons) {
    const [uploadModalOpen, setUploadModalOpen] = useState(false)
    const navigate = useNavigate()

    const getCurrentPetriNet = () => {
        const arcs: Arc[] = []
        const places: Place[] = []
        const transitions: Transition[] = []
        nodes.forEach(function (node: Node<NodeDataProbs>) {
            if (node.type === PlaceNode.displayName) {
                places.push({
                    placeId: Number(node.id),
                    name: node.data.name,
                    numberOfTokens: node.data.numberOfTokens,
                    tokens: node.data.tokens,
                } as Place)
            }
            if (node.type === TransitionNode.displayName) {
                transitions.push({
                    transitionId: Number(node.id),
                    name: node.data.name,
                } as Transition)
            }
        })
        edges.forEach((edge: Edge<EdgeDataProbs>) => {
            arcs.push({
                id: Number(edge.id),
                sourceNode: Number(edge.source),
                targetNode: Number(edge.target),
            } as Arc)
        })
        return {
            name: petriNetName,
            arcs,
            places,
            transitions,
        } as PetriNet
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

    const onSavePetriNet = async () => {
        const petriNet = getCurrentPetriNet()
        if (petriNetId === 'new') {
            const response = await savePetriNet(petriNet)
            if (response.successful) {
                toast.success('Saved sucessfully')
                navigate(`/modelling/${response.data.id}`)
            } else {
                toast.error(response.message)
            }
        } else {
            const response = await updatePetriNet(petriNetId, petriNet)
            if (response.successful) {
                toast.success('Saved sucessfully')
            } else {
                toast.error(response.message)
            }
        }
    }

    const onDownloadPetriNet = async () => {
        const petriNet = getCurrentPetriNet()
        const blob = new Blob([JSON.stringify(petriNet)], {
            type: 'application/json',
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = petriNet.name + '.json'
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
    }

    const onValidatePetriNet = async () => {
        const petriNet = getCurrentPetriNet()
        const response = await validatePetriNet(petriNet)
        if (response.successful) {
            toast.success('Petri net is valid')
        } else {
            toast.error(response.message)
        }
    }

    const onDeletePetriNet = async () => {
        if (petriNetId === 'new') {
            navigate('/')
        } else {
            const response = await deletePetriNet(Number(petriNetId))
            if (response.successful) {
                toast.success(response.status)
                navigate('/')
            } else {
                toast.error(response.message)
            }
        }
    }

    return (
        <>
            <div style={style}>
                <Tooltip title="Delete">
                    <IconButton onClick={onDeletePetriNet} sx={{ margin: '0px 5px 0px 5px' }}>
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Save">
                    <IconButton onClick={onSavePetriNet} sx={{ margin: '0px 5px 0px 5px' }}>
                        <SaveIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Upload">
                    <IconButton
                        sx={{ margin: '0px 5px 0px 5px' }}
                        onClick={() => setUploadModalOpen(true)}
                    >
                        <UploadTwoToneIcon sx={{ color: 'blue' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                    <IconButton onClick={onDownloadPetriNet} sx={{ margin: '0px 5px 0px 5px' }}>
                        <FileDownloadTwoToneIcon sx={{ color: 'blue' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Validate">
                    <IconButton onClick={onValidatePetriNet} sx={{ margin: '0px 5px 0px 5px' }}>
                        <CheckCircleTwoToneIcon sx={{ color: 'blue' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Simulate">
                    <IconButton sx={{ margin: '0px 5px 0px 0px' }}>
                        <PlayArrowTwoToneIcon sx={{ color: 'green' }} />
                    </IconButton>
                </Tooltip>
            </div>

            {/* MODALS */}
            <UploadPetriNetDialog
                open={uploadModalOpen}
                onClose={() => setUploadModalOpen(false)}
            />
        </>
    )
}
