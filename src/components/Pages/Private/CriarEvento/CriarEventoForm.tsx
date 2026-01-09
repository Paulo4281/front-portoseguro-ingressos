"use client"

import { useState, useMemo, useEffect } from "react"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2, Calendar, MapPin, Ticket, FileText, Repeat, Tag, Sparkles, Rocket, HelpCircle, Megaphone, CheckCircle2, ExternalLink, AlertCircle, X, CreditCard, Info, Users } from "lucide-react"
import { EventCreateValidator } from "@/validators/Event/EventValidator"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/Input/Input"
import { FieldError } from "@/components/FieldError/FieldError"
import { Background } from "@/components/Background/Background"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { ImageUpload } from "@/components/ImageUpload/ImageUpload"
import { FileUpload } from "@/components/FileUpload/FileUpload"
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
import { useAICreateEventDescription } from "@/hooks/AI/useAICreateEventDescription"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { Toast } from "@/components/Toast/Toast"
import { DialogTaxes } from "@/components/Dialog/DialogTaxes/DialogTaxes"
import { FormBuilder, type TFormField } from "@/components/FormBuilder/FormBuilder"
import { DialogEventSummary } from "@/components/Dialog/DialogEventSummary/DialogEventSummary"
import { DialogMarkdownInstructions } from "@/components/Dialog/DialogMarkdownInstructions/DialogMarkdownInstructions"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

type TEventCreate = z.infer<typeof EventCreateValidator>


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

const transformFormFieldsToJSON = (fields: TFormField[]): any => {
    if (!fields || fields.length === 0) {
        return undefined
    }

    const result: any = {
        text: [],
        number: [],
        email: [],
        phone: [],
        textArea: [],
        select: [],
        multiSelect: []
    }

    fields.forEach((field, index) => {
        const fieldData: any = {
            label: field.label,
            required: field.required,
            order: index
        }

        if (field.placeholder) {
            fieldData.placeholder = field.placeholder
        }

        if (field.type === "select" || field.type === "checkbox") {
            if (field.options && field.options.length > 0) {
                fieldData.options = field.options.map(opt => opt.label).filter(label => label.trim() !== "")
            }
        }

        switch (field.type) {
            case "text":
                if (field.mask) {
                    fieldData.mask = field.mask
                }
                result.text.push(fieldData)
                break
            case "email":
                result.email.push(fieldData)
                break
            case "textarea":
                result.textArea.push(fieldData)
                break
            case "select":
                result.select.push(fieldData)
                break
            case "checkbox":
                result.multiSelect.push(fieldData)
                break
        }
    })

    const hasAnyFields = Object.values(result).some((arr: any) => arr.length > 0)
    return hasAnyFields ? result : undefined
}

const CriarEventoForm = () => {
    const [recurrenceEnabled, setRecurrenceEnabled] = useState(false)
    const [formFields, setFormFields] = useState<TFormField[]>([])
    const [isFormForEachTicket, setIsFormForEachTicket] = useState(false)
    const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false)
    const [eventDataToSubmit, setEventDataToSubmit] = useState<TEventCreate | null>(null)
    const [termsFile, setTermsFile] = useState<File | null>(null)
    const [isMarkdownDialogOpen, setMarkdownDialogOpen] = useState(false)
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false)
    const [createdEventSlug, setCreatedEventSlug] = useState<string | null>(null)
    const [descriptionWrittenWithAI, setDescriptionWrittenWithAI] = useState(false)
    const [isAIMissingFieldsDialogOpen, setIsAIMissingFieldsDialogOpen] = useState(false)
    const [missingFields, setMissingFields] = useState<string[]>([])
    const router = useRouter()

    const { data: eventCategoriesData, isLoading: isEventCategoriesLoading } = useEventCategoryFind()
    const { mutateAsync: createEvent, isPending: isCreating } = useEventCreate()
    const { mutateAsync: createEventDescriptionWithAI, isPending: isCreatingDescriptionWithAI } = useAICreateEventDescription()

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
            isClientTaxed: false,
            isFree: false,
            buyTicketsLimit: 10,
            maxInstallments: 1
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
    const recurrenceDay = form.watch("recurrence.day")
    const batches = form.watch("batches") || []
    const descriptionLength = form.watch("description")?.length || 0
    const isFreeEvent = form.watch("isFree") || false
    const eventName = form.watch("name")
    const selectedCategoryIds = form.watch("categories")
    const eventLocation = form.watch("location")

    const ticketTypes = form.watch("ticketTypes") || []

    const handleCreateDescriptionWithAI = async () => {
        if (descriptionWrittenWithAI) {
            Toast.info("Descrição já escrita com IA.")
            return
        }

        const missing: string[] = []

        if (!eventName || eventName.trim() === "") {
            missing.push("Nome do evento")
        }

        if (!selectedCategoryIds || selectedCategoryIds.length === 0) {
            missing.push("Categoria (pelo menos uma)")
        }

        if (!eventLocation || eventLocation.trim() === "") {
            missing.push("Localização")
        }

        if (missing.length > 0) {
            setMissingFields(missing)
            setIsAIMissingFieldsDialogOpen(true)
            return
        }

        try {
            const categoryNames = eventCategories
                .filter(category => selectedCategoryIds.includes(category.id))
                .map(category => category.name)
                .filter(Boolean)

            if (categoryNames.length === 0) {
                setMissingFields(["Categoria (pelo menos uma)"])
                setIsAIMissingFieldsDialogOpen(true)
                return
            }

            const response = await createEventDescriptionWithAI({
                eventName: eventName || "",
                categories: categoryNames,
                location: eventLocation || ""
            })

            if (response?.success && response?.data?.message) {
                form.setValue("description", response.data.message)
                setDescriptionWrittenWithAI(true)
                Toast.success("Descrição criada com IA com sucesso!")
            }
        } catch (error) {
            Toast.error("Erro ao criar descrição com IA. Tente novamente.")
        }
    }

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

    useEffect(() => {
        if (ticketTypes.length > 0) {
            const currentBatches = form.getValues("batches") || []
            currentBatches.forEach((batch, batchIndex) => {
                const currentTicketTypes = batch.ticketTypes || []
                const updatedTicketTypes = [...currentTicketTypes]
                
                ticketTypes.forEach((_, typeIdx) => {
                    const exists = updatedTicketTypes.some(ct => ct.ticketTypeId === typeIdx.toString())
                    if (!exists) {
                        updatedTicketTypes.push({
                            ticketTypeId: typeIdx.toString(),
                            price: 0,
                            amount: 0
                        })
                    }
                })
                
                if (updatedTicketTypes.length !== currentTicketTypes.length) {
                    form.setValue(`batches.${batchIndex}.ticketTypes`, updatedTicketTypes)
                }
            })
        }
    }, [ticketTypes.length, form])

    useEffect(() => {
        if (recurrenceEnabled) {
            const currentBatches = form.getValues("batches") || []
            if (currentBatches.length > 1) {
                form.setValue("batches", [currentBatches[0]])
            }
            const updatedBatches = (form.getValues("batches") || []).map(batch => ({
                ...batch,
                endDate: null
            }))
            form.setValue("batches", updatedBatches)
        }
    }, [recurrenceEnabled, form])

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
            
            setEventDataToSubmit(data)
            setIsSummaryDialogOpen(true)
        } catch (error) {
            console.error("Erro ao validar evento:", error)
        }
    }

    const handleConfirmPublish = async () => {
        if (!eventDataToSubmit) return

        try {
            const hasBatches = eventDataToSubmit.batches && eventDataToSubmit.batches.length > 0
            const hasTicketTypes = eventDataToSubmit.ticketTypes && eventDataToSubmit.ticketTypes.length > 0
            
            const submitData: TEventCreate = {
                name: eventDataToSubmit.name,
                description: eventDataToSubmit.description,
                categories: eventDataToSubmit.categories.map((category) => category),
                image: eventDataToSubmit.image,
                location: eventDataToSubmit.location,
                tickets: undefined,
                ticketPrice: undefined,
                ticketTypes: hasTicketTypes ? eventDataToSubmit.ticketTypes : undefined,
                batches: hasBatches && eventDataToSubmit.batches ? eventDataToSubmit.batches.map(batch => ({
                    ...batch,
                    price: batch.price ? Math.round(batch.price * 100) : null,
                    ticketTypes: batch.ticketTypes ? batch.ticketTypes.map(type => ({
                        ...type,
                        price: type.price ? Math.round(type.price * 100) : null
                    })) : undefined
                })) : undefined,
                dates: eventDataToSubmit.recurrence ? undefined : (eventDataToSubmit.dates ? eventDataToSubmit.dates.map(date => ({
                    ...date,
                    price: date.hasSpecificPrice && date.price ? Math.round(date.price * 100) : null,
                    ticketTypePrices: date.hasSpecificPrice && date.ticketTypePrices ? date.ticketTypePrices.map(ttp => ({
                        ...ttp,
                        price: Math.round(ttp.price * 100)
                    })) : null
                })) : undefined),
                recurrence: eventDataToSubmit.recurrence || null,
                isClientTaxed: eventDataToSubmit.isClientTaxed || false,
                isFree: eventDataToSubmit.isFree || false,
                form: transformFormFieldsToJSON(formFields),
                isFormForEachTicket: isFormForEachTicket || false,
                buyTicketsLimit: eventDataToSubmit.buyTicketsLimit || null,
                maxInstallments: eventDataToSubmit.maxInstallments || null
            }

            const response = await createEvent({ data: submitData, termsFile: termsFile || undefined })
            
            setIsSummaryDialogOpen(false)
            setEventDataToSubmit(null)
            
            if (response?.success !== false) {
                if (response?.data?.slug) {
                    setCreatedEventSlug(response.data.slug)
                } else if (response?.data?.slug) {
                    setCreatedEventSlug(response.data?.slug)
                }
                setIsSuccessDialogOpen(true)
            } else {
                console.error("Erro na resposta da API:", response)
            }
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
        if (recurrenceEnabled && batchFields.length >= 1) return
        const initialTicketTypes = ticketTypes.length > 0
            ? ticketTypes.map((_, typeIdx) => ({
                ticketTypeId: typeIdx.toString(),
                price: 0,
                amount: 0
            }))
            : []
        
        appendBatch({
            name: "",
            price: undefined,
            quantity: undefined,
            startDate: "",
            endDate: null,
            autoActivateNext: false,
            accumulateUnsold: false,
            ticketTypes: initialTicketTypes
        })
    }


    const addTicketType = () => {
        appendTicketType({
            name: "",
            description: null
        })
        
        const newTypeIndex = ticketTypes.length
        const currentBatches = form.getValues("batches") || []
        
        currentBatches.forEach((batch, batchIndex) => {
            const currentTicketTypes = batch.ticketTypes || []
            if (!currentTicketTypes.some(ct => ct.ticketTypeId === newTypeIndex.toString())) {
                form.setValue(`batches.${batchIndex}.ticketTypes`, [
                    ...currentTicketTypes,
                    {
                        ticketTypeId: newTypeIndex.toString(),
                        price: 0,
                        amount: 0
                    }
                ])
            }
        })
    }

    const toggleDayOfWeek = (day: number) => {
        const currentDay = recurrenceDay
        if (currentDay === day) {
            form.setValue("recurrence.day", undefined)
        } else {
            form.setValue("recurrence.day", day)
        }
    }

    const toggleMonthDay = (day: number) => {
        const currentDay = recurrenceDay
        if (currentDay === day) {
            form.setValue("recurrence.day", undefined)
        } else {
            form.setValue("recurrence.day", day)
        }
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
                        sm:text-5xl font-semibold text-psi-primary mb-2">
                            Publicar Novo Evento
                        </h1>
                        <p className="text-base
                        sm:text-lg text-psi-dark/60">
                            Preencha as informações do seu evento
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-semibold text-psi-dark">Informações Básicas</h2>
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
                                        <div className="flex items-center gap-2">
                                            <label htmlFor="description" className="block text-sm font-medium text-psi-dark">
                                                Descrição *
                                            </label>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="h-5 w-5 p-0"
                                                onClick={() => setMarkdownDialogOpen(true)}
                                            >
                                                <HelpCircle className="h-4 w-4 text-psi-primary" />
                                            </Button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-psi-dark/60">
                                                {descriptionLength}/{DESCRIPTION_MAX_LENGTH}
                                            </span>
                                            <Button
                                                type="button"
                                                variant="secondary"
                                                size="sm"
                                                className="text-xs"
                                                onClick={handleCreateDescriptionWithAI}
                                                disabled={descriptionWrittenWithAI || isCreatingDescriptionWithAI}
                                            >
                                                {
                                                    isCreatingDescriptionWithAI ? (
                                                        <LoadingButton />
                                                    ) : (
                                                        <>
                                                            <Sparkles className="h-3.5 w-3.5" />
                                                            Escrever com IA
                                                        </>
                                                    )
                                                }
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
                                        render={({ field }) => {
                                            const sortedCategories = [...eventCategories].sort((a, b) =>
                                                a.name.localeCompare(b.name, 'pt-BR', { sensitivity: 'base' })
                                            )
                                            return (
                                                <MultiSelect
                                                    options={sortedCategories.map((category) => ({ value: category.id, label: category.name }))}
                                                    value={field.value || []}
                                                    onChange={field.onChange}
                                                    placeholder="Selecione as categorias..."
                                                    minSelections={1}
                                                    maxSelections={5}
                                                    required
                                                />
                                            )
                                        }}
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

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                        Imagem do Evento *
                                    </label>
                                    <p className="text-xs text-psi-dark/60 mb-3">
                                        Dimensões recomendadas: 1920x1080px (16:9) ou 1280x720px. Formatos aceitos: PNG, JPG, GIF até 10MB.
                                    </p>
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

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                        Regulamento do Evento (Opcional)
                                    </label>
                                    <p className="text-xs text-psi-dark/60 mb-3">
                                        Faça upload de um arquivo PDF com o regulamento do seu evento. Tamanho máximo: 10MB.
                                    </p>
                                    <FileUpload
                                        value={termsFile}
                                        onChange={setTermsFile}
                                        accept=".pdf"
                                        maxSize={10 * 1024 * 1024}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Tag className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-semibold text-psi-dark">Tipos de Ingressos (Opcional)</h2>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-psi-dark/60">
                                    Crie tipos de ingressos para seu evento (ex: VIP, Meia, Inteira). Se não criar tipos, você pode definir um preço único por lote.
                                </p>

                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-medium text-psi-dark">Tipos</h3>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        onClick={addTicketType}
                                    >
                                        <Plus className="h-4 w-4" />
                                        Adicionar Tipo
                                    </Button>
                                </div>

                                {ticketTypeFields.map((field, index) => (
                                    <div
                                        key={field.id}
                                        className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4 space-y-4"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-psi-dark">
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

                        <div className="rounded-2xl border z-0 border-[#E4E6F0] bg-white/95 shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Repeat className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-semibold text-psi-dark">Recorrência (Opcional)</h2>
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
                                                    day: undefined,
                                                    hourStart: "",
                                                    hourEnd: null,
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
                                                        Dia da Semana * <span className="text-xs font-normal text-psi-dark/60">(selecione apenas 1 dia)</span>
                                                    </label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {weekDays.map((day) => {
                                                            const isSelected = recurrenceDay === day.value
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
                                                    <FieldError message={form.formState.errors.recurrence?.day?.message || ""} />
                                                </div>

                                                {recurrenceDay !== null && recurrenceDay !== undefined && (
                                                    <div className="space-y-3 pt-3 border-t border-[#E4E6F0]">
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Horário *
                                                        </label>
                                                        <div className="rounded-lg border border-[#E4E6F0] bg-white p-3 space-y-3">
                                                            <div className="font-medium text-sm text-psi-dark">
                                                                {weekDays.find(d => d.value === recurrenceDay)?.label || ""}
                                                            </div>
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
                                                                        icon={false}
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
                                                                        icon={false}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {recurrenceType === "MONTHLY" && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                        Dia do Mês * <span className="text-xs font-normal text-psi-dark/60">(selecione apenas 1 dia)</span>
                                                    </label>
                                                    <div className="grid grid-cols-7 gap-2 max-h-48 overflow-y-auto">
                                                        {monthDays.map((day) => {
                                                            const isSelected = recurrenceDay === day
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
                                                    <FieldError message={form.formState.errors.recurrence?.day?.message || ""} />
                                                </div>

                                                {recurrenceDay !== null && recurrenceDay !== undefined && (
                                                    <div className="space-y-3 pt-3 border-t border-[#E4E6F0]">
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Horário *
                                                        </label>
                                                        <div className="rounded-lg border border-[#E4E6F0] bg-white p-3 space-y-3">
                                                            <div className="font-medium text-sm text-psi-dark">Dia {recurrenceDay}</div>
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
                                                                        icon={false}
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
                                                                        icon={false}
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
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
                                                        absoluteClassName={true}
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {!recurrenceEnabled && (
                            <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 shadow-lg shadow-black/5 p-6
                            sm:p-8 space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-psi-primary" />
                                        <h2 className="text-2xl font-semibold text-psi-dark">Datas e Horários</h2>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        size="sm"
                                        onClick={addDate}
                                    >
                                        <Plus className="h-4 w-4" />
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
                                                <span className="text-sm font-medium text-psi-dark">
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
                                                                absoluteClassName={true}
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

                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3 rounded-lg border border-[#E4E6F0] bg-[#F3F4FB] p-3">
                                                    <Checkbox
                                                        id={`has-specific-price-${index}`}
                                                        checked={form.watch(`dates.${index}.hasSpecificPrice`) || false}
                                                        onCheckedChange={(checked) => {
                                                            const isChecked = checked === true
                                                            const allDates = form.getValues("dates") || []
                                                            
                                                            if (isChecked) {
                                                                allDates.forEach((_, dateIdx) => {
                                                                    form.setValue(`dates.${dateIdx}.hasSpecificPrice`, true)
                                                                    if (ticketTypes.length > 0) {
                                                                        const currentPrices = form.getValues(`dates.${dateIdx}.ticketTypePrices`) || []
                                                                        const initialPrices = ticketTypes.map((_, typeIdx) => {
                                                                            const existingPrice = currentPrices.find(ttp => ttp.ticketTypeId === typeIdx.toString())
                                                                            return existingPrice || {
                                                                                ticketTypeId: typeIdx.toString(),
                                                                                price: 0
                                                                            }
                                                                        })
                                                                        form.setValue(`dates.${dateIdx}.ticketTypePrices`, initialPrices)
                                                                    } else {
                                                                        const currentPrice = form.getValues(`dates.${dateIdx}.price`)
                                                                        if (currentPrice === null || currentPrice === undefined || currentPrice === 0) {
                                                                            form.setValue(`dates.${dateIdx}.price`, 0)
                                                                        }
                                                                    }
                                                                })
                                                            } else {
                                                                allDates.forEach((_, dateIdx) => {
                                                                    form.setValue(`dates.${dateIdx}.hasSpecificPrice`, false)
                                                                    form.setValue(`dates.${dateIdx}.price`, null)
                                                                    form.setValue(`dates.${dateIdx}.ticketTypePrices`, null)
                                                                })
                                                            }
                                                        }}
                                                    />
                                                    <label htmlFor={`has-specific-price-${index}`} className="text-sm font-medium text-psi-dark cursor-pointer">
                                                        Definir preço específico para este dia
                                                    </label>
                                                </div>
                                                {form.watch(`dates.${index}.hasSpecificPrice`) && (
                                                    <div className="rounded-lg border border-amber-200 bg-amber-50/50 p-3">
                                                        <p className="text-xs text-amber-800 leading-relaxed">
                                                            <strong>Importante:</strong> Ao utilizar preços específicos por data, o preço definido pelos lotes será desconsiderado. Todas as datas devem ter preço específico quando esta opção estiver ativada.
                                                        </p>
                                                    </div>
                                                )}
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

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Tag className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-semibold text-psi-dark">Ingressos</h2>
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
                                                    Quando ativado, a taxa de serviço é adicionada ao valor pago pelo comprador. Obs: As taxas de cartão de crédito já são repassadas ao comprador por padrão.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                />
                                <FieldError message={form.formState.errors.isClientTaxed?.message || ""} />

                                <Controller
                                    name="isFree"
                                    control={form.control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-3 rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4">
                                            <Checkbox
                                                id="is-free"
                                                checked={field.value || false}
                                                onCheckedChange={(checked) => field.onChange(checked === true)}
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="is-free" className="text-sm font-medium text-psi-dark cursor-pointer">
                                                    Evento gratuito
                                                </label>
                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                    Quando ativado, os ingressos serão gratuitos e não haverá cobrança ao comprador.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                />
                                <FieldError message={form.formState.errors.isFree?.message || ""} />

                                <Controller
                                    name="isOnline"
                                    control={form.control}
                                    render={({ field }) => (
                                        <div className="flex items-center gap-3 rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4">
                                            <Checkbox
                                                id="is-online"
                                                checked={field.value || false}
                                                onCheckedChange={(checked) => field.onChange(checked === true)}
                                            />
                                            <div className="flex-1">
                                                <label htmlFor="is-online" className="text-sm font-medium text-psi-dark cursor-pointer">
                                                    Evento online
                                                </label>
                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                    Eventos online são eventos que ocorrem de forma virtual, como conferências, webinars, etc.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                />
                                <FieldError message={form.formState.errors.isFree?.message || ""} />

                                <div className="rounded-2xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/5 p-6 space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-linear-to-br from-psi-primary/20 to-psi-secondary/20 p-3 shrink-0">
                                            <Users className="h-6 w-6 text-psi-primary" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <label className="block text-base font-semibold text-psi-dark mb-1">
                                                    Limitar quantidade de ingressos por pessoa
                                                </label>
                                                <p className="text-sm text-psi-dark/60">
                                                    Defina o número máximo de ingressos que uma única pessoa pode comprar
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Controller
                                        name="buyTicketsLimit"
                                        control={form.control}
                                        render={({ field }) => {
                                            const currentValue = field.value || 10
                                            const quickOptions = [5, 10, 20, 50]
                                            
                                            return (
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-sm font-medium text-psi-dark/70">Opções rápidas:</span>
                                                        {quickOptions.map((option) => (
                                                            <Button
                                                                key={option}
                                                                type="button"
                                                                variant={currentValue === option ? "primary" : "outline"}
                                                                size="sm"
                                                                className={currentValue === option ? "" : "border-psi-primary/30 hover:border-psi-primary/50"}
                                                                onClick={() => field.onChange(option)}
                                                            >
                                                                {option} ingressos
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-medium text-psi-dark/70 whitespace-nowrap">Ou escolha:</span>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="10"
                                                            min={1}
                                                            max={100}
                                                            className="w-full max-w-[120px]"
                                                            value={field.value || ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value
                                                                if (value === "") {
                                                                    field.onChange(null)
                                                                } else {
                                                                    const numValue = parseInt(value, 10)
                                                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 100) {
                                                                        field.onChange(numValue)
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-xs text-psi-dark/60">ingressos (máx. 100)</span>
                                                    </div>
                                                </div>
                                            )
                                        }}
                                    />
                                    <FieldError message={form.formState.errors.buyTicketsLimit?.message || ""} />
                                </div>

                                <div className="rounded-2xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/5 p-6 space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="rounded-xl bg-linear-to-br from-psi-primary/20 to-psi-secondary/20 p-3 shrink-0">
                                            <CreditCard className="h-6 w-6 text-psi-primary" />
                                        </div>
                                        <div className="flex-1 space-y-2">
                                            <div>
                                                <label className="block text-base font-semibold text-psi-dark mb-1">
                                                    Máximo de parcelas
                                                </label>
                                                <p className="text-sm text-psi-dark/60">
                                                    Permita que compradores parcelem o pagamento no cartão de crédito
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <Controller
                                        name="maxInstallments"
                                        control={form.control}
                                        render={({ field }) => {
                                            const currentValue = field.value || 1
                                            const quickOptions = [1, 3, 6, 12]
                                            
                                            return (
                                                <div className="space-y-4">
                                                    <div className="flex flex-wrap items-center gap-3">
                                                        <span className="text-sm font-medium text-psi-dark/70">Opções rápidas:</span>
                                                        {quickOptions.map((option) => (
                                                            <Button
                                                                key={option}
                                                                type="button"
                                                                variant={currentValue === option ? "primary" : "outline"}
                                                                size="sm"
                                                                className={currentValue === option ? "" : "border-psi-primary/30 hover:border-psi-primary/50"}
                                                                onClick={() => field.onChange(option)}
                                                            >
                                                                {option}x
                                                            </Button>
                                                        ))}
                                                    </div>
                                                    
                                                    <div className="flex items-center gap-3">
                                                        <span className="text-sm font-medium text-psi-dark/70 whitespace-nowrap">Ou escolha:</span>
                                                        <Input
                                                            {...field}
                                                            type="number"
                                                            placeholder="1"
                                                            min={1}
                                                            max={12}
                                                            className="w-full max-w-[120px]"
                                                            value={field.value || ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value
                                                                if (value === "") {
                                                                    field.onChange(null)
                                                                } else {
                                                                    const numValue = parseInt(value, 10)
                                                                    if (!isNaN(numValue) && numValue >= 1 && numValue <= 12) {
                                                                        field.onChange(numValue)
                                                                    }
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-xs text-psi-dark/60">parcelas (máx. 12x)</span>
                                                    </div>

                                                    {currentValue > 1 && (
                                                        <div className="rounded-xl border border-psi-secondary/30 bg-linear-to-br from-psi-secondary/10 via-white to-psi-secondary/5 p-4 space-y-2">
                                                            <div className="flex items-start gap-2">
                                                                <Info className="h-4 w-4 text-psi-secondary shrink-0 mt-0.5" />
                                                                <div className="flex-1 space-y-1">
                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                        Como funciona o repasse parcelado
                                                                    </p>
                                                                    <p className="text-xs text-psi-dark/70 leading-relaxed">
                                                                        O repasse será feito <strong className="text-psi-dark">conforme as parcelas forem sendo pagas</strong>. 
                                                                        Por exemplo: se um ingresso foi dividido em 6x e já se passaram 4 meses quando o evento se encerrar, 
                                                                        será repassado ao organizador o valor das 4 parcelas já pagas. 
                                                                        As parcelas restantes serão repassadas assim que recebermos a cobrança de cada uma delas.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            )
                                        }}
                                    />
                                    <FieldError message={form.formState.errors.maxInstallments?.message || ""} />
                                </div>

                                <hr />

                                <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-lg font-medium text-psi-dark">Lotes</h3>
                                                {totalTickets > 0 && (
                                                    <p className="text-sm text-psi-dark/60 mt-1">
                                                        Total de ingressos: <span className="font-medium text-psi-primary">{totalTickets}</span>
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    size="sm"
                                                    onClick={addBatch}
                                                    disabled={recurrenceEnabled && batchFields.length >= 1}
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Adicionar Lote
                                                </Button>
                                                {recurrenceEnabled && (
                                                    <p className="text-xs text-psi-dark/60 text-right max-w-sm">
                                                        Eventos recorrentes suportam apenas um lote contínuo. O estoque reinicia automaticamente a cada nova ocorrência.
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {batchFields.map((field, index) => {
                                            const hasNextBatch = index < batchFields.length - 1
                                            return (
                                                <div
                                                    key={field.id}
                                                    className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4 space-y-4"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-psi-dark">
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
                                                                            value={(isFreeEvent ? 0 : field.value || 0)}
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
                                                                            disabled={isFreeEvent}
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
                                                            <label className="block text-sm font-medium text-psi-dark/70">
                                                                Tipos de Ingressos e Preços *
                                                            </label>
                                                            {ticketTypes.map((ticketType, typeIdx) => {
                                                                const currentTicketTypes = form.watch(`batches.${index}.ticketTypes`) || []
                                                                let ticketTypeIndex = currentTicketTypes.findIndex(ct => ct.ticketTypeId === typeIdx.toString())
                                                                
                                                                if (ticketTypeIndex < 0) {
                                                                    const newTicketType = {
                                                                        ticketTypeId: typeIdx.toString(),
                                                                        price: 0,
                                                                        amount: 0
                                                                    }
                                                                    const updatedTicketTypes = [...currentTicketTypes, newTicketType]
                                                                    form.setValue(`batches.${index}.ticketTypes`, updatedTicketTypes)
                                                                    ticketTypeIndex = updatedTicketTypes.length - 1
                                                                }
                                                                
                                                                return (
                                                                    <div key={typeIdx} className="rounded-lg border border-[#E4E6F0] bg-white p-3 space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <span className="text-sm font-medium text-psi-dark">
                                                                                {ticketType.name}
                                                                                {ticketType.description && (
                                                                                    <span className="text-xs text-psi-dark/60 ml-2">| {ticketType.description}</span>
                                                                                )}
                                                                            </span>
                                                                        </div>

                                                                        <div className="grid grid-cols-1
                                                                        sm:grid-cols-2 gap-4">
                                                                            <div>
                                                                                <label className="block text-xs text-psi-dark/60 mb-1">Preço *</label>
                                                                                <Controller
                                                                                    name={`batches.${index}.ticketTypes.${ticketTypeIndex}.price`}
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
                                                                                <FieldError message={form.formState.errors.batches?.[index]?.ticketTypes?.[ticketTypeIndex]?.price?.message || ""} />
                                                                            </div>

                                                                            <div>
                                                                                <label className="block text-xs text-psi-dark/60 mb-1">Quantidade *</label>
                                                                                <Controller
                                                                                    name={`batches.${index}.ticketTypes.${ticketTypeIndex}.amount`}
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
                                                                                <FieldError message={form.formState.errors.batches?.[index]?.ticketTypes?.[ticketTypeIndex]?.amount?.message || ""} />
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    )}

                                                    <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                                            Data Início *
                                                        </label>
                                                        {recurrenceEnabled && (
                                                            <p className="text-sm font-semibold text-psi-primary mb-2">
                                                                * Para o primeiro ciclo o lote começa nesta data. Nos próximos ciclos ele será reativado automaticamente assim que o evento terminar.
                                                            </p>
                                                        )}
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
                                                                                absoluteClassName={true}
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

                                                        {!recurrenceEnabled && (
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
                                                                                    absoluteClassName={true}
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
                                                        )}
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

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-semibold text-psi-dark">Formulário Personalizado (Opcional)</h2>
                            </div>

                            <div className="space-y-4">
                                <p className="text-sm text-psi-dark/60">
                                    Crie perguntas personalizadas que serão feitas aos compradores durante a compra. 
                                    Por exemplo: tamanho da camisa, preferências alimentares, etc.
                                </p>

                                <div className="flex items-center gap-3 rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4">
                                    <Checkbox
                                        id="is-form-for-each-ticket"
                                        checked={isFormForEachTicket}
                                        onCheckedChange={(checked) => setIsFormForEachTicket(checked === true)}
                                    />
                                    <div className="flex-1">
                                        <label htmlFor="is-form-for-each-ticket" className="text-sm font-medium text-psi-dark cursor-pointer">
                                            Incluir para cada ingresso
                                        </label>
                                        <p className="text-xs text-psi-dark/60 mt-1">
                                            Quando ativado, o formulário será preenchido separadamente para cada ingresso comprado.
                                        </p>
                                    </div>
                                </div>

                                <FormBuilder
                                    fields={formFields}
                                    onChange={(fields) => {
                                        setFormFields(fields)
                                    }}
                                />
                            </div>
                        </div>

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
                                className="group relative"
                            >
                                {form.formState.isSubmitting || isCreating ? (
                                    <LoadingButton message="Criando evento..." />
                                ) : (
                                    <>
                                    <Megaphone
                                        className="
                                        h-4 w-4 group-hover:rotate-[-20deg] group-hover:scale-120 transition-transform duration-300
                                        "
                                    />
                                    Publicar Evento
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <DialogMarkdownInstructions
                open={isMarkdownDialogOpen}
                onOpenChange={setMarkdownDialogOpen}
            />

            <Dialog open={isAIMissingFieldsDialogOpen} onOpenChange={setIsAIMissingFieldsDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="size-20 rounded-full bg-linear-to-br from-psi-secondary/30 via-psi-secondary/10 to-psi-secondary/30 flex items-center justify-center border-2 border-psi-secondary/30">
                                <Sparkles className="size-10 text-psi-secondary" />
                            </div>
                            <div className="space-y-2">
                                <DialogTitle className="text-2xl font-semibold text-psi-dark">
                                    Informações necessárias
                                </DialogTitle>
                                <DialogDescription className="text-base text-psi-dark/70">
                                    Para criar uma descrição com IA, precisamos de algumas informações básicas sobre o evento.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="space-y-4 pt-4">
                        <div className="rounded-xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/5 p-4 space-y-3">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertCircle className="h-5 w-5 text-psi-secondary shrink-0" />
                                <p className="text-sm font-medium text-psi-dark">
                                    Preencha os seguintes campos:
                                </p>
                            </div>
                            <ul className="space-y-2">
                                {missingFields.map((field, index) => (
                                    <li key={index} className="flex items-start gap-2">
                                        <div className="h-1.5 w-1.5 rounded-full bg-psi-secondary mt-2 shrink-0" />
                                        <span className="text-sm text-psi-dark/70">{field}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="rounded-lg bg-psi-primary/5 border border-psi-primary/10 p-3">
                            <p className="text-xs text-psi-dark/60 leading-relaxed">
                                <strong className="text-psi-secondary">Dica:</strong> Após preencher essas informações, você poderá gerar uma descrição profissional e atrativa para o seu evento usando inteligência artificial.
                            </p>
                        </div>
                        <Button
                            type="button"
                            variant="secondary"
                            className="w-full"
                            size="lg"
                            onClick={() => setIsAIMissingFieldsDialogOpen(false)}
                        >
                            Entendi, vou preencher
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {eventDataToSubmit && (
                <DialogEventSummary
                    open={isSummaryDialogOpen}
                    onOpenChange={setIsSummaryDialogOpen}
                    eventData={eventDataToSubmit}
                    eventCategories={eventCategories}
                    onConfirm={handleConfirmPublish}
                    isLoading={isCreating}
                />
            )}

            <Dialog open={isSuccessDialogOpen} onOpenChange={setIsSuccessDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="size-20 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                <CheckCircle2 className="size-12 text-psi-primary" />
                            </div>
                            <div className="space-y-2">
                                <DialogTitle className="text-2xl font-semibold text-psi-dark">
                                    Evento publicado com sucesso!
                                </DialogTitle>
                                <DialogDescription className="text-base text-psi-dark/70">
                                    Aguarde, em poucos instantes as vendas começarão para o seu evento.
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>
                    <div className="flex flex-col gap-3 pt-4">
                        <Button
                            type="button"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            onClick={() => {
                                setIsSuccessDialogOpen(false)
                                router.push("/meus-eventos")
                            }}
                        >
                            Ir para meus eventos
                        </Button>
                        {createdEventSlug ? (
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                size="lg"
                                onClick={() => {
                                    setIsSuccessDialogOpen(false)
                                    router.push(`/ver-evento/${createdEventSlug}`)
                                }}
                            >
                                <ExternalLink className="size-4 mr-2" />
                                Ver página do evento
                            </Button>
                        ) : (
                            <p className="text-xs text-psi-dark/60 text-center">
                                O evento foi criado com sucesso. Você pode visualizá-lo em "Meus Eventos".
                            </p>
                        )}
                    </div>
                </DialogContent>
            </Dialog>
        </Background>
    )
}

export default CriarEventoForm
