export type TCampaignLogStatus = 
    | "PENDING" 
    | "ACCEPTED" 
    | "DELIVERED" 
    | "OPENED" 
    | "CLICKED" 
    | "FAILED" 
    | "BOUNCED" 
    | "COMPLAINED" 
    | "UNSUBSCRIBED"

export type TCampaignLog = {
    id: string
    campaignId: string
    userId: string
    email: string
    status: TCampaignLogStatus
    mailgunMessageId: string | null
    errorMessage: string | null
    openedAt: string | null
    clickedAt: string | null
    createdAt: string
    updatedAt: string | null
}

export type TCampaignQuota = {
    sentCount: number
    remainingQuota: number
}

