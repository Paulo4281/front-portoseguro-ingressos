import { useMutationHook } from "../useMutation"
import { SubscriptionService } from "@/services/Subscription/SubscriptionService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TUpdateSubscriptionCreditCard } from "@/types/Subscription/TSubscription"

export const useSubscriptionUpdateCreditCard = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUpdateSubscriptionCreditCard, TApiResponse<{ message: string }>>({
        mutationFn: (data: TUpdateSubscriptionCreditCard) => SubscriptionService.updateCreditCard(data)
    })

    return {
        mutateAsync,
        isPending
    }
}

