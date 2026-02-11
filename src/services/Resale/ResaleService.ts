import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type {
    TResaleCreatePayload,
    TResaleFindData,
    TResaleUpdatePayload,
    TSellerInvitation,
    TVerifyInviteResponse
} from "@/types/Resale/TResale"

class ResaleServiceClass {
    async find(): Promise<TApiResponse<TResaleFindData | TSellerInvitation[]>> {
        const response = (await API.GET({
            prefix: "/resale/seller-invitation",
            url: ""
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar revendedores")
        }

        return response
    }

    async create(data: TResaleCreatePayload): Promise<TApiResponse> {
        const response = (await API.POST({
            prefix: "/resale/seller-invitation",
            url: "/send-invite",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao enviar convite de revendedor")
        }

        return response
    }

    async sendInvite(data: TResaleCreatePayload): Promise<TApiResponse> {
        const response = (await API.POST({
            prefix: "/resale/seller-invitation",
            url: "/send-invite",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao enviar convite de revendedor")
        }

        return response
    }

    async update(id: string, data: TResaleUpdatePayload): Promise<TApiResponse> {
        const response = (await API.PUT({
            prefix: "/resale/seller-invitation",
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
            prefix: "/resale/seller-invitation",
            url: `/${id}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao excluir revendedor")
        }

        return response
    }

    async verifyInvite(code: string): Promise<TApiResponse<TVerifyInviteResponse>> {
        const response = (await API.POST({
            prefix: "/resale/seller-invitation",
            url: `/verify-invite/${code}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao validar convite")
        }

        return response
    }
}

export const ResaleService = new ResaleServiceClass()
