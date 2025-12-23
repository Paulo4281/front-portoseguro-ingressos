import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventVerifySoldResponse } from "@/types/Event/TEvent"

export const useEventVerifySold = (eventId: string, allDates?: boolean) => {
    const {
        data,
        isLoading,
        isFetching
    } = useQueryHook<TApiResponse<TEventVerifySoldResponse[]>>({
        queryKey: ["event-verify-sold", eventId, allDates ? "allDates" : ""],
        queryFn: () => EventService.verifySold(eventId, allDates)
    })

    return {
        data,
        isLoading,
        isFetching
    }
}