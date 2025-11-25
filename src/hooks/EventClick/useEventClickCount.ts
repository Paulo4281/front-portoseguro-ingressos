import { useQueryHook } from "../useQuery"
import { EventClickService } from "@/services/Event/EventClickService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventClickCount = (eventId?: string, enabled = true) => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<number>>({
        queryKey: ["event-click-count", eventId ?? "unknown"],
        queryFn: () => EventClickService.countByEventId(eventId as string),
        enabled: enabled && !!eventId
    })

    return {
        data,
        isLoading,
        isError
    }
}