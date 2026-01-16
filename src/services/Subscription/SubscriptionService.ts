import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TCreateCRMProSubscription } from "@/types/Subscription/TSubscription"

class SubscriptionServiceClass {
    async createCRMProSubscription(data: TCreateCRMProSubscription): Promise<TApiResponse> {
        const response = (await API.POST({
            prefix: "/subscription",
            url: "/crm-pro",
            data: data
        }))?.data

        if (!response) {
            throw new Error("Erro ao criar assinatura do CRM Pro")
        }

        return response
    }
}

export const SubscriptionService = new SubscriptionServiceClass()

