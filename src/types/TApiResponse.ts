type TApiResponse<T = undefined> = {
    success: boolean
    data?: T
    message?: string
}

export type {
    TApiResponse
}