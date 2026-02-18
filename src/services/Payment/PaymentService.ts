import { API } from "@/api/api"
import { AxiosResponse } from "axios"
import type { TApiResponse } from "@/types/TApiResponse"
import type {
    TPaymentAdminListResponse,
    TPaymentRefundParams,
    TPaymentReleaseBalanceParams,
    TPaymentMySalesItem,
    TPaymentLinkVerifyResponse,
    TPaymentLinkPayParams,
    TPaymentLinkPayResponse
} from "@/types/Payment/TPayment"

type TListPaymentsParams = {
    offset?: number
    status?: "RECEIVED" | "CONFIRMED" | "PENDING" | "FAILED" | "REFUNDED" | "OVERDUE" | "REFUND_REQUESTED"
}

type TListPaymentsResponse = {
    data: TPaymentAdminListResponse[]
    total: number
    limit: number
    offset: number
}

class PaymentServiceClass {
    async verifyPaymentStatus(paymentId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payment-gateway",
            url: `/verify-payment-status/${paymentId}`
        }))?.data
        return response
    }

    // ADMIN
    async listPayments(params?: TListPaymentsParams): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payment",
            url: "/list-payments",
            params: params
        }))?.data
        return response
    }

    async refundPix({ billingId, params }: { billingId: string, params?: TPaymentRefundParams }): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/payment-gateway",
            url: `/refund/pix/${billingId}`,
            data: params ?? {}
        }))?.data
        return response
    }

    async refundCreditCard({ billingId, installmentId, params }: { billingId: string, installmentId: string, params?: TPaymentRefundParams }): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/payment-gateway",
            url: `/refund/credit-card/${billingId}?installmentId=${encodeURIComponent(installmentId)}`,
            data: params ?? {}
        }))?.data
        return response
    }

    // ADMIN
    async releaseBalance(params: TPaymentReleaseBalanceParams): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/payment",
            url: "/release-balance",
            data: params
        }))?.data
        return response
    }

    async mySales(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payment",
            url: "/my-sales"
        }))?.data
        return response
    }

    // PAYMENT LINK
    async verifyLink(code: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payment",
            url: "/link/verify",
            params: { code }
        }))?.data
        return response
    }

    async payLink(params: TPaymentLinkPayParams): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/payment",
            url: "/link/pay",
            data: params
        }))?.data
        return response
    }
}

export const PaymentService = new PaymentServiceClass()