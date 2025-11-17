import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TUserCreate } from "@/types/User/TUser"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserCreate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUserCreate, TApiResponse>({
        mutationFn: (data: TUserCreate) => UserService.create(data)
    })

    return {
        mutateAsync,
        isPending
    }
}