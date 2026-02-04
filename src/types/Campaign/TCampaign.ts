export type TCampaignStatus = "PENDING" | "SENDING" | "SENT" | "FAILED"

export type TCampaign = {
    id: string
    name: string | null
    templateId: string
    organizerId: string
    status: TCampaignStatus
    tagIds: string[] | null
    totalRecipients: number
    sentCount: number
    createdAt: string
    updatedAt: string | null
}

export type TCampaignCreate = {
    name?: string | null
    templateId: string
    tagIds: string[]
    eventId?: string | null
    opinionPollId?: string | null
    couponId?: string | null
}

export type TCampaignListResponse = {
    data: TCampaign[]
    total: number
    offset: number
    limit: number
}

