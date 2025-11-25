import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserCheckEmailExists = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (email: string) => UserService.checkEmailExists(email)
    })

    return {
        mutateAsync,
        isPending
    }
}