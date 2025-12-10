"use client"

import { useState, useEffect } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import { TimePicker } from "@/components/TimePicker/TimePicker"
import { FieldError } from "@/components/FieldError/FieldError"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useEventUpdate } from "@/hooks/Event/useEventUpdate"
import { Toast } from "@/components/Toast/Toast"
import type { TEvent } from "@/types/Event/TEvent"
import { z } from "zod"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"

const EventDateValidator = z.object({
    id: z.string().nullable().optional(),
    date: z.string({ error: DefaultFormErrors.required }),
    hourStart: z.string({ error: DefaultFormErrors.required }),
    hourEnd: z.string().nullable().optional()
})

const ChangeDateValidator = z.object({
    dates: z.array(EventDateValidator).min(1, { error: "Adicione pelo menos uma data" })
})

type TChangeDateForm = z.infer<typeof ChangeDateValidator>

type TDialogAdminChangeDateProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    event: TEvent | null
    onSuccess?: () => void
}

const DialogAdminChangeDate = ({
    open,
    onOpenChange,
    event,
    onSuccess
}: TDialogAdminChangeDateProps) => {
    const eventId = event?.id || "temp"
    const { mutateAsync: updateEvent, isPending } = useEventUpdate(eventId, true)

    const form = useForm<TChangeDateForm>({
        resolver: zodResolver(ChangeDateValidator),
        defaultValues: {
            dates: []
        }
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "dates"
    })

    useEffect(() => {
        if (event && event.EventDates && open) {
            const initialDates = event.EventDates.map(eventDate => ({
                id: eventDate.id || null,
                date: eventDate.date || "",
                hourStart: eventDate.hourStart || "",
                hourEnd: eventDate.hourEnd || null
            }))
            form.reset({ dates: initialDates })
        }
    }, [event, open, form])

    const handleSubmit = async (data: TChangeDateForm) => {
        if (!event?.id || !eventId) return

        try {
            const updateData = {
                dates: data.dates.map(date => ({
                    id: date.id,
                    date: date.date,
                    hourStart: date.hourStart,
                    hourEnd: date.hourEnd || null,
                    hasSpecificPrice: false,
                    price: null,
                    ticketTypePrices: null
                }))
            }

            const response = await updateEvent(updateData as any)

            if (response?.success) {
                Toast.success("Datas e horários atualizados com sucesso!")
                onOpenChange(false)
                if (onSuccess) {
                    onSuccess()
                }
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Erro ao atualizar datas e horários."
            Toast.error(errorMessage)
        }
    }

    const handleCancel = () => {
        form.reset()
        onOpenChange(false)
    }

    if (!event) return null

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-psi-primary" />
                        Alterar Datas e Horários
                    </DialogTitle>
                    <DialogDescription>
                        Edite as datas e horários do evento: {event.name}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                    <div className="space-y-4 py-4">
                        {fields.map((field, index) => (
                            <div
                                key={field.id}
                                className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4 space-y-4"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-semibold text-psi-dark">
                                        Data {index + 1}
                                    </span>
                                    {fields.length > 1 && (
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => remove(index)}
                                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>

                                <div className="grid grid-cols-1
                                sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Data *
                                        </label>
                                        <Controller
                                            name={`dates.${index}.date`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <DatePicker
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value || "")}
                                                    required
                                                    minDate={new Date().toISOString().split("T")[0]}
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.dates?.[index]?.date?.message || ""} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Horário Início *
                                        </label>
                                        <Controller
                                            name={`dates.${index}.hourStart`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <TimePicker
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                    required
                                                />
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.dates?.[index]?.hourStart?.message || ""} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Horário Fim
                                        </label>
                                        <Controller
                                            name={`dates.${index}.hourEnd`}
                                            control={form.control}
                                            render={({ field }) => (
                                                <TimePicker
                                                    value={field.value || ""}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => append({
                                id: null,
                                date: "",
                                hourStart: "",
                                hourEnd: null
                            })}
                            className="w-full"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Data
                        </Button>

                        <FieldError message={form.formState.errors.dates?.message || ""} />
                    </div>

                    <DialogFooter className="gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            disabled={isPending}
                        >
                            Cancelar
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <LoadingButton />
                            ) : (
                                "Confirmar"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogAdminChangeDate
}

