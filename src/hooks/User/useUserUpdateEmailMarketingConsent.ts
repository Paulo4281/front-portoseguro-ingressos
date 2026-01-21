import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserUpdateEmailMarketingConsent = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<void, TApiResponse>({
        mutationFn: () => UserService.updateEmailMarketingConsentByUser()
    })

    return {
        mutateAsync,
        isPending
    }
}

