export type TTagClient = {
    id: string
    tagId: string
    userId: string
    createdAt: string
}

export type TTagClientCreate = {
    tagId: string
    userId: string
}

export type TTagClientResponse = {
    id: string
    tagId: string
    userId: string
    createdAt: string
}

export type TTagClientListResponse = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    document: string | null
    nationality: string | null
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
    events: Array<{
        id: string
        eventId: string
        eventName: string
        paymentId: string
        paymentDate: string
        paymentValue: number
        ticketsCount: number
    }>
    totalPurchases: number
    totalSpent: number
    lastPurchaseDate: string | null
    lastPurchaseTime: string | null
    createdAt: string
}

