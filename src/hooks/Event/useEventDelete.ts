import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventDelete = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (eventId: string) => EventService.delete(eventId)
    })

    return {
        mutateAsync,
        isPending
    }
}