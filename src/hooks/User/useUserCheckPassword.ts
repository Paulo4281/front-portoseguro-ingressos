import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserCheckPassword = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (password: string) => UserService.checkPassword(password)
    })

    return {
        mutateAsync,
        isPending
    }
}