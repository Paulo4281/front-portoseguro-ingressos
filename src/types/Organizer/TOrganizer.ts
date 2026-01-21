type TBank = {
    id: string
    name: string
    code: string
    ispb: string
    isActive: boolean
}

type TOrganizer = {
    id: string
    userId: string
    companyName: string | null
    companyDocument: string | null
    companyAddress: string | null
    description: string | null
    logo: string | null
    bankId: string | null
    bankAccountName: string | null
    bankAccountOwnerName: string | null
    bankAccountOwnerBirth: string | null
    bankAccountOwnerDocument: string | null
    bankAccountAgency: string | null
    bankAccountNumber: string | null
    bankAccountDigit: string | null
    bankAccountType: "CONTA_CORRENTE" | "CONTA_POUPANCA" | null
    pixAddressKey: string | null
    pixAddressType: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP" | null
    payoutMethod: "PIX" | "BANK_ACCOUNT" | null
    identityDocumentFront: string | null
    identityDocumentBack: string | null
    identityDocumentSelfie: string | null
    crmPlan: "FREE" | "PRO"
    instagramUrl: string | null
    facebookUrl: string | null
    supportEmail: string | null
    supportPhone: string | null
    verificationStatus: "PENDING" | "WAITING_DOCUMENTATION" | "APPROVED" | "REJECTED" | null
    createdAt: string
    updatedAt: string | null
    Bank?: TBank | null
}

export type {
    TOrganizer,
    TBank
}