import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import { TApiResponse } from "@/types/TApiResponse"
import type { TTicketBuy, TTicketBuyResponse } from "@/types/Ticket/TTicket"

export const useTicketBuySeller = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TTicketBuy, TApiResponse<TTicketBuyResponse>>({
        mutationFn: (data: TTicketBuy) => TicketService.buySeller(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
