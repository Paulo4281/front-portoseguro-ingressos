import { useQueryHook } from "../useQuery"
import { OpinionPollCommentService } from "@/services/OpinionPoll/OpinionPollCommentService"
import type { TOpinionPollCommentResponse } from "@/types/OpinionPollComment/TOpinionPollComment"
import type { TApiResponse } from "@/types/TApiResponse"

export const useOpinionPollCommentFindByUserId = (opinionPollId: string | undefined) => {
    const {
        data,
        isLoading,
        isError,
        refetch
    } = useQueryHook<TApiResponse<TOpinionPollCommentResponse | null>>({
        queryKey: ["opinion-poll-comment", opinionPollId || ""],
        queryFn: () => OpinionPollCommentService.findByUserId(opinionPollId!),
        enabled: !!opinionPollId
    })

    return {
        data,
        isLoading,
        isError,
        refetch
    }
}

