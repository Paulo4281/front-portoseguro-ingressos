import { useMutationHook } from "../useMutation"
import { TicketScanSessionService } from "@/services/TicketScanSession/TicketScanSession"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTicketScanSessionDeleteByOrganizer = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<{ id: string }, TApiResponse<any>>({
        mutationFn: ({ id }: { id: string }) => TicketScanSessionService.deleteByOrganizer(id)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}
