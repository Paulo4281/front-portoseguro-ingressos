import { useMutationHook } from "../useMutation"
import { SubscriptionService } from "@/services/Subscription/SubscriptionService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useSubscriptionCancel = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<void, TApiResponse<{ message: string }>>({
        mutationFn: () => SubscriptionService.cancelCRMProSubscription()
    })

    return {
        mutateAsync,
        isPending
    }
}

