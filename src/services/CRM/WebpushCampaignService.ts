import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushCampaign, TWebpushCampaignCreate, TWebpushCampaignListResponse } from "@/types/Webpush/TWebpushCampaign"

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
}

export const WebpushCampaignService = new WebpushCampaignServiceClass()
