type TEventBatch = {
    id: string
    name: string
    price: number
    quantity: number
    startDate: string
    endDate: string | null
    isActive: boolean
    createdAt: string
    updatedAt: string | null
}

export type {
    TEventBatch
}