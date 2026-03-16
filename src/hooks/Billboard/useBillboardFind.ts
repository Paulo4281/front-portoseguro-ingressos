import { useQueryHook } from "../useQuery"
import { BillboardService } from "@/services/Billboard/BillboardService"
import type { TBillboardListItem } from "@/types/Billboard/TBillboard"
import type { TApiResponse } from "@/types/TApiResponse"

export const useBillboardFind = () => {
    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TBillboardListItem[]>>({
        queryKey: ["billboard-admin"],
        queryFn: () => BillboardService.find()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
