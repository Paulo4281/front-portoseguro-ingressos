import { useQuery } from "@tanstack/react-query"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventListBuyers } from "@/types/Event/TEvent"

export const useEventListBuyersSession = (enabled: boolean = true) => {
    return useQuery<TApiResponse<TEventListBuyers[]>>({
        queryKey: ["event-list-buyers-session"],
        queryFn: async () => {
            const response = await EventService.listBuyersSession()
            return response
        },
        enabled
    })
}


