import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const UserGenres = [
    "MALE",
    "FEMALE",
    "PREFER_NOT_TO_SAY"
] as const

const UserAddressValidator = z.object({
    street: z.string({ error: DefaultFormErrors.required }),
    number: z.string().nullable().optional(),
    complement: z.string().nullable().optional(),
    neighborhood: z.string({ error: DefaultFormErrors.required }),
    zipCode: z.string({ error: DefaultFormErrors.required }),
    city: z.string({ error: DefaultFormErrors.required }),
    state: z.string({ error: DefaultFormErrors.required }),
    country: z.string({ error: DefaultFormErrors.required }),
}).nullable().optional()

export const UserProfileUpdateValidator = z.object({
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    image: z.instanceof(File).nullable().optional(),
    phone: z.string().nullable().optional(),
    document: z.string().nullable().optional(),
    nationality: z.string().nullable().optional(),
    genre: z.enum(UserGenres).nullable().optional(),
    birth: z.string().nullable().optional(),
    address: UserAddressValidator,
})

export type TUserProfileUpdate = z.infer<typeof UserProfileUpdateValidator>

