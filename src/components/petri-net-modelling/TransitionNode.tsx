import { Button } from '@mui/material'
import { memo } from 'react'
import { Node, Handle, Position } from 'react-flow-renderer'

interface TransitionNodeProbs {
    name: string
    setSelectedNode: (value: Node) => void
}

const TransitionNode = memo(
    ({
        id,
        xPos,
        yPos,
        data,
    }: {
        id: string
        xPos: number
        yPos: number
        data: TransitionNodeProbs
    }) => {
        return (
            <>
                <Handle
                    type="target"
                    position={Position.Top}
                    style={{ background: '#555' }}
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
                        data.setSelectedNode({
                            id: id,
                            position: { x: xPos, y: yPos },
                            data: new Object(data),
                        })
                    }
                >
                    {data.name}
                </Button>
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={{ background: '#555' }}
                    isConnectable={true}
                />
            </>
        )
    }
)
TransitionNode.displayName = 'transitionNode'
export default TransitionNode
