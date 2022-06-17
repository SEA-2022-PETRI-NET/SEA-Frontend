import { Button } from '@mui/material'
import { memo } from 'react'
import { Node, Handle, Position, NodeProps, XYPosition } from 'react-flow-renderer'
import { useAppSelector } from '../../store/hooks'
import { isSimulationRunning } from '../../store/petriNetSlice'
import { NodeDataProps } from './PetriNetModelling'

const PlaceNode = memo((node: NodeProps<NodeDataProps>) => {
    const isSimRunning = useAppSelector(isSimulationRunning)

    return (
        <>
            <Handle
                type="target"
                position={Position.Top}
                style={{ background: '#555', width: '10px', height: '10px' }}
                isConnectable={true}
            />
            <Button
                sx={{
                    bgcolor: 'background.paper',
                    borderColor: 'text.primary',
                    m: 1,
                    border: 1,
                    width: '5rem',
                    height: '5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={(e) => {
                    e.preventDefault()
                    if (!isSimRunning) {
                        node.data.setSelectedNode({
                            ...node,
                            position: { x: node.xPos, y: node.yPos } as XYPosition,
                        } as Node<NodeDataProps>)
                    }
                }}
            >
                {node.data.name}
                {node.data.numberOfTokens}
            </Button>
            <Handle
                type="source"
                position={Position.Bottom}
                style={{ background: '#555', width: '10px', height: '10px' }}
                isConnectable={true}
            />
        </>
    )
})
PlaceNode.displayName = 'placeNode'
export default PlaceNode
