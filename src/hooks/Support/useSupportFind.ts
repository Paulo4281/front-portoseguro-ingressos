import { useQueryHook } from "../useQuery"
import { SupportService } from "@/services/Support/SupportService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSupportFindResponse, TSupportFindOrganizerParams } from "@/types/Support/TSupport"

export const useSupportFind = (params?: TSupportFindOrganizerParams) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TSupportFindResponse>>({
        queryKey: ["support", "find", "organizer", JSON.stringify(params)],
        queryFn: () => SupportService.findOrganizerSupports(params)
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

