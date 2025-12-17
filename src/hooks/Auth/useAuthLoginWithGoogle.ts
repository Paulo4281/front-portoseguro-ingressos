import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TAuthResponse } from "@/types/Auth/TAuth"

export const useAuthLoginWithGoogle = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse<TAuthResponse>>({
        mutationFn: (googleAuthToken: string) => UserService.loginWithGoogle(googleAuthToken)
    })

    return {
        mutateAsync,
        isPending
    }
}

