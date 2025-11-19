import { API } from "@/api/api"
import type { AxiosResponse } from "axios"

class EventService {
    async find(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: "/"
        }))?.data
        return response
    }

    async findByUserId(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: "/user"
        }))?.data
        return response
    }

    async findById(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/event",
            url: `/${id}`
        }))?.data
        return response
    }
}

export const eventService = new EventService()