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
import { deletePetriNet, getPetriNets } from '../api/petri-net-modelling'
import { toast } from 'react-toastify'
import {
    IconButton,
    List,
    ListItem,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'

const { Dragger } = Upload

export default function Overview() {
    const [petriNets, setPetriNets] = useState<PetriNet[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPetriNets = async () => {
            const response = await getPetriNets()
            if (response.successful) {
                setPetriNets(response.data)
                toast.success('Retrieved petri nets')
            } else {
                toast.error('Could not retrieve petri nets')
            }
        }
        fetchPetriNets()
    }, [])

    return (
        <div>
            <h1 style={{ marginTop: '100px' }}>Overview</h1>
            <Button variant="contained" onClick={() => navigate('/modelling/new')}>
                Create new petri net
            </Button>
            <TableContainer component={Paper} style={{ width: '300px', margin: '50px auto' }}>
                <Table aria-label="simple table">
                    <TableBody>
                        {petriNets.map((petriNet) => (
                            <TableRow
                                key={petriNet.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {petriNet.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {petriNet.id}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => deletePetriNet(petriNet.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => navigate(`/modelling/${petriNet.id}`)}
                                    >
                                        <VisibilityIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
