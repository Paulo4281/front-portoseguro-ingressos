import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/UserService/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserResendConfirmation = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (email: string) => UserService.resendConfirmation(email)
    })

    return {
        mutateAsync,
        isPending
    }
}

