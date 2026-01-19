import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaignLog, TCampaignQuota } from "@/types/CampaignLog/TCampaignLog"

class CampaignLogServiceClass {
    async findByCampaignId(campaignId: string): Promise<TApiResponse<TCampaignLog[]>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: `/campaign-log/${campaignId}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar logs da campanha")
        }

        return response
    }

    async getQuota(): Promise<TApiResponse<TCampaignQuota>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/campaign-log/quota"
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar cota de e-mails")
        }

        return response
    }
}

export const CampaignLogService = new CampaignLogServiceClass()

