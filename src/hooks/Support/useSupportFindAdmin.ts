import { useQueryHook } from "../useQuery"
import { SupportService } from "@/services/Support/SupportService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSupportFindResponse, TSupportFindAdminParams } from "@/types/Support/TSupport"

export const useSupportFindAdmin = (params?: TSupportFindAdminParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TSupportFindResponse>>({
        queryKey: ["support", "find", "admin", JSON.stringify(params)],
        queryFn: () => SupportService.findAdminSupports(params)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

