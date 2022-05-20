import { Box, Button } from '@mui/material'
import { useCallback, memo } from 'react'
import { Node, Handle, Position } from 'react-flow-renderer'

const handleStyle = { left: 10 }

interface TransitionNodeProbs {
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
                    onConnect={(params) => console.log('handle onConnect', params)}
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
                    Transition
                </Button>
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={{ background: '#555' }}
                    onConnect={(params) => console.log('handle onConnect', params)}
                    isConnectable={true}
                />
            </>
        )
    }
)
TransitionNode.displayName = 'TransitionNode'
export default TransitionNode
