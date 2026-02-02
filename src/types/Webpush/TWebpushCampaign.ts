import type { WebpushCampaignStatus } from "@/types/Webpush/TWebpushTypes"

type TWebpushCampaignCreate = {
    templateId: string
    tagIds: string[]
    eventId?: string | null
    couponId?: string | null
}

type TWebpushCampaign = {
    id: string
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
