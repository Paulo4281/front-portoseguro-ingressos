import { useQueryHook } from "../useQuery"
import { PayoutService } from "@/services/Payout/PayoutService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPayoutListResponse } from "@/types/Payout/TPayout"

export const usePayoutList = () => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TPayoutListResponse[]>>({
        queryKey: ["payout", "list"],
        queryFn: () => PayoutService.list()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

