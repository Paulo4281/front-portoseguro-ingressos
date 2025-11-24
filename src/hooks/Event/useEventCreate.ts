import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TEventCreate } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

export const useEventCreate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TEventCreate, TApiResponse<TEvent>>({
        mutationFn: (data: TEventCreate) => EventService.create(data)
    })

    return {
        mutateAsync,
        isPending
    }
}