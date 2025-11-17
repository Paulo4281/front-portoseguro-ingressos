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
}

export const UserService = new UserServiceClass()