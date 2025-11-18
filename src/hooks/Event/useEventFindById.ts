import { TEvent } from "@/types/Event/TEvent"
import { useQueryHook } from "../useQuery"
import { eventService } from "@/services/Event/EventService"

export const useEventFindById = (id: string) => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TEvent>({
        queryKey: ["event", id],
        queryFn: () => eventService.findById(id)
    })

    return {
        data,
        isLoading,
        isError,
    }
}