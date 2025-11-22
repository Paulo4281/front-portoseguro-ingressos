"use client"

import { useState, useMemo } from "react"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Calendar, MapPin, Ticket, FileText, Repeat, Tag, Sparkles } from "lucide-react"
import { EventCreateValidator } from "@/validators/Event/EventValidator"
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { z } from "zod"
import { cn } from "@/lib/utils"
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import { useEventCreate } from "@/hooks/Event/useEventCreate"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { DialogTaxes } from "@/components/Dialog/DialogTaxes/DialogTaxes"

type TEventCreate = z.infer<typeof EventCreateValidator>

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

const CriarEventoForm = () => {
    const [recurrenceEnabled, setRecurrenceEnabled] = useState(false)
    const router = useRouter()

    const { data: eventCategoriesData, isLoading: isEventCategoriesLoading } = useEventCategoryFind()
    const { mutateAsync: createEvent, isPending: isCreating } = useEventCreate()

    const eventCategories = useMemo(() => {
        if (eventCategoriesData?.data && Array.isArray(eventCategoriesData.data)) {
            return eventCategoriesData.data
        }
        return []
    }, [eventCategoriesData])

    const form = useForm<TEventCreate>({
        resolver: zodResolver(EventCreateValidator),
        defaultValues: {
            name: "",
            description: "",
            categories: [],
            image: null as any,
            location: null,
            tickets: undefined,
            ticketPrice: undefined,
            ticketTypes: undefined,
            batches: [
                {
                    name: "",
                    price: undefined,
                    quantity: undefined,
                    startDate: "",
                    endDate: null,
                    autoActivateNext: false,
                    accumulateUnsold: false,
                    ticketTypes: []
                }
            ],
            dates: [
                {
                    date: "",
                    hourStart: "",
                    hourEnd: null,
                    hasSpecificPrice: false,
                    price: null,
                    ticketTypePrices: null
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

    const { fields: ticketTypeFields, append: appendTicketType, remove: removeTicketType } = useFieldArray({
        control: form.control,
        name: "ticketTypes"
    })

    const recurrenceType = form.watch("recurrence.type")
    const recurrenceDaysOfWeek = form.watch("recurrence.daysOfWeek") || []
    const batches = form.watch("batches") || []
    const descriptionLength = form.watch("description")?.length || 0

    const ticketTypes = form.watch("ticketTypes") || []

    const watchedBatches = useWatch({
        control: form.control,
        name: "batches"
    }) || []

    const totalTickets = useMemo(() => {
        if (!watchedBatches || !watchedBatches.length) return 0
        return watchedBatches.reduce((sum, batch) => {
            if (batch.ticketTypes && batch.ticketTypes.length > 0) {
                return sum + batch.ticketTypes.reduce((typeSum, type) => typeSum + (type.amount || 0), 0)
            }
            return sum + (batch.quantity || 0)
        }, 0)
    }, [watchedBatches])

    const handleSubmit = async (data: TEventCreate) => {
        try {
            const hasBatches = data.batches && data.batches.length > 0
            const hasTicketTypes = data.ticketTypes && data.ticketTypes.length > 0
            
            const batchesWithTicketTypes = hasBatches && data.batches 
                ? data.batches.some(batch => batch.ticketTypes && batch.ticketTypes.length > 0)
                : false
            
            if (batchesWithTicketTypes && !hasTicketTypes) {
                console.error("Erro: Há batches com ticketTypes mas não há ticketTypes no nível do evento")
                return
            }
            
            const submitData: TEventCreate = {
                name: data.name,
                description: data.description,
                categories: data.categories.map((category) => category),
                image: data.image,
                location: data.location,
                tickets: undefined,
                ticketPrice: undefined,
                ticketTypes: hasTicketTypes ? data.ticketTypes : undefined,
                batches: hasBatches && data.batches ? data.batches.map(batch => ({
                    ...batch,
                    price: batch.price ? Math.round(batch.price * 100) : null,
                    ticketTypes: batch.ticketTypes ? batch.ticketTypes.map(type => ({
                        ...type,
                        price: type.price ? Math.round(type.price * 100) : null
                    })) : undefined
                })) : undefined,
                dates: data.recurrence ? undefined : (data.dates ? data.dates.map(date => ({
                    ...date,
                    price: date.hasSpecificPrice && date.price ? Math.round(date.price * 100) : null,
                    ticketTypePrices: date.hasSpecificPrice && date.ticketTypePrices ? date.ticketTypePrices.map(ttp => ({
                        ...ttp,
                        price: Math.round(ttp.price * 100)
                    })) : null
                })) : undefined),
                recurrence: data.recurrence || null,
                isClientTaxed: data.isClientTaxed || false
            }

            if (batchesWithTicketTypes && !submitData.ticketTypes) {
                console.error("Erro: ticketTypes não está sendo enviado mesmo com batches que usam ticketTypes")
                console.log("data.ticketTypes:", data.ticketTypes)
                console.log("submitData:", submitData)
                return
            }

            console.log(submitData)

            // console.log("Dados enviados:", JSON.stringify(submitData, null, 2))
            // console.log("ticketTypes no nível do evento:", submitData.ticketTypes)

            await createEvent(submitData)
            // router.push("/meus-eventos")
        } catch (error) {
            console.error("Erro ao criar evento:", error)
        }
    }

    const addDate = () => {
        appendDate({
            date: "",
            hourStart: "",
            hourEnd: null,
            hasSpecificPrice: false,
            price: null,
            ticketTypePrices: null
        })
    }

    const addBatch = () => {
        appendBatch({
            name: "",
            price: undefined,
            quantity: undefined,
            startDate: "",
            endDate: null,
            autoActivateNext: false,
            accumulateUnsold: false,
            ticketTypes: []
        })
    }


    const addTicketType = () => {
        appendTicketType({
            name: "",
            description: null
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
                            Criar Novo Evento
                        </h1>
                        <p className="text-base
                        sm:text-lg text-psi-dark/60">
                            Preencha as informações do seu evento
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
                                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                                        <label htmlFor="description" className="block text-sm font-medium text-psi-dark">
                                            Descrição *
                                        </label>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-psi-dark/60">
                                                {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="text-xs"
                                            >
                                                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                                                Escrever com IA
                                            </Button>
                                        </div>
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

                                <div >
                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                        Imagem do Evento *
                                    </label>
                                    <Controller
                                        name="image"
                                        control={form.control}
                                        render={({ field }) => (
                                            <ImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                error={form.formState.errors.image?.message}
                                                
                                            />
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Tag className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-bold text-psi-dark">Tipos de Ingressos (Opcional)</h2>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-psi-dark/60">
                                    Crie tipos de ingressos para seu evento (ex: VIP, Meia, Inteira). Se não criar tipos, você pode definir um preço único por lote.
                                </p>

                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold text-psi-dark">Tipos</h3>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={addTicketType}
                                    >
                                        <Plus className="h-4 w-4 mr-2" />
                                        Adicionar Tipo
                                    </Button>
                                </div>

                                {ticketTypeFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-psi-dark">
                                                Tipo {index + 1}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeTicketType(index)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="grid grid-cols-1
                                        sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                    Nome do Tipo *
                                                </label>
                                                <Controller
                                                    name={`ticketTypes.${index}.name`}
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Ex: VIP, Meia, Inteira"
                                                            required
                                                            className="w-full"
                                                        />
                                                    )}
                                                />
                                                <FieldError message={form.formState.errors.ticketTypes?.[index]?.name?.message || ""} />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                    Descrição (Opcional)
                                                </label>
                                                <Controller
                                                    name={`ticketTypes.${index}.description`}
                                                    control={form.control}
                                                    render={({ field }) => (
                                                        <Input
                                                            {...field}
                                                            placeholder="Ex: Acesso VIP com área exclusiva"
                                                            className="w-full"
                                                            value={field.value || ""}
                                                        />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Tag className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-bold text-psi-dark">Ingressos</h2>
                            </div>

                            <div className="space-y-4">
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
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <label htmlFor="is-client-taxed" className="text-sm font-medium text-psi-dark cursor-pointer">
                                                        Repassar taxas ao cliente
                                                    </label>
                                                    <DialogTaxes
                                                        trigger={
                                                            <button
                                                                type="button"
                                                                className="text-xs text-psi-primary hover:text-psi-primary/80 underline"
                                                            >
                                                                Entenda nossas taxas
                                                            </button>
                                                        }
                                                    />
                                                </div>
                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                    Quando ativado, a taxa de serviço é adicionada ao valor pago pelo comprador.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                />
                                <FieldError message={form.formState.errors.isClientTaxed?.message || ""} />

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
                                            return (
                                                <div
                                                    key={field.id}
                                                    className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4 space-y-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-semibold text-psi-dark">
                                                            Lote {index + 1}
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
                                                        {batchFields.length === 1 && (
                                                            <span className="text-xs text-psi-dark/60">
                                                                Mínimo de 1 lote
                                                            </span>
                                                        )}
                                                    </div>

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

                                                    {ticketTypes.length === 0 ? (
                                                        <div className="grid grid-cols-1
                                                        sm:grid-cols-2 gap-4">
                                                            <div>
                                                                <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                                    Preço *
                                                                </label>
                                                                <Controller
                                                                    name={`batches.${index}.price`}
                                                                    control={form.control}
                                                                    render={({ field }) => (
                                                                        <InputCurrency
                                                                            value={field.value || 0}
                                                                            onChangeValue={(value) => {
                                                                                if (!value || value === "") {
                                                                                    field.onChange(undefined)
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
                                                                <FieldError message={form.formState.errors.batches?.[index]?.price?.message || ""} />
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
                                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || undefined)}
                                                                        />
                                                                    )}
                                                                />
                                                                <FieldError message={form.formState.errors.batches?.[index]?.quantity?.message || ""} />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            <div className="flex items-center justify-between">
                                                                <label className="block text-sm font-medium text-psi-dark/70">
                                                                    Tipos de Ingressos e Preços
                                                                </label>
                                                                <Select
                                                                    onValueChange={(value) => {
                                                                        const selectedIndex = parseInt(value)
                                                                        if (selectedIndex >= 0 && selectedIndex < ticketTypes.length) {
                                                                            const currentTicketTypes = form.getValues(`batches.${index}.ticketTypes`) || []
                                                                            const selectedType = ticketTypes[selectedIndex]
                                                                            if (!currentTicketTypes.some(ct => ct.ticketTypeId === selectedIndex.toString())) {
                                                                                form.setValue(`batches.${index}.ticketTypes`, [
                                                                                    ...currentTicketTypes,
                                                                                    {
                                                                                        ticketTypeId: selectedIndex.toString(),
                                                                                        price: 0,
                                                                                        amount: 0
                                                                                    }
                                                                                ])
                                                                            }
                                                                        }
                                                                    }}
                                                                    value={undefined}
                                                                >
                                                                    <SelectTrigger className="w-[200px]">
                                                                        <SelectValue placeholder="Selecione um tipo..." />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        {ticketTypes.map((type, typeIdx) => {
                                                                            const currentTicketTypes = form.watch(`batches.${index}.ticketTypes`) || []
                                                                            const isAlreadyAdded = currentTicketTypes.some(ct => ct.ticketTypeId === typeIdx.toString())
                                                                            if (isAlreadyAdded) return null
                                                                            return (
                                                                                <SelectItem key={typeIdx} value={typeIdx.toString()}>
                                                                                    {type.name}
                                                                                </SelectItem>
                                                                            )
                                                                        })}
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>

                                                            {form.watch(`batches.${index}.ticketTypes`)?.map((batchTicketType, typeIndex) => {
                                                                const typeIdx = parseInt(batchTicketType.ticketTypeId)
                                                                const selectedType = ticketTypes[typeIdx]
                                                                
                                                                return (
                                                                    <div key={typeIndex} className="rounded-lg border border-[#E4E6F0] bg-white p-3 space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm font-semibold text-psi-dark">
                                                                                {selectedType?.name || "Tipo não encontrado"}
                                                                            </span>
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    const current = form.getValues(`batches.${index}.ticketTypes`) || []
                                                                                    form.setValue(`batches.${index}.ticketTypes`, current.filter((_, i) => i !== typeIndex))
                                                                                }}
                                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                            >
                                                                                <Trash2 className="h-4 w-4" />
                                                                            </Button>
                                                                        </div>

                                                                        <div className="grid grid-cols-1
                                                                        sm:grid-cols-2 gap-4">
                                                                            <div>
                                                                                <label className="block text-xs text-psi-dark/60 mb-1">Preço *</label>
                                                                                <Controller
                                                                                    name={`batches.${index}.ticketTypes.${typeIndex}.price`}
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
                                                                                <FieldError message={form.formState.errors.batches?.[index]?.ticketTypes?.[typeIndex]?.price?.message || ""} />
                                                                            </div>

                                                                            <div>
                                                                                <label className="block text-xs text-psi-dark/60 mb-1">Quantidade *</label>
                                                                                <Controller
                                                                                    name={`batches.${index}.ticketTypes.${typeIndex}.amount`}
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
                                                                                <FieldError message={form.formState.errors.batches?.[index]?.ticketTypes?.[typeIndex]?.amount?.message || ""} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            }) || []}

                                                            {(!form.watch(`batches.${index}.ticketTypes`) || form.watch(`batches.${index}.ticketTypes`)?.length === 0) && (
                                                                <p className="text-xs text-psi-dark/60">
                                                                    Adicione pelo menos um tipo de ingresso ou defina um preço único acima
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                                Data Início *
                                                            </label>
                                                            <Controller
                                                                name={`batches.${index}.startDate`}
                                                                control={form.control}
                                                                render={({ field }) => {
                                                                    const eventDates = form.watch("dates") || []
                                                                    const recurrence = form.watch("recurrence")
                                                                    
                                                                    let maxDate: string | undefined = undefined
                                                                    
                                                                    if (recurrence) {
                                                                        if (recurrence.endDate) {
                                                                            maxDate = recurrence.endDate
                                                                        }
                                                                    } else if (eventDates.length > 0) {
                                                                        const sortedDates = [...eventDates]
                                                                            .map(d => d.date)
                                                                            .filter(Boolean)
                                                                            .sort()
                                                                        if (sortedDates.length > 0) {
                                                                            maxDate = sortedDates[0]
                                                                        }
                                                                    }
                                                                    
                                                                    return (
                                                                        <>
                                                                            <DatePicker
                                                                                value={field.value || ""}
                                                                                onChange={(value) => field.onChange(value || "")}
                                                                                required
                                                                                minDate={new Date().toISOString().split("T")[0]}
                                                                                maxDate={maxDate}
                                                                            />
                                                                            {maxDate && field.value && new Date(field.value) > new Date(maxDate) && (
                                                                                <p className="text-xs text-destructive mt-1">
                                                                                    A data de início do lote não pode ser posterior à primeira data do evento
                                                                                </p>
                                                                            )}
                                                                        </>
                                                                    )
                                                                }}
                                                            />
                                                            <FieldError message={form.formState.errors.batches?.[index]?.startDate?.message || ""} />
                                                        </div>

                                                        <div>
                                                            <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                                Data Fim
                                                            </label>
                                                            <Controller
                                                                name={`batches.${index}.endDate`}
                                                                control={form.control}
                                                                render={({ field }) => {
                                                                    const eventDates = form.watch("dates") || []
                                                                    const recurrence = form.watch("recurrence")
                                                                    
                                                                    let maxDate: string | undefined = undefined
                                                                    
                                                                    if (recurrence) {
                                                                        if (recurrence.endDate) {
                                                                            maxDate = recurrence.endDate
                                                                        }
                                                                    } else if (eventDates.length > 0) {
                                                                        const sortedDates = [...eventDates]
                                                                            .map(d => d.date)
                                                                            .filter(Boolean)
                                                                            .sort()
                                                                        if (sortedDates.length > 0) {
                                                                            maxDate = sortedDates[sortedDates.length - 1]
                                                                        }
                                                                    }
                                                                    
                                                                    const batchStartDate = form.watch(`batches.${index}.startDate`)
                                                                    const minDate = batchStartDate || new Date().toISOString().split("T")[0]
                                                                    
                                                                    return (
                                                                        <>
                                                                            <DatePicker
                                                                                value={field.value || ""}
                                                                                onChange={(value) => field.onChange(value)}
                                                                                minDate={minDate}
                                                                                maxDate={maxDate}
                                                                            />
                                                                            {maxDate && field.value && new Date(field.value) > new Date(maxDate) && (
                                                                                <p className="text-xs text-destructive mt-1">
                                                                                    A data de fim do lote não pode ser posterior à última data do evento
                                                                                </p>
                                                                            )}
                                                                        </>
                                                                    )
                                                                }}
                                                            />
                                                            <FieldError message={form.formState.errors.batches?.[index]?.endDate?.message || ""} />
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
                                                form.setValue("dates", undefined)
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
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Selecione o tipo..." />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="DAILY">Diário</SelectItem>
                                                            <SelectItem value="WEEKLY">Semanal</SelectItem>
                                                            <SelectItem value="MONTHLY">Mensal</SelectItem>
                                                        </SelectContent>
                                                    </Select>
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

                                            <div className="flex items-center gap-3 rounded-lg border border-[#E4E6F0] bg-[#F3F4FB] p-3">
                                                <Checkbox
                                                    id={`has-specific-price-${index}`}
                                                    checked={form.watch(`dates.${index}.hasSpecificPrice`) || false}
                                                    onCheckedChange={(checked) => {
                                                        const isChecked = checked === true
                                                        form.setValue(`dates.${index}.hasSpecificPrice`, isChecked)
                                                        if (!isChecked) {
                                                            form.setValue(`dates.${index}.price`, null)
                                                            form.setValue(`dates.${index}.ticketTypePrices`, null)
                                                        } else {
                                                            if (ticketTypes.length > 0) {
                                                                const initialPrices = ticketTypes.map((_, typeIdx) => ({
                                                                    ticketTypeId: typeIdx.toString(),
                                                                    price: 0
                                                                }))
                                                                form.setValue(`dates.${index}.ticketTypePrices`, initialPrices)
                                                            } else {
                                                                form.setValue(`dates.${index}.ticketTypePrices`, null)
                                                            }
                                                        }
                                                    }}
                                                />
                                                <label htmlFor={`has-specific-price-${index}`} className="text-sm font-medium text-psi-dark cursor-pointer">
                                                    Definir preço específico para este dia
                                                </label>
                                            </div>

                                            {form.watch(`dates.${index}.hasSpecificPrice`) && (
                                                <div className="space-y-3 rounded-lg border border-[#E4E6F0] bg-white p-3">
                                                    {ticketTypes.length === 0 ? (
                                                        <div>
                                                            <label className="block text-xs text-psi-dark/60 mb-1">Preço para este dia *</label>
                                                            <Controller
                                                                name={`dates.${index}.price`}
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
                                                            <FieldError message={form.formState.errors.dates?.[index]?.price?.message || ""} />
                                                        </div>
                                                    ) : (
                                                        <div className="space-y-3">
                                                            <p className="text-xs text-psi-dark/60 mb-2">Defina o preço para cada tipo de ingresso neste dia:</p>
                                                            {ticketTypes.map((ticketType, typeIdx) => {
                                                                const currentPrices = form.watch(`dates.${index}.ticketTypePrices`) || []
                                                                const priceIndex = currentPrices.findIndex(ttp => ttp.ticketTypeId === typeIdx.toString())
                                                                
                                                                return (
                                                                    <div key={typeIdx} className="flex items-center gap-3">
                                                                        <div className="flex-1">
                                                                            <label className="block text-xs text-psi-dark/60 mb-1">{ticketType.name}</label>
                                                                            {priceIndex >= 0 && (
                                                                                <Controller
                                                                                    name={`dates.${index}.ticketTypePrices.${priceIndex}.price`}
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
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            )}
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
                                disabled={form.formState.isSubmitting || isCreating}
                            >
                                {form.formState.isSubmitting || isCreating ? (
                                    <LoadingButton message="Criando evento..." />
                                ) : (
                                    "Criar Evento"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </Background>
    )
}

export default CriarEventoForm
