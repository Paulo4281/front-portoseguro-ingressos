import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type {
    TResale,
    TResaleCreatePayload,
    TResaleUpdatePayload,
    TResaleFindData
} from "@/types/Resale/TResale"

class ResaleServiceClass {
    async find(): Promise<TApiResponse<TResale[] | TResaleFindData>> {
        const response = (await API.GET({
            prefix: "/resale",
            url: ""
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar revendedores")
        }

        return response
    }

    async create(data: TResaleCreatePayload): Promise<TApiResponse<TResale>> {
        const response = (await API.POST({
            prefix: "/resale",
            url: "",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao criar revendedor")
        }

        return response
    }

    async update(id: string, data: TResaleUpdatePayload): Promise<TApiResponse<TResale>> {
        const response = (await API.PUT({
            prefix: "/resale",
            url: `/${id}`,
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao atualizar revendedor")
        }

        return response
    }

    async deleteById(id: string): Promise<TApiResponse> {
        const response = (await API.DELETE({
            prefix: "/resale",
            url: `/${id}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao excluir revendedor")
        }

        return response
    }
}

export const ResaleService = new ResaleServiceClass()
