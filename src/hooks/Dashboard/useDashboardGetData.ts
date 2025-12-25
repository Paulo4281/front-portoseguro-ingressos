import { useQueryHook } from "../useQuery"
import { DashboardService } from "@/services/Dashboard/DashboardService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TDashboardOverview } from "@/types/Dashboard/TDashboard"

const useDashboardGetData = (dateStart?: string, dateEnd?: string, enabled: boolean = true) => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook<TApiResponse<TDashboardOverview>>({
        queryKey: ["dashboard-overview", dateStart || "", dateEnd || ""],
        queryFn: () => DashboardService.overview(dateStart, dateEnd),
        enabled
    })

    return {
        data,
        isLoading,
        isError
    }
}

export default useDashboardGetData