"use client"

import { useState, useMemo, useEffect } from "react"
import { useForm, Controller, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Calendar, MapPin, Ticket, FileText, Repeat, Tag, Sparkles } from "lucide-react"
import { EventUpdateValidator } from "@/validators/Event/EventValidator"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/Input/Input"
import { FieldError } from "@/components/FieldError/FieldError"
import { Background } from "@/components/Background/Background"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { ImageUpload } from "@/components/ImageUpload/ImageUpload"
import { MarkdownEditor } from "@/components/MarkdownEditor/MarkdownEditor"
import { TimePicker } from "@/components/TimePicker/TimePicker"
import { DatePicker } from "@/components/DatePicker/DatePicker"
import { InputCurrency } from "@/components/Input/InputCurrency"
import { MultiSelect } from "@/components/MultiSelect/MultiSelect"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import { useEventFindById } from "@/hooks/Event/useEventFindById"
import { Skeleton } from "@/components/ui/skeleton"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"

type TEventUpdate = z.infer<typeof EventUpdateValidator>

type TRecurrenceDayForm = {
    day: number
    hourStart: string
    hourEnd?: string | null
}

const DESCRIPTION_MAX_LENGTH = 10000

const weekDays = [
    { value: 0, label: "Dom" },
    { value: 1, label: "Seg" },
    { value: 2, label: "Ter" },
    { value: 3, label: "Qua" },
    { value: 4, label: "Qui" },
    { value: 5, label: "Sex" },
    { value: 6, label: "Sáb" }
]

const monthDays = Array.from({ length: 31 }, (_, i) => i + 1)

const parseCurrencyToNumber = (value: string): number => {
    if (!value) return 0
    const cleaned = value
        .replace(/R\$\s?/g, "")
        .replace(/\./g, "")
        .replace(",", ".")
        .trim()
    return parseFloat(cleaned) || 0
}

const formatDateOnly = (date?: string | null) => {
    if (!date) return ""
    return date.split("T")[0] || ""
}

type TAtualizarEventoFormProps = {
    eventId: string
}

const AtualizarEventoForm = ({ eventId }: TAtualizarEventoFormProps) => {
    const [recurrenceEnabled, setRecurrenceEnabled] = useState(false)
    const [useBatches, setUseBatches] = useState(false)
    const [isFormInitialized, setIsFormInitialized] = useState(false)

    const { data: eventData, isLoading: isEventLoading } = useEventFindById(eventId)
    const { data: eventCategoriesData, isLoading: isEventCategoriesLoading } = useEventCategoryFind()

    const eventCategories = useMemo(() => {
        if (eventCategoriesData?.data && Array.isArray(eventCategoriesData.data)) {
            return eventCategoriesData.data
        }
        return []
    }, [eventCategoriesData])

    const form = useForm<TEventUpdate>({
        resolver: zodResolver(EventUpdateValidator),
        defaultValues: {
            name: "",
            description: "",
            categories: [],
            image: null as any,
            location: null,
            useBatches: false,
            tickets: undefined,
            ticketPrice: undefined,
            batches: undefined,
            dates: [
                {
                    date: "",
                    hourStart: "",
                    hourEnd: null
                }
            ],
            recurrence: null,
            isClientTaxed: false
        }
    })

    const { fields: dateFields, append: appendDate, remove: removeDate } = useFieldArray({
        control: form.control,
        name: "dates"
    })

    const { fields: batchFields, append: appendBatch, remove: removeBatch } = useFieldArray({
        control: form.control,
        name: "batches"
    })

    const recurrenceType = form.watch("recurrence.type")
    const recurrenceDaysOfWeek = form.watch("recurrence.daysOfWeek") || []
    const batches = form.watch("batches") || []
    const descriptionLength = form.watch("description")?.length || 0

    const totalTickets = useMemo(() => {
        if (!useBatches || !batches.length) return 0
        return batches.reduce((sum, batch) => sum + (batch.quantity || 0), 0)
    }, [batches, useBatches])

    useEffect(() => {
        if (eventData?.data && !isFormInitialized && eventCategories.length > 0) {
            const event = eventData.data
            
            const hasBatches = !!(event.EventBatch && event.EventBatch.length > 0)
            setUseBatches(hasBatches)
            setRecurrenceEnabled(!!event.Recurrence)

            const sortedEventBatch = hasBatches
                ? [...(event.EventBatch || [])].sort((a, b) => {
                    const dateA = new Date(a.startDate).getTime()
                    const dateB = new Date(b.startDate).getTime()
                    return dateA - dateB
                })
                : []

            const batchesData = hasBatches ? sortedEventBatch.map(batch => ({
                name: batch.name,
                price: batch.price,
                quantity: batch.tickets,
                startDate: formatDateOnly(batch.startDate),
                endDate: formatDateOnly(batch.endDate),
                autoActivateNext: batch.autoActivateNext ?? false,
                accumulateUnsold: batch.accumulateUnsold ?? false
            })) : undefined

            const datesData = event.EventDate && event.EventDate.length > 0 ? event.EventDate.map(eventDate => ({
                date: formatDateOnly(eventDate.date),
                hourStart: eventDate.hourStart || "",
                hourEnd: eventDate.hourEnd
            })) : [
                {
                    date: "",
                    hourStart: "",
                    hourEnd: null
                }
            ]

            const categoryIds = event.EventCategoryEvent?.map(ece => ece.categoryId) || []

            const recurrenceData = event.Recurrence ? {
                type: event.Recurrence.type,
                hourStart: event.Recurrence.hourStart || undefined,
                hourEnd: event.Recurrence.hourEnd || undefined,
                daysOfWeek: event.Recurrence.RecurrenceDay?.map(rd => ({
                    day: rd.day,
                    hourStart: rd.hourStart,
                    hourEnd: rd.hourEnd || undefined
                })) || undefined,
                endDate: event.Recurrence.endDate || undefined
            } : null

            form.reset({
                name: event.name || "",
                description: event.description || "",
                categories: categoryIds,
                image: null as any,
                location: event.location || null,
                useBatches: hasBatches,
                tickets: hasBatches ? undefined : (event.tickets ?? undefined),
                ticketPrice: hasBatches ? undefined : event.price ?? undefined,
                batches: batchesData,
                dates: datesData,
                recurrence: recurrenceData,
                isClientTaxed: !!event.isClientTaxed
            })

            setIsFormInitialized(true)
        }
    }, [eventData, isFormInitialized, form, eventCategories])

    const handleSubmit = async (data: TEventUpdate) => {
        console.log("Event update data:", data)
    }

    const addDate = () => {
        appendDate({
            date: "",
            hourStart: "",
            hourEnd: null
        })
    }

    const addBatch = () => {
        appendBatch({
            name: "",
            price: 0,
            quantity: 0,
            startDate: "",
            endDate: null,
            autoActivateNext: false,
            accumulateUnsold: false
        })
    }

    const toggleDayOfWeek = (day: number) => {
        const current = recurrenceDaysOfWeek as TRecurrenceDayForm[] || []
        const existingIndex = current.findIndex(d => d.day === day)
        
        if (existingIndex >= 0) {
            const newDays = current.filter((_, index) => index !== existingIndex)
            form.setValue("recurrence.daysOfWeek", newDays)
        } else {
            const newDays = [...current, {
                day,
                hourStart: "",
                hourEnd: null
            }]
            form.setValue("recurrence.daysOfWeek", newDays)
        }
    }

    const toggleMonthDay = (day: number) => {
        const current = recurrenceDaysOfWeek as TRecurrenceDayForm[] || []
        const existingIndex = current.findIndex(d => d.day === day)
        
        if (existingIndex >= 0) {
            const newDays = current.filter((_, index) => index !== existingIndex)
            form.setValue("recurrence.daysOfWeek", newDays)
        } else {
            const newDays = [...current, {
                day,
                hourStart: "",
                hourEnd: null
            }]
            form.setValue("recurrence.daysOfWeek", newDays)
        }
    }

    const updateDayTime = (day: number, hourStart: string, hourEnd: string | null) => {
        const current = recurrenceDaysOfWeek as TRecurrenceDayForm[] || []
        const newDays = current.map(d => 
            d.day === day ? { ...d, hourStart, hourEnd } : d
        )
        form.setValue("recurrence.daysOfWeek", newDays)
    }

    const getDayTime = (day: number) => {
        const current = recurrenceDaysOfWeek as TRecurrenceDayForm[] || []
        const dayData = current.find(d => d.day === day)
        return dayData || { hourStart: "", hourEnd: null }
    }

    if (isEventLoading) {
        return (
            <Background variant="light">
                <div className="min-h-screen pt-32 pb-16 px-4
                sm:px-6
                lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <Skeleton className="h-12 w-64 mb-4" />
                        <Skeleton className="h-8 w-96 mb-8" />
                        <div className="space-y-8">
                            <Skeleton className="h-96 w-full" />
                            <Skeleton className="h-96 w-full" />
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    if (!eventData?.data) {
        return (
            <Background variant="light">
                <div className="min-h-screen pt-32 pb-16 px-4
                sm:px-6
                lg:px-8">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center">
                            <p className="text-psi-dark/60">Evento não encontrado</p>
                            <Link href="/meus-eventos">
                                <Button variant="outline" className="mt-4">
                                    Voltar para meus eventos
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    return (
        <Background variant="light">
            <div className="min-h-screen pt-32 pb-16 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Link
                            href="/meus-eventos"
                            className="inline-flex items-center gap-2 text-psi-dark/70 hover:text-psi-dark transition-colors mb-4"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            <span>Voltar para meus eventos</span>
                        </Link>
                        <h1 className="text-4xl
                        sm:text-5xl font-bold text-psi-primary mb-2">
                            Atualizar Evento
                        </h1>
                        <p className="text-base
                        sm:text-lg text-psi-dark/60">
                            Edite as informações do seu evento
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-bold text-psi-dark">Informações Básicas</h2>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="name" className="block text-sm font-medium text-psi-dark">
                                            Nome do Evento *
                                        </label>
                                        <span className="text-xs text-psi-dark/60">
                                            {form.watch("name")?.length || 0}/160
                                        </span>
                                    </div>
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="name"
                                                placeholder="Ex: Festival de Verão"
                                                required
                                                maxLength={160}
                                                className="w-full"
                                            />
                                        )}
                                    />
                                    <FieldError message={form.formState.errors.name?.message || ""} />
                                </div>

                                <div>
                                    <div className="flex items-center justify-between mb-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-psi-dark">
                                            Descrição *
                                        </label>
                                        <span className="text-xs text-psi-dark/60">
                                            {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
                                        </span>
                                    </div>
                                    <Controller
                                        name="description"
                                        control={form.control}
                                        render={({ field }) => (
                                            <MarkdownEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                                placeholder="Descreva seu evento... (Markdown suportado)"
                                                required
                                                maxLength={DESCRIPTION_MAX_LENGTH}
                                            />
                                        )}
                                    />
                                    <FieldError message={form.formState.errors.description?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="categories" className="block text-sm font-medium text-psi-dark mb-2">
                                        Categorias * <span className="text-xs font-normal text-psi-dark/60">(1 a 5 categorias)</span>
                                    </label>
                                    <Controller
                                        name="categories"
                                        control={form.control}
                                        render={({ field }) => (
                                            <MultiSelect
                                                options={eventCategories.map((category) => ({ value: category.id, label: category.name }))}
                                                value={field.value || []}
                                                onChange={field.onChange}
                                                placeholder="Selecione as categorias..."
                                                minSelections={1}
                                                maxSelections={5}
                                                required
                                            />
                                        )}
                                    />
                                    <FieldError message={form.formState.errors.categories?.message || ""} />
                                </div>

                                <div >
                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                        Imagem do Evento
                                    </label>
                                    <Controller
                                        name="image"
                                        control={form.control}
                                        render={({ field }) => (
                                            <ImageUpload
                                                value={field.value || eventData?.data?.image}
                                                onChange={field.onChange}
                                                error={form.formState.errors.image?.message}
                                            />
                                        )}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-psi-dark mb-2">
                                        Localização
                                    </label>
                                    <Controller
                                        name="location"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="location"
                                                placeholder="Ex: Centro de Cultura"
                                                icon={MapPin}
                                                className="w-full"
                                                value={field.value ?? ""}
                                            />
                                        )}
                                    />
                                    <FieldError message={form.formState.errors.location?.message || ""} />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Tag className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-bold text-psi-dark">Ingressos</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="use-batches"
                                        checked={useBatches}
                                        onCheckedChange={(checked) => {
                                            const isChecked = checked === true
                                            setUseBatches(isChecked)
                                            form.setValue("useBatches", isChecked)
                                            if (!isChecked) {
                                                form.setValue("batches", undefined)
                                            } else {
                                                form.setValue("tickets", undefined)
                                                form.setValue("ticketPrice", undefined)
                                                if (!batchFields.length) {
                                                    addBatch()
                                                }
                                            }
                                        }}
                                    />
                                    <label htmlFor="use-batches" className="text-sm font-medium text-psi-dark cursor-pointer">
                                        Usar lotes de ingressos
                                    </label>
                                </div>

                                <Controller
                                    name="isClientTaxed"
                                    control={form.control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-3 rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4">
                                            <Checkbox
                                                id="is-client-taxed"
                                                checked={field.value || false}
                                                onCheckedChange={(checked) => field.onChange(checked === true)}
                                            />
                                            <div>
                                                <label htmlFor="is-client-taxed" className="text-sm font-medium text-psi-dark cursor-pointer">
                                                    Repassar taxas ao cliente
                                                </label>
                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                    Quando ativado, a taxa de serviço é adicionada ao valor pago pelo comprador.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                />
                                <FieldError message={form.formState.errors.isClientTaxed?.message || ""} />

                                {!useBatches ? (
                                    <div className="grid grid-cols-1
                                    sm:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="tickets" className="block text-sm font-medium text-psi-dark mb-2">
                                                Quantidade de Ingressos *
                                            </label>
                                            <Controller
                                                name="tickets"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        id="tickets"
                                                        type="number"
                                                        placeholder="100"
                                                        icon={Ticket}
                                                        required
                                                        className="w-full"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.tickets?.message || ""} />
                                        </div>
                                        <div>
                                            <label htmlFor="ticketPrice" className="block text-sm font-medium text-psi-dark mb-2">
                                                Preço do Ingresso *
                                            </label>
                                            <Controller
                                                name="ticketPrice"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <InputCurrency
                                                        value={field.value || 0}
                                                        onChangeValue={(value) => {
                                                            if (!value || value === "") {
                                                                field.onChange(0)
                                                            } else {
                                                                const numValue = parseCurrencyToNumber(value)
                                                                field.onChange(numValue)
                                                            }
                                                        }}
                                                        required
                                                        className="w-full"
                                                    />
                                                )}
                                            />
                                            <FieldError message={form.formState.errors.ticketPrice?.message || ""} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-semibold text-psi-dark">Lotes</h3>
                                                {totalTickets > 0 && (
                                                    <p className="text-sm text-psi-dark/60 mt-1">
                                                        Total de ingressos: <span className="font-semibold text-psi-primary">{totalTickets}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={addBatch}
                                            >
                                                <Plus className="h-4 w-4 mr-2" />
                                                Adicionar Lote
                                            </Button>
                                        </div>

                                        {batchFields.map((field, index) => {
                                            const hasNextBatch = index < batchFields.length - 1
                                            const batch = eventData?.data?.EventBatch?.find((b, i, arr) => {
                                                const sortedEventBatch = [...arr].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                                                return sortedEventBatch[index]?.id === b.id
                                            })
                                            const isActiveBatch = batch?.isActive
                                            return (
                                                <div
                                                    key={field.id}
                                                    className={cn(
                                                        "rounded-xl border p-4 space-y-4",
                                                        isActiveBatch
                                                            ? "border-psi-primary bg-psi-primary/5 shadow-inner shadow-psi-primary/20"
                                                            : "border-[#E4E6F0] bg-[#F3F4FB]"
                                                    )}
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-psi-dark">
                                                            Lote {index + 1}
                                                            {isActiveBatch && (
                                                                <span className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-psi-primary">
                                                                    <Sparkles className="h-3 w-3" />
                                                                    Lote atual
                                                                </span>
                                                            )}
                                                        </span>
                                                        {batchFields.length > 1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeBatch(index)}
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
                                                            Nome do Lote *
                                                        </label>
                                                        <Controller
                                                            name={`batches.${index}.name`}
                                                            control={form.control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    placeholder="Ex: 1º Lote"
                                                                    required
                                                                    className="w-full"
                                                                />
                                                            )}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Preço *
                                                        </label>
                                                        <Controller
                                                            name={`batches.${index}.price`}
                                                            control={form.control}
                                                            render={({ field }) => (
                                                                <InputCurrency
                                                                    {...field}
                                                                    value={ValueUtils.centsToCurrency(Number(field.value)) || 0}
                                                                    required
                                                                    className="w-full"
                                                                />
                                                            )}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Quantidade *
                                                        </label>
                                                        <Controller
                                                            name={`batches.${index}.quantity`}
                                                            control={form.control}
                                                            render={({ field }) => (
                                                                <Input
                                                                    {...field}
                                                                    type="number"
                                                                    placeholder="100"
                                                                    required
                                                                    className="w-full"
                                                                    value={field.value || ""}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                                />
                                                            )}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Data Início *
                                                        </label>
                                                        <Controller
                                                            name={`batches.${index}.startDate`}
                                                            control={form.control}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    value={field.value || ""}
                                                                    onChange={(value) => field.onChange(value || "")}
                                                                    required
                                                                    minDate={new Date().toISOString().split("T")[0]}
                                                                />
                                                            )}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Data Fim
                                                        </label>
                                                        <Controller
                                                            name={`batches.${index}.endDate`}
                                                            control={form.control}
                                                            render={({ field }) => (
                                                                <DatePicker
                                                                    value={field.value || ""}
                                                                    onChange={(value) => field.onChange(value)}
                                                                    minDate={form.watch(`batches.${index}.startDate`) || new Date().toISOString().split("T")[0]}
                                                                />
                                                            )}
                                                        />
                                                    </div>
                                                </div>

                                                {hasNextBatch && (
                                                    <div className="rounded-lg border border-[#E4E6F0] bg-white p-4 space-y-3 mt-4">
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                id={`auto-activate-${index}`}
                                                                checked={form.watch(`batches.${index}.autoActivateNext`) || false}
                                                                onCheckedChange={(checked) => {
                                                                    form.setValue(`batches.${index}.autoActivateNext`, checked === true)
                                                                }}
                                                            />
                                                            <label htmlFor={`auto-activate-${index}`} className="text-sm font-medium text-psi-dark cursor-pointer">
                                                                Ativar próximo lote automaticamente quando todos os ingressos deste lote forem vendidos
                                                            </label>
                                                        </div>
                                                        <div className="flex items-center gap-3">
                                                            <Checkbox
                                                                id={`accumulate-${index}`}
                                                                checked={form.watch(`batches.${index}.accumulateUnsold`) || false}
                                                                onCheckedChange={(checked) => {
                                                                    form.setValue(`batches.${index}.accumulateUnsold`, checked === true)
                                                                }}
                                                            />
                                                            <label htmlFor={`accumulate-${index}`} className="text-sm font-medium text-psi-dark cursor-pointer">
                                                                Acumular ingressos não vendidos para o próximo lote
                                                            </label>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                        })}
                                        <FieldError message={form.formState.errors.batches?.message || ""} />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="rounded-2xl border z-0 border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Repeat className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-bold text-psi-dark">Recorrência (Opcional)</h2>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <Checkbox
                                        id="recurrence-enabled"
                                        checked={recurrenceEnabled}
                                        onCheckedChange={(checked) => {
                                            const isChecked = checked === true
                                            setRecurrenceEnabled(isChecked)
                                            if (!isChecked) {
                                                form.setValue("recurrence", null)
                                            } else {
                                                form.setValue("recurrence", {
                                                    type: "WEEKLY",
                                                    daysOfWeek: [],
                                                    endDate: null
                                                })
                                            }
                                        }}
                                    />
                                    <label htmlFor="recurrence-enabled" className="text-sm font-medium text-psi-dark cursor-pointer">
                                        Este evento é recorrente
                                    </label>
                                </div>

                                {recurrenceEnabled && (
                                    <div className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                Tipo de Recorrência *
                                            </label>
                                            <Controller
                                                name="recurrence.type"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <select
                                                        {...field}
                                                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                    >
                                                        <option value="DAILY">Diário</option>
                                                        <option value="WEEKLY">Semanal</option>
                                                        <option value="MONTHLY">Mensal</option>
                                                    </select>
                                                )}
                                            />
                                        </div>

                                        {recurrenceType === "DAILY" && (
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                    Horário *
                                                </label>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs text-psi-dark/60 mb-1">Início</label>
                                                        <TimePicker
                                                            value={form.watch("recurrence.hourStart") || ""}
                                                            onChange={(value) => {
                                                                const current = form.getValues("recurrence")
                                                                if (current) {
                                                                    form.setValue("recurrence.hourStart", value || "", { shouldValidate: true })
                                                                }
                                                            }}
                                                            required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-psi-dark/60 mb-1">Fim</label>
                                                        <TimePicker
                                                            value={form.watch("recurrence.hourEnd") || ""}
                                                            onChange={(value) => {
                                                                const current = form.getValues("recurrence")
                                                                if (current) {
                                                                    form.setValue("recurrence.hourEnd", value, { shouldValidate: true })
                                                                }
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {recurrenceType === "WEEKLY" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                        Dias da Semana *
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {weekDays.map((day) => {
                                                            const isSelected = recurrenceDaysOfWeek.some((d: TRecurrenceDayForm) => d.day === day.value)
                                                            return (
                                                                <Button
                                                                    key={day.value}
                                                                    type="button"
                                                                    variant={isSelected ? "primary" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => toggleDayOfWeek(day.value)}
                                                                >
                                                                    {day.label}
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                    <FieldError message={form.formState.errors.recurrence?.daysOfWeek?.message || ""} />
                                                </div>

                                                {recurrenceDaysOfWeek.length > 0 && (
                                                    <div className="space-y-3 pt-3 border-t border-[#E4E6F0]">
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Horários por Dia *
                                                        </label>
                                                        {recurrenceDaysOfWeek.map((dayData: TRecurrenceDayForm) => {
                                                            const dayLabel = weekDays.find(d => d.value === dayData.day)?.label || ""
                                                            const dayTime = getDayTime(dayData.day)
                                                            return (
                                                                <div key={dayData.day} className="rounded-lg border border-[#E4E6F0] bg-white p-3 space-y-3">
                                                                    <div className="font-semibold text-sm text-psi-dark">{dayLabel}</div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="block text-xs text-psi-dark/60 mb-1">Início</label>
                                                                            <TimePicker
                                                                                value={dayTime.hourStart}
                                                                                onChange={(value) => updateDayTime(dayData.day, value || "", null)}
                                                                                required
                                                                                icon={false}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs text-psi-dark/60 mb-1">Fim</label>
                                                                            <TimePicker
                                                                                value={dayTime.hourEnd || ""}
                                                                                onChange={(value) => {
                                                                                    const current = getDayTime(dayData.day)
                                                                                    updateDayTime(dayData.day, current.hourStart, value)
                                                                                }}
                                                                                icon={false}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {recurrenceType === "MONTHLY" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                        Dias do Mês *
                                                    </label>
                                                    <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
                                                        {monthDays.map((day) => {
                                                            const isSelected = recurrenceDaysOfWeek.some((d: TRecurrenceDayForm) => d.day === day)
                                                            return (
                                                                <Button
                                                                    key={day}
                                                                    type="button"
                                                                    variant={isSelected ? "primary" : "outline"}
                                                                    size="sm"
                                                                    onClick={() => toggleMonthDay(day)}
                                                                    className="min-w-[40px]"
                                                                >
                                                                    {day}
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                    <FieldError message={form.formState.errors.recurrence?.daysOfWeek?.message || ""} />
                                                </div>

                                                {recurrenceDaysOfWeek.length > 0 && (
                                                    <div className="space-y-3 pt-3 border-t border-[#E4E6F0]">
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Horários por Dia *
                                                        </label>
                                                        {recurrenceDaysOfWeek.map((dayData: TRecurrenceDayForm) => {
                                                            const dayTime = getDayTime(dayData.day)
    return (
                                                                <div key={dayData.day} className="rounded-lg border border-[#E4E6F0] bg-white p-3 space-y-3">
                                                                    <div className="font-semibold text-sm text-psi-dark">Dia {dayData.day}</div>
                                                                    <div className="grid grid-cols-2 gap-4">
                                                                        <div>
                                                                            <label className="block text-xs text-psi-dark/60 mb-1">Início</label>
                                                                            <TimePicker
                                                                                value={dayTime.hourStart}
                                                                                onChange={(value) => updateDayTime(dayData.day, value || "", null)}
                                                                                required
                                                                                icon={false}
                                                                            />
                                                                        </div>
                                                                        <div>
                                                                            <label className="block text-xs text-psi-dark/60 mb-1">Fim</label>
                                                                            <TimePicker
                                                                                value={dayTime.hourEnd || ""}
                                                                                onChange={(value) => {
                                                                                    const current = getDayTime(dayData.day)
                                                                                    updateDayTime(dayData.day, current.hourStart, value)
                                                                                }}
                                                                                icon={false}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )
                                                        })}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                Data de Término (Opcional)
                                            </label>
                                            <Controller
                                                name="recurrence.endDate"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <DatePicker
                                                        value={field.value || ""}
                                                        onChange={(value) => field.onChange(value)}
                                                        minDate={new Date().toISOString().split("T")[0]}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!recurrenceEnabled && (
                            <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                            sm:p-8 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-psi-primary" />
                                        <h2 className="text-2xl font-bold text-psi-dark">Datas e Horários</h2>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addDate}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Data
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {dateFields.map((field, index) => (
                                        <div
                                            key={field.id}
                                            className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4 space-y-4"
                                        >
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-psi-dark">
                                                    Data {index + 1}
                                                </span>
                                                {dateFields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeDate(index)}
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
                                    <FieldError message={form.formState.errors.dates?.message || ""} />
                                </div>
                            </div>
                        )}

                        <div className="flex items-center justify-end gap-4 pt-4">
                            <Button
                                type="button"
                                variant="ghost"
                                asChild
                            >
                                <Link href="/meus-eventos">
                                    Cancelar
                                </Link>
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? (
                                    <LoadingButton message="Atualizando evento..." />
                                ) : (
                                    "Atualizar Evento"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Background>
    )
}

export {
    AtualizarEventoForm
}
