import { useQueries } from "@tanstack/react-query"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

export const useEventFindByIds = (ids: string[]) => {
    const queries = useQueries({
        queries: ids.map((id) => ({
            queryKey: ["event", id],
            queryFn: () => EventService.findById(id),
            enabled: !!id
        }))
    })

    const events = queries
        .map((query) => {
            if (query.data?.success && query.data?.data) {
                return query.data.data
            }
            return null
        })
        .filter((event): event is TEvent => event !== null)

    const isLoading = queries.some((query) => query.isLoading)
    const isError = queries.some((query) => query.isError)

    return {
        data: events,
        isLoading,
        isError
    }
}

