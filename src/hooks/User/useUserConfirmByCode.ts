import { useMutationHook } from "../useMutation"
import { userService } from "@/services/UserService/UserService"
import type { TUserConfirmByCodeResponse } from "@/types/User/TUser"

export const useUserConfirmByCode = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TUserConfirmByCodeResponse>({
        mutationFn: (code: string) => userService.confirmByCode(code)
    })

    return {
        mutateAsync,
        isPending
    }
}

