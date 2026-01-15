export type TTagAutomationRules = {
    eventId?: string
    eventCategoryId?: string
    minTotalSpent?: number
    minTicketsCount?: number
    purchaseDateFrom?: string
    purchaseDateTo?: string
} | null

export type TTag = {
    id: string
    name: string
    color: string
    userId: string
    automationRules: TTagAutomationRules
    createdAt: string
    updatedAt: string | null
}

export type TTagCreate = {
    name: string
    color: string
    automationRules?: TTagAutomationRules
}

export type TTagUpdate = {
    name?: string
    color?: string
    automationRules?: TTagAutomationRules
}

export type TTagResponse = {
    id: string
    name: string
    color: string
    userId: string
    automationRules: TTagAutomationRules
    createdAt: string
    updatedAt: string | null
}

