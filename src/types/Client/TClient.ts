type TClientEvent = {
    id: string
    eventId: string
    eventName: string
    paymentId: string
    paymentDate: string
    paymentValue: number
    ticketsCount: number
}

type TClient = {
    id: string
    userId: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    birth: string | null
    address: {
        street: string | null
        number: string | null
        complement: string | null
        neighborhood: string | null
        city: string | null
        state: string | null
        country: string | null
        zipCode: string | null
    } | null
    totalPayments: number
    events: TClientEvent[]
    createdAt: string
}

type TFindOrganizerClientsResponse = {
    data: TClient[]
    total: number
    limit: number
    offset: number
}

export type {
    TClient,
    TClientEvent,
    TFindOrganizerClientsResponse
}