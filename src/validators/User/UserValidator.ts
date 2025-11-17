import { UserRoles } from "@/types/User/TUser"
import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const UserCreateValidator = z.object({
    firstName: z.string({ error: DefaultFormErrors.required }),
    lastName: z.string({ error: DefaultFormErrors.required }),
    email: z.email({ error: DefaultFormErrors.email }),
    phone: z.string({ error: DefaultFormErrors.required }),
    password: z.string({ error: DefaultFormErrors.required }),
    role: z.enum(UserRoles, { error: DefaultFormErrors.required }),
}).superRefine((data, ctx) => {
    if (!data.password) {
        return
    }

    if (data.password.length < 8) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordMinLength
        })
        return
    }

    if (!/[A-Z]/.test(data.password)) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordUppercase
        })
        return
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password)) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordSpecialChar
        })
    }
})

const UserResetPasswordByCodeValidator = z.object({
    email: z.email({ error: DefaultFormErrors.email }),
    code: z.string({ error: DefaultFormErrors.required }).length(6, { error: DefaultFormErrors.length }),
    password: z.string({ error: DefaultFormErrors.required }).nonempty({ error: DefaultFormErrors.required }),
}).superRefine((data, ctx) => {
    if (data.password.length < 8) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordMinLength
        })
        return
    }

    if (!/[A-Z]/.test(data.password)) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordUppercase
        })
        return
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password)) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordSpecialChar
        })
    }
})

const UserResetPasswordValidator = z.object({
    currentPassword: z.string({ error: DefaultFormErrors.required }),
    password: z.string({ error: DefaultFormErrors.required }),
}).superRefine((data, ctx) => {
    if (data.password.length < 8) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordMinLength
        })
        return
    }

    if (!/[A-Z]/.test(data.password)) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordUppercase
        })
        return
    }

    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(data.password)) {
        ctx.addIssue({
            code: "custom",
            path: ["password"],
            message: DefaultFormErrors.passwordSpecialChar
        })
    }
})

export {
    UserCreateValidator,
    UserResetPasswordByCodeValidator,
    UserResetPasswordValidator
}