export type TCampaignStatus = "PENDING" | "SENDING" | "SENT" | "FAILED"

export type TCampaign = {
    id: string
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
    templateId: string
    tagIds: string[]
}

export type TCampaignListResponse = {
    data: TCampaign[]
    total: number
    offset: number
    limit: number
}

