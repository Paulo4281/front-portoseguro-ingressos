import { useQueryHook } from "../useQuery"
import { NotificationService } from "@/services/Notification/NotificationService"
import type { TNotification } from "@/types/Notification/TNotification"
import type { TApiResponse } from "@/types/TApiResponse"

export const useNotificationFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TNotification[]>>({
        queryKey: ["notification"],
        queryFn: () => NotificationService.find()
    })

    return {
        data,
        isLoading,
        isError
    }
}