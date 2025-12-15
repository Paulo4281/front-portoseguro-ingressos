import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventSoldInValueResponse } from "@/types/Event/TEvent"

export const useEventSoldInValue = (eventId: string) => {
    const {
        data,
        isLoading,
        isFetching
    } = useQueryHook<TApiResponse<TEventSoldInValueResponse>>({
        queryKey: ["event-sold-in-value", eventId],
        queryFn: () => EventService.soldInValue(eventId)
    })

    return {
        data,
        isLoading,
        isFetching
    }
}