import { useMutationHook } from "../useMutation"
import { userService } from "@/services/UserService/UserService"
import type { TUserConfirmByLinkResponse } from "@/types/User/TUser"

export const useUserConfirmByLink = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TUserConfirmByLinkResponse>({
        mutationFn: (link: string) => userService.confirmByLink(link)
    })

    return {
        mutateAsync,
        isPending
    }
}