import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaign, TWebpushCampaignCreate, TWebpushCampaignListResponse } from "@/types/Webpush/TWebpushCampaign"
import type {
    TWebpushCampaignAdminBulkUpdateStatusPayload,
    TWebpushCampaignAdminBulkUpdateStatusResponse,
    TWebpushCampaignAdminListResponse,
    TWebpushCampaignAdminSendNowResponse,
    TWebpushCampaignAdminSendSingleResponse,
    TWebpushCampaignAdminUpdateStatusPayload,
    TWebpushCampaignAdminUpdateStatusResponse
} from "@/types/Webpush/TWebpushCampaignAdmin"

class WebpushCampaignServiceClass {
    async create(data: TWebpushCampaignCreate): Promise<TApiResponse<TWebpushCampaign>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: "/webpushcampaign",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao criar campanha de webpush")
        }

        return response
    }

    async findAll(offset: number = 0): Promise<TApiResponse<TWebpushCampaignListResponse>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/webpushcampaign",
            params: {
                offset
            }
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar campanhas de webpush")
        }

        return response
    }

    async findAllAdmin(params: { offset?: number; userId?: string; startDate?: string; endDate?: string }): Promise<TApiResponse<TWebpushCampaignAdminListResponse>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/webpushcampaign/list/admin",
            params: {
                offset: params.offset || 0,
                userId: params.userId || undefined,
                startDate: params.startDate || undefined,
                endDate: params.endDate || undefined
            }
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar campanhas de webpush admin")
        }

        return response
    }

    async sendNow(campaignId: string): Promise<TApiResponse<TWebpushCampaignAdminSendNowResponse>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: `/webpushcampaign/send/${campaignId}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao enviar campanha de webpush")
        }

        return response
    }

    async sendSingleLog(campaignLogId: string): Promise<TApiResponse<TWebpushCampaignAdminSendSingleResponse>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: `/webpushcampaign/send/single-email/${campaignLogId}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao enviar log de webpush")
        }

        return response
    }

    async updateLogStatus(campaignLogId: string, data: TWebpushCampaignAdminUpdateStatusPayload): Promise<TApiResponse<TWebpushCampaignAdminUpdateStatusResponse>> {
        const response = (await API.PATCH({
            prefix: "/crm",
            url: `/webpushcampaign/status/${campaignLogId}`,
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao atualizar status do log de webpush")
        }

        return response
    }

    async updateLogStatusBulk(data: TWebpushCampaignAdminBulkUpdateStatusPayload): Promise<TApiResponse<TWebpushCampaignAdminBulkUpdateStatusResponse>> {
        const response = (await API.PUT({
            prefix: "/crm",
            url: "/webpushcampaign/status/bulk",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao atualizar status dos logs de webpush")
        }

        return response
    }
}

export const WebpushCampaignService = new WebpushCampaignServiceClass()
