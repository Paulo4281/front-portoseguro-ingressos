import { useMutationHook } from "../useMutation"
import { AIService, type TAICreateEventDescriptionParams, type TAICreateEventDescriptionResponse } from "@/services/AI/AIService"
import type { TApiResponse } from "@/types/TApiResponse"

export const useAICreateEventDescription = () => {
    const {
        mutateAsync,
        isPending
    } = useMutationHook<TAICreateEventDescriptionParams, TApiResponse<TAICreateEventDescriptionResponse>>({
        mutationFn: (params) => AIService.createEventDescription(params)
    })

    return {
        mutateAsync,
        isPending
    }
}
