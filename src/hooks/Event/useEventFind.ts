import { useQuery } from "@tanstack/react-query"
import { eventService } from "@/services/EventService/EventService"

export const useEventFind = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ["events"],
        queryFn: () => eventService.find()
    })

    return {
        data,
        isLoading,
        isError,
    }
}