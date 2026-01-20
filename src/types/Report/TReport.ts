export type TReportCampaignPerformance = {
    campaignId: string
    templateName: string
    subject: string
    sentAt: string
    totalRecipients: number
    deliveredCount: number
    acceptedCount: number
    openedCount: number
    clickedCount: number
    conversionCount: number
    deliveredRate: number
    acceptedRate: number
    openRate: number
    clickRate: number
    conversionRate: number
    revenue: number
}

export type TReportCustomerEntry = {
    month: string
    year: number
    newCustomers: number
    totalCustomers: number
    customersByTag: Array<{
        tagId: string
        tagName: string
        count: number
    }>
}

export type TReportSalesByEvent = {
    eventId: string
    eventName: string
    ticketsSold: number
    revenue: number
    averageTicketPrice: number
    conversionRate: number
}

export type TReportAISuggestion = {
    id: string
    type: "campaign" | "segment" | "event" | "pricing"
    title: string
    description: string
    priority: "high" | "medium" | "low"
    actionLabel?: string
}

export type TReportOverview = {
    totalCampaigns: number
    totalEmailsSent: number
    averageOpenRate: number
    averageClickRate: number
    totalRevenue: number
    totalCustomers: number
    newCustomersLast30Days: number
    topPerformingCampaign: TReportCampaignPerformance | null
}

export type TReportCampaignStats = {
    week: string
    month: string
    year: number
    sent: number
    opened: number
    clicked: number
}

export type TReportCustomerSegment = {
    segmentName: string
    customerCount: number
    averageTicketPrice: number
    totalRevenue: number
    engagementScore: number
}

export type TReportResponse = {
    overview: TReportOverview
    campaignPerformance: TReportCampaignPerformance[]
    customerEntries: TReportCustomerEntry[]
    salesByEvent: TReportSalesByEvent[]
    aiSuggestions: TReportAISuggestion[]
    campaignStatsOverTime: TReportCampaignStats[]
    customerSegments: TReportCustomerSegment[]
}

export type TReportFilters = {
    dateFrom?: string
    dateTo?: string
    tagIds?: string[]
    eventIds?: string[]
}

