import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TTicketScanSessionAuthenticate } from "@/types/TicketScanSession/TTicketScanSession"

class TicketScanSessionServiceClass {
    async authenticate(data: TTicketScanSessionAuthenticate): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticketscan-session",
            url: "/authenticate",
            data: data
        }))?.data
        return response
    }

    async delete(): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/ticketscan-session",
            url: ""
        }))?.data
        return response
    }

    async deleteByOrganizer(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/ticketscan-session",
            url: `/organizer/${id}`
        }))?.data
        return response
    }

}

export const TicketScanSessionService = new TicketScanSessionServiceClass()