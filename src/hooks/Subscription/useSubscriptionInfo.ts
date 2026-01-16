import { useQueryHook } from "../useQuery"
import { SubscriptionService } from "@/services/Subscription/SubscriptionService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSubscriptionInfoResponse } from "@/types/Subscription/TSubscription"

export const useSubscriptionInfo = () => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TSubscriptionInfoResponse[]>>({
        queryKey: ["subscription", "info"],
        queryFn: () => SubscriptionService.info()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

