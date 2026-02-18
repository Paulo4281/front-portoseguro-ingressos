import { useQueryHook } from "../useQuery"
import { CronLogService } from "@/services/CronLog/CronLogService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCronLogListResponse } from "@/types/CronLog/TCronLog"

export type TUseCronLogFindParams = {
    offset?: number
    name?: string
    enabled?: boolean
}

export const useCronLogFind = (params?: TUseCronLogFindParams) => {
    const { data, isLoading, isError, refetch } = useQueryHook<TApiResponse<TCronLogListResponse>>({
        queryKey: [
            "cron-log",
            "list",
            (params?.offset ?? 0).toString(),
            params?.name ?? ""
        ],
        queryFn: () => CronLogService.list({ offset: params?.offset ?? 0, name: params?.name }),
        enabled: params?.enabled ?? true
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

