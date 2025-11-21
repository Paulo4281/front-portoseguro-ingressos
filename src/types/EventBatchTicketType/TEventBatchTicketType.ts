import type { TTicketType } from "@/types/TicketType/TTicketType"

type TEventBatchTicketType = {
    id: string
    eventBatchId: string
    ticketTypeId: string
    price: number
    amount: number
    TicketType?: TTicketType
}

export type {
    TEventBatchTicketType
}

