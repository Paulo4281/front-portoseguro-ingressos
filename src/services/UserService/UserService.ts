import { API } from "@/api/api"
import type { TUserCreate, TUserCreateConfirmRequest } from "@/types/User/TUser"
import type { AxiosResponse } from "axios"

class UserServiceClass {
    async create(data: TUserCreate): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/",
            data: data
        }))?.data
        return response
    }

    async confirmByCode(data: TUserCreateConfirmRequest): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/code/confirm-by-code",
            data: data
        }))?.data
        return response
    }

    async resendConfirmation(email: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/code/resend",
            data: { email }
        }))?.data
        return response
    }
}

export const UserService = new UserServiceClass()