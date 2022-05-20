import { Button } from '@mui/material'
import { memo } from 'react'
import { Handle, Position } from 'react-flow-renderer'

interface PlaceNodeProbs {
    setOpenDialog: (value: boolean) => void
}

const PlaceNode = memo(({ data }: { data: PlaceNodeProbs }) => {
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
                    height: '5rem',
                    borderRadius: '50%',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
                onClick={() => data.setOpenDialog(true)}
            >
                Place
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
})
PlaceNode.displayName = 'PlaceNode'
export default PlaceNode
