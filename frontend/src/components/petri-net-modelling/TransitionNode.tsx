import { Box, Button } from '@mui/material'
import { useCallback } from 'react'
import { Handle, Position } from 'react-flow-renderer'

const handleStyle = { left: 10 }

export default function TransitionNode() {
    const onChange = useCallback((evt: any) => {
        console.log(evt.target.value)
    }, [])

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
