import { useQueryHook } from "../useQuery"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSellerListItem } from "@/types/Resale/TResale"

export const useSellerList = () => {
    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TSellerListItem[]>>({
        queryKey: ["sellers"],
        queryFn: () => UserService.listSellers()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
