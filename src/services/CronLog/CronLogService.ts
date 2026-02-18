import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCronLogListResponse } from "@/types/CronLog/TCronLog"
import type { AxiosResponse } from "axios"

type TCronLogListParams = {
    offset?: number
    name?: string
}

class CronLogServiceClass {
    async list(params?: TCronLogListParams): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/cron-log",
            url: "",
            params: {
                offset: params?.offset ?? 0,
                ...(params?.name ? { name: params.name } : {})
            }
        }))?.data

        return response as TApiResponse<TCronLogListResponse>
    }
}

export const CronLogService = new CronLogServiceClass()

