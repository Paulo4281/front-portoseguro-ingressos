import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventVerifySoldResponse } from "@/types/Event/TEvent"

export const useEventVerifySold = (eventId: string) => {
    const {
        data,
        isLoading,
        isFetching
    } = useQueryHook<TApiResponse<TEventVerifySoldResponse[]>>({
        queryKey: ["event-verify-sold", eventId],
        queryFn: () => EventService.verifySold(eventId)
    })

    return {
        data,
        isLoading,
        isFetching
    }
}