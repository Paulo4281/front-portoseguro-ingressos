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

    // ADMIN
    async listToAdmin(offset: number = 0): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payout",
            url: "/list/admin",
            params: {
                offset: offset.toString()
            }
        }))?.data
        return response
    }
}

export const PayoutService = new PayoutServiceClass()
