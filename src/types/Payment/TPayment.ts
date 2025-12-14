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

type TPayment = {
  id: string
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
  status: typeof PaymentGatewayBillingStatuses[number]
  type: "TICKET"
  method: "PIX" | "CREDIT_CARD"
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
    TPayment
}

export {
    PaymentGatewayBillingStatuses
}