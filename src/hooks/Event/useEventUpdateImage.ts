import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventUpdateImage = (eventId: string) => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<File, TApiResponse>({
        mutationFn: (file: File) => EventService.updateImage(eventId, file)
    })

    return {
        mutateAsync,
        isPending
    }
}

export default useEventUpdateImage
