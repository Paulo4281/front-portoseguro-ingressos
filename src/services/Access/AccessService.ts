import { API } from "@/api/api"
import type { TApiResponse } from "@/types/TApiResponse"
import type { TLoginLogListResponse } from "@/types/Access/TAccess"
import type { AxiosResponse } from "axios"

type TAccessListParams = {
    offset?: number
    from?: string
    to?: string
}

class AccessServiceClass {
    async list(params?: TAccessListParams): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/access",
            url: "",
            params: {
                offset: params?.offset ?? 0,
                ...(params?.from ? { from: params.from } : {}),
                ...(params?.to ? { to: params.to } : {}),
            }
        }))?.data

        return response as TApiResponse<TLoginLogListResponse>
    }
}

export const AccessService = new AccessServiceClass()

