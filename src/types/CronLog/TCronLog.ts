export type TCronLogListItem = {
    id: string
    name: string
    startedAt: string
    finishedAt: string
    status: string
    errorMessage: string | null
    durationMs: number
    createdAt: string
}

export type TCronLogListResponse = {
    data: TCronLogListItem[]
    total: number
    limit: number
    offset: number
}

