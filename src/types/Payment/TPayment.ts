import { TicketCancelledBy } from "../Ticket/TTicket"

export const PaymentMethods = [
    "PIX",
    "CREDIT_CARD",
    "LINK"
] as const

export const PaymentGatewayBillingStatuses = [
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

export const PaymentRefundStatuses = [
    "PENDING",
    "DONE",
    "CANCELLED",
    "AWAITING_CRITICAL_ACTION_AUTHORIZATION",
    "AWAITING_CUSTOMER_EXTERNAL_AUTHORIZATION"
] as const

/** Resposta do pagamento via link (GET /payment/link/verify?code=...) */
export type TPaymentLinkVerifyResponse = {
    payment: {
        id: string
        code: string
        status: typeof PaymentGatewayBillingStatuses[number]
        method: typeof PaymentMethods[number]
        externalPaymentId: string | null
        totalPaidByCustomer: number | null
        qrcodeData: {
            encodedImage: string
            payload: string
            expirationDate: string
            description?: string
            success?: boolean
        } | null
        customer: {
            id: string
            firstName: string
            lastName: string
            email: string
        } | null
        event: {
            id: string
            name: string
            image: string
            maxInstallments: number
            acceptsPixPayment: boolean
            acceptsCreditCardPayment: boolean
        } | null
    }
    tickets: Array<{
        id: string
        code: string
        price: number
        status: string
        isInsured: boolean
        ticketType: {
            id: string
            name: string
        } | null
        dates: Array<{
            id: string
            date: string | null
            hourStart: string | null
            hourEnd: string | null
        }>
    }>
}

export type TPaymentLinkPayParams = {
    paymentId: string
    paymentMethod: "CREDIT_CARD"
    ccInfo?: {
        number?: string
        holderName?: string
        exp?: string
        cvv?: string
        installments?: number
    } | null
}

export type TPaymentLinkPayResponse = {
    paymentId: string
    status: typeof PaymentGatewayBillingStatuses[number]
    confirmedByCreditCard?: boolean
    isCreditCardError?: boolean
}

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
    estimatedCreditDate: string | null
    createdAt: string
}

type TPaymentAdminListResponse = {
    id: string
    code: string
    method: typeof PaymentMethods[number]
    type: "TICKET" | "CRM_PRO"
    status: "RECEIVED" | "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED" | "OVERDUE" | "REFUND_REQUESTED"
    externalPaymentId: string | null
    eventId: string | null
    eventInfo: any
    subscriptionId: string | null
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
    refundReason: string | null
    refundedBy: string | null
    refundStatus: typeof PaymentRefundStatuses[number] | null
    refundedAt: string | null
    refundReceiptUrl: string | null
    refundEndToEndIdentifier: string | null
    paidAt: string | null
    chargebackRequested: boolean
    sellerUserId: string | null
    sellerCommissionRate: number | null
    sellerCommissionValue: number | null
    sellerCreditCardUsedInfo: any | null
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
    Seller: {
        id: string
        firstName: string
        lastName: string
        email: string
        phone: string | null
        document: string | null
    } | null
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
        code: string
        price: number
        status: string
        ticketTypeId: string | null
        isInsured: boolean | null
        cancelledBy: typeof TicketCancelledBy[number] | null
        cancelledAt: string | null
        refundReason: string | null
        refundedBy: string | null
        refundedAt: string | null
        refundStatus: string | null
        refundReceiptUrl: string | null
        refundEndToEndIndentifier: string | null
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
    } | null
    Subscription: {
        id: string
        code: string
        type: "CRM"
        status: "ACTIVE" | "PENDING" | "OVERDUE" | "FAILED" | "CANCELLED"
        grossValue: number
        netValue: number | null
        createdAt: string
        updatedAt: string | null
    } | null
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
  refundReason: string | null
  refundedBy: string | null
  refundStatus: typeof PaymentRefundStatuses[number] | null
  refundedAt: string | null
  refundReceiptUrl: string | null
  refundEndToEndIdentifier: string | null
  status: typeof PaymentGatewayBillingStatuses[number]
  type: "TICKET"
  method: typeof PaymentMethods[number]
}

type TPaymentRefundParams = {
    description?: string
    ticketId?: string
}

type TPaymentReleaseBalanceParams = {
    eventId: string
    eventDateId?: string | null
}

type TPaymentReleaseBalanceResponse = {
    success: boolean
    message?: string
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

/** Item da lista "Minhas vendas" do revendedor (GET /payment/my-sales) */
export type TPaymentMySalesItem = {
    id: string
    code: string
    method: typeof PaymentMethods[number]
    status: string
    totalPaidByCustomer: number | null
    sellerCommissionRate: number | null
    sellerCommissionValue: number | null
    paidAt: string | null
    createdAt: string
    customer: {
        id: string
        firstName: string
        lastName: string
        email: string
    } | null
    event: {
        id: string
        name: string
        image: string
    } | null
    tickets: Array<{
        id: string
        code: string
        price: number
        status: string
        ticketType: {
            id: string
            name: string
        } | null
        dates: Array<{
            id: string
            date: string | null
            hourStart: string | null
            hourEnd: string | null
        }>
    }>
}

/** Status de pagamento válidos para o revendedor receber a comissão (entram no saldo). Demais são apenas histórico. */
export function isPaymentValidForReceipt(status: string): boolean {
    return status === "CONFIRMED" || status === "RECEIVED"
}

/** Labels em português para status de pagamento (inclui status usados pela API que podem não estar em PaymentGatewayBillingStatuses) */
const PaymentStatusLabels: Record<string, string> = {
    PENDING: "Pendente",
    RECEIVED: "Recebido",
    CONFIRMED: "Confirmado",
    OVERDUE: "Atrasado",
    REFUNDED: "Reembolsado",
    REFUND_REQUESTED: "Reembolso solicitado",
    REFUND_IN_PROGRESS: "Reembolso em andamento",
    RECEIVED_IN_CASH: "Recebido em dinheiro",
    FAILED: "Falhou",
    CHARGEBACK_REQUESTED: "Chargeback solicitado",
    CHARGEBACK_DISPUTE: "Chargeback em disputa",
    AWAITING_CHARGEBACK_REVERSAL: "Aguardando reversão",
    DUNNING_REQUESTED: "Cobrança solicitada",
    DUNNING_RECEIVED: "Cobrança recebida",
    AWAITING_RISK_ANALYSIS: "Aguardando análise de risco"
}

export function getPaymentStatusLabel(status: string): string {
    return PaymentStatusLabels[status] ?? status
}

export type {
    TPaymentGatewayGetPIXQrCodeResponse,
    TPaymentStatusResponse,
    TPayment,
    TPaymentAdminListResponse,
    TPaymentInstallment,
    TPaymentRefundParams,
    TPaymentReleaseBalanceParams,
    TPaymentReleaseBalanceResponse,
}