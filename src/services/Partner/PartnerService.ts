import { API } from "@/api/api"
import { AxiosResponse } from "axios"
import type { TPartnerIncrementClickCount, TPartnerUpdate } from "@/types/Partner/TPartner"

class PartnerServiceClass {
    async find(): Promise<AxiosResponse["data"]> {
        const response = await API.GET({
            prefix: "/partner",
            url: ""
        })

        if (response?.data) {
            return response.data
        }

        return {
            success: false,
            message: "Não foi possível buscar os parceiros"
        }
    }

    async incrementClickCount(data: TPartnerIncrementClickCount): Promise<AxiosResponse["data"]> {
        const response = await API.PATCH({
            prefix: "/partner",
            url: "/click-count",
            data
        })

        if (response?.data) {
            return response.data
        }

        return {
            success: false,
            message: "Não foi possível registrar o clique no parceiro"
        }
    }

    async update(data: TPartnerUpdate): Promise<AxiosResponse["data"]> {
        const response = await API.PUT({
            prefix: "/partner",
            url: "",
            data
        })

        if (response?.data) {
            return response.data
        }

        return {
            success: false,
            message: "Não foi possível atualizar o parceiro"
        }
    }
}

export const PartnerService = new PartnerServiceClass()
