import { useQueryHook } from "../useQuery"
import { OpinionPollService } from "@/services/OpinionPoll/OpinionPollService"
import type { TOpinionPoll } from "@/types/OpinionPoll/TOpinionPoll"
import type { TApiResponse } from "@/types/TApiResponse"

export const useOpinionPollFind = () => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TOpinionPoll[]>>({
        queryKey: ["opinion-polls"],
        queryFn: () => OpinionPollService.findAll()
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

