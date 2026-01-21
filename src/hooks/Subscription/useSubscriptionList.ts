import { useQueryHook } from "../useQuery"
import { SubscriptionService } from "@/services/Subscription/SubscriptionService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSubscriptionListResponse } from "@/types/Subscription/TSubscription"

type TUseSubscriptionListParams = {
    offset?: number
    status?: "ACTIVE" | "PENDING" | "OVERDUE" | "FAILED" | "CANCELLED"
}

export const useSubscriptionList = (params?: TUseSubscriptionListParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TSubscriptionListResponse>>({
        queryKey: ["subscription", "admin", "list", params?.offset?.toString() || "", params?.status || ""],
        queryFn: () => SubscriptionService.list(params)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

