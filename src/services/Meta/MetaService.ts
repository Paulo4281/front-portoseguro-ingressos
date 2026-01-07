import { API } from "@/api/api"
import type { AxiosResponse } from "axios"

type TMetaCheckParams = {
    facebookPixelId: string
    facebookAccessToken: string
}

type TMetaFacebookPixelGetResponse = {
    facebookPixelId: string | null
    facebookAccessToken: string | null
}

class MetaServiceClass {
    async getFacebookPixel(): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/meta",
            url: ""
        }))?.data
        return response
    }

    async check(params: TMetaCheckParams): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/meta",
            url: "/check",
            data: {
                facebookPixelId: params.facebookPixelId,
                facebookAccessToken: params.facebookAccessToken
            }
        }))?.data
        return response
    }
}

export const MetaService = new MetaServiceClass()
export type { TMetaFacebookPixelGetResponse }

