import IconButton from '@mui/material/IconButton'
import { Tooltip } from '@mui/material'
import PlayArrowTwoToneIcon from '@mui/icons-material/PlayArrowTwoTone'
import DeleteIcon from '@mui/icons-material/Delete'
import SaveIcon from '@mui/icons-material/Save'
import CheckCircleTwoToneIcon from '@mui/icons-material/CheckCircleTwoTone'
import FileDownloadTwoToneIcon from '@mui/icons-material/FileDownloadTwoTone'
import UploadTwoToneIcon from '@mui/icons-material/UploadTwoTone'

interface ActionButtons {
    style?: React.CSSProperties | undefined
}

export default function ActionButtons({ style }: ActionButtons) {
    return (
        <div style={style}>
            <Tooltip title="Delete">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Save">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }}>
                    <SaveIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Upload">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }}>
                    <UploadTwoToneIcon sx={{ color: 'blue' }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Download">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }}>
                    <FileDownloadTwoToneIcon sx={{ color: 'blue' }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Validate">
                <IconButton sx={{ margin: '0px 5px 0px 5px' }}>
                    <CheckCircleTwoToneIcon sx={{ color: 'blue' }} />
                </IconButton>
            </Tooltip>
            <Tooltip title="Simulate">
                <IconButton sx={{ margin: '0px 5px 0px 0px' }}>
                    <PlayArrowTwoToneIcon sx={{ color: 'green' }} />
                </IconButton>
            </Tooltip>
        </div>
    )
}
