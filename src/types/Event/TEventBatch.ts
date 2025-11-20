type TEventBatch = {
    id: string
    name: string
    price: number | null
    startDate: string
    endDate: string | null
    tickets: number
    autoActivateNext: boolean
    accumulateUnsold: boolean
    isActive: boolean
    eventId: string
    createdAt: string
    updatedAt: string | null
}

export type {
    TEventBatch
}