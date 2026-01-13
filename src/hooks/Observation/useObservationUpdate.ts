import { useMutationHook } from "../useMutation"
import { ObservationService } from "@/services/CRM/ObservationService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TObservationUpdate } from "@/types/Observation/TObservation"
import { useQueryClient } from "@tanstack/react-query"

type TObservationUpdateParams = {
    id: string
    data: TObservationUpdate
    userId: string
}

export const useObservationUpdate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TObservationUpdateParams, TApiResponse>({
        mutationFn: ({ id, data }: TObservationUpdateParams) => ObservationService.update(id, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["observations", variables.userId] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

