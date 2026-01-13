import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTagCreate, TTagUpdate, TTagResponse } from "@/types/Tag/TTag"

class TagServiceClass {
    async create(data: TTagCreate): Promise<TApiResponse<TTagResponse>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: "/tag",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao criar tag")
        }

        return response
    }

    async findAll(): Promise<TApiResponse<TTagResponse[]>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/tag"
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar tags")
        }

        return response
    }

    async update(id: string, data: TTagUpdate): Promise<TApiResponse> {
        const response = (await API.PUT({
            prefix: "/crm",
            url: `/tag/${id}`,
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao atualizar tag")
        }

        return response
    }

    async delete(id: string): Promise<TApiResponse> {
        const response = (await API.DELETE({
            prefix: "/crm",
            url: `/tag/${id}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao deletar tag")
        }

        return response
    }
}

export const TagService = new TagServiceClass()

