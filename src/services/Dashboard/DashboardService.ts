import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TDashboardOverview, TDashboardPayouts } from "@/types/Dashboard/TDashboard"
import type { TApiResponse } from "@/types/TApiResponse"

class DashboardServiceClass {
    async overview(dateStart?: string, dateEnd?: string): Promise<AxiosResponse["data"]> {
        const params: Record<string, string> = {}
        if (dateStart) {
            params.dateStart = dateStart
        }
        if (dateEnd) {
            params.dateEnd = dateEnd
        }
        const response = (await API.GET({
            prefix: "/dashboard",
            url: "/overview",
            params: Object.keys(params).length > 0 ? params : undefined
        }))?.data
        return response
    }

    async payouts(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/dashboard",
            url: "/payouts"
        }))?.data
        return response
    }
}

export const DashboardService = new DashboardServiceClass()