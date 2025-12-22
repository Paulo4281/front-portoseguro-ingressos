import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventCacheResponse } from "@/types/Event/TEvent"

export const useEventCacheSession = (enabled: boolean = true) => {
    const {
        data,
        isLoading,
        isFetching
    } = useQueryHook<TApiResponse<TEventCacheResponse>>({
        queryKey: ["event-cache-session"],
        queryFn: () => EventService.cacheSession(),
        enabled
    })

    return {
        data,
        isLoading,
        isFetching
    }
}