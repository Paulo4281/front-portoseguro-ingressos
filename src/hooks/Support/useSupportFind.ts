import { useQueryHook } from "../useQuery"
import { SupportService } from "@/services/Support/SupportService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TSupportFindResponse } from "@/types/Support/TSupport"

export const useSupportFind = () => {
    const {
        data,
        isLoading,
        isError,
    } = useQueryHook<TApiResponse<TSupportFindResponse>>({
        queryKey: ["support", "find"],
        queryFn: () => SupportService.find()
    })

    return {
        data,
        isLoading,
        isError,
    }
}

