import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventUpdateIsTaxed = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<string, TApiResponse>({
        mutationFn: (eventId: string) => EventService.updateIsTaxed(eventId)
    })

    return {
        mutateAsync,
        isPending
    }
}
