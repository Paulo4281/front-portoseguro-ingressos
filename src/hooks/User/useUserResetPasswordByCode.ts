import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TUserResetPasswordByCode } from "@/types/User/TUser"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserResetPasswordByCode = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUserResetPasswordByCode, TApiResponse>({
        mutationFn: (data: TUserResetPasswordByCode) => UserService.resetPasswordByCode(data)
    })

    return {
        mutateAsync,
        isPending
    }
}