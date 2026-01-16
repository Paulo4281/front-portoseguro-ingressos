type TSubscription = {
    id: string
    code: string
    method: string
    type: string
    status: "ACTIVE" | "PENDING" | "OVERDUE" | "FAILED" | "CANCELLED"
    externalSubscriptionId: string | null
    grossValue: number
    cancelledAt: string | null
    createdAt: string
    updatedAt: string | null
    user: {
        id: string
        firstName: string
        lastName: string
        email: string
    }
    organizer: {
        id: string
        companyName: string | null
        companyDocument: string | null
        logo: string | null
        crmPlan: "FREE" | "PRO" | null
    } | null
    card: {
        id: string
        name: string
        last4: string
        brand: string
    } | null
}

type TCreateCRMProSubscription = {
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

type TSubscriptionCreate = {
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

type TSubscriptionListResponse = {
    data: TSubscription[]
    total: number
    offset: number
    limit: number
}

type TSubscriptionInfoResponse = {
    id: string
    code: string
    method: string
    type: string
    status: string
    externalSubscriptionId: string | null
    grossValue: number
    cancelledAt: string | null
    expiresAt: string | null
    createdAt: string
    card: {
        id: string
        name: string
        last4: string
        brand: string
    } | null
}

type TUpdateSubscriptionCreditCard = {
    creditCard?: {
        holderName: string
        number: string
        expiryMonth: string
        expiryYear: string
        ccv: string
    }
    creditCardToken?: string
}

export type {
    TSubscription,
    TCreateCRMProSubscription,
    TSubscriptionCreate,
    TSubscriptionListResponse,
    TSubscriptionInfoResponse,
    TUpdateSubscriptionCreditCard
}