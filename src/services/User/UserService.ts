import { API } from "@/api/api"
import type { TUserCreate, TUserResetPasswordByCode, TUserResetPassword } from "@/types/User/TUser"
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

    async checkEmailExists(email: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/check-email-exists",
            data: { email }
        }))?.data
        return response
    }

    async resetPassword(data: TUserResetPassword): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/reset-password",
            data: data
        }))?.data
        return response
    }

    async resetPasswordByCode(data: TUserResetPasswordByCode): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/reset-password-by-code",
            data: data
        }))?.data
        return response
    }
}

export const UserService = new UserServiceClass()