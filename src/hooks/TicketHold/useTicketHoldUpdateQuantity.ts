import { useMutationHook } from "../useMutation"
import { TicketHoldService } from "@/services/TicketHold/TicketHoldService"
import type { TTicketHoldUpdate } from "@/types/TicketHold/TTicketHold"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketHoldUpdateQuantity = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TTicketHoldUpdate, TApiResponse>({
        mutationFn: (data: TTicketHoldUpdate) => TicketHoldService.updateQuantity(data)
    })

    return {
        mutateAsync,
        isPending
    }
}