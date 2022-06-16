import IconButton from '@mui/material/IconButton'
import { Dialog, DialogTitle } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { InboxOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import { message, Upload } from 'antd'

const { Dragger } = Upload

const props: UploadProps = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const { status } = info.file
        if (status !== 'uploading') {
            console.log(info.file, info.fileList)
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`)
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`)
        }
    },
    onDrop(e) {
        console.log('Dropped files', e.dataTransfer.files)
    },
}

export interface UploadDialogProps {
    open: boolean
    onClose: () => void
}

export default function UploadPetriNetDialog(props: UploadDialogProps) {
    const { onClose, open } = props

    const handleClose = () => {
        console.log('closing upload modal')
    }

    return (
        <Dialog PaperProps={{ sx: { width: '50%' } }} onClose={handleClose} open={open}>
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
            <div style={{ margin: '30px 80px 50px 80px' }}>
                <Dragger {...props}>
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
        </Dialog>
    )
}
