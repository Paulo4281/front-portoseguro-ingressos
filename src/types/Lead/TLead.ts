type TLeadEvent = {
    id: string
    eventId: string
    eventName: string
    purchaseId: string
    purchaseDate: string
    purchaseValue: number
    ticketsCount: number
}

type TLead = {
    id: string
    userId: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    birth: string | null
    device: "DESKTOP" | "MOBILE" | "TABLET" | null
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
    totalEventsPurchased: number
    events: TLeadEvent[]
    createdAt: string
}

export type {
    TLead,
    TLeadEvent
}