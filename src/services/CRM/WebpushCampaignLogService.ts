import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaignLogListResponse, TWebpushCampaignLogQuota } from "@/types/Webpush/TWebpushCampaignLog"

class WebpushCampaignLogServiceClass {
    async findByCampaignId(campaignId: string): Promise<TApiResponse<TWebpushCampaignLogListResponse>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: `/webpushcampaign-log/${campaignId}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar logs da campanha de webpush")
        }

        return response
    }

    async getQuota(): Promise<TApiResponse<TWebpushCampaignLogQuota>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/webpushcampaign-log/quota"
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar cota de webpush")
        }

        return response
    }
}

export const WebpushCampaignLogService = new WebpushCampaignLogServiceClass()
