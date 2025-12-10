import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventVerifyLastTicketsResponse } from "@/types/Event/TEvent"

export const useEventVerifyLastTicket = (eventId: string | null, enabled: boolean = true) => {
    const {
        data,
        isLoading,
        isFetching
    } = useQueryHook<TApiResponse<TEventVerifyLastTicketsResponse[]>>({
        queryKey: ["event-verify-last-ticket", eventId ?? ""],
        queryFn: () => EventService.verifyLastTickets(eventId!),
        enabled: enabled && !!eventId
    })

    return {
        data,
        isLoading,
        isFetching
    }
}