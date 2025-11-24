import { useMutationHook } from "../useMutation"
import { NotificationService } from "@/services/Notification/NotificationService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useNotificationDeleteAll = () => {
    const {
        mutate,
        mutateAsync,
        isPending,
        isError
    } = useMutationHook<void, TApiResponse>({
        mutationFn: () => NotificationService.deleteAll()
    })

    return {
        mutate,
        mutateAsync,
        isPending,
        isError
    }
}

