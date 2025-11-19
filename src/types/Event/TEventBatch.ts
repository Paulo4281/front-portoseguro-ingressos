type TEventBatch = {
    id: string
    name: string
    price: number
    tickets: number
    isActive: boolean
    autoActivateNext: boolean
    accumulateUnsold: boolean
    startDate: string
    endDate: string | null
    eventId: string
    createdAt: string
    updatedAt: string | null
}

export type {
    TEventBatch
}