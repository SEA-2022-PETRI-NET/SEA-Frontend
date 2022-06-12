import { Button } from '@mui/material'
import { memo } from 'react'
import { Node, Handle, Position } from 'react-flow-renderer'

interface PlaceNodeProbs {
    setSelectedNode: (value: Node) => void
}

const PlaceNode = memo(
    ({
        id,
        xPos,
        yPos,
        data,
    }: {
        id: string
        xPos: number
        yPos: number
        data: PlaceNodeProbs
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
                        height: '5rem',
                        borderRadius: '50%',
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
                    Place
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
PlaceNode.displayName = 'placeNode'
export default PlaceNode
