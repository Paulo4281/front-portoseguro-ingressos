import { useMutationHook } from "../useMutation"
import { eventService } from "@/services/Event/EventService"
import type { TEventCreate } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

export const useEventCreate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TEventCreate, TApiResponse<TEvent>>({
        mutationFn: (data: TEventCreate) => eventService.create(data)
    })

    return {
        mutateAsync,
        isPending
    }
}