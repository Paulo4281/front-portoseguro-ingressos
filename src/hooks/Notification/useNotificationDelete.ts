import { useMutationHook } from "../useMutation"
import { NotificationService } from "@/services/Notification/NotificationService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useNotificationDelete = () => {
    const {
        mutate,
        mutateAsync,
        isPending,
        isError
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (notificationId: string) => NotificationService.deleteById(notificationId)
    })

    return {
        mutate,
        mutateAsync,
        isPending,
        isError
    }
}

