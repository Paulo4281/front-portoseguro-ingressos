import { useMutationHook } from "../useMutation"
import { TicketHoldService } from "@/services/TicketHold/TicketHoldService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketHoldDeleteByUserId = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<void, TApiResponse<void>>({
        mutationFn: () => TicketHoldService.deleteByUserId()
    })

    return {
        mutateAsync,
        isPending
    }
}