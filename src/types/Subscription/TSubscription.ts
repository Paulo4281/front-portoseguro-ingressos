export type TCreateCRMProSubscription = {
    creditCard?: {
        holderName: string
        number: string
        expiryMonth: string
        expiryYear: string
        ccv: string
    }
    creditCardHolderInfo?: {
        name: string
        email: string
        cpfCnpj: string
        postalCode: string
        addressNumber: string
        phone: string
        mobilePhone?: string
        addressComplement?: string
    }
    creditCardToken?: string
}

export type TSubscriptionCreate = {
    code: string
    method: "CREDIT_CARD"
    type: "CRM"
    status: "ACTIVE" | "PENDING" | "OVERDUE" | "FAILED" | "CANCELLED"
    externalSubscriptionId: string
    grossValue: number
    netValue: number | null
    userId: string
    cardId: string | null
}

