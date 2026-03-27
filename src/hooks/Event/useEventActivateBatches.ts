import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventActivateBatches = () => {
    const { mutateAsync, isPending } = useMutationHook<string, TApiResponse>({
        mutationFn: (eventId: string) => EventService.activateBatches(eventId)
    })

    return {
        mutateAsync,
        isPending
    }
}
