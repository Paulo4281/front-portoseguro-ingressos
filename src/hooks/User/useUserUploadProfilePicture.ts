import { useMutationHook } from "../useMutation"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TUser } from "@/types/User/TUser"

type TUserUploadProfilePictureResponse = {
    user: TUser
}

export const useUserUploadProfilePicture = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<File, TApiResponse<TUserUploadProfilePictureResponse>>({
        mutationFn: (file: File) => UserService.uploadProfilePicture(file)
    })

    return {
        mutateAsync,
        isPending
    }
}

