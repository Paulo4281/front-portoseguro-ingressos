import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const AuthValidator = z.object({
    email: z.email({ error: DefaultFormErrors.email }),
    password: z.string({ error: DefaultFormErrors.required })
})

export {
    AuthValidator
}