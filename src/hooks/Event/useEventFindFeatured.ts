import { useQueryHook } from "../useQuery"
import { eventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

export const useEventFindFeatured = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events", "featured"],
        queryFn: () => eventService.findFeatured()
    })

    return {
        data,
        isLoading,
        isError,
    }
}