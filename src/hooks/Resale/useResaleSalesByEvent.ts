import { useQueryHook } from "../useQuery"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TResaleSalesByEvent } from "@/types/Resale/TResale"

export const useResaleSalesByEvent = () => {
    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TResaleSalesByEvent[]>>({
        queryKey: ["resale-sales-by-event"],
        queryFn: () => UserService.getOrganizerResaleSalesByEvent()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
