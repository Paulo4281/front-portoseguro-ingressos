import { useQueryHook } from "../useQuery"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TTicket } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketFindByUserId = (userId: string) => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TTicket[]>>({
        queryKey: ["tickets", userId],
        queryFn: () => TicketService.findByUserId(userId),
        enabled: !!userId
    })

    return {
        data,
        isLoading,
        isError,
    }
}