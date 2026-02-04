import type { WebpushStatus } from "@/types/Webpush/TWebpushTypes"

export type TWebpushCampaignAdminStatus = "PENDING" | "PROCESSING" | "SENT" | "FAILED"

export type TWebpushCampaignAdminLog = {
    id: string
    campaignId: string
    userId: string
    status: WebpushStatus
    errorMessage: string | null
    adminTriggeredSingleSend: boolean
    adminTriggeredSingleSendAt: string | null
    adminUpdatedStatus: boolean
    adminUpdatedStatusAt: string | null
    adminUpdatedStatusTo: string | null
    createdAt: string
    updatedAt: string | null
}

export type TWebpushCampaignAdmin = {
    id: string
    name: string | null
    templateId: string
    userId: string
    status: TWebpushCampaignAdminStatus
    tagIds: string[] | null
    eventId: string | null
    couponId: string | null
    totalRecipients: number
    sentCount: number
    startedByAdmin: boolean
    startedByAdminAt: string | null
    startedByCron: boolean
    startedByCronAt: string | null
    createdAt: string
    updatedAt: string | null
    logs: TWebpushCampaignAdminLog[]
}

export type TWebpushCampaignAdminListResponse = {
    data: TWebpushCampaignAdmin[]
    total: number
    offset: number
    limit: number
}

export type TWebpushCampaignAdminSendNowResponse = {
    campaignId: string
    processedLogs: number
}

export type TWebpushCampaignAdminSendSingleResponse = {
    campaignLogId: string
}

export type TWebpushCampaignAdminUpdateStatusPayload = {
    status: WebpushStatus
}

export type TWebpushCampaignAdminBulkUpdateStatusPayload = {
    logIds: string[]
    status: WebpushStatus
}

export type TWebpushCampaignAdminUpdateStatusResponse = {
    campaignLogId: string
    status: string
}

export type TWebpushCampaignAdminBulkUpdateStatusResponse = {
    logIds: string[]
    status: string
}
