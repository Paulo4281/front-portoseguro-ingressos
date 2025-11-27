import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TUserUpdate, TUser } from "@/types/User/TUser"
import type { TApiResponse } from "@/types/TApiResponse"

type TUserUpdateResponse = TUser

export const useUserUpdate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUserUpdate, TApiResponse<TUserUpdateResponse>>({
        mutationFn: (data: TUserUpdate) => UserService.update(data)
    })

    return {
        mutateAsync,
        isPending
    }
}

