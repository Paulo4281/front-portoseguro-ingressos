type TOpinionPollResponse = {
    id: string
    customerName: string
    customerEmail: string
    rating: number
    comment?: string
    createdAt: string
}

type TOpinionPoll = {
    id: string
    eventId: string
    eventName: string
    eventDate: string
    link: string
    totalResponses: number
    averageRating: number
    responses: TOpinionPollResponse[]
    createdAt: string
}

type TOpinionPollListResponse = {
    data: TOpinionPoll[]
    total: number
}

export type {
    TOpinionPoll,
    TOpinionPollResponse,
    TOpinionPollListResponse
}
