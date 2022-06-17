import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit'
import petriNetReducer from './petriNetSlice'

export const store = configureStore({
    reducer: {
        petriNet: petriNetReducer,
    },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    Action<string>
>
