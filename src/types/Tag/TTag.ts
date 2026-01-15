export type TTag = {
    id: string
    name: string
    color: string
    userId: string
    createdAt: string
    updatedAt: string | null
}

export type TTagCreate = {
    name: string
    color: string
    automationRules?: {
        eventId?: string
        eventCategoryId?: string
        minTotalSpent?: number
        minTicketsCount?: number
        minEventsCount?: number
        purchaseDateFrom?: string
        purchaseDateTo?: string
    }
}

export type TTagUpdate = {
    name?: string
    color?: string
}

export type TTagResponse = {
    id: string
    name: string
    color: string
    userId: string
    createdAt: string
    updatedAt: string | null
}

