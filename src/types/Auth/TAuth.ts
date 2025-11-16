import { z } from "zod"
import { AuthValidator } from "@/validators/Auth/AuthValidator"

type TAuth = z.infer<typeof AuthValidator>

export type {
    TAuth
}