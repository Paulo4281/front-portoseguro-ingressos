import { useMutationHook } from "../useMutation"
import { TicketHoldService } from "@/services/TicketHold/TicketHoldService"
import type { TTicketHoldCreate, TTicketHoldCreateResponse } from "@/types/TicketHold/TTicketHold"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketHoldCreate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TTicketHoldCreate[], TApiResponse<TTicketHoldCreateResponse[]>>({
        mutationFn: (data: TTicketHoldCreate[]) => TicketHoldService.create(data)
    })

    return {
        mutateAsync,
        isPending
    }
}