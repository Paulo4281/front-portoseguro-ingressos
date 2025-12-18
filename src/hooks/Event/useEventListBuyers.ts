import { useQuery } from "@tanstack/react-query"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventListBuyers } from "@/types/Event/TEvent"

type TUseEventListBuyersParams = {
    eventId: string
    eventDateId?: string
    ticketTypeId?: string
    onlyConfirmed?: boolean
    enabled?: boolean
}

export const useEventListBuyers = (params: TUseEventListBuyersParams) => {
    const { eventId, eventDateId, ticketTypeId, onlyConfirmed = false, enabled = true } = params

    return useQuery<TApiResponse<TEventListBuyers[]>>({
        queryKey: ["event-list-buyers", eventId, eventDateId, ticketTypeId],
        queryFn: async () => {
            const response = await EventService.listBuyers(eventId, eventDateId, ticketTypeId, onlyConfirmed)
            return response
        },
        enabled: enabled && !!eventId
    })
}

