import { useQueryHook } from "../useQuery"
import { ObservationService } from "@/services/CRM/ObservationService"
import type { TObservationResponse } from "@/types/Observation/TObservation"
import type { TApiResponse } from "@/types/TApiResponse"

export const useObservationFindByUserId = (userId: string | undefined) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TObservationResponse[]>>({
        queryKey: ["observations", userId || ""],
        queryFn: () => ObservationService.findByUserId(userId!),
        enabled: !!userId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

