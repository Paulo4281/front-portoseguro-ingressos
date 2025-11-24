import { useQueryHook } from "../useQuery"
import { NotificationService } from "@/services/Notification/NotificationService"

export const useNotificationFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook({
        queryKey: ["notification"],
        queryFn: () => NotificationService.find()
    })

    return {
        data,
        isLoading,
        isError
    }
}