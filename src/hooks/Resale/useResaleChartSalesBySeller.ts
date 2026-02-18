import { useQueryHook } from "../useQuery"
import { UserService } from "@/services/User/UserService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TRevendaChartSalesBySeller } from "@/types/Resale/TResale"

export const useResaleChartSalesBySeller = () => {
    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TRevendaChartSalesBySeller[]>>({
        queryKey: ["resale-chart-sales-by-seller"],
        queryFn: () => UserService.getOrganizerResaleChartSalesBySeller()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}
