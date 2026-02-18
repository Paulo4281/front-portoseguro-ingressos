import { API } from "@/api/api"
import type { AxiosResponse } from "axios"

class SellerBalanceServiceClass {
    async current(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/resale/seller-balance",
            url: "/current"
        }))?.data
        return response
    }
}

export const SellerBalanceService = new SellerBalanceServiceClass()
