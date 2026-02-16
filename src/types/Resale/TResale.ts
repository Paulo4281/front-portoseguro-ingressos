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

type TSellerListItem = {
    id: string
    firstName?: string | null
    lastName?: string | null
    email: string
    phone?: string | null
    sellerActive: boolean
    sellerCommissionRate: number
    createdAt: string
    totalSales?: number
    totalRevenue?: number
}

type TSellerInvitation = {
    id: string
    email: string
    code: string
    isUsed: boolean
    usedAt?: string | null
    createdAt: string
    updatedAt?: string | null
}

/** Item para gráfico: vendas (ingressos + receita) por revendedor */
export type TRevendaChartSalesBySeller = {
    sellerId: string
    /** Nome ou e-mail do revendedor para exibição */
    sellerName: string
    /** Quantidade de ingressos vendidos */
    ticketsCount: number
    /** Receita total em centavos (R$) */
    revenueCents: number
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
    /** Opcional: % das vendas do evento atribuídas a este revendedor (0–100) */
    efficiencyPercent?: number
}

type TResaleCreatePayload = {
    email: string
}

type TResaleUpdatePayload = {
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
    resellers?: TResale[] | TSellerListItem[]
    items?: TResale[] | TSellerListItem[] | TSellerInvitation[]
    invites?: TSellerInvitation[]
    invitations?: TSellerInvitation[]
    stats?: Partial<TResaleStats>
    topSellers?: TResaleTopSeller[]
    ranking?: TResaleTopSeller[]
}

type TResaleInviteStatus = "PENDING" | "ACCEPTED" | "CANCELLED"

type TResaleInvite = {
    id: string
    email: string
    status: TResaleInviteStatus
    siid: string
    createdAt: string
}

type TOrganizerInfo = {
    name: string
    phone: string
    email: string
    image: string | null
}

type TVerifyInviteOrganizerInfo = {
    companyName: string | null
    companyDocument: string | null
    companyAddress: string | null
    logo: string | null
    description: string | null
    instagramUrl: string | null
    facebookUrl: string | null
}

type TVerifyInviteResponse = {
    email: string
    organizer: TVerifyInviteOrganizerInfo | null
}

export type {
    TResale,
    TResaleSalesByEvent,
    TSellerListItem,
    TSellerInvitation,
    TResaleCreatePayload,
    TResaleUpdatePayload,
    TResaleStats,
    TResaleTopSeller,
    TResaleFindData,
    TResaleInvite,
    TResaleInviteStatus,
    TOrganizerInfo,
    TVerifyInviteOrganizerInfo,
    TVerifyInviteResponse
}
