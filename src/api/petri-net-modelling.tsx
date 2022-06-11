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
        url: `/Model/${id}`,
        method: 'GET',
    })

export const getPetriNets = (): Promise<Response<PetriNet[]>> =>
    backendConnection.request({
        url: '/Model',
        method: 'GET',
    })

export const savePetriNet = (petriNet: PetriNet): Promise<Response<PetriNet>> =>
    backendConnection.request({
        url: '/Model',
        method: 'POST',
        data: petriNet,
    })

export const updatePetriNet = (petriNet: PetriNet): Promise<Response<PetriNet>> =>
    backendConnection.request({
        url: '/Model/update-petri-net',
        method: 'POST',
        data: petriNet,
    })

export const validatePetriNet = (petriNet: PetriNet): Promise<Response<any>> =>
    backendConnection.request({
        url: '/Model/validate-petri-net',
        method: 'POST',
        data: petriNet,
    })

export const deletePetriNet = (petriNetId: number): Promise<Response<any>> =>
    backendConnection.request({
        url: '/Model',
        method: 'DELETE',
        data: petriNetId,
    })
