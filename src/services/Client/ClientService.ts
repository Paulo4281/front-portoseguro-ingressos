import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import { AxiosResponse } from "axios"
import type { TFindOrganizerClientsCrmResponse } from "@/types/Client/TClient"

type TFindOrganizerClientsParams = {
    offset?: number
    search?: string
}

type TFindOrganizerClientsCrmParams = {
    offset: number
    search?: string
    tagId?: string
    eventId?: string
}

class ClientServiceClass {
    async findOrganizerClients(params?: TFindOrganizerClientsParams): Promise<AxiosResponse["data"]> {
        const queryParams = new URLSearchParams()
        
        if (params?.offset !== undefined) {
            queryParams.append("offset", params.offset.toString())
        }
        if (params?.search) {
            queryParams.append("search", params.search)
        }

        const queryString = queryParams.toString()
        const url = `/organizer/clients${queryString ? `?${queryString}` : ""}`

        const response = (await API.GET({
            prefix: "/user",
            url
        }))?.data
        return response
    }

    async findOrganizerClientsCrm(params: TFindOrganizerClientsCrmParams): Promise<TApiResponse<TFindOrganizerClientsCrmResponse>> {
        const queryParams: Record<string, string | number> = {
            offset: params.offset
        }
        
        if (params.search) {
            queryParams.search = params.search
        }

        if (params.tagId) {
            queryParams.tagId = params.tagId
        }

        if (params.eventId) {
            queryParams.eventId = params.eventId
        }

        const response = (await API.GET({
            prefix: "/user",
            url: "/organizer/clientes/crm",
            params: queryParams
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar clientes do CRM")
        }

        return response
    }
}

export const ClientService = new ClientServiceClass()