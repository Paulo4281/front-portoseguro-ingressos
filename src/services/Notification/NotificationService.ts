import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
class NotificationServiceClass {
    async find(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/notification",
            url: "/"
        }))?.data
        return response
    }

    async read(): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/notification",
            url: "/read"
        }))?.data
        return response
    }

    async deleteAll(): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/notification",
            url: "/"
        }))?.data
        return response
    }

    async deleteById(id: string): Promise<AxiosResponse["data"]> {
        const response = (await API.DELETE({
            prefix: "/notification",
            url: `/${id}`
        }))?.data
        return response
    }
}

export const NotificationService = new NotificationServiceClass()