import { API } from "@/api/api"
import type { TAuth } from "@/types/Auth/TAuth"
import type { AxiosResponse } from "axios"

class AuthServiceClass {
    async auth(data: TAuth): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/auth",
            url: "/",
            data: data
        }))?.data
        return response
    }

    async logout(): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/auth",
            url: "/logout",
        }))?.data
        return response
    }
}

export const AuthService = new AuthServiceClass()