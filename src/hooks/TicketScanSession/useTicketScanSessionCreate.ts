import { useMutationHook } from "../useMutation"
import { TicketScanSessionService } from "@/services/TicketScanSession/TicketScanSession"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketScanSessionAuthenticate } from "@/types/TicketScanSession/TTicketScanSession"

export const useTicketScanSessionCreate = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TTicketScanSessionAuthenticate, TApiResponse<null>>({
        mutationFn: (data: TTicketScanSessionAuthenticate) => TicketScanSessionService.authenticate(data)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}
