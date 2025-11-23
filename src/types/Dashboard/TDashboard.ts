type TDashboard = {
    totalRevenue: number
    totalTickets: number
    totalEvents: number
    averageTicketPrice: number
    revenueGrowth: number
    ticketsGrowth: number
    eventsGrowth: number
    averageTicketPriceGrowth: number
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