import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

export const useEventFindByIdUser = (id: string) => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TEvent>>({
        queryKey: ["event-user", id],
        queryFn: () => EventService.findByIdUser(id)
    })

    return {
        data,
        isLoading,
        isError
    }
}