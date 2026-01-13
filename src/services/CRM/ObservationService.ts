import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TObservationCreate, TObservationUpdate, TObservationResponse } from "@/types/Observation/TObservation"

class ObservationServiceClass {
    async create(data: TObservationCreate): Promise<TApiResponse<TObservationResponse>> {
        const response = (await API.POST({
            prefix: "/crm",
            url: "/observation",
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao criar observação")
        }

        return response
    }

    async findByUserId(userId: string): Promise<TApiResponse<TObservationResponse[]>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: `/observation/${userId}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar observações")
        }

        return response
    }

    async update(id: string, data: TObservationUpdate): Promise<TApiResponse> {
        const response = (await API.PATCH({
            prefix: "/crm",
            url: `/observation/${id}`,
            data
        }))?.data

        if (!response) {
            throw new Error("Erro ao atualizar observação")
        }

        return response
    }

    async delete(id: string): Promise<TApiResponse> {
        const response = (await API.DELETE({
            prefix: "/crm",
            url: `/observation/${id}`
        }))?.data

        if (!response) {
            throw new Error("Erro ao deletar observação")
        }

        return response
    }
}

export const ObservationService = new ObservationServiceClass()

