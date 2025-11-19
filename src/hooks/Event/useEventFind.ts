import { TEvent } from "@/types/Event/TEvent"
import { useQueryHook } from "../useQuery"
import { eventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventFind = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events"],
        queryFn: () => eventService.find()
    })

    return {
        data,
        isLoading,
        isError,
    }
}