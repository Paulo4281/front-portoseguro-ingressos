import { API } from "@/api/api"
import type { AxiosResponse } from "axios"

class PayoutServiceClass {
    async withdraw(): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/payout",
            url: "/withdraw"
        }))?.data
        return response
    }

    async list(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payout",
            url: "/list"
        }))?.data
        return response
    }
}

export const PayoutService = new PayoutServiceClass()
