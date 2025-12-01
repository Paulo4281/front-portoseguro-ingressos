import { useMutationHook } from "../useMutation"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TTicketScanResponse } from "@/types/Ticket/TTicket"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketScan = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<void, TApiResponse<TTicketScanResponse>>({
        mutationFn: () => TicketService.scan()
    })

    return {
        mutateAsync,
        isPending
    }
}