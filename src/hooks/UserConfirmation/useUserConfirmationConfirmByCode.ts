import { useMutationHook } from "../useMutation"
import { UserConfirmationService } from "@/services/User/UserConfirmationService"
import type { TUserCreateConfirmRequest, TUserConfirmByCodeResponse } from "@/types/User/TUserConfirmation"
import type { TApiResponse } from "@/types/TApiResponse"

export const useUserConfirmByCode = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TUserCreateConfirmRequest, TApiResponse<TUserConfirmByCodeResponse>>({
        mutationFn: (params: TUserCreateConfirmRequest) => UserConfirmationService.confirmByCode(params)
    })

    return {
        mutateAsync,
        isPending
    }
}

