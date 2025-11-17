import { UserRoles } from "@/types/User/TUser"
import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const UserConfirmationCreateConfirmValidator = z.object({
    code: z.string({ error: DefaultFormErrors.required }).length(6, { error: DefaultFormErrors.length }),
})

const UserConfirmationForgotPasswordValidator = z.object({
    email: z.email({ error: DefaultFormErrors.email }),
})

export {
    UserConfirmationCreateConfirmValidator,
    UserConfirmationForgotPasswordValidator
}