import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TBalanceResponse, TBalanceDatesAdminListResponse } from "@/types/Balance/TBalance"

class BalanceServiceClass {
    async current(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/balance",
            url: "/current"
        }))?.data
        return response
    }

    async listBalancesDatesByEvent(eventId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/balance",
            url: `/list-balances-dates-by-event/${eventId}`
        }))?.data
        return response
    }
}

export const BalanceService = new BalanceServiceClass()
