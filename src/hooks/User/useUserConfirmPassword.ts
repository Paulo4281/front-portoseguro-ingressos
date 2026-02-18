import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"

type TConfirmPasswordResponse = {
    availableForPasswordDef: boolean
}

export const useUserConfirmPassword = () => {
    const { mutateAsync, isPending } = useMutationHook<
        { code: string; password: string },
        TApiResponse<TConfirmPasswordResponse>
    >({
        mutationFn: ({ code, password }) => UserService.confirmPassword(code, password)
    })

    return {
        mutateAsync,
        isPending
    }
}
