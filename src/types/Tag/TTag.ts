export type TTag = {
    id: string
    name: string
    color: string
    userId: string
    createdAt: string
    updatedAt: string | null
}

export type TTagCreate = {
    name: string
    color: string
}

export type TTagUpdate = {
    name?: string
    color?: string
}

export type TTagResponse = {
    id: string
    name: string
    color: string
    userId: string
    createdAt: string
    updatedAt: string | null
}

