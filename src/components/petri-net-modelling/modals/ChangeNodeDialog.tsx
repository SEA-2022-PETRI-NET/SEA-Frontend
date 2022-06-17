import IconButton from '@mui/material/IconButton'
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Box } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import { Node } from 'react-flow-renderer'
import { NodeDataProps } from '../PetriNetModelling'
import PlaceNode from '../PlaceNode'

export interface ChangeNodeDialogProps {
    selectedNode: Node<NodeDataProps> | null
    onClose: () => void
    onDelete: () => void
    changeSelectedNode: (id: string | undefined, data: NodeDataProps) => void
}

export default function ChangeNodeDialog({
    selectedNode,
    onClose,
    onDelete,
    changeSelectedNode,
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
                        onChange={(e) =>
                            changeSelectedNode(selectedNode?.id, {
                                ...selectedNode?.data,
                                name: e.target.value,
                            } as NodeDataProps)
                        }
                    />
                    {selectedNode?.type === PlaceNode.displayName && (
                        <TextField
                            label="Tokens"
                            type="number"
                            variant="outlined"
                            style={{ margin: '10px auto' }}
                            value={selectedNode?.data.numberOfTokens}
                            onChange={(e) =>
                                changeSelectedNode(selectedNode?.id, {
                                    ...selectedNode?.data,
                                    numberOfTokens: Number(e.target.value),
                                } as NodeDataProps)
                            }
                        />
                    )}
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
