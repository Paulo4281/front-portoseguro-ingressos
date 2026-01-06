import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventUpdateTerms = (eventId: string) => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<File, TApiResponse>({
        mutationFn: (termsFile: File) => EventService.updateTerms(eventId, termsFile)
    })

    return {
        mutateAsync,
        isPending
    }
}

