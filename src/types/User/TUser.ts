import { z } from "zod"
import { UserCreateValidator, UserResetPasswordByCodeValidator } from "@/validators/User/UserValidator"

const UserRoles = [
    "CUSTOMER",
    "ORGANIZER",
    "ADMIN"
] as const

type TUser = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    role: typeof UserRoles[number]
    createdAt: string
    updatedAt: string | null
}

type TUserCreate = z.infer<typeof UserCreateValidator>

type TUserResetPasswordByCode = z.infer<typeof UserResetPasswordByCodeValidator>

export type {
    TUser,
    TUserCreate,
    TUserResetPasswordByCode
}

export {
    UserRoles
}