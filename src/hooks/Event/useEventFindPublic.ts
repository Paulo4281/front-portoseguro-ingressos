import { TEvent } from "@/types/Event/TEvent"
import { useQueryHook } from "../useQuery"
import { eventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventFindPublic = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events", "public"],
        queryFn: () => eventService.find()
    })

    return {
        data,
        isLoading,
        isError,
    }
}

