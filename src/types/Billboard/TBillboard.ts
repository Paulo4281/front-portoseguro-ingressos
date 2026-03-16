/** Resposta do GET /billboard/client (sem uploaderUserId). */
type TBillboard = {
    id: string
    url: string
    type: "SYSTEM" | "EVENT"
    gotoLink: string | null
    frontendAreaId: string
    altText: string
    updatedAt: string | null
    createdAt: string
}

/** Item listado no GET /billboard/ (admin), pode incluir uploaderUserId. */
type TBillboardListItem = TBillboard & {
    uploaderUserId?: string
}

type TBillboardCreate = {
    type: "SYSTEM" | "EVENT"
    gotoLink?: string | null
    frontendAreaId: string
    altText: string
    image: File
}

type TBillboardUpdate = {
    id: string
    type?: "SYSTEM" | "EVENT"
    gotoLink?: string | null
    altText?: string
    image?: File
}

export type {
    TBillboard,
    TBillboardListItem,
    TBillboardCreate,
    TBillboardUpdate
}
