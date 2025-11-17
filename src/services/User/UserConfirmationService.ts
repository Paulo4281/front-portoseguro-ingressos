import { API } from "@/api/api"
import type { TUserCreateConfirmRequest, TUserConfirmByCodeResponse } from "@/types/User/TUser"
import type { AxiosResponse } from "axios"

class UserConfirmationServiceClass {
    async confirmByCode(data: TUserCreateConfirmRequest): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user-confirmation",
            url: "/confirm-by-code",
            data: data
        }))?.data
        return response
    }

    async resendConfirmation(email: string): Promise<AxiosResponse["data"]> {
        const response = (await API.POST({
            prefix: "/user-confirmation",
            url: "/resend-code",
            data: { email }
        }))?.data
        return response
    }
}

export const UserConfirmationService = new UserConfirmationServiceClass()