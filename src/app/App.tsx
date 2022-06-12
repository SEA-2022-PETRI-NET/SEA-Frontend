import './App.css'
import CssBaseline from '@mui/material/CssBaseline'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import { Routes, Route, NavLink } from 'react-router-dom'
import { Button } from '@mui/material'
import PetriNetModelling from '../components/petri-net-modelling/PetriNetModelling'
import Transforming from '../components/Transforming'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Overview from '../components/Overview'
import PetriNetSimulation from '../components/petri-net-simulation/PetriNetSimulation'

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
                        Overview
                    </Button>
                    <Button sx={{ color: 'white' }} component={NavLink} to={'/modelling/new'}>
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
                    <Route path="/" element={<Overview />} />
                    <Route path="/modelling/:petriNetId" element={<PetriNetModelling />} />
                    <Route
                        path="/modelling/:petriNetId/simulate"
                        element={<PetriNetSimulation />}
                    />
                    <Route path="/transformer" element={<Transforming />} />
                    <Route path="about" element={<h1>about</h1>} />
                </Routes>
            </Box>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

export default App
