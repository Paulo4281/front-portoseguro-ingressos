import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TUserConfirmSocial } from "@/types/User/TUser"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TAuthResponse } from "@/types/Auth/TAuth"

export const useUserConfirmSocial = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUserConfirmSocial, TApiResponse<TAuthResponse>>({
        mutationFn: (data: TUserConfirmSocial) => UserService.confirmSocial(data)
    })

    return {
        mutateAsync,
        isPending
    }
}

