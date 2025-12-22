import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import { TEventSearchResponse } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseEventSearchParams = {
    query: string
    enabled?: boolean
}

export const useEventSearch = ({ query, enabled = true }: TUseEventSearchParams) => {
    const {
        data,
        isLoading,
        error
    } = useQueryHook<TApiResponse<TEventSearchResponse[]>>({
        queryKey: ["event-search", query],
        queryFn: () => EventService.search(query),
        enabled: enabled && query.length > 0
    })

    return {
        data,
        isLoading,
        error
    }
}