type TEventDateTicketTypePrice = {
    id: string
    eventDateId: string
    ticketTypeId: string
    price: number
    TicketType?: {
        id: string
        name: string
        description: string | null
        eventId: string
    }
}

type TEventDate = {
    id: string
    date: string | null
    hourStart: string | null
    hourEnd: string | null
    eventId: string
    hasSpecificPrice?: boolean
    price?: number | null
    EventDateTicketTypePrices?: TEventDateTicketTypePrice[] | null
    createdAt: string
    updatedAt: string | null
}

export type {
    TEventDate,
    TEventDateTicketTypePrice
}