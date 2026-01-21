import { useQueryHook } from "../useQuery"
import { TagService } from "@/services/CRM/TagService"
import type { TTagResponse } from "@/types/Tag/TTag"
import type { TApiResponse } from "@/types/TApiResponse"

export const useTagFind = () => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TTagResponse[]>>({
        queryKey: ["tags"],
        queryFn: () => TagService.findAll()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

