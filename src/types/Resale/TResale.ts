type TResale = {
    id: string
    email: string
    commissionRate?: number
    isActive?: boolean
    totalSales?: number
    salesCount?: number
    totalTicketsSold?: number
    ticketsSold?: number
    /** Receita total em centavos (R$) */
    totalRevenue?: number
    createdAt?: string
    updatedAt?: string | null
}

/** Vendas de um revendedor por evento (para gráfico de eficiência) */
type TResaleSalesByEvent = {
    eventId: string
    eventName: string
    resellerId: string
    resellerEmail: string
    ticketsSold: number
    /** Receita em centavos */
    revenue: number
}

type TResaleCreatePayload = {
    email: string
    commissionRate: number
}

type TResaleUpdatePayload = {
    email: string
    commissionRate: number
}

type TResaleStats = {
    totalResellers: number
    activeResellers: number
    totalSales: number
    averageSalesPerReseller: number
}

type TResaleTopSeller = {
    id: string
    email: string
    totalSales: number
}

type TResaleFindData = {
    resellers?: TResale[]
    items?: TResale[]
    stats?: Partial<TResaleStats>
    topSellers?: TResaleTopSeller[]
    ranking?: TResaleTopSeller[]
}

type TResaleInviteStatus = "PENDING" | "ACCEPTED" | "CANCELLED"

type TResaleInvite = {
    id: string
    email: string
    status: TResaleInviteStatus
    commissionRate?: number
    siid: string
    createdAt: string
}

type TOrganizerInfo = {
    name: string
    phone: string
    email: string
    image: string | null
}

export type {
    TResale,
    TResaleSalesByEvent,
    TResaleCreatePayload,
    TResaleUpdatePayload,
    TResaleStats,
    TResaleTopSeller,
    TResaleFindData,
    TResaleInvite,
    TResaleInviteStatus,
    TOrganizerInfo
}
