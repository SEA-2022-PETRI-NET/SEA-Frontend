import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useState } from 'react'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import Button from '@mui/material/Button'

const { Dragger } = Upload

export default function Transforming() {
    const [fromType, setFromType] = useState('')
    const [toType, setToType] = useState('')

    const props = {
        name: 'file',
        multiple: true,
        action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
        onChange(info: any) {
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
        onDrop(e: React.DragEvent) {
            console.log('Dropped files', e.dataTransfer.files)
        },
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '50px' }}>
            <Grid container spacing={2} sx={{ padding: 10, maxWidth: 1000 }}>
                <Grid item xs={5}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">From Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={fromType}
                            label="type"
                            onChange={(e) => setFromType(e.target.value as string)}
                        >
                            <MenuItem value={10}>Perti Net</MenuItem>
                            <MenuItem value={20}>DCR</MenuItem>
                            <MenuItem value={30}>BPMN</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={2}></Grid>
                <Grid item xs={5}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">To Type</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={toType}
                            label="type"
                            onChange={(e) => setToType(e.target.value as string)}
                        >
                            <MenuItem value={10}>Perti Net</MenuItem>
                            <MenuItem value={20}>DCR</MenuItem>
                            <MenuItem value={30}>BPMN</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
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
                </Grid>
                <Grid item xs={12} sx={{ marginTop: 5 }}>
                    <Button variant="outlined">Convert</Button>
                </Grid>
            </Grid>
        </div>
    )
}
