import type { TTicket } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"
class TicketServiceClass {
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