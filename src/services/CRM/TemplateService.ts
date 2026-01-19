import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TTemplateListResponse } from "@/types/Template/TTemplate"

class TemplateServiceClass {
    async findAll(): Promise<TApiResponse<TTemplateListResponse>> {
        const response = (await API.GET({
            prefix: "/crm",
            url: "/template"
        }))?.data

        return response
    }
}

export const TemplateService = new TemplateServiceClass()

