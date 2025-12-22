import { API } from "@/api/api"
import type { TTicketHoldCreate, TTicketHoldUpdate } from "@/types/TicketHold/TTicketHold"
import type { AxiosResponse } from "axios"

class TicketHoldServiceClass {
    async create(data: TTicketHoldCreate[]): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticket-hold",
            url: "/",
            data: data
        }))?.data
        return response
    }

    async updateQuantity(data: TTicketHoldUpdate): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/ticket-hold",
            url: `/update-quantity`,
            data: data
        }))?.data
        return response
    }

    async deleteByUserId(): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/ticket-hold",
            url: "",
        }))?.data
        return response
    }
}

export const TicketHoldService = new TicketHoldServiceClass()