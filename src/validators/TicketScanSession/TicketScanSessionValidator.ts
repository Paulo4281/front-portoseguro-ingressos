import { z } from "zod"

const TicketScanCodeValidator = z.string({ error: "Código é obrigatório" }).regex(/^PSI-TS-[a-zA-Z0-9]{9}$/, { error: "Código inválido" })

const TicketScanSessionAuthenticateValidator = z.object({
    code: TicketScanCodeValidator,
    name: z.string({ error: "Nome é obrigatório" }).min(2, { error: "Informe seu nome" }).max(80, { error: "Nome muito longo" }),
    password: z.string({ error: "Senha é obrigatória" }).min(4, { error: "Senha deve ter no mínimo 4 caracteres" }).max(255, { error: "Senha deve ter no máximo 255 caracteres" }),
    location: z.string().max(80, { error: "Local muito longo" }).nullable().optional().or(z.literal(""))
}).strict()

type TTicketScanSessionAuthenticateForm = z.infer<typeof TicketScanSessionAuthenticateValidator>

export {
    TicketScanSessionAuthenticateValidator,
    TicketScanCodeValidator
}

export type {
    TTicketScanSessionAuthenticateForm
}


