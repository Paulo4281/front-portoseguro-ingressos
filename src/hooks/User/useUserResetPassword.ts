import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TUserResetPassword } from "@/types/User/TUser"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserResetPassword = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUserResetPassword, TApiResponse>({
        mutationFn: (data: TUserResetPassword) => UserService.resetPassword(data)
    })

    return {
        mutateAsync,
        isPending
    }
}