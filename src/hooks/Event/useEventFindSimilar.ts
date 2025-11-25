import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TEvent } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseEventFindSimilarParams = {
    categories: string
    excludeEventId?: string
    enabled?: boolean
}

export const useEventFindSimilar = (params?: TUseEventFindSimilarParams) => {
    const isEnabled = params?.enabled === true || (
        params !== undefined &&
        params?.enabled !== false &&
        typeof params?.categories === "string" &&
        params.categories.length > 0
    )

    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events-similar", params?.categories || "", params?.excludeEventId || ""],
        queryFn: () => {
            if (!params) throw new Error("Params are required")
            return EventService.findSimilar({
                categories: params.categories,
                excludeEventId: params.excludeEventId
            })
        },
        enabled: isEnabled
    })

    return {
        data,
        isLoading,
        isError,
    }
}

