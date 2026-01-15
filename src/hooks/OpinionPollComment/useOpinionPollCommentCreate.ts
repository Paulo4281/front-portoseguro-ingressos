import { useMutationHook } from "../useMutation"
import { OpinionPollCommentService } from "@/services/OpinionPoll/OpinionPollCommentService"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TOpinionPollCommentCreate, TOpinionPollCommentResponse } from "@/types/OpinionPollComment/TOpinionPollComment"
import { useQueryClient } from "@tanstack/react-query"

export const useOpinionPollCommentCreate = () => {
    const queryClient = useQueryClient()

    const {
        mutateAsync,
        isPending
    } = useMutationHook<TOpinionPollCommentCreate, TApiResponse<TOpinionPollCommentResponse>>({
        mutationFn: (data: TOpinionPollCommentCreate) => OpinionPollCommentService.create(data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ["opinion-poll-comment", variables.opinionPollId] })
        }
    })

    return {
        mutateAsync,
        isPending
    }
}

