import { useMutationHook } from "../useMutation"
import { TicketScanService } from "@/services/TicketScan/TicketScanService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTicketScanPublic, TTicketScanUpdatePassword } from "@/types/TicketScan/TTicketScan"

export const useTicketScanUpdatePassword = () => {
    const {
        mutateAsync,
        isPending,
        isError,
    } = useMutationHook<TTicketScanUpdatePassword, TApiResponse<TTicketScanPublic>>({
        mutationFn: (data: TTicketScanUpdatePassword) => TicketScanService.updatePassword(data)
    })

    return {
        mutateAsync,
        isPending,
        isError
    }
}
