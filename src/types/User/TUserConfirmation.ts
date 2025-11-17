import { z } from "zod"
import { UserCreateConfirmValidator } from "@/validators/User/UserConfirmationValidator"
import { UserForgotPasswordValidator } from "@/validators/User/UserConfirmationValidator"

type TUserCreateConfirm = z.infer<typeof UserCreateConfirmValidator>

type TUserCreateConfirmRequest = TUserCreateConfirm & {
    email: string
}

type TUserConfirmByCodeResponse = {
    isValid: boolean
}

type TUserForgotPassword = z.infer<typeof UserForgotPasswordValidator>

export type {
    TUserCreateConfirm,
    TUserCreateConfirmRequest,
    TUserConfirmByCodeResponse,
    TUserForgotPassword
}