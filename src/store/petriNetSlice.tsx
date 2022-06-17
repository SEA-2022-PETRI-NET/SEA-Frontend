import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from './store'

interface PetriNetState {
    isSimulationRunning: boolean
    petriNetId: string
}

// Define the initial state using that type
const initialState: PetriNetState = {
    isSimulationRunning: false,
    petriNetId: 'new',
}

export const petriNetSlice = createSlice({
    name: 'petriNet',
    initialState,
    reducers: {
        setIsSimulationRunning: (state, action: PayloadAction<boolean>) => {
            state.isSimulationRunning = action.payload
        },
    },
})

export const { setIsSimulationRunning } = petriNetSlice.actions

export const isSimulationRunning = (state: RootState) => state.petriNet.isSimulationRunning

export default petriNetSlice.reducer
