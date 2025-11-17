import { useMutationHook } from "../useMutation"
import { AuthService } from "@/services/Auth/AuthService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useAuthLogout = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<void, TApiResponse>({
        mutationFn: async () => AuthService.logout()
    })

    return {
        mutateAsync,
        isPending
    }
}