import { z } from "zod"
import { UserCreateValidator, UserResetPasswordValidator, UserResetPasswordByCodeValidator, UserUpdateValidator } from "@/validators/User/UserValidator"
import type { TUserAddress } from "./TUserAddress"
import { TOrganizer } from "../Organizer/TOrganizer"

const UserRoles = [
    "CUSTOMER",
    "ORGANIZER",
    "ADMIN"
] as const

const UserGenres = [
    "MALE",
    "FEMALE",
    "PREFER_NOT_TO_SAY"
] as const


type TUser = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string | null
    document: string | null
    nationality: string | null
    gender: typeof UserGenres[number] | null
    birth: string | null
    image: string | null
    payCustomerId: string | null
    completeInfo: boolean
    role: typeof UserRoles[number]
    createdAt: string
    updatedAt: string | null

    Organizer?: TOrganizer | null

    Address: TUserAddress | null
}

type TUserCreate = z.infer<typeof UserCreateValidator>

type TUserResetPasswordByCode = z.infer<typeof UserResetPasswordByCodeValidator>

type TUserResetPassword = z.infer<typeof UserResetPasswordValidator>

type TUserUpdate = z.infer<typeof UserUpdateValidator>

export type {
    TUser,
    TUserCreate,
    TUserResetPasswordByCode,
    TUserResetPassword,
    TUserUpdate
}

export {
    UserRoles
}