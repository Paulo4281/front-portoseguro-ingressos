import { z } from "zod"
import { UserConfirmationCreateConfirmValidator } from "@/validators/User/UserConfirmationValidator"
import { UserConfirmationForgotPasswordValidator } from "@/validators/User/UserConfirmationValidator"

type TUserCreateConfirm = z.infer<typeof UserConfirmationCreateConfirmValidator>

type TUserCreateConfirmRequest = TUserCreateConfirm & {
    email: string
}

type TUserConfirmByCodeResponse = {
    isValid: boolean
}

type TUserForgotPassword = z.infer<typeof UserConfirmationForgotPasswordValidator>

export type {
    TUserCreateConfirm,
    TUserCreateConfirmRequest,
    TUserConfirmByCodeResponse,
    TUserForgotPassword
}