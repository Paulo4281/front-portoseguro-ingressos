import { z } from "zod"
import { AuthValidator } from "@/validators/Auth/AuthValidator"
import type { TUser } from "@/types/User/TUser"

type TAuth = z.infer<typeof AuthValidator>

type TAuthResponse = {
    user: TUser
}

export type {
    TAuth,
    TAuthResponse
}