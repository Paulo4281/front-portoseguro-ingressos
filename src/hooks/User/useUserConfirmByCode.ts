import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/UserService/UserService"
import type { TUserCreateConfirmRequest, TUserConfirmByCodeResponse } from "@/types/User/TUser"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserConfirmByCode = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUserCreateConfirmRequest, TApiResponse<TUserConfirmByCodeResponse>>({
        mutationFn: (params: TUserCreateConfirmRequest) => UserService.confirmByCode(params)
    })

    return {
        mutateAsync,
        isPending
    }
}

