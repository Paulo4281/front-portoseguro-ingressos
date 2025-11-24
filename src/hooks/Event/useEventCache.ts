import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

export const useEventCache = () => {
    const {
        data,
        isLoading,
        isFetching
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["event-cache"],
        queryFn: () => EventService.cache()
    })

    return {
        data,
        isLoading,
        isFetching
    }
}