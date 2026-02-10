import { Toast } from "@/components/Toast/Toast"
import axios, { AxiosError, AxiosResponse } from "axios"
import { APIErrorHandler } from "@/utils/Errors/APIErrorHandler"

type Prefixes =
    "/auth" |
    "/user" |
    "/user-confirmation" |
    "/event" |
    "/event-category" |
    "/notification" |
    "/coupon" |
    "/organizer" |
    "/bank" |
    "/event-click" |
    "/ticket" |
    "/ticketscan" |
    "/ticketscan-session" |
    "/ticket-hold" |
    "/support" |
    "/payment" |
    "/payment-gateway" |
    "/card" |
    "/dashboard" |
    "/balance" |
    "/payout" |
    "/meta" |
    "/ai" |
    "/crm" |
    "/opinionpoll" |
    "/opinionpoll-comment" |
    "/subscription" |
    "/resale"

type TAPIParams = {
    prefix: Prefixes
    url: string
    data?: object
    params?: Record<string, string | number>
}

type TAPIError = {
    message: string
    statusCode: number
    internalCode?: number
}

class ApiClass {
    async POST(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
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

    async POST_FILE(params: TAPIParams & { formData: FormData }): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const response = await axios.post(
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

    async GET(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const queryString = params.params 
                ? "?" + new URLSearchParams(
                    Object.entries(params.params).reduce((acc, [key, value]) => {
                        acc[key] = String(value)
                        return acc
                    }, {} as Record<string, string>)
                ).toString()
                : ""
            
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}${params.prefix}${params.url}${queryString}`,
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

    async PUT(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
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

    async PUT_FILE(params: TAPIParams & { formData: FormData }): Promise<AxiosResponse<any, any, {}> | undefined> {
        try {
            const response = await axios.put(
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

    async PATCH(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
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

    async PATCH_FILE(params: TAPIParams & { formData: FormData }): Promise<AxiosResponse<any, any, {}> | undefined> {
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

    async DELETE(params: TAPIParams): Promise<AxiosResponse<any, any, {}> | undefined> {
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

    HandleSuccess() {
        Toast.success("Operação realizada com sucesso")
    }

    HandleError(error: AxiosError) {
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

export const API = new ApiClass()