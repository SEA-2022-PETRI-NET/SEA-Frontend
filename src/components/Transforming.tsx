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
import { PetriNet } from '../models/PetrinetModels'
import { transformBpmnToPetriNet } from '../api/transforming'
import { toast } from 'react-toastify'

const { Dragger } = Upload

enum ProcessModellingNotations {
    PetriNet = 'PETRI_NET',
    BPMN = 'BPMN',
    DCR = 'DCR',
}

export default function Transforming() {
    const [fromType, setFromType] = useState('')
    const [toType, setToType] = useState('')
    const [file, setFile] = useState<Blob | null>(null)

    const onDownloadPetriNet = async (petriNet: PetriNet) => {
        const blob = new Blob([JSON.stringify(petriNet)], {
            type: 'application/json',
        })
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = petriNet.name + '.json'
        document.body.appendChild(link)
        link.click()
        link.parentNode?.removeChild(link)
    }

    const uploadJson = () => {
        if (
            file &&
            fromType === ProcessModellingNotations.BPMN.toString() &&
            toType === ProcessModellingNotations.PetriNet.toString()
        ) {
            const reader = new FileReader()
            reader.onload = async (e) => {
                const bpmn = JSON.parse(e.target?.result?.toString() ?? '')
                const response = await transformBpmnToPetriNet(bpmn)
                if (response.successful) {
                    onDownloadPetriNet(response.data)
                } else {
                    toast.error(response.message)
                }
            }
            reader.readAsText(file)
        }
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
                            style={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value={ProcessModellingNotations.PetriNet} disabled={true}>
                                Perti Net
                            </MenuItem>
                            <MenuItem value={ProcessModellingNotations.DCR} disabled={true}>
                                DCR
                            </MenuItem>
                            <MenuItem value={ProcessModellingNotations.BPMN}>BPMN</MenuItem>
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
                            style={{ backgroundColor: 'white' }}
                        >
                            <MenuItem value={ProcessModellingNotations.PetriNet}>
                                Perti Net
                            </MenuItem>
                            <MenuItem value={ProcessModellingNotations.DCR} disabled={true}>
                                DCR
                            </MenuItem>
                            <MenuItem value={ProcessModellingNotations.BPMN} disabled={true}>
                                BPMN
                            </MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
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
                        action={() => {
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
                        <p className="ant-upload-hint">The file should be a JSON file</p>
                    </Dragger>
                </Grid>
                <Grid item xs={12} sx={{ marginTop: 5 }}>
                    <Button variant="outlined" onClick={uploadJson}>
                        Convert
                    </Button>
                </Grid>
            </Grid>
        </div>
    )
}
