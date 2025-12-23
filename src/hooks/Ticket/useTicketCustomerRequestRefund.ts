import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketCustomerRequestRefundResponse } from "@/types/Ticket/TTicket"

export const useTicketCustomerRequestRefund = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<{ ticketId: string }, TApiResponse<TTicketCustomerRequestRefundResponse>>({
        mutationFn: (data) => TicketService.customerRequestRefund(data.ticketId)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}