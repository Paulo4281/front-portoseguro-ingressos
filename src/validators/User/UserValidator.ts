import { UserRoles } from "@/types/User/TUser"
import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const UserCreateValidator = z.object({
    firstName: z.string({ error: DefaultFormErrors.required }),
    lastName: z.string({ error: DefaultFormErrors.required }),
    email: z.email({ error: DefaultFormErrors.email }),
    phone: z.string({ error: DefaultFormErrors.required }),
    document: z.string({ error: DefaultFormErrors.required }),
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

const UserUpdateValidator = z.object({
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    phone: z.string().min(1).optional(),
    birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable().optional(),
    document: z.string().nullable().optional(),
    nationality: z.string().nullable().optional(),
    gender: z.string().nullable().optional(),
    address: z.object({
        street: z.string().nullable().optional(),
        number: z.string().nullable().optional(),
        complement: z.string().nullable().optional(),
        neighborhood: z.string().nullable().optional(),
        city: z.string().nullable().optional(),
        state: z.string().nullable().optional(),
        country: z.string().nullable().optional(),
        zipCode: z.string().nullable().optional()
    }).optional()
})

export {
    UserCreateValidator,
    UserResetPasswordByCodeValidator,
    UserResetPasswordValidator,
    UserUpdateValidator
}