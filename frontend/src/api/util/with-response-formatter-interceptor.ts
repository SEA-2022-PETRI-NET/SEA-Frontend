/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'

interface BaseResponse {
    status: number
    is4xx: boolean
    is5xx: boolean
}

export interface SuccessfulResponse<T> extends BaseResponse {
    successful: true
    data: T
}

export interface FailedResponse extends BaseResponse {
    successful: false
    message: string
}

export type Response<T> = SuccessfulResponse<T> | FailedResponse

export interface TypedAxiosInstance {
    request<T = any>(config: AxiosRequestConfig): Promise<Response<T>>
}

export default function withResponseFormatterInterceptor(
    instance: AxiosInstance
): TypedAxiosInstance {
    instance.interceptors.response.use(
        (resolvedResponse: AxiosResponse<any>) => {
            return {
                data: resolvedResponse?.data,
                status: resolvedResponse.status,
                successful: true,
                is4xx: false,
                is5xx: false,
            }
        },
        (error) => {
            const { response } = error
            return {
                status: response?.status || NaN,
                successful: false,
                message: response?.data?.response || 'Something went wrong',
                is4xx: response?.status >= 400 && response?.status < 500,
                is5xx: response?.status >= 500 && response?.status < 600,
            }
        }
    )
    return instance
}
