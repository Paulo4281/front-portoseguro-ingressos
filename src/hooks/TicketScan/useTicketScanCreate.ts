import { useMutationHook } from "../useMutation"
import { TicketScanService } from "@/services/TicketScan/TicketScanService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketScanCreate, TTicketScanPublic } from "@/types/TicketScan/TTicketScan"

export const useTicketScanCreate = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TTicketScanCreate, TApiResponse<TTicketScanPublic>>({
        mutationFn: (data: TTicketScanCreate) => TicketScanService.create(data)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}
