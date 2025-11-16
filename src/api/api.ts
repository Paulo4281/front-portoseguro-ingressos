import { Toast } from "@/components/Toast/Toast"
import axios, { AxiosError, AxiosResponse } from "axios"
import { APIErrorHandler } from "@/utils/Errors/APIErrorHandler"

type Prefixes =
    "/auth"

type TAPIParams = {
    prefix: Prefixes
    url: string
    data?: object
}

type TAPIError = {
    message: string
    statusCode: number
    internalCode?: number
}

export class API {
    static async POST(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}${params.prefix}${params.url}`,
                params.data,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            return response
        } catch(error) {
            this.HandleError(error as AxiosError)
        }
    }

    static async GET(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}${params.prefix}${params.url}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            return response
        } catch(error) {
            this.HandleError(error as AxiosError)
        }
    }

    static async PUT(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_API_URL}${params.prefix}${params.url}`,
                params.data,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            return response
        } catch(error) {
            this.HandleError(error as AxiosError)
        }
    }

    static async PATCH(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}${params.prefix}${params.url}`,
                params.data,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            return response
        } catch(error) {
            this.HandleError(error as AxiosError)
        }
    }

    static async PATCH_FILE(params: TAPIParams & { formData: FormData }): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const response = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_URL}${params.prefix}${params.url}`,
                params.formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true
                }
            )
            return response
        } catch(error) {
            this.HandleError(error as AxiosError)
        }
    }

    static async DELETE(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_URL}${params.prefix}${params.url}`,
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    withCredentials: true
                }
            )
            return response
        } catch(error) {
            this.HandleError(error as AxiosError)
        }
    }

    static HandleSuccess() {
        Toast.success("Operação realizada com sucesso")
    }

    static HandleError(error: AxiosError) {
        const errorData = error.response?.data as TAPIError
        
        if (errorData?.internalCode && APIErrorHandler[errorData.internalCode]) {
            Toast.error(APIErrorHandler[errorData.internalCode])
        } else {
            Toast.error("Ocorreu um erro ao realizar a operação")
        }

    }
}

export type {
    TAPIError
}