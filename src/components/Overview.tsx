import Grid from '@mui/material/Grid'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import { useEffect, useState } from 'react'
import { Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import 'antd/dist/antd.css'
import Button from '@mui/material/Button'
import { PetriNet } from '../models/PetrinetModels'
import { getPetriNets } from '../api/petri-net-modelling'
import { toast } from 'react-toastify'
import { List, ListItem } from '@mui/material'

const { Dragger } = Upload

export default function Overview() {
    const [petriNets, setPetriNets] = useState<PetriNet[]>([])

    useEffect(() => {
        console.log('hey')
        ;async () => {
            const response = await getPetriNets()
            if (response.successful) {
                setPetriNets(response.data)
                toast.success('Retrieved petri nets')
            } else {
                toast.error('Could not retrieve petri nets')
            }
        }
    })

    return (
        <>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>

            <h1>heyhey</h1>

            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <h1>heyhey</h1>
            <List>
                {petriNets.map((petriNet) => (
                    <h1 key={petriNet.id}>{petriNet.id}</h1>
                ))}
            </List>
        </>
    )
}
