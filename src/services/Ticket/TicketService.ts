import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TTicket, TTicketBuy, TTicketScanLinkGenerateResponse, TTicketScanResponse, TTicketScanLink, TTicketScanLinkCreate, TTicketScanLinkDelete, TTicketQRCodeResponse, TTicketToOrganizer, TTicketValidate, TTicketValidateQrCodeResponse, TTicketOrganizerRequestRefundResponse } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"

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

    async validateTicketQrCodeWorker(qrcodeToken: string, method: "qr-scan" | "qr-image"): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticket",
            url: `/validate-ticket-qrcode/worker/${encodeURIComponent(qrcodeToken)}`,
            data: { method }
        }))?.data
        return response
    }

    async validateTicketQrCodeOrganizer(qrcodeToken: string, method: "qr-scan" | "qr-image"): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticket",
            url: `/validate-ticket-qrcode/organizer/${encodeURIComponent(qrcodeToken)}`,
            data: { method }
        }))?.data
        return response
    }

    async validateTicketWorker(ticketId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticket",
            url: `/validate-ticket/worker/${encodeURIComponent(ticketId)}`
        }))?.data
        return response
    }

    async validateTicketOrganizer(ticketId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticket",
            url: `/validate-ticket/organizer/${encodeURIComponent(ticketId)}`
        }))?.data
        return response
    }

    async organizerRequestRefund(ticketId: string, reason: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticket",
            url: `/organizer/request-refund/${encodeURIComponent(ticketId)}`,
            data: { reason }
        }))?.data
        return response
    }
}

export const TicketService = new TicketServiceClass()