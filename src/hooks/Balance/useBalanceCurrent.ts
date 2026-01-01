import { useQueryHook } from "../useQuery"
import { BalanceService } from "@/services/Balance/BalanceService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TBalanceResponse } from "@/types/Balance/TBalance"

export const useBalanceCurrent = () => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TBalanceResponse>>({
        queryKey: ["balance", "current"],
        queryFn: () => BalanceService.current()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

