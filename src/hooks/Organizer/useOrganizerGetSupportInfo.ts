import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TGetSupportInfoResponse = {
    email: string | null
    phone: string | null
}

export const useOrganizerGetSupportInfo = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse<TGetSupportInfoResponse>>({
        mutationFn: (organizerId) => UserService.getOrganizerSupportInfo(organizerId)
    })

    return {
        mutateAsync,
        isPending
    }
}

