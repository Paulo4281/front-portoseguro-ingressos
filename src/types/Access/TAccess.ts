export type TLoginMethod = "EMAIL_PASSWORD" | "GOOGLE"

export type TLoginLogUserPartial = {
    id: string
    email: string
    firstName: string
    lastName: string
}

export type TLoginLogListItem = {
    id: string
    userId: string | null
    ip: string
    userAgent: string | null
    method: TLoginMethod
    success: boolean
    error: string | null
    device: string | null
    browser: string | null
    os: string | null
    createdAt: string
    User: TLoginLogUserPartial | null
}

export type TLoginLogListResponse = {
    data: TLoginLogListItem[]
    total: number
    offset: number
    limit: number
}

