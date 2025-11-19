import { API } from "@/api/api"
import type { AxiosResponse } from "axios"

class EventCategoryServiceClass {
    async find(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event-category",
            url: "/"
        }))?.data
        return response
    }
}

export const EventCategoryService = new EventCategoryServiceClass()