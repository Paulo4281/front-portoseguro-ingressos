const PaymentGatewayBillingStatuses = [
    "PENDING",
    "RECEIVED",
    "CONFIRMED",
    "OVERDUE",
    "REFUNDED",
    "RECEIVED_IN_CASH",
    "REFUND_REQUESTED",
    "REFUND_IN_PROGRESS",
    "CHARGEBACK_REQUESTED",
    "CHARGEBACK_DISPUTE",
    "AWAITING_CHARGEBACK_REVERSAL",
    "DUNNING_REQUESTED",
    "DUNNING_RECEIVED",
    "AWAITING_RISK_ANALYSIS",
  ] as const

type TPaymentInstallment = {
    id: string
    paymentId: string
    installmentNumber: number
    grossValue: number
    netValue: number
    dueDate: string | null
    paidAt: string | null
    receivedAt: string | null
    status: "RECEIVED" | "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED"
    externalPaymentId: string | null
    externalInstallmentId: string | null
    createdAt: string
}

type TPaymentAdminListResponse = {
    id: string
    code: string
    method: "CREDIT_CARD" | "PIX"
    type: "TICKET"
    status: "RECEIVED" | "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED" | "OVERDUE" | "REFUND_REQUESTED"
    externalPaymentId: string | null
    eventId: string
    eventInfo: any
    grossValue: number
    netValue: number | null
    discountedValue: number | null
    gatewayFeeGain: number | null
    customerFee: number | null
    organizerFee: number | null
    customerPaymentFee: number | null
    platformPaymentFee: number | null
    couponInfo: any | null
    creditCardInstallments: number | null
    organizerPayout: number | null
    totalPaidByCustomer: number | null
    invoiceUrl: string | null
    invoiceNumber: string | null
    transactionReceiptUrl: string | null
    qrcodeData: any | null
    failedReason: string | null
    additionalLogs: string | null
    paidAt: string | null
    chargebackRequested: boolean
    userId: string
    cardId: string | null
    createdAt: string
    updatedAt: string | null
    User: {
        id: string
        firstName: string
        lastName: string
        email: string
        phone: string | null
        document: string | null
    }
    Card: {
        id: string
        name: string
        last4: string
        brand: string
        expYear: string
        expMonth: string
    } | null
    Installments: TPaymentInstallment[]
    Tickets: Array<{
        id: string
        status: string
        ticketTypeId: string | null
        TicketType: {
            id: string
            name: string
            description: string | null
        } | null
        TicketDates: Array<{
            id: string
            eventDateId: string
            status: string
            EventDate: {
                id: string
                date: string
                hourStart: string
                hourEnd: string
            }
        }>
    }>
    Event: {
        id: string
        name: string
        description: string | null
        slug: string
        location: string | null
        image: string
        isFree: boolean
        isOnline: boolean
        createdAt: string
        Organizer: {
            id: string
            companyName: string
            companyDocument: string
        }
    }
}

type TPayment = {
  id: string
  code: string
  userId: string
  eventId: string
  eventInfo: any
  cardId: string | null
  chargebackRequested: boolean
  couponInfo: Record<string, unknown> | null
  createdAt: string
  updatedAt: string | null
  creditCardInstallments: number | null
  customerFee: number
  customerPaymentFee: number
  discountedValue: number
  externalPaymentId: string | null
  gatewayFeeGain: number
  grossValue: number
  netValue: number
  organizerFee: number
  organizerPayout: number
  paidAt: string | null
  platformPaymentFee: number
  totalPaidByCustomer: number
  invoiceUrl: string | null
  invoiceNumber: string | null
  transactionReceiptUrl: string | null
  qrcodeData: any | null
  failedReason: string | null
  additionalLogs: string | null
  status: typeof PaymentGatewayBillingStatuses[number]
  type: "TICKET"
  method: "PIX" | "CREDIT_CARD"
}

type TPaymentRefundParams = {
    description?: string
}

type TPaymentGatewayGetPIXQrCodeResponse = {
    encodedImage: string
    payload: string
    expirationDate: string
    description: string
}

type TPaymentStatusResponse = {
    status: typeof PaymentGatewayBillingStatuses[number]
}

export type {
    TPaymentGatewayGetPIXQrCodeResponse,
    TPaymentStatusResponse,
    TPayment,
    TPaymentAdminListResponse,
    TPaymentInstallment,
    TPaymentRefundParams
}

export {
    PaymentGatewayBillingStatuses
}