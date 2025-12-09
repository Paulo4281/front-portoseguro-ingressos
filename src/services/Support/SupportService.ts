import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { 
    TSupportCreate, 
    TSupportFindResponse, 
    TSupport,
    TSupportFindOrganizerParams,
    TSupportFindAdminParams,
    TSupportReply,
    TSupportUpdateStatus
} from "@/types/Support/TSupport"
import type { TApiResponse } from "@/types/TApiResponse"

class SupportServiceClass {
    async create(data: TSupportCreate): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        
        formData.append("subject", data.subject)
        formData.append("description", data.description)
        
        if (data.image) {
            formData.append("image", data.image)
        }
        
        if (data.additionalInfo) {
            formData.append("additionalInfo", JSON.stringify(data.additionalInfo))
        }

        const response = (await API.POST_FILE({
            prefix: "/support",
            url: "",
            formData
        }))?.data

        return response
    }

    async findOrganizerSupports(params?: TSupportFindOrganizerParams): Promise<AxiosResponse["data"]> {
        const queryParams: Record<string, string | number> = {}
        
        if (params?.offset !== undefined) {
            queryParams.offset = params.offset
        }
        
        if (params?.status) {
            queryParams.status = params.status
        }

        const response = (await API.GET({
            prefix: "/support",
            url: "/organizer",
            params: queryParams
        }))?.data

        return response
    }

    async findAdminSupports(params?: TSupportFindAdminParams): Promise<AxiosResponse["data"]> {
        const queryParams: Record<string, string | number> = {}
        
        if (params?.offset !== undefined) {
            queryParams.offset = params.offset
        }
        
        if (params?.status) {
            queryParams.status = params.status
        }
        
        if (params?.subject) {
            queryParams.subject = params.subject
        }
        
        if (params?.userId) {
            queryParams.userId = params.userId
        }

        const response = (await API.GET({
            prefix: "/support",
            url: "/admin",
            params: queryParams
        }))?.data

        return response
    }

    async reply(data: TSupportReply): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/support",
            url: "/reply",
            data
        }))?.data

        return response
    }

    async updateStatus(data: TSupportUpdateStatus): Promise<AxiosResponse["data"]> {
        const response = (await API.PATCH({
            prefix: "/support",
            url: "/update-status",
            data
        }))?.data

        return response
    }
}

export const SupportService = new SupportServiceClass()
