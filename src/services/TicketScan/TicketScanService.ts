import { API } from "@/api/api"
import { AxiosResponse } from "axios"
import type { TTicketScanCreate, TTicketScanUpdateExpAt, TTicketScanUpdatePassword } from "@/types/TicketScan/TTicketScan"

class TicketScanServiceClass {
    async create(data: TTicketScanCreate): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/ticketscan",
            url: "",
            data: data
        }))?.data
        return response
    }

    async list(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/ticketscan",
            url: ""
        }))?.data
        return response
    }

    async updateExpAt(data: TTicketScanUpdateExpAt): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/ticketscan",
            url: "/exp-date",
            data: data
        }))?.data
        return response
    }

    async updatePassword(data: TTicketScanUpdatePassword): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/ticketscan",
            url: "/password",
            data: data
        }))?.data
        return response
    }

    async delete(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/ticketscan",
            url: `/${id}`
        }))?.data
        return response
    }
}

export const TicketScanService = new TicketScanServiceClass()