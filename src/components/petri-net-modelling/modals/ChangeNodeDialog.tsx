import IconButton from '@mui/material/IconButton'
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    TextField,
    DialogActions,
} from '@mui/material'
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
                <DialogContentText>
                    <TextField
                        id="outlined-basic"
                        label="Title"
                        variant="outlined"
                        value={selectedNode?.data.name ?? ''}
                    />
                    <TextField
                        id="outlined-basic"
                        label="Tokens"
                        type="number"
                        variant="outlined"
                    />
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <IconButton sx={{ margin: '0px 5px 0px 5px' }} onClick={onDelete}>
                    <DeleteIcon />
                </IconButton>
            </DialogActions>
        </Dialog>
    )
}
