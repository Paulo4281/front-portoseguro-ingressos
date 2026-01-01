import { useQueryHook } from "../useQuery"
import { BalanceService } from "@/services/Balance/BalanceService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TBalanceDatesAdminListResponse } from "@/types/Balance/TBalance"

export const useBalanceListDatesByEvent = (eventId: string | null, enabled: boolean = true) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TBalanceDatesAdminListResponse[]>>({
        queryKey: ["balance", "dates-by-event", eventId || ""],
        queryFn: () => BalanceService.listBalancesDatesByEvent(eventId!),
        enabled: enabled && !!eventId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

