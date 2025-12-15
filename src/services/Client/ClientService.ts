import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import { AxiosResponse } from "axios"

type TFindOrganizerClientsParams = {
    offset?: number
    search?: string
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
}

export const ClientService = new ClientServiceClass()