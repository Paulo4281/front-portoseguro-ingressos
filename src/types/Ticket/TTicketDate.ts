import type { TEventDate } from "@/types/Event/TEventDate"

const TicketDateStatuses = [
    "PENDING",
    "CONFIRMED",
    "CANCELLED"
] as const

type TTicketDate = {
    id: string
    ticketId: string
    eventDateId: string
    status: typeof TicketDateStatuses[number]
    usedAt: string | null
    EventDate?: TEventDate | null
}

export type {
    TTicketDate
}

export {
    TicketDateStatuses
}