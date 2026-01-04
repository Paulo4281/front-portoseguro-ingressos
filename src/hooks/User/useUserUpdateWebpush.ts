import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TUpdateWebpush = {
    endpoint: string
    p256dh: string
    auth: string
}

export const useUserUpdateWebpush = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUpdateWebpush, TApiResponse>({
        mutationFn: (data: TUpdateWebpush) => UserService.updateWebpush(data)
    })

    return {
        mutateAsync,
        isPending
    }
}

