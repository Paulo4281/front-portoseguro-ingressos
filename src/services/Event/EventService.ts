import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import { EventCreateValidator } from "@/validators/Event/EventValidator"
import { z } from "zod"
import type { TEventSalesReport, TEventDetailedStats, TEventUpdate } from "@/types/Event/TEvent"

type TEventCreate = z.infer<typeof EventCreateValidator>

const eventSalesReportMock: TEventSalesReport = {
    eventId: "",
    eventName: "",
    totalTicketsSold: 245,
    totalTickets: 960,
    totalRevenue: 3675000,
    totalViews: 1250,
    conversionRate: 19.6,
    salesByBatch: [
        { batchId: "1", batchName: "Lote Promocional", ticketsSold: 120, revenue: 1440000, percentage: 49.0 },
        { batchId: "2", batchName: "Lote 1", ticketsSold: 85, revenue: 1700000, percentage: 34.7 },
        { batchId: "3", batchName: "Lote 2", ticketsSold: 40, revenue: 535000, percentage: 16.3 }
    ],
    salesByTicketType: [
        { ticketTypeId: "1", ticketTypeName: "Inteira", ticketsSold: 150, revenue: 2250000, percentage: 61.2 },
        { ticketTypeId: "2", ticketTypeName: "Meia", ticketsSold: 75, revenue: 1125000, percentage: 30.6 },
        { ticketTypeId: "3", ticketTypeName: "VIP", ticketsSold: 20, revenue: 300000, percentage: 8.2 }
    ],
    salesByDate: [
        { date: "2025-11-20", ticketsSold: 45, revenue: 675000 },
        { date: "2025-11-21", ticketsSold: 62, revenue: 930000 },
        { date: "2025-11-22", ticketsSold: 38, revenue: 570000 },
        { date: "2025-11-23", ticketsSold: 55, revenue: 825000 },
        { date: "2025-11-24", ticketsSold: 45, revenue: 675000 }
    ],
    buyersByAgeRange: [
        { ageRange: "18-25", count: 85, percentage: 34.7 },
        { ageRange: "26-35", count: 95, percentage: 38.8 },
        { ageRange: "36-45", count: 45, percentage: 18.4 },
        { ageRange: "46-55", count: 15, percentage: 6.1 },
        { ageRange: "56+", count: 5, percentage: 2.0 }
    ],
    buyersByOrigin: [
        { origin: "Porto Seguro", count: 120, percentage: 49.0 },
        { origin: "Salvador", count: 65, percentage: 26.5 },
        { origin: "São Paulo", count: 35, percentage: 14.3 },
        { origin: "Rio de Janeiro", count: 15, percentage: 6.1 },
        { origin: "Outros", count: 10, percentage: 4.1 }
    ],
    salesOverTime: [
        { date: "2025-11-15", ticketsSold: 12, revenue: 180000 },
        { date: "2025-11-16", ticketsSold: 18, revenue: 270000 },
        { date: "2025-11-17", ticketsSold: 25, revenue: 375000 },
        { date: "2025-11-18", ticketsSold: 32, revenue: 480000 },
        { date: "2025-11-19", ticketsSold: 28, revenue: 420000 },
        { date: "2025-11-20", ticketsSold: 45, revenue: 675000 },
        { date: "2025-11-21", ticketsSold: 62, revenue: 930000 },
        { date: "2025-11-22", ticketsSold: 38, revenue: 570000 },
        { date: "2025-11-23", ticketsSold: 55, revenue: 825000 },
        { date: "2025-11-24", ticketsSold: 45, revenue: 675000 }
    ],
    topBuyers: [
        { buyerName: "Maria Silva", ticketsBought: 8, totalSpent: 120000 },
        { buyerName: "João Santos", ticketsBought: 6, totalSpent: 90000 },
        { buyerName: "Ana Costa", ticketsBought: 5, totalSpent: 75000 },
        { buyerName: "Pedro Oliveira", ticketsBought: 4, totalSpent: 60000 },
        { buyerName: "Carla Ferreira", ticketsBought: 4, totalSpent: 60000 }
    ],
    averageTicketPrice: 15000,
    peakSalesDay: "Terça-feira",
    peakSalesHour: "14:00 - 15:00"
}

const eventDetailedStatsMock: TEventDetailedStats = {

}

class EventServiceClass {
    async create(data: TEventCreate): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        
        formData.append("name", data.name)
        formData.append("description", data.description)
        if (data.location) {
            formData.append("location", data.location)
        }
        formData.append("isClientTaxed", String(data.isClientTaxed || false))
        
        if (data.image) {
            formData.append("image", data.image)
        }

        if (data.form) {
            formData.append("form", JSON.stringify(data.form))
        }

        if (data.isFormForEachTicket) {
            formData.append("isFormForEachTicket", String(data.isFormForEachTicket))
        }
        if (data.isFree !== undefined && data.isFree !== null) {
            formData.append("isFree", String(data.isFree))
        }
        if (data.isOnline !== undefined && data.isOnline !== null) {
            formData.append("isOnline", String(data.isOnline))
        }
        if (data.maxInstallments !== undefined && data.maxInstallments !== null) {
            formData.append("maxInstallments", String(data.maxInstallments))
        }
        
        if (data.categories && data.categories.length > 0) {
            data.categories.forEach((categoryId: string, index: number) => {
                formData.append(`categories[${index}]`, categoryId)
            })
        }
        
        if (data.ticketTypes && data.ticketTypes.length > 0) {
            formData.append("ticketTypes", JSON.stringify(data.ticketTypes))
        }
        
        if (data.batches && data.batches.length > 0) {
            formData.append("batches", JSON.stringify(data.batches))
        } else {
            if (data.tickets !== undefined) {
                formData.append("tickets", String(data.tickets))
            }
            if (data.ticketPrice !== undefined) {
                formData.append("ticketPrice", String(data.ticketPrice))
            }
        }
        
        if (data.recurrence) {
            formData.append("recurrence", JSON.stringify(data.recurrence))
        } else if (data.dates && data.dates.length > 0) {
            formData.append("dates", JSON.stringify(data.dates))
        }
        
        const response = (await API.POST_FILE({
            prefix: "/event",
            url: "/",
            formData: formData
        }))?.data
        return response
    }

    async find(params?: { offset?: number; name?: string; categoryId?: string }): Promise<AxiosResponse["data"]> {
        const queryParams: Record<string, string | number> = {}
        
        if (params?.offset !== undefined) {
            queryParams.offset = params.offset
        }
        
        if (params?.name) {
            queryParams.name = params.name
        }
        
        if (params?.categoryId) {
            queryParams.categoryId = params.categoryId
        }
        
        const response = (await API.GET({
            prefix: "/event",
            url: "/",
            params: Object.keys(queryParams).length > 0 ? queryParams : undefined
        }))?.data
        return response
    }

    async findAdmin(params?: { offset?: number; name?: string }): Promise<AxiosResponse["data"]> {
        const queryParams: Record<string, string | number> = {}
        
        if (params?.offset !== undefined) {
            queryParams.offset = params.offset
        }
        
        if (params?.name) {
            queryParams.name = params.name
        }
        
        const response = (await API.GET({
            prefix: "/event",
            url: "/admin",
            params: Object.keys(queryParams).length > 0 ? queryParams : undefined
        }))?.data
        return response
    }

    async findFeatured(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: "/featured"
        }))?.data
        return response
    }

    async findByUserId(params?: { offset?: number; name?: string }): Promise<AxiosResponse["data"]> {
        const queryParams: Record<string, string | number> = {}
        
        if (params?.offset !== undefined) {
            queryParams.offset = params.offset
        }
        
        if (params?.name) {
            queryParams.name = params.name
        }
        
        const response = (await API.GET({
            prefix: "/event",
            url: "/user",
            params: Object.keys(queryParams).length > 0 ? queryParams : undefined
        }))?.data
        return response
    }

    async findById(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: `/${id}`
        }))?.data
        return response
    }

    async findBySlug(slug: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: `/slug/${slug}`
        }))?.data
        return response
    }

    async findByIdUser(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: `/user/${id}`
        }))?.data
        return response
    }

    async findSimilar(params: { categories: string; excludeEventId?: string }): Promise<AxiosResponse["data"]> {
        const queryParams: Record<string, string> = {
            categories: params.categories
        }
        
        if (params.excludeEventId) {
            queryParams.excludeEventId = params.excludeEventId
        }
        
        const response = (await API.GET({
            prefix: "/event",
            url: "/similar",
            params: queryParams
        }))?.data
        
        return response
    }

    async cache(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: "/cache"
        }))?.data
        return response
    }

    async verifySold(eventId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: `/verify-sold/${eventId}`
        }))?.data
        return response
    }

    async verifyLastTickets(eventId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: `/verify-last-tickets/${eventId}`
        }))?.data
        return response
    }

    async update(eventId: string, data: TEventUpdate, isAdmin?: boolean): Promise<AxiosResponse["data"]> {
        const url = isAdmin ? `/admin/${eventId}` : `/${eventId}`
        
        const response = (await API.PUT({
            prefix: "/event",
            url: url,
            data: data
        }))?.data
        return response
    }

    async updateImage(eventId: string, file: File): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        formData.append("image", file)
        
        const response = (await API.PATCH_FILE({
            prefix: "/event",
            url: `/update-image/${eventId}`,
            formData: formData
        }))?.data
        return response
    }

    async generateSalesReport(eventId: string): Promise<AxiosResponse["data"]> {
        return {
            success: true,
            data: {
                ...eventSalesReportMock,
                eventId
            }
        }
    }
}

export const EventService = new EventServiceClass()