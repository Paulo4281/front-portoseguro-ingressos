type TDashboard = {
    totalRevenue: number
    totalTickets: number
    totalEvents: number
    averageTicketPrice: number
    revenueGrowth: number
    ticketsGrowth: number
    eventsGrowth: number
    averageTicketPriceGrowth: number
    upcomingPayouts: Array<{
        date: string
        amount: number
    }>
    pendingRefunds: Array<{
        eventName: string
        eventDate: string
        reason: "postponement" | "cancellation"
        totalAmount: number
        refundedAmount: number
        status: "pending" | "processing" | "completed"
    }>
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
    topPerformingEvents: Array<{
        name: string
        tickets: number
        revenue: number
    }>
}

export type {
    TDashboard
}