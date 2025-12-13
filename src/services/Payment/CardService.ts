import { API } from "@/api/api"
import { AxiosResponse } from "axios"

class CardServiceClass {
    async findByUserId(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/card",
            url: ""
        }))?.data
        return response
    }
}

export const CardService = new CardServiceClass()