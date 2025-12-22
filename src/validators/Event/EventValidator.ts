import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const EventDateTicketTypePriceValidator = z.object({
    ticketTypeId: z.string({ error: DefaultFormErrors.required }),
    price: z.number({ error: DefaultFormErrors.required }).min(0, { error: "Preço não pode ser negativo" })
})

const EventDateValidator = z.object({
    id: z.string().nullable().optional(),
    date: z.string({ error: DefaultFormErrors.required }),
    hourStart: z.string({ error: DefaultFormErrors.required }),
    hourEnd: z.string().nullable().optional(),
    hasSpecificPrice: z.boolean().optional(),
    price: z.number().min(0, { error: "Preço não pode ser negativo" }).nullable().optional(),
    ticketTypePrices: z.array(EventDateTicketTypePriceValidator).nullable().optional()
})

const RecurrenceValidator = z.object({
    id: z.string().nullable().optional(),
    type: z.enum(["DAILY", "WEEKLY", "MONTHLY"], { error: DefaultFormErrors.required }),
    hourStart: z.string().optional(),
    hourEnd: z.string().nullable().optional(),
    day: z.number().int().min(0).max(31).optional(),
    endDate: z.string().nullable().optional()
}).nullable().optional()

const TicketTypeValidator = z.object({
    id: z.string().nullable().optional(),
    name: z.string({ error: DefaultFormErrors.required }).min(1, { error: "Nome do tipo é obrigatório" }),
    description: z.string().nullable().optional()
})

const EventBatchTicketTypeDayValidator = z.object({
    eventDateId: z.string({ error: DefaultFormErrors.required }),
    price: z.number({ error: DefaultFormErrors.required }).min(0, { error: "Preço não pode ser negativo" })
})

const EventBatchTicketTypeValidator = z.object({
    ticketTypeId: z.string({ error: DefaultFormErrors.required }),
    id: z.string().nullable().optional(),
    price: z.number().min(0, { error: "Preço não pode ser negativo" }).nullable().optional(),
    amount: z.number({ error: DefaultFormErrors.required }).min(1, { error: "Quantidade deve ser maior que 0" })
})

const BatchValidator = z.object({
    id: z.string().nullable().optional(),
    name: z.string({ error: DefaultFormErrors.required }),
    price: z.number().min(0, { error: "Preço não pode ser negativo" }).nullable().optional(),
    quantity: z.number().min(1, { error: "Quantidade deve ser maior que 0" }).nullable().optional(),
    startDate: z.string({ error: DefaultFormErrors.required }),
    endDate: z.string().nullable().optional(),
    autoActivateNext: z.boolean().optional(),
    accumulateUnsold: z.boolean().optional(),
    ticketTypes: z.array(EventBatchTicketTypeValidator).optional()
})

const EventCreateValidator = z.object({
    name: z.string({ error: DefaultFormErrors.required }).min(3, { error: "Nome deve ter no mínimo 3 caracteres" }).max(160, { error: "Nome deve ter no máximo 160 caracteres" }),
    description: z.string({ error: DefaultFormErrors.required }).min(10, { error: "Descrição deve ter no mínimo 10 caracteres" }),
    categories: z.array(z.string({ error: DefaultFormErrors.required }), { error: DefaultFormErrors.required })
        .min(1, { error: "Selecione pelo menos uma categoria" })
        .max(5, { error: "Selecione no máximo 5 categorias" }),
    image: z.instanceof(File, { error: DefaultFormErrors.required }),
    location: z.string().nullable().optional(),
    tickets: z.number().optional(),
    ticketPrice: z.number().optional(),
    ticketTypes: z.array(TicketTypeValidator).optional(),
    batches: z.array(BatchValidator).optional(),
    dates: z.array(EventDateValidator).optional(),
    recurrence: RecurrenceValidator,
    isFree: z.boolean().optional(),
    isOnline: z.boolean().optional(),
    isClientTaxed: z.boolean().optional(),
    form: z.any().optional(),
    isFormForEachTicket: z.boolean().optional(),
    buyTicketsLimit: z.number().int().min(1, { error: "O limite deve ser no mínimo 1" }).max(100, { error: "O limite deve ser no máximo 100" }).nullable().optional(),
    maxInstallments: z.number().int().min(1, { error: "Parcelamento mínimo é 1x" }).max(12, { error: "Parcelamento máximo é 12x" }).nullable().optional()
}).superRefine((data, ctx) => {
    const hasBatches = data.batches && data.batches.length > 0
    
    if (!hasBatches && !data.tickets) {
        ctx.addIssue({
            code: "custom",
            path: ["tickets"],
            message: "Quantidade de ingressos é obrigatória quando não usar lotes"
        })
    }
    if (!hasBatches && (data.ticketPrice === null || data.ticketPrice === undefined)) {
        ctx.addIssue({
            code: "custom",
            path: ["ticketPrice"],
            message: "Preço do ingresso é obrigatório quando não usar lotes"
        })
    }
    if (hasBatches && (!data.batches || data.batches.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["batches"],
            message: "Adicione pelo menos um lote"
        })
    }
    if (data.recurrence && data.dates && data.dates.length > 0) {
        ctx.addIssue({
            code: "custom",
            path: ["dates"],
            message: "Não é possível ter recorrência e datas específicas ao mesmo tempo"
        })
    }
    if (!data.recurrence && (!data.dates || data.dates.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["dates"],
            message: "Adicione pelo menos uma data ou configure recorrência"
        })
    }
    if (data.recurrence && data.recurrence.type === "WEEKLY" && (!data.recurrence.day || data.recurrence.day === undefined)) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "day"],
            message: "Selecione pelo menos um dia da semana"
        })
    }
    if (data.recurrence && data.recurrence.type === "MONTHLY" && (!data.recurrence.day || data.recurrence.day === undefined)) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "day"],
            message: "Selecione pelo menos um dia do mês"
        })
    }
    if (data.recurrence && data.recurrence.type === "WEEKLY" && data.recurrence.day) {
        if (!data.recurrence.hourStart) {
            ctx.addIssue({
                code: "custom",
                path: ["recurrence", "hourStart"],
                message: "Horário de início é obrigatório"
            })
        }
    }
    if (data.recurrence && data.recurrence.type === "MONTHLY" && data.recurrence.day) {
        if (!data.recurrence.hourStart) {
            ctx.addIssue({
                code: "custom",
                path: ["recurrence", "hourStart"],
                message: "Horário de início é obrigatório"
            })
        }
    }
    if (data.recurrence && data.recurrence.type === "DAILY" && !data.recurrence.hourStart) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "hourStart"],
            message: "Horário de início é obrigatório para eventos diários"
        })
    }

    if (data.dates && data.dates.length > 0) {
        const datesWithSpecificPrice = data.dates.filter(date => date.hasSpecificPrice === true)
        const datesWithoutSpecificPrice = data.dates.filter(date => date.hasSpecificPrice === false)
        
        if (datesWithSpecificPrice.length > 0 && datesWithoutSpecificPrice.length > 0) {
            datesWithoutSpecificPrice.forEach((date, index) => {
                const dateIndex = data.dates!.findIndex(d => d === date)
                ctx.addIssue({
                    code: "custom",
                    path: ["dates", dateIndex, "hasSpecificPrice"],
                    message: "Se você definir preço específico para uma data, todas as outras datas também devem ter preço específico"
                })
            })
        }
    }

    if (hasBatches && data.batches && data.batches.length > 0) {
        let eventStartDate: string | null = null
        let eventEndDate: string | null = null

        if (data.recurrence) {
            if (data.recurrence.endDate) {
                eventEndDate = data.recurrence.endDate
            }
        } else if (data.dates && data.dates.length > 0) {
            const sortedDates = [...data.dates]
                .map(d => d.date)
                .filter(Boolean)
                .sort()
            
            if (sortedDates.length > 0) {
                eventStartDate = sortedDates[0]
                eventEndDate = sortedDates[sortedDates.length - 1]
            }
        }

        if (eventStartDate) {
            data.batches.forEach((batch, index) => {
                if (batch.startDate) {
                    const batchStartDate = new Date(batch.startDate)
                    const eventStart = new Date(eventStartDate)
                    
                    if (batchStartDate > eventStart) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["batches", index, "startDate"],
                            message: "A data de início do lote não pode ser posterior à primeira data do evento"
                        })
                    }
                }

                if (batch.endDate && eventEndDate) {
                    const batchEndDate = new Date(batch.endDate)
                    const eventEnd = new Date(eventEndDate)
                    
                    if (batchEndDate > eventEnd) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["batches", index, "endDate"],
                            message: "A data de fim do lote não pode ser posterior à última data do evento"
                        })
                    }
                }
            })
        }
    }
})

const EventUpdateValidatorBase = z.object({
    name: z.string({ error: DefaultFormErrors.required }).min(3, { error: "Nome deve ter no mínimo 3 caracteres" }).max(160, { error: "Nome deve ter no máximo 160 caracteres" }),
    description: z.string({ error: DefaultFormErrors.required }).min(10, { error: "Descrição deve ter no mínimo 10 caracteres" }),
    categories: z.array(z.string({ error: DefaultFormErrors.required }), { error: DefaultFormErrors.required })
        .min(1, { error: "Selecione pelo menos uma categoria" })
        .max(5, { error: "Selecione no máximo 5 categorias" }),
    image: z.instanceof(File, { error: DefaultFormErrors.required }).nullable().optional(),
    location: z.string().nullable().optional(),
    tickets: z.number().optional(),
    ticketPrice: z.number().optional(),
    ticketTypes: z.array(TicketTypeValidator).optional(),
    batches: z.array(BatchValidator).optional(),
    dates: z.array(EventDateValidator).optional(),
    recurrence: RecurrenceValidator,
    isClientTaxed: z.boolean().optional(),
    form: z.any().optional(),
    isFormForEachTicket: z.boolean().optional(),
    isFree: z.boolean().optional(),
    isOnline: z.boolean().optional(),
    buyTicketsLimit: z.number().int().min(1, { error: "O limite deve ser no mínimo 1" }).max(100, { error: "O limite deve ser no máximo 100" }).nullable().optional(),
    maxInstallments: z.number().int().min(1, { error: "Parcelamento mínimo é 1x" }).max(12, { error: "Parcelamento máximo é 12x" }).nullable().optional()
})

const EventUpdateValidator = EventUpdateValidatorBase.superRefine((data, ctx) => {
    const hasBatches = data.batches && data.batches.length > 0
    
    if (!hasBatches && !data.tickets) {
        ctx.addIssue({
            code: "custom",
            path: ["tickets"],
            message: "Quantidade de ingressos é obrigatória quando não usar lotes"
        })
    }
    if (!hasBatches && (data.ticketPrice === null || data.ticketPrice === undefined)) {
        ctx.addIssue({
            code: "custom",
            path: ["ticketPrice"],
            message: "Preço do ingresso é obrigatório quando não usar lotes"
        })
    }
    if (hasBatches && (!data.batches || data.batches.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["batches"],
            message: "Adicione pelo menos um lote"
        })
    }
    if (data.recurrence && data.dates && data.dates.length > 0) {
        ctx.addIssue({
            code: "custom",
            path: ["dates"],
            message: "Não é possível ter recorrência e datas específicas ao mesmo tempo"
        })
    }
    if (!data.recurrence && (!data.dates || data.dates.length === 0)) {
        ctx.addIssue({
            code: "custom",
            path: ["dates"],
            message: "Adicione pelo menos uma data ou configure recorrência"
        })
    }
    if (data.recurrence && data.recurrence.type === "WEEKLY" && (data.recurrence.day === undefined || data.recurrence.day === null)) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "day"],
            message: "Selecione um dia da semana"
        })
    }
    if (data.recurrence && data.recurrence.type === "MONTHLY" && (data.recurrence.day === undefined || data.recurrence.day === null)) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "day"],
            message: "Selecione um dia do mês"
        })
    }
    if (data.recurrence && data.recurrence.type === "DAILY" && !data.recurrence.hourStart) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "hourStart"],
            message: "Horário de início é obrigatório para eventos diários"
        })
    }
    if (data.recurrence && (data.recurrence.type === "WEEKLY" || data.recurrence.type === "MONTHLY") && !data.recurrence.hourStart) {
        ctx.addIssue({
            code: "custom",
            path: ["recurrence", "hourStart"],
            message: "Horário de início é obrigatório"
        })
    }

    if (data.dates && data.dates.length > 0) {
        const datesWithSpecificPrice = data.dates.filter(date => date.hasSpecificPrice === true)
        const datesWithoutSpecificPrice = data.dates.filter(date => date.hasSpecificPrice === false)
        
        if (datesWithSpecificPrice.length > 0 && datesWithoutSpecificPrice.length > 0) {
            datesWithoutSpecificPrice.forEach((date, index) => {
                const dateIndex = data.dates!.findIndex(d => d === date)
                ctx.addIssue({
                    code: "custom",
                    path: ["dates", dateIndex, "hasSpecificPrice"],
                    message: "Se você definir preço específico para uma data, todas as outras datas também devem ter preço específico"
                })
            })
        }
    }

    if (hasBatches && data.batches && data.batches.length > 0) {
        data.batches.forEach((batch, batchIndex) => {
            const hasTicketTypes = batch.ticketTypes && batch.ticketTypes.length > 0
            const hasPrice = batch.price !== null && batch.price !== undefined
            const hasQuantity = batch.quantity !== null && batch.quantity !== undefined && batch.quantity > 0
            const hasSpecificPriceInDates = data.dates && data.dates.length > 0 && data.dates.some(date => date.hasSpecificPrice && date.price !== null && date.price !== undefined)
            const isFreeEvent = data.isFree === true

            if (isFreeEvent) {
                return
            }

            if (!hasTicketTypes && !hasPrice && !hasSpecificPriceInDates) {
                ctx.addIssue({
                    code: "custom",
                    path: ["batches", batchIndex, "price"],
                    message: "Defina um preço para o lote ou associe tipos de ingressos"
                })
            }

            if (!hasTicketTypes && !hasQuantity) {
                ctx.addIssue({
                    code: "custom",
                    path: ["batches", batchIndex, "quantity"],
                    message: "Defina uma quantidade para o lote ou associe tipos de ingressos"
                })
            }

            if (hasTicketTypes && batch.ticketTypes && batch.ticketTypes.length === 0) {
                ctx.addIssue({
                    code: "custom",
                    path: ["batches", batchIndex, "ticketTypes"],
                    message: "Adicione pelo menos um tipo de ingresso ao lote"
                })
            }
        })

        let eventStartDate: string | null = null
        let eventEndDate: string | null = null

        if (data.recurrence) {
            if (data.recurrence.endDate) {
                eventEndDate = data.recurrence.endDate
            }
        } else if (data.dates && data.dates.length > 0) {
            const sortedDates = [...data.dates]
                .map(d => d.date)
                .filter(Boolean)
                .sort()
            
            if (sortedDates.length > 0) {
                eventStartDate = sortedDates[0]
                eventEndDate = sortedDates[sortedDates.length - 1]
            }
        }

        if (eventStartDate) {
            data.batches.forEach((batch, index) => {
                if (batch.startDate) {
                    const batchStartDate = new Date(batch.startDate)
                    const eventStart = new Date(eventStartDate)
                    
                    if (batchStartDate > eventStart) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["batches", index, "startDate"],
                            message: "A data de início do lote não pode ser posterior à primeira data do evento"
                        })
                    }
                }

                if (batch.endDate && eventEndDate) {
                    const batchEndDate = new Date(batch.endDate)
                    const eventEnd = new Date(eventEndDate)
                    
                    if (batchEndDate > eventEnd) {
                        ctx.addIssue({
                            code: "custom",
                            path: ["batches", index, "endDate"],
                            message: "A data de fim do lote não pode ser posterior à última data do evento"
                        })
                    }
                }
            })
        }
    }
})

export {
    EventCreateValidator,
    EventUpdateValidator
}
export type {
    EventCreateValidator as TEventCreateValidator,
    EventUpdateValidator as TEventUpdateValidator
}

