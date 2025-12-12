import { API } from "@/api/api"
import { AxiosResponse } from "axios"

class PaymentServiceClass {
    async verifyPaymentStatus(paymentId: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/payment-gateway",
            url: `/verify-payment-status/${paymentId}`
        }))?.data
        return response
    }
}

export const PaymentService = new PaymentServiceClass()