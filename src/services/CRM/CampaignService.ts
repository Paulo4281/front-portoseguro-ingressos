import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCampaign, TCampaignCreate, TCampaignListResponse } from "@/types/Campaign/TCampaign"

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
}

export const CampaignService = new CampaignServiceClass()

