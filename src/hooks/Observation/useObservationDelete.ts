import { useMutationHook } from "../useMutation"
import { ObservationService } from "@/services/CRM/ObservationService"
import type { TApiResponse } from "@/types/TApiResponse"
import { useQueryClient } from "@tanstack/react-query"

type TObservationDeleteParams = {
    id: string
    userId: string
}

export const useObservationDelete = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TObservationDeleteParams, TApiResponse>({
        mutationFn: ({ id }: TObservationDeleteParams) => ObservationService.delete(id),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["observations", variables.userId] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

