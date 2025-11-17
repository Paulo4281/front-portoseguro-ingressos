import { useMutationHook } from "../useMutation"
import { AuthService } from "@/services/Auth/AuthService"
import type { TAuth, TAuthResponse } from "@/types/Auth/TAuth"
import type { TApiResponse } from "@/types/TApiResponse"

export const useAuthLogin = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TAuth, TApiResponse<TAuthResponse>>({
        mutationFn: (data: TAuth) => AuthService.auth(data)
    })

    return {
        mutateAsync,
        isPending
    }
}