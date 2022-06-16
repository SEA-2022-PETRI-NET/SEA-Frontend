import { Button } from '@mui/material'
import { memo } from 'react'
import { Node, Handle, Position, NodeProps, XYPosition } from 'react-flow-renderer'
import { NodeDataProps } from './PetriNetModelling'

const TransitionNode = memo((node: NodeProps<NodeDataProps>) => {
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
                    height: '10rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={() =>
                    node.data.setSelectedNode({
                        ...node,
                        position: { x: node.xPos, y: node.yPos } as XYPosition,
                    } as Node<NodeDataProps>)
                }
            >
                {node.data.name}
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
TransitionNode.displayName = 'transitionNode'
export default TransitionNode
