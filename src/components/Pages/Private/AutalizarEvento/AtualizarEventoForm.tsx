"use client"

import { useState, useMemo, useEffect } from "react"
import { useForm, Controller, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2, Calendar, MapPin, Ticket, FileText, Repeat, Tag, Sparkles, Check, CheckCircle } from "lucide-react"
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
import { useEventFindByIdUser } from "@/hooks/Event/useEventFindByIdUser"
import { useEventUpdate } from "@/hooks/Event/useEventUpdate"
import useEventUpdateImage from "@/hooks/Event/useEventUpdateImage"
import { Skeleton } from "@/components/ui/skeleton"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { DialogTaxes } from "@/components/Dialog/DialogTaxes/DialogTaxes"
import { FormBuilder, type TFormField } from "@/components/FormBuilder/FormBuilder"
import { DialogEditWarning, type TChangeItem } from "@/components/Dialog/DialogEditWarning/DialogEditWarning"
import { Toast } from "@/components/Toast/Toast"

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

const parseFormJSONToFields = (formJSON: any): TFormField[] => {
    if (!formJSON || typeof formJSON !== 'object') return []
    
    const fieldsWithOrder: Array<{ field: TFormField, order: number }> = []
    
    const formTypes = ['text', 'email', 'textArea', 'select', 'multiSelect']
    
    formTypes.forEach(type => {
        if (Array.isArray(formJSON[type])) {
            formJSON[type].forEach((fieldData: any) => {
                const field: TFormField = {
                    id: `${type}-${fieldData.order ?? Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    type: type === 'textArea' ? 'textarea' : type === 'multiSelect' ? 'checkbox' : type as TFormField['type'],
                    label: fieldData.label || '',
                    placeholder: fieldData.placeholder,
                    required: fieldData.required || false,
                    mask: fieldData.mask
                }
                
                if (type === 'select' || type === 'multiSelect') {
                    if (fieldData.options && Array.isArray(fieldData.options)) {
                        field.options = fieldData.options.map((opt: string, idx: number) => ({
                            id: `${field.id}-opt-${idx}`,
                            label: opt
                        }))
                    }
                }
                
                fieldsWithOrder.push({
                    field,
                    order: fieldData.order ?? 999
                })
            })
        }
    })
    
    return fieldsWithOrder
        .sort((a, b) => a.order - b.order)
        .map(item => item.field)
}

type TAtualizarEventoFormProps = {
    eventId: string
}

const AtualizarEventoForm = ({ eventId }: TAtualizarEventoFormProps) => {
    const [recurrenceEnabled, setRecurrenceEnabled] = useState(false)
    const [isFormInitialized, setIsFormInitialized] = useState(false)
    const [formFields, setFormFields] = useState<TFormField[]>([])
    const [isFormForEachTicket, setIsFormForEachTicket] = useState(false)
    const [originalData, setOriginalData] = useState<any>(null)
    const [isWarningOpen, setIsWarningOpen] = useState(true)

    const { data: eventData, isLoading: isEventLoading } = useEventFindByIdUser(eventId)
    const { data: eventCategoriesData, isLoading: isEventCategoriesLoading } = useEventCategoryFind()

    const { mutateAsync: updateEvent, isPending: isUpdatingEvent } = useEventUpdate(eventId)
    const { mutateAsync: updateEventImage, isPending: isUpdatingImage } = useEventUpdateImage(eventId)

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
        } as any
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
    
    const currentFormData = useWatch({
        control: form.control
    })

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

    const detectChanges = useMemo((): { changes: TChangeItem[], riskScore: number } => {
        if (!originalData || !isFormInitialized) return { changes: [], riskScore: 0 }

        const changes: TChangeItem[] = []
        let totalRisk = 0

        const compareValues = (current: any, original: any, fieldName: string, severity: TChangeItem["severity"], riskPoints: number) => {
            const currentNormalized = current === null || current === undefined ? null : current
            const originalNormalized = original === null || original === undefined ? null : original
            if (currentNormalized !== originalNormalized) {
                changes.push({ field: fieldName, severity })
                totalRisk += riskPoints
            }
        }

        const compareArrays = (current: any[] | undefined, original: any[] | undefined, fieldName: string, severity: TChangeItem["severity"], riskPoints: number) => {
            if (!current && !original) return
            if ((!current && original) || (current && !original)) {
                changes.push({ field: fieldName, severity })
                totalRisk += riskPoints
                return
            }
            if (current && original) {
                if (current.length !== original.length) {
                    changes.push({ field: fieldName, severity })
                    totalRisk += riskPoints
                    return
                }
                try {
                    if (JSON.stringify(current) !== JSON.stringify(original)) {
                        changes.push({ field: fieldName, severity })
                        totalRisk += riskPoints
                    }
                } catch {
                    changes.push({ field: fieldName, severity })
                    totalRisk += riskPoints
                }
            }
        }

        compareValues(currentFormData.name, originalData.name, "Nome do Evento", "medium", 5)
        compareValues(currentFormData.description, originalData.description, "Descrição", "medium", 5)
        compareArrays(currentFormData.categories, originalData.categories, "Categorias", "medium", 5)
        compareValues(currentFormData.location, originalData.location, "Localização", "high", 15)
        compareValues(currentFormData.isClientTaxed, originalData.isClientTaxed, "Repassar taxas ao cliente", "high", 15)

        if (currentFormData.image && currentFormData.image !== originalData.image) {
            changes.push({ field: "Imagem do Evento", severity: "low" })
            totalRisk += 2
        }

        compareArrays(currentFormData.ticketTypes, originalData.ticketTypes, "Tipos de Ingressos", "critical", 25)

        compareArrays(currentFormData.batches, originalData.batches, "Lotes de Ingressos", "critical", 30)
        
        if (currentFormData.batches && originalData.batches) {
            currentFormData.batches.forEach((batch: any, index: number) => {
                const originalBatch = originalData.batches[index]
                if (originalBatch) {
                    if (batch.name !== originalBatch.name) {
                        changes.push({ field: `Lote ${index + 1} - Nome`, severity: "high" })
                        totalRisk += 10
                    }
                    if (batch.price !== originalBatch.price) {
                        changes.push({ field: `Lote ${index + 1} - Preço`, severity: "critical" })
                        totalRisk += 25
                    }
                    if (batch.quantity !== originalBatch.quantity) {
                        changes.push({ field: `Lote ${index + 1} - Quantidade`, severity: "critical" })
                        totalRisk += 25
                    }
                    if (batch.startDate !== originalBatch.startDate || batch.endDate !== originalBatch.endDate) {
                        changes.push({ field: `Lote ${index + 1} - Datas`, severity: "critical" })
                        totalRisk += 25
                    }
                    compareArrays(batch.ticketTypes, originalBatch.ticketTypes, `Lote ${index + 1} - Tipos e Preços`, "critical", 25)
                }
            })
        }

        compareArrays(currentFormData.dates, originalData.dates, "Datas e Horários", "critical", 30)
        
        if (currentFormData.dates && originalData.dates) {
            currentFormData.dates.forEach((date: any, index: number) => {
                const originalDate = originalData.dates[index]
                if (originalDate) {
                    if (date.date !== originalDate.date) {
                        changes.push({ field: `Data ${index + 1} - Data`, severity: "critical" })
                        totalRisk += 25
                    }
                    if (date.hourStart !== originalDate.hourStart || date.hourEnd !== originalDate.hourEnd) {
                        changes.push({ field: `Data ${index + 1} - Horários`, severity: "critical" })
                        totalRisk += 20
                    }
                    if (date.hasSpecificPrice !== originalDate.hasSpecificPrice) {
                        changes.push({ field: `Data ${index + 1} - Preço Específico`, severity: "high" })
                        totalRisk += 15
                    }
                    if (date.price !== originalDate.price) {
                        changes.push({ field: `Data ${index + 1} - Preço`, severity: "critical" })
                        totalRisk += 25
                    }
                    compareArrays(date.ticketTypePrices, originalDate.ticketTypePrices, `Data ${index + 1} - Preços por Tipo`, "critical", 25)
                }
            })
        }

        try {
            if (JSON.stringify(currentFormData.recurrence || null) !== JSON.stringify(originalData.recurrence || null)) {
                changes.push({ field: "Recorrência", severity: "critical" })
                totalRisk += 30
            }
        } catch {
            if (currentFormData.recurrence !== originalData.recurrence) {
                changes.push({ field: "Recorrência", severity: "critical" })
                totalRisk += 30
            }
        }

        const currentFormJSON = transformFormFieldsToJSON(formFields)
        const originalFormJSON = transformFormFieldsToJSON(originalData.formFields)
        if (JSON.stringify(currentFormJSON) !== JSON.stringify(originalFormJSON)) {
            changes.push({ field: "Formulário Personalizado", severity: "high" })
            totalRisk += 15
        }

        if (isFormForEachTicket !== originalData.isFormForEachTicket) {
            changes.push({ field: "Incluir formulário para cada ingresso", severity: "high" })
            totalRisk += 15
        }

        return {
            changes,
            riskScore: Math.min(totalRisk, 100)
        }
    }, [currentFormData, originalData, isFormInitialized, formFields, isFormForEachTicket])

    const { changes, riskScore } = detectChanges

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
        if (eventData?.data && !isFormInitialized && eventCategories.length > 0) {
            const event = eventData.data
            
            const hasBatches = !!(event.EventBatches && event.EventBatches.length > 0)
            const hasTicketTypes = !!(event.TicketTypes && event.TicketTypes.length > 0)
            setRecurrenceEnabled(!!event.Recurrence)

            const ticketTypesData = hasTicketTypes ? event.TicketTypes.map(tt => ({
                name: tt.name,
                description: tt.description
            })) : undefined

            const sortedEventBatch = hasBatches
                ? [...(event.EventBatches || [])].sort((a, b) => {
                    const dateA = new Date(a.startDate).getTime()
                    const dateB = new Date(b.startDate).getTime()
                    return dateA - dateB
                })
                : []

            const batchesData = hasBatches ? sortedEventBatch.map((batch, batchIndex) => {
                const batchTicketTypes = batch.EventBatchTicketTypes || []
                const ticketTypesInBatch = hasTicketTypes && batchTicketTypes.length > 0
                    ? event.TicketTypes!.map((tt, typeIdx) => {
                        const ebt = batchTicketTypes.find(ebt => ebt.ticketTypeId === tt.id)
                        return {
                            ticketTypeId: typeIdx.toString(),
                            price: ebt ? (ebt.price ? ebt.price / 100 : 0) : 0,
                            amount: ebt ? ebt.amount : 0
                        }
                    })
                    : []

                return {
                    name: batch.name,
                    price: batch.price ? batch.price / 100 : undefined,
                    quantity: batch.tickets,
                    startDate: formatDateOnly(batch.startDate),
                    endDate: formatDateOnly(batch.endDate),
                    autoActivateNext: batch.autoActivateNext ?? false,
                    accumulateUnsold: batch.accumulateUnsold ?? false,
                    ticketTypes: ticketTypesInBatch.length > 0 ? ticketTypesInBatch : undefined
                }
            }) : [{
                name: "",
                price: event.price ? event.price / 100 : undefined,
                quantity: event.tickets ?? undefined,
                startDate: "",
                endDate: null,
                autoActivateNext: false,
                accumulateUnsold: false,
                ticketTypes: undefined
            }]

            const datesData = event.EventDates && event.EventDates.length > 0 ? event.EventDates.map(eventDate => {
                const hasSpecificPrice = eventDate.hasSpecificPrice || false
                const ticketTypePrices = hasSpecificPrice && hasTicketTypes && eventDate.EventDateTicketTypePrices
                    ? event.TicketTypes!.map((tt, typeIdx) => {
                        const edttp = eventDate.EventDateTicketTypePrices!.find(edttp => edttp.ticketTypeId === tt.id)
                        return {
                            ticketTypeId: typeIdx.toString(),
                            price: edttp ? edttp.price / 100 : 0
                        }
                    })
                    : null

                return {
                    date: formatDateOnly(eventDate.date),
                    hourStart: eventDate.hourStart || "",
                    hourEnd: eventDate.hourEnd,
                    hasSpecificPrice,
                    price: hasSpecificPrice && eventDate.price ? eventDate.price / 100 : null,
                    ticketTypePrices
                }
            }) : [
                {
                    date: "",
                    hourStart: "",
                    hourEnd: null,
                    hasSpecificPrice: false,
                    price: null,
                    ticketTypePrices: null
                }
            ]

            const categoryIds = event.EventCategoryEvents?.map(ece => ece.categoryId) || []

            const recurrenceData = event.Recurrence ? {
                type: event.Recurrence.type,
                hourStart: event.Recurrence.hourStart || undefined,
                hourEnd: event.Recurrence.hourEnd || undefined,
                daysOfWeek: event.Recurrence.RecurrenceDays?.map(rd => ({
                    day: rd.day,
                    hourStart: rd.hourStart,
                    hourEnd: rd.hourEnd || undefined
                })) || undefined,
                endDate: event.Recurrence.endDate || undefined
            } : null

            const parsedForm = event.form ? (typeof event.form === 'string' ? JSON.parse(event.form) : event.form) : null
            if (parsedForm) {
                setFormFields(parseFormJSONToFields(parsedForm))
            }
            setIsFormForEachTicket(!!event.isFormForEachTicket)

            const initialFormData = {
                name: event.name || "",
                description: event.description || "",
                categories: categoryIds,
                image: null as any,
                location: event.location || null,
                tickets: undefined,
                ticketPrice: undefined,
                ticketTypes: ticketTypesData,
                batches: batchesData,
                dates: datesData,
                recurrence: recurrenceData,
                isClientTaxed: !!event.isClientTaxed,
                isFree: !!event.isFree,
                buyTicketsLimit: event.buyTicketsLimit ?? null,
                maxInstallments: event.maxInstallments ?? null
            }

            form.reset(initialFormData)
            
            setOriginalData({
                ...initialFormData,
                formFields: parsedForm ? parseFormJSONToFields(parsedForm) : [],
                isFormForEachTicket: !!event.isFormForEachTicket
            })

            setIsFormInitialized(true)
        }
    }, [eventData, isFormInitialized, form, eventCategories])

    const handleSubmit = async (data: TEventUpdate) => {
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

            const submitData: TEventUpdate = {
                name: data.name,
                description: data.description,
                categories: data.categories.map((category) => category),
                // image will be sent separately if it's a new File
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
                isClientTaxed: data.isClientTaxed || false,
                form: transformFormFieldsToJSON(formFields),
                isFormForEachTicket: isFormForEachTicket || false
                ,
                isFree: data.isFree || false,
                buyTicketsLimit: data.buyTicketsLimit || null,
                maxInstallments: data.maxInstallments || null
            }

            // Detect if image is a new File (uploaded). If so, we'll send it via the PATCH image route.
            let imageFile: File | undefined = undefined
            if (data.image && typeof (data.image as any) === "object" && (data.image as any).name) {
                imageFile = data.image as unknown as File
                // don't include the file in the main update payload to avoid duplicate handling
                // (EventService.updateImage will be used)
                ;(submitData as any).image = undefined
            }

            // Call update for the main data
            const response = await updateEvent(submitData as any)

            // If there is a new image file, call the image route
            if (imageFile) {
                const response = await updateEventImage(imageFile)
                if (response?.success) {
                    Toast.success("Imagem do evento atualizada com sucesso!")
                }
            }

            if (response?.success) {
                Toast.success("Evento atualizado com sucesso!")
            }

            // Optionally you can redirect or show a success toast here
        } catch (error) {
            console.error("Erro ao atualizar evento:", error)
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
                                                value={field.value || ImageUtils.getEventImageUrl(eventData?.data?.image!)}
                                                onChange={field.onChange}
                                                error={form.formState.errors.image?.message}
                                                showButtons={false}
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

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Limitar quantidade de ingressos por pessoa
                                        </label>
                                        <Controller
                                            name="buyTicketsLimit"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="10"
                                                    min={1}
                                                    max={100}
                                                    className="w-full max-w-[200px]"
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
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.buyTicketsLimit?.message || ""} />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Máximo de parcelas
                                        </label>
                                        <Controller
                                            name="maxInstallments"
                                            control={form.control}
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    type="number"
                                                    placeholder="1"
                                                    min={1}
                                                    max={12}
                                                    className="w-full max-w-[200px]"
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
                                            )}
                                        />
                                        <FieldError message={form.formState.errors.maxInstallments?.message || ""} />
                                    </div>
                                </div>

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
                                            const batch = eventData?.data?.EventBatches?.find((b, i, arr) => {
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
                                                                    <CheckCircle className="h-3 w-3" />
                                                                    Lote atual
                                                                </span>
                                                            )}
                                                        </span>
                                                        {batchFields.length > 1 ? (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => removeBatch(index)}
                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        ) : (
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
                                                                            <span className="text-sm font-semibold text-psi-dark">
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

                                                    <div className="grid grid-cols-2 gap-6">
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
                                                                let priceIndex = currentPrices.findIndex(ttp => ttp.ticketTypeId === typeIdx.toString())
                                                                
                                                                if (priceIndex < 0) {
                                                                    const newPrice = {
                                                                        ticketTypeId: typeIdx.toString(),
                                                                        price: 0
                                                                    }
                                                                    const updatedPrices = [...currentPrices, newPrice]
                                                                    form.setValue(`dates.${index}.ticketTypePrices`, updatedPrices)
                                                                    priceIndex = updatedPrices.length - 1
                                                                }
                                                                
                                                                return (
                                                                    <div key={typeIdx} className="flex items-center gap-3">
                                                                        <div className="flex-1">
                                                                            <label className="block text-xs text-psi-dark/60 mb-1">{ticketType.name}{ticketType.description && (
                                                                                <span className="text-xs text-psi-dark/60 ml-2">| {ticketType.description}</span>
                                                                            )}</label>
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

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                        sm:p-8 space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <FileText className="h-5 w-5 text-psi-primary" />
                                <h2 className="text-2xl font-bold text-psi-dark">Formulário Personalizado (Opcional)</h2>
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
                                    key={JSON.stringify(formFields.map(f => ({ type: f.type, label: f.label })))}
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
                                disabled={isUpdatingEvent}
                            >
                                {isUpdatingEvent ? (
                                    <LoadingButton message="Atualizando evento..." />
                                ) : (
                                    "Atualizar Evento"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <DialogEditWarning
                changes={changes}
                riskScore={riskScore}
                isOpen={isWarningOpen && changes.length > 0}
                onClose={() => setIsWarningOpen(false)}
            />
        </Background>
    )
}

export {
    AtualizarEventoForm
}
