import { TEvent } from "@/types/Event/TEvent"
import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventFindById = (id: string) => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent>>({
        queryKey: ["event", id],
        queryFn: () => EventService.findById(id)
    })

    return {
        data,
        isLoading,
        isError,
    }
}