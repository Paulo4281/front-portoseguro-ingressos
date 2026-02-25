type TPartner = {
    id: string
    name: string
    description?: string | null
    logo?: string | null
    link?: string | null
    clickCount?: number
    createdAt?: string
    updatedAt?: string | null
}

type TPartnerUpdate = {
    id: string
    name?: string
    description?: string | null
    logo?: string | null
    link?: string | null
}

type TPartnerIncrementClickCount = {
    id: string
}

export type {
    TPartner,
    TPartnerUpdate,
    TPartnerIncrementClickCount
}
