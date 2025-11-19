import { useQueryHook } from "../useQuery"
import { eventService } from "@/services/Event/EventService"
import type { TEvent } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventFindByUserId = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events", "user"],
        queryFn: () => eventService.findByUserId()
    })

    return {
        data,
        isLoading,
        isError,
    }
}