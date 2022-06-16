import { Button } from '@mui/material'
import { memo } from 'react'
import { Node, Handle, Position } from 'react-flow-renderer'
import { Token } from '../../models/PetrinetModels'

interface PlaceNodeProbs {
    name: string
    numberOfTokens?: number
    tokens?: Token[]
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
                    onClick={() =>
                        data.setSelectedNode({
                            id: id,
                            position: { x: xPos, y: yPos },
                            data: new Object(data),
                        })
                    }
                >
                    {data.name}
                    {data.numberOfTokens}
                </Button>
                <Handle
                    type="source"
                    position={Position.Bottom}
                    style={{ background: '#555', width: '10px', height: '10px' }}
                    isConnectable={true}
                />
            </>
        )
    }
)
PlaceNode.displayName = 'placeNode'
export default PlaceNode
