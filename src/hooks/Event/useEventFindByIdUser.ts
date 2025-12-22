import { useQueryHook } from "../useQuery"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

type TUseEventFindByIdUserParams = {
    id: string
    enabled?: boolean
}

export const useEventFindByIdUser = (id: string, options?: { enabled?: boolean }) => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TEvent>>({
        queryKey: ["event-user", id],
        queryFn: () => EventService.findByIdUser(id),
        enabled: options?.enabled !== false && !!id
    })

    return {
        data,
        isLoading,
        isError
    }
}