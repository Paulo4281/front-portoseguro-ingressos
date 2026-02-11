import { useQueryHook } from "../useQuery"
import { ResaleService } from "@/services/Resale/ResaleService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TResaleFindData, TSellerInvitation } from "@/types/Resale/TResale"

export const useResaleFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TResaleFindData | TSellerInvitation[]>>({
        queryKey: ["seller-invites"],
        queryFn: () => ResaleService.find()
    })

    return {
        data,
        isLoading,
        isError
    }
}
