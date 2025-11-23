"use client"

import { useState, useMemo, useCallback } from "react"
import { useCart } from "@/contexts/CartContext"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useEventFindByIds } from "@/hooks/Event/useEventFindByIds"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { QuantitySelector } from "@/components/QuantitySelector/QuantitySelector"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"
import { CheckoutUtils } from "@/utils/Helpers/CheckoutUtils/CheckoutUtils"
import { formatEventDate, formatEventTime } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { getCardBrand } from "@/utils/Helpers/CardUtils/CardUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { 
    User, 
    Mail, 
    Phone, 
    FileText, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    Trash2,
    ChevronRight,
    ChevronLeft,
    Receipt,
    Calendar,
    Clock,
    Check,
    ClipboardList
} from "lucide-react"
import { useRouter } from "next/navigation"
import { CTAButton } from "@/components/CTAButton/CTAButton"
import { Toast } from "@/components/Toast/Toast"

type TPaymentMethod = "pix" | "credit"

const CheckoutInfo = () => {
    const { items, updateQuantity, updateTicketTypeQuantity, addItem, removeItem, getTotal } = useCart()
    const { user } = useAuthStore()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("pix")
    
    const [buyerData, setBuyerData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        document: user?.document || "",
        street: user?.address?.street || "",
        number: user?.address?.number || "",
        complement: user?.address?.complement || "",
        neighborhood: user?.address?.neighborhood || "",
        zipcode: user?.address?.zipcode || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        country: user?.address?.country || "BR",
    })
    
    const [cardData, setCardData] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    })
    
    const [formAnswers, setFormAnswers] = useState<Record<string, any>>({})

    const getInputMaskMin = useCallback((mask: string) => {
        switch (mask) {
            case "000.000.000-00":
                return 11
            case "(00) 00000-0000":
                return 15
            default:
                return 0
        }
    }, [])
    
    const cardBrand = useMemo(() => {
        return getCardBrand(cardData.number)
    }, [cardData.number])
    
    const uniqueEventIds = useMemo(() => {
        return [...new Set(items.map(item => item.eventId))]
    }, [items])
    
    const { data: eventsData } = useEventFindByIds(uniqueEventIds)
    
    const eventsWithForms = useMemo(() => {
        return eventsData.filter(event => {
            if (!event?.form) return false
            
            let parsedForm = event.form
            
            if (typeof event.form === 'string') {
                try {
                    parsedForm = JSON.parse(event.form)
                } catch (e) {
                    return false
                }
            }
            
            if (typeof parsedForm !== 'object' || parsedForm === null) return false
            
            return Object.keys(parsedForm).length > 0
        })
    }, [eventsData])
    
    const hasForms = eventsWithForms.length > 0
    
    const allFormFields = useMemo(() => {
        if (!hasForms) return []
        
        const fieldsByEvent: Record<string, Array<{ eventId: string, eventName: string, type: string, field: any, order: number }>> = {}
        
        eventsWithForms.forEach(event => {
            if (!event?.form) return
            
            let parsedForm = event.form
            
            if (typeof event.form === 'string') {
                try {
                    parsedForm = JSON.parse(event.form)
                } catch (e) {
                    return
                }
            }
            
            if (typeof parsedForm !== 'object' || parsedForm === null) return
            
            if (!fieldsByEvent[event.id]) {
                fieldsByEvent[event.id] = []
            }
            
            const formTypes = ['text', 'email', 'textArea', 'select', 'multiSelect']
            
            formTypes.forEach(type => {
                if (Array.isArray(parsedForm[type])) {
                    parsedForm[type].forEach((field: any) => {
                        fieldsByEvent[event.id].push({
                            eventId: event.id,
                            eventName: event.name,
                            type,
                            field,
                            order: field.order !== undefined ? field.order : 999
                        })
                    })
                }
            })
            
            fieldsByEvent[event.id].sort((a, b) => a.order - b.order)
        })
        
        const allFields: Array<{ eventId: string, eventName: string, type: string, field: any, order: number }> = []
        
        Object.values(fieldsByEvent).forEach(eventFields => {
            allFields.push(...eventFields)
        })
        
        return allFields
    }, [eventsWithForms, hasForms])
    
    const formFieldsByEvent = useMemo(() => {
        const grouped: Record<string, Array<{ eventId: string, eventName: string, type: string, field: any, order: number }>> = {}
        
        allFormFields.forEach(field => {
            if (!grouped[field.eventId]) {
                grouped[field.eventId] = []
            }
            grouped[field.eventId].push(field)
        })
        
        return grouped
    }, [allFormFields])
    
    const getEventTicketQuantity = useMemo(() => {
        const quantities: Record<string, number> = {}
        
        items.forEach(item => {
            if (!quantities[item.eventId]) {
                quantities[item.eventId] = 0
            }
            
            if (item.ticketTypes && item.ticketTypes.length > 0) {
                const total = item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
                quantities[item.eventId] += total
            } else {
                quantities[item.eventId] += item.quantity
            }
        })
        
        return quantities
    }, [items])
    
    const getTicketTypeNameByIndex = useMemo(() => {
        const mapping: Record<string, string[]> = {}
        
        items.forEach(item => {
            if (!mapping[item.eventId]) {
                mapping[item.eventId] = []
            }
            
            if (item.ticketTypes && item.ticketTypes.length > 0) {
                item.ticketTypes.forEach(tt => {
                    for (let i = 0; i < tt.quantity; i++) {
                        mapping[item.eventId].push(tt.ticketTypeName)
                    }
                })
            } else {
                for (let i = 0; i < item.quantity; i++) {
                    mapping[item.eventId].push("Ingresso")
                }
            }
        })
        
        return mapping
    }, [items])
    
    const getTicketTypeDescriptionByIndex = useMemo(() => {
        const mapping: Record<string, string[]> = {}
        
        items.forEach(item => {
            if (!mapping[item.eventId]) {
                mapping[item.eventId] = []
            }
            
            const event = eventsData.find(e => e?.id === item.eventId)
            
            if (item.ticketTypes && item.ticketTypes.length > 0) {
                item.ticketTypes.forEach(tt => {
                    const ticketType = event?.TicketTypes?.find(t => t.id === tt.ticketTypeId)
                    const description = ticketType?.description || ""
                    
                    for (let i = 0; i < tt.quantity; i++) {
                        mapping[item.eventId].push(description)
                    }
                })
            } else {
                for (let i = 0; i < item.quantity; i++) {
                    mapping[item.eventId].push("")
                }
            }
        })
        
        return mapping
    }, [items, eventsData])
    
    const maxStep = hasForms ? 4 : 3
    
    const total = useMemo(() => {
        return items.reduce((sum, item) => {
            const event = eventsData.find(e => e?.id === item.eventId)
            return sum + CheckoutUtils.calculateItemTotal(item, event || null)
        }, 0)
    }, [items, eventsData])
    
    const handleNext = () => {
        if (currentStep === 3 && hasForms) {
            const eventsWithFormForEachTicket = eventsWithForms.filter(event => event && event.isFormForEachTicket === true)
            
            for (const event of eventsWithFormForEachTicket) {
                if (!event) continue
                const ticketQuantity = getEventTicketQuantity[event.id] || 0
                const eventFields = formFieldsByEvent[event.id] || []
                
                for (let ticketIndex = 0; ticketIndex < ticketQuantity; ticketIndex++) {
                    const requiredFields = eventFields.filter(f => f.field.required)
                    const missingFields = requiredFields.filter(f => {
                        const key = `${f.eventId}-${ticketIndex}-${f.type}-${f.field.order}`
                        const answer = formAnswers[key]
                        
                        if (!answer) return true
                        if (Array.isArray(answer) && answer.length === 0) return true
                        if (typeof answer === 'string') {
                            const trimmed = answer.trim()
                            if (trimmed === '') return true
                            
                            if (f.type === 'text' && f.field.mask) {
                                const minLength = getInputMaskMin(f.field.mask)
                                if (trimmed.length < minLength) return true
                            }
                        }
                        
                        return false
                    })
                    
                    if (missingFields.length > 0) {
                        Toast.info(`Por favor, preencha todos os campos obrigatórios do formulário para o ingresso ${ticketIndex + 1} do evento "${event.name}".`)
                        return
                    }
                }
            }
            
            const eventsWithFormOnce = eventsWithForms.filter(event => event && event.isFormForEachTicket !== true)
            
            for (const event of eventsWithFormOnce) {
                if (!event) continue
                const eventFields = formFieldsByEvent[event.id] || []
                const requiredFields = eventFields.filter(f => f.field.required)
                const missingFields = requiredFields.filter(f => {
                    const key = `${f.eventId}-${f.type}-${f.field.order}`
                    const answer = formAnswers[key]
                    
                    if (!answer) return true
                    if (Array.isArray(answer) && answer.length === 0) return true
                    if (typeof answer === 'string') {
                        const trimmed = answer.trim()
                        if (trimmed === '') return true
                        
                        if (f.type === 'text' && f.field.mask) {
                            const minLength = getInputMaskMin(f.field.mask)
                            if (trimmed.length < minLength) return true
                        }
                    }
                    
                    return false
                })
                
                if (missingFields.length > 0) {
                    Toast.info(`Por favor, preencha todos os campos obrigatórios do formulário do evento "${event.name}".`)
                    return
                }
            }
        }
        
        if (currentStep < maxStep) {
            setCurrentStep(currentStep + 1)
        }
    }
    
    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }
    
    const handleFinalize = () => {
        console.log("Finalizando compra...")
    }
    
    if (items.length === 0) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-12 mt-[100px]">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <h1 className="text-2xl font-semibold text-psi-dark">Carrinho vazio</h1>
                        <p className="text-psi-dark/60">Adicione ingressos ao carrinho antes de finalizar a compra.</p>
                        <Button onClick={() => router.push("/")} variant="primary">
                            Voltar para eventos
                        </Button>
                    </div>
                </div>
            </Background>
        )
    }
    
    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[100px]
            sm:py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-psi-dark mb-2
                        sm:text-4xl">
                            Checkout
                        </h1>
                        <p className="text-psi-dark/60">
                            Finalize sua compra de ingressos
                        </p>
                    </div>
                    
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {[
                                { number: 1, label: "Dados do Comprador", icon: User },
                                { number: 2, label: "Resumo", icon: Receipt },
                                ...(hasForms ? [{ number: 3, label: "Formulário", icon: ClipboardList }] : []),
                                { number: hasForms ? 4 : 3, label: "Finalização", icon: CheckCircle2 }
                            ].map((step, index) => {
                                const isActive = currentStep === step.number
                                const isCompleted = currentStep > step.number
                                const StepIcon = step.icon
                                
                                return (
                                    <div key={step.number} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center flex-1">
                                            <div className={`flex items-center justify-center size-10 rounded-full border-2 transition-all ${
                                                isActive
                                                    ? "border-psi-primary bg-psi-primary text-white"
                                                    : isCompleted
                                                    ? "border-psi-primary bg-psi-primary text-white"
                                                    : "border-psi-dark/20 bg-white text-psi-dark/40"
                                            }`}>
                                                {isCompleted ? (
                                                    <Check className="size-5" />
                                                ) : (
                                                    <StepIcon className="size-5" />
                                                )}
                                            </div>
                                            <span className={`mt-2 text-xs font-medium text-center
                                            sm:text-sm ${
                                                isActive
                                                    ? "text-psi-primary"
                                                    : isCompleted
                                                    ? "text-psi-primary"
                                                    : "text-psi-dark/40"
                                            }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {index < (hasForms ? 3 : 2) && (
                                            <div className={`flex-1 h-0.5 mx-2 transition-all ${
                                                isCompleted
                                                    ? "bg-psi-primary"
                                                    : "bg-psi-dark/20"
                                            }`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    <div className="grid gap-8
                    lg:grid-cols-[1fr_400px]">
                        <div className="space-y-6">
                            {currentStep === 1 && (
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <h2 className="text-xl font-semibold text-psi-dark mb-6">Dados do Comprador</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="grid gap-4
                                        sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Nome *
                                                </label>
                                                <Input
                                                    value={buyerData.firstName}
                                                    onChange={(e) => setBuyerData({ ...buyerData, firstName: e.target.value })}
                                                    icon={User}
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Sobrenome *
                                                </label>
                                                <Input
                                                    value={buyerData.lastName}
                                                    onChange={(e) => setBuyerData({ ...buyerData, lastName: e.target.value })}
                                                    icon={User}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                E-mail *
                                            </label>
                                            <Input
                                                type="email"
                                                value={buyerData.email}
                                                onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                                                icon={Mail}
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Telefone *
                                            </label>
                                            <InputMask
                                                mask="(00) 00000-0000"
                                                value={buyerData.phone}
                                                onAccept={(value) => setBuyerData({ ...buyerData, phone: value as string })}
                                                placeholder="(00) 00000-0000"
                                                icon={Phone}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                CPF/CNPJ *
                                            </label>
                                            <InputMask
                                                mask="000.000.000-00"
                                                value={buyerData.document}
                                                onAccept={(value) => setBuyerData({ ...buyerData, document: value as string })}
                                                placeholder="000.000.000-00"
                                                icon={FileText}
                                            />
                                        </div>
                                        
                                        <div className="pt-4 border-t border-psi-dark/10">
                                            <h3 className="text-lg font-semibold text-psi-dark mb-4">Endereço</h3>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    CEP *
                                                </label>
                                                <InputMask
                                                    mask="00000-000"
                                                    value={buyerData.zipcode}
                                                    onAccept={(value) => setBuyerData({ ...buyerData, zipcode: value as string })}
                                                    placeholder="00000-000"
                                                    icon={MapPin}
                                                />
                                            </div>
                                            
                                            <div className="grid gap-4
                                            sm:grid-cols-2 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Rua *
                                                    </label>
                                                    <Input
                                                        value={buyerData.street}
                                                        onChange={(e) => setBuyerData({ ...buyerData, street: e.target.value })}
                                                        icon={MapPin}
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Número
                                                    </label>
                                                    <Input
                                                        value={buyerData.number}
                                                        onChange={(e) => setBuyerData({ ...buyerData, number: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Complemento
                                                </label>
                                                <Input
                                                    value={buyerData.complement}
                                                    onChange={(e) => setBuyerData({ ...buyerData, complement: e.target.value })}
                                                />
                                            </div>
                                            
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Bairro *
                                                </label>
                                                <Input
                                                    value={buyerData.neighborhood}
                                                    onChange={(e) => setBuyerData({ ...buyerData, neighborhood: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="grid gap-4
                                            sm:grid-cols-3 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Cidade *
                                                    </label>
                                                    <Input
                                                        value={buyerData.city}
                                                        onChange={(e) => setBuyerData({ ...buyerData, city: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Estado *
                                                    </label>
                                                    <Input
                                                        value={buyerData.state}
                                                        onChange={(e) => setBuyerData({ ...buyerData, state: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        País *
                                                    </label>
                                                    <Input
                                                        value={buyerData.country}
                                                        onChange={(e) => setBuyerData({ ...buyerData, country: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {currentStep === 2 && (
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 grid grid-cols-1
                                sm:p-8 shadow-sm">
                                    <h2 className="text-xl font-semibold text-psi-dark mb-6">Resumo da Compra</h2>
                                    
                                    <div className="space-y-4">
                                        {items.map((item) => {
                                            const event = eventsData.find(e => e?.id === item.eventId)
                                            if (!event) return null
                                            
                                            return (
                                                <div key={`${item.eventId}-${item.batchId}`} className="border border-psi-dark/10 rounded-xl p-4">
                                                    <div className="flex flex-col lg:flex-row gap-4">
                                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-psi-dark/5 shrink-0">
                                                            <img
                                                                src={ImageUtils.getEventImageUrl(event.image)}
                                                                alt={event.name}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        
                                                        <div className="flex-1 space-y-2">
                                                            <h3 className="font-semibold text-psi-dark">{event.name}</h3>
                                                            
                                                            {item.batchName && (
                                                                <p className="text-sm text-psi-dark/60">Lote: {item.batchName}</p>
                                                            )}
                                                            
                                                            {event.EventDates && event.EventDates.length > 0 && (
                                                                <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                                                    <Calendar className="size-4" aria-label="Datas e horários do evento" />
                                                                    <span>
                                                                        {event.EventDates.map((ed, index) => (
                                                                            <span key={ed.id}>
                                                                                {index > 0 && <br />}
                                                                                {formatEventDate(ed.date, "DD [de] MMMM [de] YYYY")}{" "}
                                                                                <span className="inline-flex items-center gap-1">
                                                                                    | <Clock className="size-3 inline" aria-label="Hora do evento" />
                                                                                    {formatEventTime(ed.hourStart, ed.hourEnd)}
                                                                                </span>
                                                                            </span>
                                                                        ))}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            
                                                            {item.ticketTypes && item.ticketTypes.length > 0 ? (
                                                                <div className="space-y-3 pt-2">
                                                                    <p className="text-sm font-medium text-psi-dark/70">Tipos de ingressos:</p>
                                                                    {item.ticketTypes.map((tt, ttIndex) => {
                                                                        const isMultipleDaysWithTicketTypes = tt.days && tt.days.length > 0 && tt.ticketTypeId && tt.ticketTypeId !== ""
                                                                        const uniqueKey = tt.days && tt.days.length > 0 ? tt.days[0] : `${tt.ticketTypeId}-${ttIndex}`
                                                                        return (
                                                                        <div key={uniqueKey} className="flex items-center justify-between p-2 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                                                            <div className="flex-1">
                                                                                <p className="text-sm font-medium text-psi-dark">{tt.ticketTypeName}</p>
                                                                                {tt.days && tt.days.length > 0 && (
                                                                                    <p className="text-xs text-psi-dark/60 mt-1">
                                                                                        {isMultipleDaysWithTicketTypes && tt.days && tt.days.length > 0
                                                                                            ? event && 'EventDates' in event && (event as any).EventDates?.find((ed: any) => ed.id === tt.days?.[0]) 
                                                                                                ? formatEventDate((event as any).EventDates.find((ed: any) => ed.id === tt.days?.[0])?.date, "DD [de] MMMM [de] YYYY")
                                                                                                : "Dia selecionado"
                                                                                            : tt.days && tt.days.length === 1 ? "1 dia selecionado" : tt.days ? `${tt.days.length} dias selecionados` : ""}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                            <div className="flex items-center gap-3">
                                                                                <QuantitySelector
                                                                                    value={tt.quantity}
                                                                                    onChange={(qty) => {
                                                                                        const isDayBasedWithoutTicketTypes = CheckoutUtils.isDayBasedWithoutTicketTypes([tt])
                                                                                        const isMultipleDaysWithTicketTypes = CheckoutUtils.isMultipleDaysWithTicketTypes([tt])
                                                                                        const identifier = CheckoutUtils.getTicketTypeIdentifier(tt)
                                                                                        
                                                                                        if (qty === 0 && item.ticketTypes && item.ticketTypes.length > 1) {
                                                                                            const updatedTicketTypes = CheckoutUtils.filterTicketTypesByIdentifier(
                                                                                                item.ticketTypes,
                                                                                                identifier,
                                                                                                isDayBasedWithoutTicketTypes,
                                                                                                isMultipleDaysWithTicketTypes
                                                                                            )
                                                                                            if (updatedTicketTypes.length === 0) {
                                                                                                removeItem(item.eventId, item.batchId)
                                                                                                return
                                                                                            }
                                                                                            const newTotalQuantity = updatedTicketTypes.reduce((sum, t) => sum + t.quantity, 0)
                                                                                            
                                                                                            const batch = event.EventBatches?.find(b => b.id === item.batchId)
                                                                                            const hasEventBatchTicketTypes = batch?.EventBatchTicketTypes && batch.EventBatchTicketTypes.length > 0
                                                                                            
                                                                                            const newTotalPrice = CheckoutUtils.calculateBasePriceForTicketTypes(
                                                                                                updatedTicketTypes,
                                                                                                event,
                                                                                                batch || null,
                                                                                                hasEventBatchTicketTypes
                                                                                            )
                                                                                            
                                                                                            addItem({
                                                                                                eventId: item.eventId,
                                                                                                eventName: item.eventName,
                                                                                                batchId: item.batchId,
                                                                                                batchName: item.batchName,
                                                                                                price: newTotalPrice || 0,
                                                                                                ticketTypes: updatedTicketTypes,
                                                                                                isClientTaxed: item.isClientTaxed
                                                                                            }, newTotalQuantity)
                                                                                            return
                                                                                        }
                                                                                        
                                                                                        if (tt.days && tt.days.length > 0 && event) {
                                                                                            const batch = event.EventBatches?.find(b => b.id === item.batchId)
                                                                                            const hasEventBatchTicketTypes = batch?.EventBatchTicketTypes && batch.EventBatchTicketTypes.length > 0
                                                                                            
                                                                                            const updatedTicketTypes = CheckoutUtils.updateTicketTypeQuantityByIdentifier(
                                                                                                item.ticketTypes || [],
                                                                                                identifier,
                                                                                                qty,
                                                                                                isDayBasedWithoutTicketTypes,
                                                                                                isMultipleDaysWithTicketTypes
                                                                                            )
                                                                                            
                                                                                            const newTotalPrice = CheckoutUtils.calculateBasePriceForTicketTypes(
                                                                                                updatedTicketTypes || [],
                                                                                                event,
                                                                                                batch || null,
                                                                                                hasEventBatchTicketTypes
                                                                                            )
                                                                                            
                                                                                            const newTotalQuantity = updatedTicketTypes?.reduce((sum, t) => sum + t.quantity, 0) || 0
                                                                                            
                                                                                            if (updatedTicketTypes && updatedTicketTypes.length > 0 && newTotalQuantity > 0) {
                                                                                                addItem({
                                                                                                    eventId: item.eventId,
                                                                                                    eventName: item.eventName,
                                                                                                    batchId: item.batchId,
                                                                                                    batchName: item.batchName,
                                                                                                    price: newTotalPrice || 0,
                                                                                                    ticketTypes: updatedTicketTypes,
                                                                                                    isClientTaxed: item.isClientTaxed
                                                                                                }, newTotalQuantity)
                                                                                            }
                                                                                            return
                                                                                        }
                                                                                        
                                                                                        updateTicketTypeQuantity(item.eventId, item.batchId, tt.ticketTypeId, qty)
                                                                                    }}
                                                                                    min={1}
                                                                                    max={10}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            ) : (
                                                            <div className="flex items-center justify-between pt-2">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-sm text-psi-dark/60">Quantidade:</span>
                                                                    <QuantitySelector
                                                                        value={item.quantity}
                                                                        onChange={(qty) => updateQuantity(item.eventId, item.batchId, qty)}
                                                                        min={1}
                                                                        max={10}
                                                                    />
                                                                </div>
                                                                </div>
                                                            )}
                                                                
                                                            <div className="flex items-center justify-between pt-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(item.eventId, item.batchId)}
                                                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </button>
                                                            </div>
                                                            
                                                            <div className="pt-2 border-t border-psi-dark/10">
                                                                <p className="text-lg font-semibold text-psi-primary">
                                                                    {ValueUtils.centsToCurrency(CheckoutUtils.calculateItemTotal(item, event))}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    
                                    <div className="mt-6 p-4 rounded-xl bg-psi-primary/5 border border-psi-primary/20">
                                        <div className="flex items-start gap-3">
                                            <Receipt className="size-5 text-psi-primary shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="font-semibold text-psi-dark">Importante</p>
                                                <p className="text-sm text-psi-dark/70">
                                                    Os ingressos serão enviados para o seu e-mail juntamente com o comprovante de pagamento após a confirmação.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {currentStep === 3 && hasForms && (
                                <div className="space-y-6">
                                    {Object.entries(formFieldsByEvent).map(([eventId, fields]) => {
                                        const event = eventsData.find(e => e?.id === eventId)
                                        const eventName = fields[0]?.eventName || "Evento"
                                        const isForEachTicket = event?.isFormForEachTicket === true
                                        const ticketQuantity = isForEachTicket ? (getEventTicketQuantity[eventId] || 0) : 1
                                        
                                        return (
                                            <div key={eventId} className="space-y-6">
                                                {Array.from({ length: ticketQuantity }).map((_, ticketIndex) => {
                                                    const ticketNumber = ticketIndex + 1
                                                    const ticketTypeName = getTicketTypeNameByIndex[eventId]?.[ticketIndex] || "Ingresso"
                                                    const ticketTypeDescription = getTicketTypeDescriptionByIndex[eventId]?.[ticketIndex] || ""
                                                    return (
                                                        <div key={`${eventId}-${ticketIndex}`} className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                                        sm:p-8 shadow-sm">
                                                            <div className="mb-6">
                                                                <h2 className="text-xl font-semibold text-psi-dark mb-1">{eventName}</h2>
                                                                {isForEachTicket && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-psi-primary">Ingresso {ticketNumber} de {ticketQuantity}</p>
                                                                        <p className="text-sm font-semibold text-psi-dark">{ticketTypeName !== "Ingresso" ? ticketTypeName : ""}</p>
                                                                        {ticketTypeDescription && (
                                                                            <p className="text-xs text-psi-dark/60 mt-1">{ticketTypeDescription}</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <p className="text-sm text-psi-dark/60 mt-1">Formulário Personalizado</p>
                                                            </div>
                                                            
                                                            <div className="space-y-6">
                                                                {fields.map((formField) => {
                                                                    const key = isForEachTicket 
                                                                        ? `${formField.eventId}-${ticketIndex}-${formField.type}-${formField.field.order}`
                                                                        : `${formField.eventId}-${formField.type}-${formField.field.order}`
                                                                    const currentValue = formAnswers[key] || (formField.type === 'multiSelect' ? [] : '')
                                                                    
                                                                    return (
                                                                        <div key={key} className="space-y-2">
                                                                            <label className="block text-sm font-medium text-psi-dark">
                                                                                {formField.field.label}
                                                                                {formField.field.required && <span className="text-destructive ml-1">*</span>}
                                                                            </label>
                                                                            
                                                                            {formField.type === 'text' && (
                                                                                formField.field.mask ? (
                                                                                    <InputMask
                                                                                        mask={formField.field.mask}
                                                                                        value={currentValue}
                                                                                        onAccept={(value) => setFormAnswers({ ...formAnswers, [key]: value as string })}
                                                                                        placeholder={formField.field.placeholder || ""}
                                                                                        min={getInputMaskMin(formField.field.mask)}
                                                                                    />
                                                                                ) : (
                                                                                    <Input
                                                                                        value={currentValue}
                                                                                        onChange={(e) => setFormAnswers({ ...formAnswers, [key]: e.target.value })}
                                                                                        placeholder={formField.field.placeholder || ""}
                                                                                        required={formField.field.required}
                                                                                    />
                                                                                )
                                                                            )}
                                                                            
                                                                            {formField.type === 'email' && (
                                                                                <Input
                                                                                    type="email"
                                                                                    value={currentValue}
                                                                                    onChange={(e) => setFormAnswers({ ...formAnswers, [key]: e.target.value })}
                                                                                    placeholder={formField.field.placeholder || ""}
                                                                                    required={formField.field.required}
                                                                                />
                                                                            )}
                                                                            
                                                                            {formField.type === 'textArea' && (
                                                                                <Textarea
                                                                                    value={currentValue}
                                                                                    onChange={(e) => setFormAnswers({ ...formAnswers, [key]: e.target.value })}
                                                                                    placeholder={formField.field.placeholder || ""}
                                                                                    required={formField.field.required}
                                                                                    className="min-h-[100px]"
                                                                                />
                                                                            )}
                                                                            
                                                                            {formField.type === 'select' && (
                                                                                <Select
                                                                                    value={currentValue}
                                                                                    onValueChange={(value) => setFormAnswers({ ...formAnswers, [key]: value })}
                                                                                    required={formField.field.required}
                                                                                >
                                                                                    <SelectTrigger className="w-full">
                                                                                        <SelectValue placeholder="Selecione uma opção..." />
                                                                                    </SelectTrigger>
                                                                                    <SelectContent>
                                                                                        {formField.field.options?.map((option: string, optIndex: number) => (
                                                                                            <SelectItem key={optIndex} value={option}>
                                                                                                {option}
                                                                                            </SelectItem>
                                                                                        ))}
                                                                                    </SelectContent>
                                                                                </Select>
                                                                            )}
                                                                            
                                                                            {formField.type === 'multiSelect' && (
                                                                                <div className="space-y-2">
                                                                                    {formField.field.options?.map((option: string, optIndex: number) => {
                                                                                        const isChecked = Array.isArray(currentValue) && currentValue.includes(option)
                                                                                        return (
                                                                                            <div key={optIndex} className="flex items-center gap-2">
                                                                                                <Checkbox
                                                                                                    id={`${key}-${optIndex}`}
                                                                                                    checked={isChecked}
                                                                                                    onCheckedChange={(checked) => {
                                                                                                        const currentArray = Array.isArray(currentValue) ? currentValue : []
                                                                                                        if (checked) {
                                                                                                            setFormAnswers({ ...formAnswers, [key]: [...currentArray, option] })
                                                                                                        } else {
                                                                                                            setFormAnswers({ ...formAnswers, [key]: currentArray.filter((v: string) => v !== option) })
                                                                                                        }
                                                                                                    }}
                                                                                                />
                                                                                                <label htmlFor={`${key}-${optIndex}`} className="text-sm text-psi-dark cursor-pointer">
                                                                                                    {option}
                                                                                                </label>
                                                                                            </div>
                                                                                        )
                                                                                    })}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                            
                            {currentStep === (hasForms ? 4 : 3) && (
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <div className="text-center space-y-4 mb-6">
                                        <div className="inline-flex items-center justify-center size-16 rounded-full bg-psi-primary/10">
                                            <CheckCircle2 className="size-8 text-psi-primary" />
                                        </div>
                                        <h2 className="text-2xl font-semibold text-psi-dark">Finalizar Compra</h2>
                                        <p className="text-psi-dark/60">
                                            Revise todas as informações e escolha a forma de pagamento
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-lg font-semibold text-psi-dark mb-4">Forma de Pagamento</h3>
                                            
                                            <div className="space-y-4 mb-6">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod("pix")}
                                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                                        paymentMethod === "pix"
                                                            ? "border-psi-primary bg-psi-primary/5"
                                                            : "border-psi-dark/10 hover:border-psi-primary/30"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`size-4 rounded-full border-2 ${
                                                            paymentMethod === "pix"
                                                                ? "border-psi-primary bg-psi-primary"
                                                                : "border-psi-dark/30"
                                                        }`}>
                                                            {paymentMethod === "pix" && (
                                                                <div className="size-full rounded-full bg-white scale-50" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                        <img
                                                            src="/icons/payment/pix.png"
                                                            width={25}
                                                        />
                                                        <span className="font-semibold text-psi-dark">PIX</span>
                                                        </div>
                                                    </div>
                                                </button>
                                                
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod("credit")}
                                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                                        paymentMethod === "credit"
                                                            ? "border-psi-primary bg-psi-primary/5"
                                                            : "border-psi-dark/10 hover:border-psi-primary/30"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className={`size-4 rounded-full border-2 ${
                                                            paymentMethod === "credit"
                                                                ? "border-psi-primary bg-psi-primary"
                                                                : "border-psi-dark/30"
                                                        }`}>
                                                            {paymentMethod === "credit" && (
                                                                <div className="size-full rounded-full bg-white scale-50" />
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                        <img
                                                            src="/icons/payment/credit-card.png"
                                                            width={25}
                                                        />
                                                        <span className="font-semibold text-psi-dark">Cartão de Crédito</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </div>
                                            
                                            {paymentMethod === "credit" && (
                                                <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                                            Número do Cartão *
                                                        </label>
                                                        <div className="relative">
                                                            <InputMask
                                                                mask="0000 0000 0000 0000"
                                                                value={cardData.number}
                                                                onAccept={(value) => setCardData({ ...cardData, number: value as string })}
                                                                placeholder="0000 0000 0000 0000"
                                                                icon={CreditCard}
                                                            />
                                                            {cardBrand && (
                                                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                                    <div className={`size-10 rounded flex items-center justify-center text-xs font-bold ${
                                                                        cardBrand === "visa" ? "bg-[#1434CB] text-white" :
                                                                        cardBrand === "mastercard" ? "bg-[#EB001B] text-white" :
                                                                        cardBrand === "amex" ? "bg-[#006FCF] text-white" :
                                                                        cardBrand === "elo" ? "bg-[#FFCB05] text-[#231F20]" :
                                                                        cardBrand === "hipercard" ? "bg-[#DF0F50] text-white" :
                                                                        "bg-gray-600 text-white"
                                                                    }`}>
                                                                        {cardBrand === "visa" ? "VISA" :
                                                                         cardBrand === "mastercard" ? "MC" :
                                                                         cardBrand === "amex" ? "AMEX" :
                                                                         cardBrand === "elo" ? "ELO" :
                                                                         cardBrand === "hipercard" ? "HIPER" :
                                                                         cardBrand.toUpperCase().substring(0, 4)}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                                            Nome no Cartão *
                                                        </label>
                                                        <Input
                                                            value={cardData.name}
                                                            onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                                            placeholder="NOME COMO ESTÁ NO CARTÃO"
                                                            required
                                                        />
                                                    </div>
                                                    
                                                    <div className="grid gap-4
                                                    sm:grid-cols-2">
                                                        <div>
                                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                                Validade *
                                                            </label>
                                                            <InputMask
                                                                mask="00/00"
                                                                value={cardData.expiry}
                                                                onAccept={(value) => setCardData({ ...cardData, expiry: value as string })}
                                                                placeholder="MM/AA"
                                                            />
                                                        </div>
                                                        
                                                        <div>
                                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                                CVV *
                                                            </label>
                                                            <InputMask
                                                                mask="000"
                                                                value={cardData.cvv}
                                                                onAccept={(value) => setCardData({ ...cardData, cvv: value as string })}
                                                                placeholder="000"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="p-4 rounded-xl bg-psi-dark/5">
                                            <h3 className="font-semibold text-psi-dark mb-2">Resumo</h3>
                                            <div className="space-y-1 text-sm text-psi-dark/70">
                                                <p><strong>Total:</strong> {ValueUtils.centsToCurrency(total)}</p>
                                                <p><strong>Itens:</strong> {items.reduce((sum, item) => sum + item.quantity, 0)} ingresso(s)</p>
                                                <p><strong>Pagamento:</strong> {paymentMethod === "pix" ? "PIX" : "Cartão de Crédito"}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                onClick={handleFinalize}
                                                variant="primary"
                                                size="lg"
                                                className=""
                                            >
                                                <Check className="size-4" />
                                                Finalizar Compra
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-6">
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePrevious}
                                    >
                                        <ChevronLeft className="size-4" />
                                        Voltar
                                    </Button>
                                )}
                                
                                {currentStep < maxStep && (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleNext}
                                        className="ml-auto"
                                    >
                                        Continuar
                                        <ChevronRight className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="lg:sticky lg:top-[100px] lg:h-fit">
                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="font-semibold text-psi-dark mb-4">Resumo do Pedido</h3>
                                
                                <div className="space-y-3 mb-4">
                                    {items.flatMap((item) => {
                                        const event = eventsData.find(e => e?.id === item.eventId)
                                        
                                        if (item.ticketTypes && item.ticketTypes.length > 0) {
                                            return item.ticketTypes.map((tt, ttIndex) => {
                                                const eventDate = tt.days && tt.days.length > 0 && event?.EventDates
                                                    ? event.EventDates.find(ed => ed.id === tt.days?.[0])
                                                    : null
                                                
                                                const dayLabel = eventDate 
                                                    ? formatEventDate(eventDate.date, "DD [de] MMMM")
                                                    : null
                                                
                                                const ticketTypeLabel = dayLabel 
                                                    ? `${tt.ticketTypeName} - ${dayLabel}`
                                                    : tt.ticketTypeName
                                                
                                                const itemForThisTicketType: any = {
                                                    ...item,
                                                    ticketTypes: [tt],
                                                    quantity: tt.quantity
                                                }
                                                
                                                return (
                                                    <div key={`${item.eventId}-${item.batchId}-${ttIndex}`} className="flex items-center justify-between text-sm">
                                                        <span className="text-psi-dark/70">
                                                            {ticketTypeLabel} x{tt.quantity}
                                                        </span>
                                                        <span className="font-semibold text-psi-dark">
                                                            {ValueUtils.centsToCurrency(CheckoutUtils.calculateItemTotal(itemForThisTicketType, event || null))}
                                                        </span>
                                                    </div>
                                                )
                                            })
                                        }
                                        
                                        return (
                                        <div key={`${item.eventId}-${item.batchId}`} className="flex items-center justify-between text-sm">
                                            <span className="text-psi-dark/70">
                                                {item.eventName} x{item.quantity}
                                            </span>
                                            <span className="font-semibold text-psi-dark">
                                                    {ValueUtils.centsToCurrency(CheckoutUtils.calculateItemTotal(item, event || null))}
                                            </span>
                                        </div>
                                        )
                                    })}
                                </div>
                                
                                <div className="pt-4 border-t border-psi-dark/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-psi-dark">Total</span>
                                        <span className="text-2xl font-bold text-psi-primary">
                                            {ValueUtils.centsToCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    CheckoutInfo
}

