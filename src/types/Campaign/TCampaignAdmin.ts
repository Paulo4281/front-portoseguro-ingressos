import type { TCampaignLogStatus } from "@/types/CampaignLog/TCampaignLog"

export type TCampaignAdminStatus = "PENDING" | "PROCESSING" | "SENT" | "FAILED"

export type TCampaignAdminLog = {
    id: string
    campaignId: string
    userId: string
    email: string
    status: TCampaignLogStatus
    mailgunMessageId: string | null
    errorMessage: string | null
    openedAt: string | null
    clickedAt: string | null
    adminTriggeredSingleSend: boolean
    adminTriggeredSingleSendAt: string | null
    adminUpdatedStatus: boolean
    adminUpdatedStatusAt: string | null
    adminUpdatedStatusTo: string | null
    createdAt: string
    updatedAt: string | null
}

export type TCampaignAdmin = {
    id: string
    name: string | null
    templateId: string
    userId: string
    status: TCampaignAdminStatus
    tagIds: string[] | null
    eventId: string | null
    couponId: string | null
    opinionPollId: string | null
    totalRecipients: number
    sentCount: number
    startedByAdmin: boolean
    startedByAdminAt: string | null
    startedByCron: boolean
    startedByCronAt: string | null
    createdAt: string
    updatedAt: string | null
    logs: TCampaignAdminLog[]
}

export type TCampaignAdminListResponse = {
    data: TCampaignAdmin[]
    total: number
    offset: number
    limit: number
}

export type TCampaignAdminSendNowResponse = {
    campaignId: string
    processedLogs: number
}

export type TCampaignAdminSendSingleResponse = {
    campaignLogId: string
}

export type TCampaignAdminUpdateStatusPayload = {
    status: TCampaignLogStatus
}

export type TCampaignAdminBulkUpdateStatusPayload = {
    logIds: string[]
    status: TCampaignLogStatus
}

export type TCampaignAdminUpdateStatusResponse = {
    campaignLogId: string
    status: string
}

export type TCampaignAdminBulkUpdateStatusResponse = {
    logIds: string[]
    status: string
}
