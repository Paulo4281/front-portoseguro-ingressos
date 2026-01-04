import { useQueryHook } from "../useQuery"
import { PayoutService } from "@/services/Payout/PayoutService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TPayoutAdminListResponse } from "@/types/Payout/TPayout"

type TUsePayoutListAdminParams = {
    offset?: number
}

type TPayoutAdminListResponseWithPagination = {
    data: TPayoutAdminListResponse[]
    total: number
    limit: number
    offset: number
}

export const usePayoutListAdmin = (params?: TUsePayoutListAdminParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TPayoutAdminListResponseWithPagination>>({
        queryKey: ["payout", "admin", "list", params?.offset?.toString() || "0"],
        queryFn: () => PayoutService.listToAdmin(params?.offset || 0),
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

