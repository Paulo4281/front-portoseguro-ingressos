import { useQueryHook } from "../useQuery"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TTicket } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketFindByUserId = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TTicket[]>>({
        queryKey: ["tickets"],
        queryFn: () => TicketService.findByUserId(),
    })

    return {
        data,
        isLoading,
        isError,
    }
}