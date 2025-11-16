import { TEvent } from "@/types/Event/TEvent"
import { useQueryHook } from "../useQuery"
import { eventService } from "@/services/EventService/EventService"

export const useEventFind = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TEvent[]>({
        queryKey: ["events"],
        queryFn: () => eventService.find()
    })

    return {
        data,
        isLoading,
        isError,
    }
}