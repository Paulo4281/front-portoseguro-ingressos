import { useQueryHook } from "../useQuery"
import { OpinionPollService } from "@/services/OpinionPoll/OpinionPollService"
import type { TOpinionPoll } from "@/types/OpinionPoll/TOpinionPoll"
import type { TApiResponse } from "@/types/TApiResponse"

export const useOpinionPollFindByEventId = (eventId: string | undefined) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TOpinionPoll>>({
        queryKey: ["opinion-poll", eventId || ""],
        queryFn: () => OpinionPollService.findByEventId(eventId!),
        enabled: !!eventId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

