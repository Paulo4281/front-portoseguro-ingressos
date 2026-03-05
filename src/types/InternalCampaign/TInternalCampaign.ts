type TInternalCampaignLocationStat = {
    location: string
    accesses: number
}

type TInternalCampaignDeviceStat = {
    device: string
    accesses: number
}

type TInternalCampaignDailyStat = {
    date: string
    accesses: number
}

type TInternalCampaign = {
    id: string
    name: string
    utmCampaign: string
    utmId: string
    utmSource: string | null
    utmContent: string | null
    utmTerm: string | null
    adminUserId: string
    createdAt: string
    updatedAt: string | null
}

type TInternalCampaignListItem = TInternalCampaign & {
    accessesTotal: number
    salesTotal: number
    efficiencyPercent: number
}

type TInternalCampaignCreate = {
    name: string
    utmCampaign: string
    utmSource?: string | null
    utmContent?: string | null
    utmTerm?: string | null
}

type TInternalCampaignUpdate = {
    id: string
    name?: string
    utmCampaign?: string
    utmSource?: string | null
    utmContent?: string | null
    utmTerm?: string | null
}

type TInternalCampaignStatsResponse = {
    locationStats: TInternalCampaignLocationStat[]
    deviceStats: TInternalCampaignDeviceStat[]
    dailyStats: TInternalCampaignDailyStat[]
}

type TInternalCampaignPaginatedResponse = {
    data: TInternalCampaignListItem[]
    total: number
    offset: number
    limit: number
}

export type {
    TInternalCampaign,
    TInternalCampaignListItem,
    TInternalCampaignCreate,
    TInternalCampaignUpdate,
    TInternalCampaignStatsResponse,
    TInternalCampaignPaginatedResponse,
    TInternalCampaignLocationStat,
    TInternalCampaignDeviceStat,
    TInternalCampaignDailyStat
}
