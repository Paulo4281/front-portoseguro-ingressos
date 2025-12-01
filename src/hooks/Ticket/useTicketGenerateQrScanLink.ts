import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketScanLinkGenerateResponse } from "@/types/Ticket/TTicket"

export const useTicketGenerateQrScanLink = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<void, TApiResponse<TTicketScanLinkGenerateResponse>>({
        mutationFn: () => TicketService.generateScanLink()
    })

    return {
        mutateAsync,
        isPending
    }
}