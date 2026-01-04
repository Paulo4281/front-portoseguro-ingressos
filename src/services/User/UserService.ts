import { API } from "@/api/api"
import type { TUserCreate, TUserResetPasswordByCode, TUserResetPassword, TUserUpdate, TUserConfirmSocial } from "@/types/User/TUser"
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

    async checkPassword(password: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/check-password",
            data: { password }
        }))?.data
        return response
    }

    async checkPasswordAdmin(password: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user",
            url: "/check-password-admin",
            data: { password }
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

    async loginWithGoogle(googleAuthToken: string): Promise<AxiosResponse["data"]> {
        const response = (await API.GET({
            prefix: "/user",
            url: `/google/sub/${googleAuthToken}`
        }))?.data
        return response
    }

    async confirmSocial(data: TUserConfirmSocial): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/user",
            url: "/confirm-social/google",
            data: data
        }))?.data
        return response
    }

    async update(data: TUserUpdate): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/user",
            url: "/",
            data: data
        }))?.data
        return response
    }

    async uploadProfilePicture(file: File): Promise<AxiosResponse["data"]> {
        const formData = new FormData()
        formData.append("image", file)

        const response = (await API.POST_FILE({
            prefix: "/user",
            url: "/upload-profile-picture",
            formData
        }))?.data
        return response
    }

    async updateWebpush(data: { endpoint: string; p256dh: string; auth: string }): Promise<AxiosResponse["data"]> {
        const response = (await API.PUT({
            prefix: "/user",
            url: "/webpush",
            data: data
        }))?.data
        return response
    }
}

export const UserService = new UserServiceClass()