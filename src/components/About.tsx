import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { LoremIpsum } from 'react-lorem-ipsum'
import Button from '@mui/material/Button'
import { NavLink } from 'react-router-dom'
import { List, ListItem, ListSubheader } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}))

export default function About() {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: '150px',
                marginLeft: '200px',
                marginRight: '200px',
            }}
        >
            <Grid container spacing={2}>
                <Grid item xs={5}>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <img
                            src={require('../example_petri_net.png')}
                            style={{
                                borderColor: 'black',
                                borderWidth: 50,
                                width: '100%',
                            }}
                        />
                    </div>
                </Grid>
                <Grid item xs={7} sx={{ backgroundColor: '#e4e5e2' }}>
                    <h1> About This</h1>
                    This is a PetriNet modeling, simulation and transformation tool. It contains:
                    <List sx={{ listStyleType: 'disc', marginLeft: '20px' }}>
                        <ListSubheader
                            sx={{
                                fontWeight: 700,
                                lineHeight: '24px',
                                fontSize: '16px',
                                color: 'black',
                            }}
                        ></ListSubheader>
                        <ListItem sx={{ display: 'list-item' }}>
                            The overview page of the PetriNet models that are saved in the backend,
                        </ListItem>
                        <Button variant="contained" component={NavLink} to={'/Overview'}>
                            Overview of Saved Models
                        </Button>
                        <ListItem sx={{ display: 'list-item' }}>
                            The modelling tool used to edit and simulate existing PetriNets, as well
                            as create new ones,
                        </ListItem>
                        <Button variant="contained" component={NavLink} to={'/PetriNetModelling'}>
                            Modelling Tool
                        </Button>
                        <ListItem sx={{ display: 'list-item' }}>
                            The transformation tool for converting PertriNets to other formats.
                        </ListItem>
                        <Button variant="contained" component={NavLink} to={'/transformer'}>
                            Transformation Tool
                        </Button>
                    </List>
                </Grid>
                <Grid item xs={12}>
                    This tool was created as part of the Software Engineering and Architecture
                    course at the University of Copenhagen in spring 2022.
                </Grid>
            </Grid>
        </div>
    )
}
