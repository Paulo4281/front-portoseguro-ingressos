import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TTicket, TTicketBuy } from "@/types/Ticket/TTicket"
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

    async findByUserId(userId: string): Promise<TApiResponse<TTicket[]> | any> {
        // if (!userId) {
        //     return {
        //         success: false,
        //         data: []
        //     }
        // }

        // const tickets = mockTickets.filter((ticket) => ticket.userId === userId)
        // return {
        //     success: true,
        //     data: tickets
        // }
    }
}

export const TicketService = new TicketServiceClass()