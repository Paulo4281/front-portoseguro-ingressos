import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"

type TAICreateEventDescriptionParams = {
    eventName: string
    categories: string[]
    location: string
}

type TAICreateEventDescriptionResponse = {
    message: string
}

class AIServiceClass {
    async createEventDescription(params: TAICreateEventDescriptionParams): Promise<TApiResponse<TAICreateEventDescriptionResponse>> {
        const response = (await API.POST({
            prefix: "/ai",
            url: "/event-description",
            data: params
        }))?.data

        if (!response) {
            throw new Error("Erro ao criar descrição com IA")
        }

        return response
    }
}

export const AIService = new AIServiceClass()
export type { TAICreateEventDescriptionParams, TAICreateEventDescriptionResponse }