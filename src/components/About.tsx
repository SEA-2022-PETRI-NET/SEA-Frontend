import { styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { LoremIpsum } from 'react-lorem-ipsum'
import Button from '@mui/material/Button'
import { NavLink } from 'react-router-dom'
import { Link, List, ListItem, ListSubheader } from '@mui/material'

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
            <Grid container spacing={8}>
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
                <Grid item xs={7}>
                    <div style={{ backgroundColor: '#e4e5e2', padding: '40px 30px' }}>
                        <h1> About This Tool</h1>
                        <p>
                            This is a Petri Net modeling, simulation and transformation tool. This
                            tool supports transformations from{' '}
                            <Link href="https://en.wikipedia.org/wiki/Business_Process_Model_and_Notation">
                                BPMN graphs
                            </Link>{' '}
                            to{' '}
                            <Link href="https://en.wikipedia.org/wiki/Petri_net">
                                Petri Net graphs
                            </Link>
                            .
                        </p>
                        <p>
                            In the future it should also support transformations from Petri Net
                            graphs into BPMN graphs and transformations between{' '}
                            <Link href="https://dcrsolutions.net/">DCR graphs</Link> and Petri Net
                            graphs.
                        </p>
                        <p>
                            This tool was created as part of the Software Engineering and
                            Architecture course at the University of Copenhagen in spring 2022.
                        </p>
                    </div>
                </Grid>
                <Grid item xs={12}>
                    This tool contains:
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
                            The overview page of the PetriNet models that you have saved:
                            <Button
                                style={{ marginLeft: '20px' }}
                                variant="contained"
                                component={NavLink}
                                to={'/Overview'}
                            >
                                Overview of Saved Models
                            </Button>
                        </ListItem>

                        <ListItem sx={{ display: 'list-item' }}>
                            The modelling tool used to edit and simulate existing PetriNets, as well
                            as create new ones:
                            <Button
                                style={{ marginLeft: '20px' }}
                                variant="contained"
                                component={NavLink}
                                to={'/PetriNetModelling'}
                            >
                                Modelling Tool
                            </Button>
                        </ListItem>
                        <ListItem sx={{ display: 'list-item' }}>
                            The transformation tool for converting between different types of
                            process modelling notations:
                            <Button
                                style={{ marginLeft: '20px' }}
                                variant="contained"
                                component={NavLink}
                                to={'/transformer'}
                            >
                                Transformation Tool
                            </Button>
                        </ListItem>
                    </List>
                </Grid>
            </Grid>
        </div>
    )
}
