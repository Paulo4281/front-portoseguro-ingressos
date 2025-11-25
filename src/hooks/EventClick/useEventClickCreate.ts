import { useMutationHook } from "../useMutation"
import { EventClickService } from "@/services/Event/EventClickService"
import type { TEventClickCreate } from "@/types/Event/TEventClick"
import type { TApiResponse } from "@/types/TApiResponse"

export const useEventClickCreate = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TEventClickCreate, TApiResponse>({
        mutationFn: (data: TEventClickCreate) => EventClickService.create(data)
    })

    return {
        mutateAsync,
        isPending
    }
}