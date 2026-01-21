import { useQueryHook } from "../useQuery"
import { OpinionPollService } from "@/services/OpinionPoll/OpinionPollService"
import type { TOpinionPollByCodeResponse } from "@/types/OpinionPoll/TOpinionPoll"
import type { TApiResponse } from "@/types/TApiResponse"

export const useOpinionPollFindByCode = (code: string | undefined) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TOpinionPollByCodeResponse | null>>({
        queryKey: ["opinion-poll", code || ""],
        queryFn: () => OpinionPollService.findByCode(code!),
        enabled: !!code
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

