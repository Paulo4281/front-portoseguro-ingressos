import type { TEventBatch } from "./TEventBatch"
import type { TEventDate } from "./TEventDate"
import type { TRecurrence } from "./TRecurrence"
import type { TEventCategoryEvent } from "./TEventCategoryEvent"
import type { TTicketType } from "@/types/TicketType/TTicketType"
import type { TOrganizer } from "@/types/Organizer/TOrganizer"
import { EventCreateValidator } from "@/validators/Event/EventValidator"
import type { z } from "zod"

type TEventCreate = z.infer<typeof EventCreateValidator>

type TEventUpdate = Partial<TEventCreate>

type TEventCacheResponse = {
    id: string
    name: string
    Recurrence: {
        id: string
    } | null
    EventDates: {
        id: string
        date: string | null
        hourStart: string | null
        hourEnd: string | null
    }[]
}

type TEvent = {
    id: string
    name: string
    description: string | null
    slug: string
    location: string | null
    image: string
    price: number | null
    tickets: number | null
    userId: string
    organizerId: string
    isFree: boolean
    isOnline: boolean
    isClientTaxed: boolean
    maxInstallments: number
    isActive: boolean
    isDeleted: boolean
    isCancelled: boolean
    isPostponed: boolean
    postponedAt: string | null
    createdAt: string
    updatedAt: string | null
    form: any | null
    isFormForEachTicket: boolean
    buyTicketsLimit: number | null

    EventDates: TEventDate[]
    EventBatches: TEventBatch[]
    EventCategoryEvents: TEventCategoryEvent[]
    TicketTypes: TTicketType[]
    Recurrence: TRecurrence | null
    Organizer: TOrganizer
}

type TEventSalesReport = {
    eventId: string
    eventName: string
    totalTicketsSold: number
    totalTickets: number
    totalRevenue: number
    totalViews: number
    conversionRate: number
    salesByBatch: Array<{
        batchId: string
        batchName: string
        ticketsSold: number
        revenue: number
        percentage: number
    }>
    salesByTicketType: Array<{
        ticketTypeId: string
        ticketTypeName: string
        ticketsSold: number
        revenue: number
        percentage: number
    }>
    salesByDate: Array<{
        date: string
        ticketsSold: number
        revenue: number
    }>
    buyersByAgeRange: Array<{
        ageRange: string
        count: number
        percentage: number
    }>
    buyersByOrigin: Array<{
        origin: string
        count: number
        percentage: number
    }>
    salesOverTime: Array<{
        date: string
        ticketsSold: number
        revenue: number
    }>
    topBuyers: Array<{
        buyerName: string
        ticketsBought: number
        totalSpent: number
    }>
    averageTicketPrice: number
    peakSalesDay: string
    peakSalesHour: string
}

type TEventVerifyLastTicketsResponse = {
    eventId: string
    eventDateId: string | null
    ticketTypeId: string | null
    isLastTickets: boolean
    available: boolean
    ticketsAmount: number | null
}

type TEventVerifySoldResponse = {
    eventId: string
    eventBatchId: string
    eventDateId: string | null
    ticketTypeId: string | null
    sold: number
}

type TEventDetailedStats = {

}

type TEventSoldInValueResponse = {
    eventId: string
    value: number
}

type TEventBuyerValidationInfo = {
    validatedAt?: string | null
    validatedByOrganizer?: boolean
    method?: "qr-scan" | "qr-image" | "button" | null
    code?: string | null
    ip?: string | null
    name?: string | null
    location?: string | null
} | null

type TEventSearchResponse = {
    id: string
    name: string
    slug: string
    image: string
}

type TEventBuyerTicketStatus =
    "PENDING" |
    "CONFIRMED" |
    "CANCELLED" |
    "REFUNDED" |
    "REFUND_REQUESTED" |
    "OVERDUE" |
    "USED" |
    "PARTIALLY_USED" |
    "EXPIRED" |
    "FAILED"

type TEventListBuyers = {
    ticketId: string
    status: TEventBuyerTicketStatus
    customerName: string
    paymentDate: Date | string
    ticketTypeName: string | null
    eventDates: string[]
    formAnswers: Record<string, any>
    validationInfo: TEventBuyerValidationInfo
}

export type {
    TEvent,
    TEventDate,
    TRecurrence,
    TEventCategoryEvent,
    TOrganizer,
    TEventCreate,
    TEventSalesReport,
    TEventDetailedStats,
    TEventUpdate,
    TEventVerifyLastTicketsResponse,
    TEventVerifySoldResponse,
    TEventSoldInValueResponse,
    TEventListBuyers,
    TEventSearchResponse,
    TEventCacheResponse
}