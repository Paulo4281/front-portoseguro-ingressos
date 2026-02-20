export type TLead = {
    id: string
    name: string
    phone: string
    email: string | null
    ipAddress: string | null
    userAgent: string | null
    browser: string | null
    os: string | null
    device: string | null
    origin: string | null
    referrer: string | null
    metadata: any | null
    createdAt: string
    updatedAt: string | null
}

export type TLeadCreateRequest = {
    name: string
    phone: string
    email?: string | null
}

export type TLeadFindParams = {
    offset?: number
}

export type TPaginatedResponse<T> = {
    data: T[]
    total: number
    offset: number
    limit: number
}

