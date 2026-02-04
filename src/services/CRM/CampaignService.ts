import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaign, TCampaignCreate, TCampaignListResponse } from "@/types/Campaign/TCampaign"
import type {
    TCampaignAdminBulkUpdateStatusPayload,
    TCampaignAdminBulkUpdateStatusResponse,
    TCampaignAdminListResponse,
    TCampaignAdminSendNowResponse,
    TCampaignAdminSendSingleResponse,
    TCampaignAdminUpdateStatusPayload,
    TCampaignAdminUpdateStatusResponse
} from "@/types/Campaign/TCampaignAdmin"

class CampaignServiceClass {
    async create(data: TCampaignCreate): Promise<TApiResponse<TCampaign>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: "/campaign",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao criar campanha")
        }

        return response
    }

    async findAll(offset: number = 0): Promise<TApiResponse<TCampaignListResponse>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/campaign",
            params: {
                offset
            }
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar campanhas")
        }

        return response
    }

    async findAllAdmin(params: { offset?: number; userId?: string; startDate?: string; endDate?: string }): Promise<TApiResponse<TCampaignAdminListResponse>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/campaign/list/admin",
            params: {
                offset: params.offset || 0,
                userId: params.userId || undefined,
                startDate: params.startDate || undefined,
                endDate: params.endDate || undefined
            }
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar campanhas admin")
        }

        return response
    }

    async sendNow(campaignId: string): Promise<TApiResponse<TCampaignAdminSendNowResponse>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: `/campaign/send/${campaignId}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao enviar campanha")
        }

        return response
    }

    async sendSingleLog(campaignLogId: string): Promise<TApiResponse<TCampaignAdminSendSingleResponse>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: `/campaign/send/single-email/${campaignLogId}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao enviar log")
        }

        return response
    }

    async updateLogStatus(campaignLogId: string, data: TCampaignAdminUpdateStatusPayload): Promise<TApiResponse<TCampaignAdminUpdateStatusResponse>> {
        const response = (await API.PATCH({
            prefix: "/crm",
            url: `/campaign/status/${campaignLogId}`,
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao atualizar status do log")
        }

        return response
    }

    async updateLogStatusBulk(data: TCampaignAdminBulkUpdateStatusPayload): Promise<TApiResponse<TCampaignAdminBulkUpdateStatusResponse>> {
        const response = (await API.PUT({
            prefix: "/crm",
            url: "/campaign/status/bulk",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao atualizar status dos logs")
        }

        return response
    }
}

export const CampaignService = new CampaignServiceClass()

