import { useMutationHook } from "../useMutation"
import { UserConfirmationService } from "@/services/User/UserConfirmationService"
import type { TUserForgotPassword } from "@/types/User/TUserConfirmation"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserConfirmationForgotPassword = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUserForgotPassword, TApiResponse>({
        mutationFn: (data: TUserForgotPassword) => UserConfirmationService.forgotPassword(data)
    })

    return {
        mutateAsync,
        isPending
    }
}