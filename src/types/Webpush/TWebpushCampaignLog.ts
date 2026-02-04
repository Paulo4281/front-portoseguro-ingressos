import type { WebpushStatus } from "@/types/Webpush/TWebpushTypes"

type TWebpushCampaignLogUser = {
    id: string
    firstName: string
    lastName: string
    email: string
} | null

type TWebpushCampaignLog = {
    id: string
    campaignId: string
    userId: string
    status: WebpushStatus
    errorMessage: string | null
    user: TWebpushCampaignLogUser
    createdAt: string
    updatedAt: string | null
}

type TWebpushCampaignLogQuota = {
    sentCount: number
    remainingQuota: number
}

type TWebpushCampaignLogListResponse = TWebpushCampaignLog[]

export type {
    TWebpushCampaignLog,
    TWebpushCampaignLogQuota,
    TWebpushCampaignLogListResponse
}
