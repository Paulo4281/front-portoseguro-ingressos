import { useQueryHook } from "../useQuery"
import { SellerBalanceService } from "@/services/Resale/SellerBalanceService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSellerBalanceResponse } from "@/types/Balance/TBalance"

export const useSellerBalanceCurrent = () => {
    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TSellerBalanceResponse>>({
        queryKey: ["resale", "seller-balance", "current"],
        queryFn: () => SellerBalanceService.current()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
