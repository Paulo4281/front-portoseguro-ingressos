import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEventUpdate } from "@/types/Event/TEvent"

export const useEventUpdate = (eventId: string, isAdmin?: boolean) => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TEventUpdate, TApiResponse>({
        mutationFn: (data: TEventUpdate) => EventService.update(eventId, data, isAdmin)
    })

    return {
        mutateAsync,
        isPending
    }
}