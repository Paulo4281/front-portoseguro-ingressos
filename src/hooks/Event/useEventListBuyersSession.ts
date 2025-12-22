import { useQuery } from "@tanstack/react-query"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventListBuyers } from "@/types/Event/TEvent"

type TUseEventListBuyersSessionParams = {
    eventDateId?: string
    enabled?: boolean
}

export const useEventListBuyersSession = (enabled: boolean = true, eventDateId?: string) => {
    return useQuery<TApiResponse<TEventListBuyers[]>>({
        queryKey: ["event-list-buyers-session", eventDateId],
        queryFn: async () => {
            const response = await EventService.listBuyersSession(eventDateId)
            return response
        },
        enabled
    })
}


