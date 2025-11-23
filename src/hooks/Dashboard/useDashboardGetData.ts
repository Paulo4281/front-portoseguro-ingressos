import { useQueryHook } from "../useQuery"
import { DashboardService } from "@/services/Dashboard/DashboardService"

const useDashboardGetData = (period: "day" | "week" | "month" | "year" = "month") => {
    const {
        data,
        isLoading,
        isError
    } = useQueryHook({
        queryKey: ["dashboard-data", period],
        queryFn: () => DashboardService.getDashboardData(period),
    })

    return {
        data,
        isLoading,
        isError
    }
}

export default useDashboardGetData