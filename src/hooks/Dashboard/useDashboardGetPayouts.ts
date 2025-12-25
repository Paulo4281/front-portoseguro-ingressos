import { useQueryHook } from "../useQuery"
import { DashboardService } from "@/services/Dashboard/DashboardService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TDashboardPayouts } from "@/types/Dashboard/TDashboard"

const useDashboardGetPayouts = () => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TDashboardPayouts>>({
        queryKey: ["dashboard-payouts"],
        queryFn: () => DashboardService.payouts(),
    })

    return {
        data,
        isLoading,
        isError
    }
}

export default useDashboardGetPayouts

