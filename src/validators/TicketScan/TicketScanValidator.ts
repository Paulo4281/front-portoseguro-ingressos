import { z } from "zod"

const ticketScanExpiresAtValidator = z.string({ error: "Informe a data de expiração" }).min(1, { error: "Informe a data de expiração" }).refine((value) => {
    const date = new Date(value)
    return !Number.isNaN(date.getTime()) && date.getTime() > Date.now()
}, { error: "A data de expiração deve ser no futuro" })

const TicketScanCreateValidator = z.object({
    eventId: z.string({ error: "Evento é obrigatório" }).uuid({ error: "Evento inválido" }),
    password: z.string({ error: "Senha é obrigatória" }).min(4, { error: "Senha deve ter no mínimo 4 caracteres" }).max(255, { error: "Senha deve ter no máximo 255 caracteres" }),
    maxUsers: z.number({ error: "Número máximo de usuários é obrigatório" }).int({ error: "Número máximo de usuários inválido" }).min(1, { error: "Mínimo de 1 usuário" }).max(99, { error: "Máximo de 99 usuários" }).optional(),
    expiresAt: ticketScanExpiresAtValidator
}).strict()

const TicketScanUpdateExpAtValidator = z.object({
    id: z.string({ error: "Id é obrigatório" }).uuid({ error: "Id inválido" }),
    expiresAt: ticketScanExpiresAtValidator
}).strict()

const TicketScanUpdatePasswordValidator = z.object({
    id: z.string({ error: "Id é obrigatório" }).uuid({ error: "Id inválido" }),
    password: z.string({ error: "Senha é obrigatória" }).min(4, { error: "Senha deve ter no mínimo 4 caracteres" }).max(255, { error: "Senha deve ter no máximo 255 caracteres" })
}).strict()

const TicketScanCreateLinkValidator = z.object({
    maxUsers: z.number({ error: "Número máximo de usuários é obrigatório" }).min(1, { error: "Mínimo de 1 usuário" }).max(99, { error: "Máximo de 99 usuários" }),
    password: z.string({ error: "Senha é obrigatória" }).min(4, { error: "Senha deve ter no mínimo 4 caracteres" }).max(50, { error: "Senha deve ter no máximo 50 caracteres" }),
    expiresAt: ticketScanExpiresAtValidator
}).strict()

type TTicketScanCreateForm = z.infer<typeof TicketScanCreateValidator>
type TTicketScanUpdateExpAtForm = z.infer<typeof TicketScanUpdateExpAtValidator>
type TTicketScanUpdatePasswordForm = z.infer<typeof TicketScanUpdatePasswordValidator>
type TTicketScanCreateLinkForm = z.infer<typeof TicketScanCreateLinkValidator>

export {
    TicketScanCreateValidator,
    TicketScanUpdateExpAtValidator,
    TicketScanUpdatePasswordValidator,
    TicketScanCreateLinkValidator
}

export type {
    TTicketScanCreateForm,
    TTicketScanUpdateExpAtForm,
    TTicketScanUpdatePasswordForm,
    TTicketScanCreateLinkForm
}
