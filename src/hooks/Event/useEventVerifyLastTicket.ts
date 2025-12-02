import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventVerifyLastTicketsResponse } from "@/types/Event/TEvent"

export const useEventVerifyLastTicket = (eventId: string) => {
    const {
        data,
        isLoading,
        isFetching
    } = useQueryHook<TApiResponse<TEventVerifyLastTicketsResponse[]>>({
        queryKey: ["event-verify-last-ticket", eventId],
        queryFn: () => EventService.verifyLastTickets(eventId)
    })

    return {
        data,
        isLoading,
        isFetching
    }
}