import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"

type TTicket = {
    id: string
    status: "PENDING" | "PAID" | "CANCELLED" | "USED" | "EXPIRED"
    eventId: string
    eventBatchId: string | null
    userId: string
    price: number
    createdAt: string
    updatedAt: string | null

    event: TEvent
    eventBatch: TEventBatch | null
}

export type {
    TTicket
}