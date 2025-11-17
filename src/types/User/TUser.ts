import { z } from "zod"
import { UserValidator } from "@/validators/User/UserValidator"

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


export type {
    TUser,
    TUserCreate
}

export {
    UserRoles
}