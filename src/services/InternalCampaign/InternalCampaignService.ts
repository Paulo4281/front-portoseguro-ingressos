import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type {
    TInternalCampaign,
    TInternalCampaignCreate,
    TInternalCampaignListItem,
    TInternalCampaignPaginatedResponse,
    TInternalCampaignStatsResponse,
    TInternalCampaignUpdate
} from "@/types/InternalCampaign/TInternalCampaign"

const BASE_URL = "https://portoseguroingressos.com.br"

class InternalCampaignServiceClass {
    private toSnakeCase(value: string): string {
        return value
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "_")
            .replace(/^_+|_+$/g, "")
            .replace(/_{2,}/g, "_")
    }

    private buildCampaignLink(data: {
        utmCampaign: string
        utmId?: string | null
        utmSource?: string | null
        utmContent?: string | null
        utmTerm?: string | null
    }): string {
        const params = new URLSearchParams()

        params.set("utm_campaign", data.utmCampaign)
        if (data.utmId) params.set("utm_id", data.utmId)
        if (data.utmSource) params.set("utm_source", data.utmSource)
        if (data.utmContent) params.set("utm_content", data.utmContent)
        if (data.utmTerm) params.set("utm_term", data.utmTerm)

        return `${BASE_URL}?${params.toString()}`
    }

    private withLink<T extends TInternalCampaign>(campaign: T): T & { link: string } {
        return {
            ...campaign,
            link: this.buildCampaignLink({
                utmCampaign: campaign.utmCampaign,
                utmId: campaign.utmId,
                utmSource: campaign.utmSource || null,
                utmContent: campaign.utmContent || null,
                utmTerm: campaign.utmTerm || null
            })
        }
    }

    private withLinks<T extends TInternalCampaign>(campaigns: T[]): Array<T & { link: string }> {
        return campaigns.map((campaign) => this.withLink(campaign))
    }

    async find(offset: number = 0): Promise<TApiResponse<TInternalCampaignPaginatedResponse & { data: Array<TInternalCampaignListItem & { link: string }> }>> {
        const response = (await API.GET({
            prefix: "/internal-campaign",
            url: "/",
            params: {
                offset
            }
        }))?.data as TApiResponse<TInternalCampaignPaginatedResponse> | undefined

        if (!response?.success || !response.data) {
            return {
                success: false,
                message: response?.message || "Não foi possível buscar campanhas internas"
            }
        }

        return {
            success: true,
            data: {
                ...response.data,
                data: this.withLinks(response.data.data || [])
            }
        }
    }

    async create(payload: TInternalCampaignCreate): Promise<TApiResponse<TInternalCampaign & { link: string }>> {
        if (!payload.name?.trim()) {
            return {
                success: false,
                message: "Nome da campanha é obrigatório"
            }
        }

        const response = (await API.POST({
            prefix: "/internal-campaign",
            url: "/",
            data: {
                name: payload.name.trim(),
                utmCampaign: this.toSnakeCase(payload.utmCampaign || payload.name),
                utmSource: payload.utmSource || null,
                utmContent: payload.utmContent || null,
                utmTerm: payload.utmTerm || null
            }
        }))?.data as TApiResponse<TInternalCampaign> | undefined

        if (!response?.success || !response.data) {
            return {
                success: false,
                message: response?.message || "Não foi possível criar a campanha"
            }
        }

        return {
            success: true,
            data: this.withLink(response.data),
            message: response.message
        }
    }

    async update(payload: TInternalCampaignUpdate): Promise<TApiResponse<TInternalCampaign & { link: string }>> {
        const response = (await API.PUT({
            prefix: "/internal-campaign",
            url: "/",
            data: {
                ...payload,
                utmCampaign: payload.utmCampaign ? this.toSnakeCase(payload.utmCampaign) : undefined
            }
        }))?.data as TApiResponse<TInternalCampaign> | undefined

        if (!response?.success || !response.data) {
            return {
                success: false,
                message: response?.message || "Não foi possível atualizar a campanha"
            }
        }

        return {
            success: true,
            data: this.withLink(response.data),
            message: response.message
        }
    }

    async deleteById(id: string): Promise<TApiResponse<{ id: string }>> {
        const response = (await API.DELETE({
            prefix: "/internal-campaign",
            url: "/",
            data: { id }
        }))?.data as TApiResponse<{ id: string }> | undefined

        if (!response?.success) {
            return {
                success: false,
                message: response?.message || "Não foi possível excluir a campanha"
            }
        }

        return {
            success: true,
            data: response.data,
            message: response.message
        }
    }

    async getStats(campaignId: string): Promise<TApiResponse<TInternalCampaignStatsResponse>> {
        const response = (await API.GET({
            prefix: "/internal-campaign",
            url: `/stats/${campaignId}`
        }))?.data as TApiResponse<TInternalCampaignStatsResponse> | undefined

        if (!response?.success || !response.data) {
            return {
                success: false,
                message: response?.message || "Não foi possível buscar estatísticas da campanha"
            }
        }

        return response
    }

    toUtmCampaign(value: string): string {
        return this.toSnakeCase(value)
    }
}

export const InternalCampaignService = new InternalCampaignServiceClass()
