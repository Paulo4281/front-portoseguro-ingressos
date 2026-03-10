const NotaFiscalTypes = [
    "CLIENT",
    "ORGANIZER"
] as const

type TNotaFiscalOrganizerAddress = {
    street: string
    number: string | null
    complement?: string | null
    neighborhood: string
    city: string
    state: string
    country: string
    zipCode: string
}

type TNotaFiscalOrganizer = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    document: string | null
    profileImageUrl: string | null
    companyName: string | null
    cnpj: string | null
    supportEmail: string | null
    supportPhone: string | null
    logoUrl: string | null
    address?: TNotaFiscalOrganizerAddress | null
}

type TNotaFiscal = {
    id: string
    type: (typeof NotaFiscalTypes)[number]
    pdfLink: string | null
    xmlLink: string | null
    userIdOwner: string | null
    userIdUploader: string | null
    paymentId: string | null
    yearReference: number
    monthReference: number
    requested: boolean
    updatedAt: string | null
    createdAt: string
    organizer?: TNotaFiscalOrganizer | null
}

type TNotaFiscalLinkResponse = {
    link: string | null
}

type TNotaFiscalListAdminParams = {
    offset?: number
    status?: "DONE" | "PENDING"
    userIdOwner?: string
}

type TNotaFiscalListOrganizerParams = {
    status?: "DONE" | "PENDING"
}

type TNotaFiscalListAdminResponse = {
    data: TNotaFiscal[]
    total: number
    limit: number
    offset: number
}

type TNotaFiscalUploadByAdmin = {
    id?: string
    userIdOwner?: string
    yearReference?: number
    monthReference?: number
}

type TNotaFiscalUploadByOrganizer = {
    paymentId: string
}

export type {
    TNotaFiscal,
    TNotaFiscalOrganizer,
    TNotaFiscalOrganizerAddress,
    TNotaFiscalLinkResponse,
    TNotaFiscalListAdminParams,
    TNotaFiscalListOrganizerParams,
    TNotaFiscalListAdminResponse,
    TNotaFiscalUploadByAdmin,
    TNotaFiscalUploadByOrganizer
}

export {
    NotaFiscalTypes
}
