type TTicketHold = {
    id: string
    eventId: string
    eventBatchId: string
    eventDateId: string
    ticketTypeId: string
    userId: string
    quantity: number
    expiresAt: string
    createdAt: string
}

type TTicketHoldCreate = {
    eventId: string
    eventBatchId: string
    eventDateId: string | null
    ticketTypeId: string | null
    quantity: number
}

type TTicketHoldUpdate = {
    id: string
    quantity: number
}

type TTicketHoldCreateResponse = {
    id: string
    eventDateId: string | null
    ticketTypeId: string | null
}

export type {
    TTicketHold,
    TTicketHoldCreate,
    TTicketHoldUpdate,
    TTicketHoldCreateResponse
}