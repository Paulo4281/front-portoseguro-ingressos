import { z } from "zod"
import { UserCreateValidator, UserResetPasswordValidator, UserResetPasswordByCodeValidator, UserUpdateValidator, UserConfirmSocialValidator } from "@/validators/User/UserValidator"
import type { TUserAddress } from "./TUserAddress"
import { TOrganizer } from "../Organizer/TOrganizer"

const UserRoles = [
    "CUSTOMER",
    "ORGANIZER",
    "ADMIN",
    "SELLER",
    "NOT_DEFINED"
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
    isCompleteInfo: boolean
    isMarketingConsent: boolean
    role: typeof UserRoles[number]
    createdAt: string
    updatedAt: string | null

    Organizer?: TOrganizer | null

    Address: TUserAddress | null

    /** Apenas para role SELLER: se false, o revendedor não pode realizar novas vendas */
    sellerActive?: boolean
    /** Apenas para role SELLER: taxa de comissão (0–100) */
    sellerCommissionRate?: number

    /** Apenas para role SELLER: dados para recebimento (conta bancária / PIX) */
    sellerBankId?: string | null
    sellerBankAccountName?: string | null
    sellerBankAccountOwnerName?: string | null
    sellerBankAccountOwnerBirth?: string | null
    sellerBankAccountOwnerDocument?: string | null
    sellerBankAccountOwnerDocumentType?: "CPF" | "CNPJ" | null
    sellerBankAccountAgency?: string | null
    sellerBankAccountNumber?: string | null
    sellerBankAccountDigit?: string | null
    sellerBankAccountType?: "CONTA_CORRENTE" | "CONTA_POUPANCA" | null
    sellerPixAddressKey?: string | null
    sellerPixAddressType?: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP" | null
    sellerPayoutMethod?: "PIX" | "BANK_ACCOUNT" | null
}

type TUserCreate = z.infer<typeof UserCreateValidator>

type TUserResetPasswordByCode = z.infer<typeof UserResetPasswordByCodeValidator>

type TUserResetPassword = z.infer<typeof UserResetPasswordValidator>

type TUserUpdate = z.infer<typeof UserUpdateValidator>

type TUserConfirmSocial = z.infer<typeof UserConfirmSocialValidator>

export type {
    TUser,
    TUserCreate,
    TUserResetPasswordByCode,
    TUserResetPassword,
    TUserUpdate,
    TUserConfirmSocial
}

export {
    UserRoles,
    UserGenres
}