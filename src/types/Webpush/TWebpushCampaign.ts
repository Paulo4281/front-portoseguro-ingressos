import type { WebpushCampaignStatus } from "@/types/Webpush/TWebpushTypes"

type TWebpushCampaignCreate = {
    name?: string | null
    templateId: string
    tagIds: string[]
    eventId?: string | null
    couponId?: string | null
}

type TWebpushCampaign = {
    id: string
    name: string | null
    templateId: string
    userId: string
    status: WebpushCampaignStatus
    tagIds: string[] | null
    eventId: string | null
    couponId: string | null
    totalRecipients: number
    sentCount: number
    createdAt: string
    updatedAt: string | null
}

type TWebpushCampaignListResponse = {
    data: TWebpushCampaign[]
    total: number
    offset: number
    limit: number
}

export type {
    TWebpushCampaignCreate,
    TWebpushCampaign,
    TWebpushCampaignListResponse
}
