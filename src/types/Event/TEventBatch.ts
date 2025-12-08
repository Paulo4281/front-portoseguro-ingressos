import type { TEventBatchTicketType } from "@/types/EventBatchTicketType/TEventBatchTicketType"

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
    isFinished: boolean
    eventId: string
    createdAt: string
    updatedAt: string | null
    EventBatchTicketTypes?: TEventBatchTicketType[]
}

export type {
    TEventBatch
}