import IconButton from '@mui/material/IconButton'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { InboxOutlined } from '@ant-design/icons'
import { message, Upload } from 'antd'
import { useState } from 'react'
import { PetriNet } from '../../../models/PetrinetModels'

const { Dragger } = Upload

export interface UploadDialogProps {
    open: boolean
    onClose: () => void
    loadPetriNet: (petriNet: PetriNet) => void
}

export default function UploadPetriNetDialog({ open, onClose, loadPetriNet }: UploadDialogProps) {
    const [file, setFile] = useState<Blob | null>(null)

    const uploadJson = () => {
        if (file) {
            const reader = new FileReader()
            reader.onload = (e) => {
                const petriNet: PetriNet = JSON.parse(e.target?.result?.toString() ?? '')
                loadPetriNet(petriNet)
            }
            reader.readAsText(file)
            onClose()
        }
    }

    return (
        <Dialog PaperProps={{ sx: { width: '50%' } }} onClose={onClose} open={open}>
            <DialogTitle>
                Upload file
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div style={{ margin: '30px 80px 50px 80px' }}>
                    <Dragger
                        name={'file'}
                        accept={'application/json'}
                        beforeUpload={(file) => {
                            setFile(file)
                            return false
                        }}
                        onChange={(info) => {
                            const { status } = info.file
                            if (status === 'done') {
                                message.success(`${info.file.name} file uploaded successfully.`)
                            } else if (status === 'error') {
                                message.error(`${info.file.name} file upload failed.`)
                            }
                        }}
                        action={(file) => {
                            console.log(file)
                            return 'done'
                        }}
                        onRemove={() => {
                            setFile(null)
                        }}
                    >
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined />
                        </p>
                        <p className="ant-upload-text">Click or drag file to this area to upload</p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly prohibit from uploading
                            company data or other band files
                        </p>
                    </Dragger>
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={uploadJson}>Upload</Button>
            </DialogActions>
        </Dialog>
    )
}
