import { UserRoles } from "@/types/User/TUser"
import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const UserCreateConfirmValidator = z.object({
    code: z.string({ error: DefaultFormErrors.required }).length(6, { error: DefaultFormErrors.length }),
})

const UserForgotPasswordValidator = z.object({
    email: z.email({ error: DefaultFormErrors.email }),
})

export {
    UserCreateConfirmValidator,
    UserForgotPasswordValidator
}