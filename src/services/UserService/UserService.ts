import type { TUserConfirmByLinkResponse, TUserConfirmByCodeResponse } from "@/types/User/TUser"

class UserService {
    async confirmByLink(link: string): Promise<TUserConfirmByLinkResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    isValid: true
                })
            }, 2500)
        })
    }

    async confirmByCode(code: string): Promise<TUserConfirmByCodeResponse> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    isValid: true
                })
            }, 1500)
        })
    }
}

export const userService = new UserService()