import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserCheckPasswordAdmin = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (password: string) => UserService.checkPasswordAdmin(password)
    })

    return {
        mutateAsync,
        isPending
    }
}