import { useMutationHook } from "../useMutation"
import { TicketScanService } from "@/services/TicketScan/TicketScanService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketScanDelete = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<{ id: string }, TApiResponse<any>>({
        mutationFn: ({ id }: { id: string }) => TicketScanService.delete(id)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}
