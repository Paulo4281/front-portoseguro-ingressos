import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

export const useEventFindFeatured = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events", "featured"],
        queryFn: () => EventService.findFeatured()
    })

    return {
        data,
        isLoading,
        isError,
    }
}