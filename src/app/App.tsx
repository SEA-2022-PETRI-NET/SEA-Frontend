import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Routes, Route, NavLink } from 'react-router-dom'
import { Button } from '@mui/material'
import PetriNetModelling from '../components/petri-net-modelling/PetriNetModelling'
import Transforming from '../components/Transforming'

function App() {
    return (
        <>
            <Box sx={{ display: 'flex' }}>
                <CssBaseline />
                <Toolbar
                    sx={{
                        backgroundColor: '#0da2ff',
                        width: '100%',
                        position: 'absolute',
                        zIndex: 6,
                    }}
                >
                    <Typography
                        component="h1"
                        variant="h6"
                        color="white"
                        noWrap
                        sx={{ flexGrow: 1 }}
                    >
                        SEA
                    </Typography>
                    <Button sx={{ color: 'white' }} component={NavLink} to={'/'}>
                        Modelling
                    </Button>
                    <Button sx={{ color: 'white' }} component={NavLink} to={'/transformer'}>
                        Transform
                    </Button>
                    <Button sx={{ color: 'white' }} component={NavLink} to={'/about'}>
                        About
                    </Button>
                </Toolbar>
            </Box>
            <Box>
                <Routes>
                    <Route path="/" element={<PetriNetModelling />} />
                    <Route path="/transformer" element={<Transforming />} />
                    <Route path="about" element={<h1>about</h1>} />
                </Routes>
            </Box>
        </>
    )
}

export default App