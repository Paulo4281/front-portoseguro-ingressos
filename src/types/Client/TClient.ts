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

type TCustomer = {
    id: string
    name: string
    email: string
    phone: string
    totalPurchases: number
    totalSpent: number
    lastPurchaseDate: string
    lastPurchaseTime: string
    events: Array<{
        id: string
        name: string
        date: string
        tickets: Array<{
            type: string
            quantity: number
        }>
    }>
    tags: Array<{
        id: string
        name: string
        color: string
    }>
    observations: Array<{
        id: string
        text: string
        createdAt: string
    }>
}

type TFindOrganizerClientsCrmResponse = {
    data: TCustomer[]
    total: number
    limit: number
    offset: number
}

export type {
    TClient,
    TClientEvent,
    TFindOrganizerClientsResponse,
    TCustomer,
    TFindOrganizerClientsCrmResponse
}