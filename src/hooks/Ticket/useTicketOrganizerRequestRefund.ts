import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TTicketOrganizerRequestRefundResponse } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"
import { useQueryClient } from "@tanstack/react-query"

type TUseTicketOrganizerRequestRefundParams = {
    ticketId: string
    reason: string
}

export const useTicketOrganizerRequestRefund = () => {
    const queryClient = useQueryClient()

    return useMutationHook<TUseTicketOrganizerRequestRefundParams, TApiResponse<TTicketOrganizerRequestRefundResponse>>({
        mutationFn: async (params) => {
            return await TicketService.organizerRequestRefund(params.ticketId, params.reason)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tickets", "to-organizer"] })
        }
    })
}

