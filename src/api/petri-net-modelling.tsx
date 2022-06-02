import axios from 'axios'
import { PetriNet } from '../models/PetrinetModels'
import { Response } from './util/with-response-formatter-interceptor'
import withResponseFormatterInterceptor from './util/with-response-formatter-interceptor'

const backendConnection = withResponseFormatterInterceptor(
    axios.create({
        baseURL: process.env.REACT_APP_BACKEND_URL_MODEL_ENGINE,
        headers: { 'Access-Control-Allow-Origin': '*' },
    })
)

export const getPetriNetById = (id: number): Promise<Response<PetriNet>> =>
    backendConnection.request({
        url: `/${id}`,
        method: 'GET',
    })

export const savePetriNet = (petriNet: PetriNet): Promise<Response<number>> =>
    backendConnection.request({
        url: '',
        method: 'POST',
        data: {},
    })
