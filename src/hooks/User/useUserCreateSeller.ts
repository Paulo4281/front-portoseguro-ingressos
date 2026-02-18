import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TCreateSellerPayload = {
    firstName: string
    lastName: string
    email: string
    phone: string
    document: string
    password: string
    invitationCode: string
}

export const useUserCreateSeller = () => {
    const { mutateAsync, isPending } = useMutationHook<TCreateSellerPayload, TApiResponse>({
        mutationFn: (data: TCreateSellerPayload) => UserService.createSeller(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
