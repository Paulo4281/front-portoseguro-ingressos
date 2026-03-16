import { useQueryHook } from "../useQuery"
import { BillboardService } from "@/services/Billboard/BillboardService"
import type { TBillboard } from "@/types/Billboard/TBillboard"
import type { TApiResponse } from "@/types/TApiResponse"

export const useBillboardClient = () => {
    const { data, isLoading, isError } = useQueryHook<TApiResponse<TBillboard[]>>({
        queryKey: ["billboard-client"],
        queryFn: () => BillboardService.getClient()
    })

    return {
        data,
        isLoading,
        isError
    }
}
