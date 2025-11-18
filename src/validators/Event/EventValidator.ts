import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const EventDateValidator = z.object({
    date: z.string({ error: DefaultFormErrors.required }),
    hourStart: z.string({ error: DefaultFormErrors.required }),
    hourEnd: z.string().nullable().optional()
})

const RecurrenceDayValidator = z.object({
    day: z.number(),
    hourStart: z.string({ error: DefaultFormErrors.required }),
    hourEnd: z.string().nullable().optional()
})

const RecurrenceValidator = z.object({
    type: z.enum(["NONE", "DAILY", "WEEKLY", "MONTHLY"], { error: DefaultFormErrors.required }),
    hourStart: z.string().optional(),
    hourEnd: z.string().nullable().optional(),
    daysOfWeek: z.array(RecurrenceDayValidator).optional(),
    endDate: z.string().nullable().optional()
}).nullable().optional()

const BatchValidator = z.object({
    name: z.string({ error: DefaultFormErrors.required }),
    price: z.number({ error: DefaultFormErrors.required }).min(0.01, { error: "Preço deve ser maior que 0" }),
    quantity: z.number({ error: DefaultFormErrors.required }).min(1, { error: "Quantidade deve ser maior que 0" }),
    startDate: z.string({ error: DefaultFormErrors.required }),
    endDate: z.string().nullable().optional()
})

const EventCreateValidator = z.object({
    name: z.string({ error: DefaultFormErrors.required }).min(3, { error: "Nome deve ter no mínimo 3 caracteres" }).max(160, { error: "Nome deve ter no máximo 160 caracteres" }),
    description: z.string({ error: DefaultFormErrors.required }).min(10, { error: "Descrição deve ter no mínimo 10 caracteres" }),
    image: z.instanceof(File, { error: DefaultFormErrors.required }),
    location: z.string().nullable().optional(),
    useBatches: z.boolean(),
    tickets: z.number().optional(),
    batches: z.array(BatchValidator).optional(),
    dates: z.array(EventDateValidator).optional(),
    recurrence: RecurrenceValidator
}).superRefine((data, ctx) => {
    if (!data.useBatches && !data.tickets) {
        ctx.addIssue({
            code: "custom",
            path: ["tickets"],
            message: "Quantidade de ingressos é obrigatória quando não usar lotes"
        })
    }
    if (data.useBatches && (!data.batches || data.batches.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["batches"],
            message: "Adicione pelo menos um lote"
        })
    }
    if (!data.recurrence && (!data.dates || data.dates.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["dates"],
            message: "Adicione pelo menos uma data ou configure recorrência"
        })
    }
    if (data.recurrence && data.recurrence.type === "WEEKLY" && (!data.recurrence.daysOfWeek || data.recurrence.daysOfWeek.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "daysOfWeek"],
            message: "Selecione pelo menos um dia da semana"
        })
    }
    if (data.recurrence && data.recurrence.type === "MONTHLY" && (!data.recurrence.daysOfWeek || data.recurrence.daysOfWeek.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "daysOfWeek"],
            message: "Selecione pelo menos um dia do mês"
        })
    }
    if (data.recurrence && data.recurrence.type === "WEEKLY" && data.recurrence.daysOfWeek) {
        data.recurrence.daysOfWeek.forEach((day, index) => {
            if (!day.hourStart) {
                ctx.addIssue({
                    code: "custom",
                    path: ["recurrence", "daysOfWeek", index, "hourStart"],
                    message: "Horário de início é obrigatório"
                })
            }
        })
    }
    if (data.recurrence && data.recurrence.type === "MONTHLY" && data.recurrence.daysOfWeek) {
        data.recurrence.daysOfWeek.forEach((day, index) => {
            if (!day.hourStart) {
                ctx.addIssue({
                    code: "custom",
                    path: ["recurrence", "daysOfWeek", index, "hourStart"],
                    message: "Horário de início é obrigatório"
                })
            }
        })
    }
    if (data.recurrence && data.recurrence.type === "DAILY" && !data.recurrence.hourStart) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "hourStart"],
            message: "Horário de início é obrigatório para eventos diários"
        })
    }
})

export {
    EventCreateValidator
}
export type {
    EventCreateValidator as TEventCreateValidator
}

