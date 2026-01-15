import type { TOpinionPollCommentResponse } from "@/types/OpinionPollComment/TOpinionPollComment"

type TOpinionPollResponse = {
    id: string
    code: string
    eventId: string
    userId: string
    createdAt: string
    commentsCount: number
    averageStars: number
    comments: TOpinionPollCommentResponse[]
    event: {
        id: string
        name: string
        location: string | null
    }
}

type TOpinionPollByCodeResponse = {
    id: string
    code: string
    eventId: string
    event: {
        id: string
        name: string
        image: string
        location: string | null
        dates: Array<{
            id: string
            date: string | null
            hourStart: string | null
            hourEnd: string | null
        }>
    }
}

type TOpinionPoll = TOpinionPollResponse

export type {
    TOpinionPoll,
    TOpinionPollResponse,
    TOpinionPollByCodeResponse
}
