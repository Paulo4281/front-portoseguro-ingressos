import { z } from "zod"
import { UserCreateConfirmValidator, UserValidator } from "@/validators/User/UserValidator"

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

type TUserCreate = z.infer<typeof UserValidator>

type TUserCreateConfirm = z.infer<typeof UserCreateConfirmValidator>

type TUserCreateConfirmRequest = TUserCreateConfirm & {
    email: string
}

type TUserConfirmByLinkResponse = {
    isValid: boolean
}

type TUserConfirmByCodeResponse = {
    isValid: boolean
}

export type {
    TUser,
    TUserCreate,
    TUserCreateConfirm,
    TUserConfirmByLinkResponse,
    TUserConfirmByCodeResponse,
    TUserCreateConfirmRequest
}

export {
    UserRoles
}