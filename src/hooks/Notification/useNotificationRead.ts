import { TApiResponse } from "@/types/TApiResponse"
import { useMutationHook } from "../useMutation"
import { NotificationService } from "@/services/Notification/NotificationService"

export const useNotificationRead = () => {
    const {
        mutate,
        isPending,
        isError
    } = useMutationHook<void, TApiResponse>({
        mutationFn: () => NotificationService.read()
    })

    return {
        mutate,
        isPending,
        isError
    }
}