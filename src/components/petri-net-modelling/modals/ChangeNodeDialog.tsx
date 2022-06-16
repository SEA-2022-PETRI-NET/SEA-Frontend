import IconButton from '@mui/material/IconButton'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { Node } from 'react-flow-renderer'
import { NodeDataProbs } from '../PetriNetModelling'

export interface ChangeNodeDialogProps {
    selectedNode: Node<NodeDataProbs> | null
    onClose: () => void
    onDelete: () => void
}

export default function ChangeNodeDialog({
    selectedNode,
    onClose,
    onDelete,
}: ChangeNodeDialogProps) {
    return (
        <Dialog open={!!selectedNode} onClose={onClose}>
            <DialogTitle style={{ cursor: 'move' }}>
                {selectedNode?.data.name}
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Box style={{ display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        label="Title"
                        variant="outlined"
                        value={selectedNode?.data.name ?? ''}
                        style={{ margin: '10px auto' }}
                    />
                    <TextField
                        label="Tokens"
                        type="number"
                        variant="outlined"
                        style={{ margin: '10px auto' }}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <IconButton sx={{ margin: '0px 5px 0px 5px' }} onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </DialogActions>
        </Dialog>
    )
}
