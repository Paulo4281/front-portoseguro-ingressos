type TTicketScanCreate = {
    eventId: string
    password: string
    maxUsers?: number
    expiresAt: string
}

type TTicketScanUpdateExpAt = {
    id: string
    expiresAt: string
}

type TTicketScanUpdatePassword = {
    id: string
    password: string
}

type TTicketScanSessionPublic = {
    id: string
    ticketScanId: string
    name: string
    location: string | null
    ip: string
    createdAt: string
}

type TTicketScanPublic = {
    id: string
    code: string
    eventId: string
    maxUsers: number
    userId?: string
    password?: string
    expiresAt: string
    createdAt: string
    updatedAt: string | null
    TicketScanSessions?: TTicketScanSessionPublic[]
}

export type {
    TTicketScanCreate,
    TTicketScanUpdateExpAt,
    TTicketScanUpdatePassword,
    TTicketScanSessionPublic,
    TTicketScanPublic
}