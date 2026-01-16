import { useMutationHook } from "../useMutation"
import { SubscriptionService } from "@/services/Subscription/SubscriptionService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCreateCRMProSubscription } from "@/types/Subscription/TSubscription"

export const useSubscriptionCreateCRMPro = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TCreateCRMProSubscription, TApiResponse>({
        mutationFn: (data: TCreateCRMProSubscription) => SubscriptionService.createCRMProSubscription(data)
    })

    return {
        mutateAsync,
        isPending
    }
}

