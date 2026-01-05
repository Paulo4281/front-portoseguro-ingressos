import { useMutationHook } from "../useMutation"
import { EventService } from "@/services/Event/EventService"
import type { TEventCreate } from "@/types/Event/TEvent"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TEvent } from "@/types/Event/TEvent"

type TEventCreateParams = {
    data: TEventCreate
    termsFile?: File
}

export const useEventCreate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TEventCreateParams, TApiResponse<TEvent>>({
        mutationFn: ({ data, termsFile }) => EventService.create(data, termsFile)
    })

    return {
        mutateAsync,
        isPending
    }
}