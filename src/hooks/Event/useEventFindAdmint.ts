import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

export const useEventFindAdmin = (params?: { offset?: number; name?: string }) => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TEvent[]>>({
        queryKey: ["events", "admin", params?.offset?.toString() || "", params?.name || ""],
        queryFn: () => EventService.findAdmin(params)
    })

    return {
        data,
        isLoading,
        isError
    }
}