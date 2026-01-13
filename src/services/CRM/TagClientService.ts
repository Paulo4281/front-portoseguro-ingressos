import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTagClientCreate, TTagClientResponse } from "@/types/TagClient/TTagClient"

class TagClientServiceClass {
    async create(data: TTagClientCreate): Promise<TApiResponse<TTagClientResponse>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: "/tag-client",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao adicionar tag ao cliente")
        }

        return response
    }

    async findByUserId(userId: string): Promise<TApiResponse<TTagClientResponse[]>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: `/tag-client/${userId}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar tags do cliente")
        }

        return response
    }

    async delete(id: string): Promise<TApiResponse> {
        const response = (await API.DELETE({
            prefix: "/crm",
            url: `/tag-client/${id}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao remover tag do cliente")
        }

        return response
    }
}

export const TagClientService = new TagClientServiceClass()

