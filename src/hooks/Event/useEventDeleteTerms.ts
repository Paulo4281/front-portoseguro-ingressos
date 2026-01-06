import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventDeleteTerms = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (eventId: string) => EventService.deleteTerms(eventId)
    })

    return {
        mutateAsync,
        isPending
    }
}

