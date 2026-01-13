import { useMutationHook } from "../useMutation"
import { ObservationService } from "@/services/CRM/ObservationService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TObservationCreate, TObservationResponse } from "@/types/Observation/TObservation"
import { useQueryClient } from "@tanstack/react-query"

export const useObservationCreate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TObservationCreate, TApiResponse<TObservationResponse>>({
        mutationFn: (data: TObservationCreate) => ObservationService.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["observations", variables.userId] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

