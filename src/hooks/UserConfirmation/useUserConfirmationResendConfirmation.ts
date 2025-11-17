import { useMutationHook } from "../useMutation"
import { UserConfirmationService } from "@/services/User/UserConfirmationService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserResendConfirmation = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (email: string) => UserConfirmationService.resendConfirmation(email)
    })

    return {
        mutateAsync,
        isPending
    }
}

