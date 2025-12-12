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
    TPaymentStatusResponse
}

export {
    PaymentGatewayBillingStatuses
}