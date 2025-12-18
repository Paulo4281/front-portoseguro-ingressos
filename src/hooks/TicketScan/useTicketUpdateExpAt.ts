import { useMutationHook } from "../useMutation"
import { TicketScanService } from "@/services/TicketScan/TicketScanService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketScanPublic, TTicketScanUpdateExpAt } from "@/types/TicketScan/TTicketScan"

export const useTicketUpdateExpAt = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TTicketScanUpdateExpAt, TApiResponse<TTicketScanPublic>>({
        mutationFn: (data: TTicketScanUpdateExpAt) => TicketScanService.updateExpAt(data)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}
