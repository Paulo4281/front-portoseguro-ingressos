import { TEvent } from "@/types/Event/TEvent"
import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"    
import type { TApiResponse } from "@/types/TApiResponse"

type TUseEventFindParams = {
    offset?: number
    name?: string
}

export const useEventFind = (params?: TUseEventFindParams) => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events", "user", params?.offset?.toString() || "", params?.name || ""],
        queryFn: () => EventService.findByUserId({
            offset: params?.offset,
            name: params?.name
        })
    })

    return {
        data,
        isLoading,
        isError,
    }
}