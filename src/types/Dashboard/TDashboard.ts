type TDashboardOverview = {
    totalRevenue: number
    totalTickets: number
    totalEvents: number
    averageTicketPrice: number
    revenueOverTime: Array<{
        date: string
        revenue: number
    }>
    ticketsOverTime: Array<{
        date: string
        tickets: number
    }>
    salesByEvent: Array<{
        eventName: string
        tickets: number
        revenue: number
    }>
}

type TDashboardPayouts = {
    upcomingPayouts: Array<{
        date: string
        value: number
    }>
    pendingRefunds: Array<{
        eventName: string
        eventDate: string
        reason: "POSTPONED" | "CANCELLED"
        totalAmount: number
        refundedAmount: number
        status: "PENDING" | "PROCESSING" | "COMPLETED"
    }>
}

export type {
    TDashboardOverview,
    TDashboardPayouts
}