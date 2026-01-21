type TOpinionPollCommentCreate = {
    opinionPollId: string
    stars: number
    comment?: string | null
}

type TOpinionPollCommentResponse = {
    id: string
    stars: number
    comment: string | null
    opinionPollId: string
    userId: string
    createdAt: string
    User: {
        id: string
        firstName: string
        lastName: string
        email: string
        image: string | null
    }
}

export type {
    TOpinionPollCommentCreate,
    TOpinionPollCommentResponse
}

