import { useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import Button from '@mui/material/Button'
import { PetriNet } from '../models/PetrinetModels'
import { deletePetriNet, getPetriNets } from '../api/petri-net-modelling'
import { toast } from 'react-toastify'
import {
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useNavigate } from 'react-router-dom'

export default function Overview() {
    const [petriNets, setPetriNets] = useState<PetriNet[]>([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPetriNets = async () => {
            const response = await getPetriNets()
            if (response.successful) {
                setPetriNets(response.data)
                //toast.success('Retrieved petri nets')
            } else {
                toast.error('Could not retrieve petri nets')
            }
        }
        fetchPetriNets()
    }, [])

    return (
        <div style={{ width: '700px', margin: '100px auto' }}>
            <h1>Overview of stored petri nets</h1>
            <Button variant="contained" onClick={() => navigate('/modelling/new')}>
                Create new petri net
            </Button>
            <TableContainer component={Paper} style={{ width: '300px', margin: '50px auto' }}>
                <Table aria-label="simple table">
                    <TableBody>
                        {petriNets.map((petriNet) => (
                            <TableRow
                                key={petriNet.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {petriNet.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {petriNet.id}
                                </TableCell>
                                <TableCell>
                                    <IconButton
                                        onClick={() => {
                                            deletePetriNet(petriNet.id)
                                            window.location.reload()
                                        }}
                                    >
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
