import axios from 'axios'
import { Transition } from '../models/PetrinetModels'
import { Response } from './util/with-response-formatter-interceptor'
import withResponseFormatterInterceptor from './util/with-response-formatter-interceptor'

const backendConnection = withResponseFormatterInterceptor(
    axios.create({
        baseURL: process.env.REACT_APP_BACKEND_URL_MODEL_ENGINE,
        headers: { 'Access-Control-Allow-Origin': '*' },
    })
)

export const getEnabledTransitions = (id: number): Promise<Response<Transition[]>> =>
    backendConnection.request({
        url: `/Simulation/${id}`,
        method: 'GET',
    })

export const fireTransitionRequest = (
    petriNetId: number,
    transitionId: number
): Promise<Response<Transition[]>> =>
    backendConnection.request({
        url: `/Simulation/${petriNetId}/${transitionId}`,
        method: 'PUT',
    })
