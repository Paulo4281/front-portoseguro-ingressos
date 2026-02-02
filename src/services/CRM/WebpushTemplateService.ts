import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TWebpushTemplateListResponse } from "@/types/Webpush/TWebpushTemplate"

class WebpushTemplateServiceClass {
    async findAll(): Promise<TApiResponse<TWebpushTemplateListResponse>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/webpushtemplate"
        }))?.data

        if (!response) {
            throw new Error("Erro ao buscar templates de webpush")
        }

        return response
    }
}

export const WebpushTemplateService = new WebpushTemplateServiceClass()
