import { TEvent } from "@/types/Event/TEvent"
import { useQueryHook } from "../useQuery"
import { eventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

type TUseEventFindPublicParams = {
    offset?: number
    name?: string
    categoryId?: string
}

export const useEventFindPublic = (params?: TUseEventFindPublicParams) => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events", "public", params?.offset?.toString() || "", params?.name || "", params?.categoryId || ""],
        queryFn: () => eventService.find({
            offset: params?.offset,
            name: params?.name,
            categoryId: params?.categoryId
        })
    })

    return {
        data,
        isLoading,
        isError,
    }
}

