import { useQueryHook } from "../useQuery"
import { ResaleService } from "@/services/Resale/ResaleService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TResale, TResaleFindData } from "@/types/Resale/TResale"

export const useResaleFind = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TResale[] | TResaleFindData>>({
        queryKey: ["resales"],
        queryFn: () => ResaleService.find()
    })

    return {
        data,
        isLoading,
        isError
    }
}
