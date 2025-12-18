import { useMutationHook } from "../useMutation"
import { TicketScanSessionService } from "@/services/TicketScanSession/TicketScanSession"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketScanSessionDelete = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<void, TApiResponse<any>>({
        mutationFn: () => TicketScanSessionService.delete()
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}
