import { TEvent } from "@/types/Event/TEvent"
import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventFindBySlug = (slug: string) => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TEvent>>({
        queryKey: ["event", slug],
        queryFn: () => EventService.findBySlug(slug)
    })

    return {
        data,
        isLoading,
        isError,
    }
}