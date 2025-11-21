import type { TTicketType } from "@/types/TicketType/TTicketType"

type TEventBatchTicketTypeDay = {
    eventDateId: string
    price: number
}

type TEventBatchTicketType = {
    id: string
    eventBatchId: string
    ticketTypeId: string
    price: number | null
    amount: number
    days: TEventBatchTicketTypeDay[] | null
    TicketType?: TTicketType
}

export type {
    TEventBatchTicketType,
    TEventBatchTicketTypeDay
}

