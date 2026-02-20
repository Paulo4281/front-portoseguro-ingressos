import { API } from "@/api/api"
import type { AxiosResponse } from "axios"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TLead, TLeadCreateRequest, TLeadFindParams, TPaginatedResponse } from "@/types/Lead/TLead"

class LeadServiceClass {
    async create(data: TLeadCreateRequest): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/lead",
            url: "",
            data
        }))?.data

        return response as TApiResponse<TLead>
    }

    async find(params?: TLeadFindParams): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/lead",
            url: "",
            params: {
                offset: params?.offset ?? 0
            }
        }))?.data

        return response as TApiResponse<TPaginatedResponse<TLead>>
    }
}

export const LeadService = new LeadServiceClass()

