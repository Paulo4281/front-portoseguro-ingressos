import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TTicket, TTicketBuy, TTicketScanLinkGenerateResponse, TTicketScanResponse, TTicketScanLink, TTicketScanLinkCreate, TTicketScanLinkDelete, TTicketQRCodeResponse, TTicketToOrganizer } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"

const mockTicketScanResponse: TApiResponse<TTicketScanResponse> = {
    success: true,
    data: {
        status: "VALID",
        description: null
    }
}

const mockTicketScanLinkGenerateResponse: TApiResponse<TTicketScanLinkGenerateResponse> = {
    success: true,
    data: {
        link: "https://www.google.com"
    }
}

const mockScanLinks: TTicketScanLink[] = []

class TicketServiceClass {
    async buy(data: TTicketBuy): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticket",
            url: "/buy",
            data: data
        }))?.data
        return response
    }

    async findByEventIdToOrganizer(eventId: string, offset: number = 0, limit: number = 30, search?: string, status?: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/ticket",
            url: `/list-sold-by-event/${eventId}`,
            params: {
                offset,
                limit,
                search: search || "",
                status: status || ""
            }
        }))?.data
        return response
    }

    async scan(): Promise<AxiosResponse["data"]> {
        return mockTicketScanResponse
    }

    async generateScanLink(): Promise<AxiosResponse["data"]> {
        return mockTicketScanLinkGenerateResponse
    }

    async createScanLink(data: TTicketScanLinkCreate): Promise<AxiosResponse["data"]> {
        const newLink: TTicketScanLink = {
            id: `link-${Date.now()}`,
            link: `${window.location.origin}/qr-scan-link/${Date.now()}`,
            maxUsers: data.maxUsers,
            currentUsers: 0,
            password: data.password,
            createdAt: new Date().toISOString()
        }
        mockScanLinks.push(newLink)
        return {
            success: true,
            data: newLink
        }
    }

    async getScanLinks(): Promise<AxiosResponse["data"]> {
        return {
            success: true,
            data: mockScanLinks
        }
    }

    async deleteScanLink(data: TTicketScanLinkDelete): Promise<AxiosResponse["data"]> {
        const index = mockScanLinks.findIndex(link => link.id === data.linkId)
        if (index >= 0) {
            mockScanLinks.splice(index, 1)
        }
        return {
            success: true,
            data: null
        }
    }

    async scanWithData(qrData: string): Promise<AxiosResponse["data"]> {
        console.log("Enviando dados do QR Code para o servidor:", qrData)
        return mockTicketScanResponse
    }

    async getTicketQRCode(ticketId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/ticket",
            url: `/generate-ticket-qrcode/${ticketId}`
        }))?.data
        return response
    }

    async findByUserId(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/ticket",
            url: "/user"
        }))?.data
        return response
    }
}

export const TicketService = new TicketServiceClass()