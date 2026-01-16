import { API } from "@/api/api"
import type { TCreateCRMProSubscription, TSubscriptionListResponse, TUpdateSubscriptionCreditCard } from "@/types/Subscription/TSubscription"
import type { TApiResponse } from "@/types/TApiResponse"
import { AxiosResponse } from "axios"

type TListSubscriptionsParams = {
    offset?: number
    status?: "ACTIVE" | "PENDING" | "OVERDUE" | "FAILED" | "CANCELLED"
}

class SubscriptionServiceClass {
    async createCRMProSubscription(data: TCreateCRMProSubscription): Promise<AxiosResponse["data"]> {
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

    async list(params?: TListSubscriptionsParams): Promise<AxiosResponse["data"]> {
        const queryParams: string[] = []
        if (params?.offset !== undefined) {
            queryParams.push(`offset=${params.offset}`)
        }
        if (params?.status) {
            queryParams.push(`status=${params.status}`)
        }

        const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : ""

        const response = (await API.GET({
            prefix: "/subscription",
            url: `/list${queryString}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao listar assinaturas")
        }

        return response
    }

    async info(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/subscription",
            url: "/info"
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar informações da assinatura")
        }

        return response
    }

    async cancelCRMProSubscription(): Promise<TApiResponse<{ message: string }>> {
        const response = (await API.POST({
            prefix: "/subscription",
            url: "/crm-pro/cancel",
            data: {}
        }))?.data

        if (!response) {
            throw new Error("Erro ao cancelar assinatura do CRM Pro")
        }

        return response
    }

    async updateCreditCard(data: TUpdateSubscriptionCreditCard): Promise<TApiResponse<{ message: string }>> {
        const response = (await API.PUT({
            prefix: "/subscription",
            url: "/crm-pro/update-credit-card",
            data: data
        }))?.data

        if (!response) {
            throw new Error("Erro ao atualizar cartão de crédito")
        }

        return response
    }
}

export const SubscriptionService = new SubscriptionServiceClass()

