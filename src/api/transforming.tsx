import axios from 'axios'
import { PetriNet } from '../models/PetrinetModels'
import { Response } from './util/with-response-formatter-interceptor'
import withResponseFormatterInterceptor from './util/with-response-formatter-interceptor'

const backendConnection = withResponseFormatterInterceptor(
    axios.create({
        baseURL: process.env.BACKEND_URL_TRANSFORMER_ENGINE,
        headers: { 'Access-Control-Allow-Origin': '*' },
    })
)

export const transformBpmnToPetriNet = (bpmn: unknown): Promise<Response<PetriNet>> =>
    backendConnection.request({
        url: `/bpmn-to-petri-net`,
        method: 'POST',
        data: bpmn,
    })
