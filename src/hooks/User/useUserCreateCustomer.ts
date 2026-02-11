import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TCreateCustomerPayload = {
    firstName: string
    lastName: string
    email: string
    phone: string
    document: string
}

export const useUserCreateCustomer = () => {
    const { mutateAsync, isPending } = useMutationHook<TCreateCustomerPayload, TApiResponse>({
        mutationFn: (data) => UserService.createCustomer(data)
    })

    return {
        mutateAsync,
        isPending
    }
}
