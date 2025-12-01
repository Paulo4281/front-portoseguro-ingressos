"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
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
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
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
    ClipboardList,
    Loader2,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    UserCircle,
    ArrowRight
} from "lucide-react"
import { useRouter } from "next/navigation"
import { CTAButton } from "@/components/CTAButton/CTAButton"
import { Toast } from "@/components/Toast/Toast"
import { useCouponCheck } from "@/hooks/Coupon/useCouponCheck"
import { useUserCheckEmailExists } from "@/hooks/User/useUserCheckEmailExistst"
import { useAuthLogin } from "@/hooks/Auth/useAuthLogin"
import { useUserCreate } from "@/hooks/User/useUserCreate"
import { useUserConfirmationConfirmByCode } from "@/hooks/UserConfirmation/useUserConfirmationConfirmByCode"
import { useUserConfirmationResendConfirmation } from "@/hooks/UserConfirmation/useUserConfirmationResendConfirmation"
import { AuthValidator } from "@/validators/Auth/AuthValidator"
import { UserCreateValidator } from "@/validators/User/UserValidator"
import { UserConfirmationCreateConfirmValidator } from "@/validators/User/UserConfirmationValidator"
import type { TAuth } from "@/types/Auth/TAuth"
import type { TUserCreate } from "@/types/User/TUser"
import type { TUserCreateConfirm } from "@/types/User/TUserConfirmation"
import type { TTicketBuy, TTicketBuyResponse } from "@/types/Ticket/TTicket"
import { FieldError } from "@/components/FieldError/FieldError"
import { PasswordStrength } from "@/components/PasswordStrength/PasswordStrength"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { Icon } from "@/components/Icon/Icon"
import { Timer } from "@/components/Timer/Timer"
import { getStates, getCitiesByState } from "@/utils/Helpers/IBGECitiesAndStates/IBGECitiesAndStates"
import { getCountries, getCountriesSync } from "@/utils/Helpers/Countries/Countries"
import { SelectInstallment, calculateTotalWithInstallmentFee } from "@/components/SelectInstallment/SelectInstallment"
import { useTicketBuy } from "@/hooks/Ticket/useTicketBuy"

type TPaymentMethod = "pix" | "credit"

const CheckoutInfo = () => {
    const { items, updateQuantity, updateTicketTypeQuantity, addItem, removeItem, getTotal } = useCart()
    const { user, isAuthenticated, setUser } = useAuthStore()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("pix")
    
    const [buyerData, setBuyerData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        document: user?.document || "",
        street: user?.Address?.street || "",
        number: user?.Address?.number || "",
        complement: user?.Address?.complement || "",
        neighborhood: user?.Address?.neighborhood || "",
        zipCode: user?.Address?.zipCode || "",
        city: user?.Address?.city || "",
        state: user?.Address?.state || "",
        country: user?.Address?.country || "Brasil",
    })

    const [emailInput, setEmailInput] = useState("")
    const [showLoginDialog, setShowLoginDialog] = useState(false)
    const [showCadastroDialog, setShowCadastroDialog] = useState(false)
    const [showConfirmacaoDialog, setShowConfirmacaoDialog] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [canResend, setCanResend] = useState(false)
    const [timerKey, setTimerKey] = useState(0)
    const [hasResent, setHasResent] = useState(false)
    const [cadastroEmail, setCadastroEmail] = useState("")
    const [cadastroName, setCadastroName] = useState("")

    const { mutateAsync: checkEmailExists, isPending: isCheckingEmail } = useUserCheckEmailExists()
    const { mutateAsync: loginUser, isPending: isLoggingIn } = useAuthLogin()
    const { mutateAsync: createUser, isPending: isCreatingUser } = useUserCreate()
    const { mutateAsync: confirmByCode, isPending: isConfirmingByCode } = useUserConfirmationConfirmByCode()
    const { mutateAsync: resendConfirmation, isPending: isResendingConfirmation } = useUserConfirmationResendConfirmation()
    const { mutateAsync: buyTicket, isPending: isBuyingTicket } = useTicketBuy()

    const [buyTicketResponse, setBuyTicketResponse] = useState<TTicketBuyResponse | null>(null)

    const loginForm = useForm<TAuth>({
        resolver: zodResolver(AuthValidator),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const cadastroForm = useForm<TUserCreate>({
        resolver: zodResolver(UserCreateValidator),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            role: "CUSTOMER"
        }
    })

    useEffect(() => {
        cadastroForm.setValue("role", "CUSTOMER")
    }, [cadastroForm])

    const confirmacaoForm = useForm<TUserCreateConfirm>({
        resolver: zodResolver(UserConfirmationCreateConfirmValidator),
        defaultValues: {
            code: ""
        }
    })

    const passwordValue = cadastroForm.watch("password")

    const states = useMemo(() => getStates(), [])
    const cities = useMemo(() => {
        return getCitiesByState(buyerData.state || "")
    }, [buyerData.state])
    const [countries, setCountries] = useState(getCountriesSync())

    useEffect(() => {
        if (isAuthenticated && user) {
            setBuyerData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                email: user.email || "",
                phone: user.phone || "",
                document: user.document || "",
                street: user.Address?.street || "",
                number: user.Address?.number || "",
                complement: user.Address?.complement || "",
                neighborhood: user.Address?.neighborhood || "",
                zipCode: user.Address?.zipCode || "",
                city: user.Address?.city || "",
                state: user.Address?.state || "",
                country: user.Address?.country || "Brasil",
            })
            setEmailInput("")
        }
    }, [isAuthenticated, user])

    useEffect(() => {
        if (showLoginDialog && emailInput) {
            loginForm.setValue("email", emailInput)
        }
    }, [showLoginDialog, emailInput, loginForm])

    useEffect(() => {
        if (showCadastroDialog && cadastroEmail) {
            cadastroForm.setValue("email", cadastroEmail)
        }
    }, [showCadastroDialog, cadastroEmail, cadastroForm])

    useEffect(() => {
        const loadCountries = async () => {
            const countriesList = await getCountries()
            setCountries(countriesList)
        }
        loadCountries()
    }, [])
    
    const [cardData, setCardData] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    })
    
    const [installments, setInstallments] = useState(1)
    
    const [formAnswers, setFormAnswers] = useState<Record<string, any>>({})
    const [couponCodes, setCouponCodes] = useState<Record<string, string>>({})
    const [couponLoading, setCouponLoading] = useState<Record<string, boolean>>({})
    const [appliedCoupons, setAppliedCoupons] = useState<Record<string, {
        id: string
        discountType: "PERCENTAGE" | "FIXED"
        discountValue: number
    }>>({})

    const { mutateAsync: checkCoupon } = useCouponCheck()

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
    
    const eventId = useMemo(() => {
        return items.length > 0 ? items[0].eventId : null
    }, [items])
    
    const uniqueEventIds = useMemo(() => {
        return eventId ? [eventId] : []
    }, [eventId])
    
    const { data: eventsData } = useEventFindByIds(uniqueEventIds)
    
    const currentEvent = useMemo(() => {
        if (!eventsData || !Array.isArray(eventsData) || eventsData.length === 0) return null
        return eventsData[0]
    }, [eventsData])

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
        
        const currentEvent = eventsWithForms[0]
        if (!currentEvent?.form) return []
        
        let parsedForm = currentEvent.form
        
        if (typeof currentEvent.form === 'string') {
            try {
                parsedForm = JSON.parse(currentEvent.form)
            } catch (e) {
                return []
            }
        }
        
        if (typeof parsedForm !== 'object' || parsedForm === null) return []
        
        const allFields: Array<{ eventId: string, eventName: string, type: string, field: any, order: number }> = []
        
        const formTypes = ['text', 'email', 'textArea', 'select', 'multiSelect']
        
        formTypes.forEach(type => {
            if (Array.isArray(parsedForm[type])) {
                parsedForm[type].forEach((field: any) => {
                    allFields.push({
                        eventId: currentEvent.id,
                        eventName: currentEvent.name,
                        type,
                        field,
                        order: field.order !== undefined ? field.order : 999
                    })
                })
            }
        })
        
        allFields.sort((a, b) => a.order - b.order)
        
        return allFields
    }, [eventsWithForms, hasForms])
    
    const formFieldsByEvent = useMemo(() => {
        const grouped: Record<string, Array<{ eventId: string, eventName: string, type: string, field: any, order: number }>> = {}
        
        if (allFormFields.length > 0) {
            const eventId = allFormFields[0].eventId
            grouped[eventId] = allFormFields
        }
        
        return grouped
    }, [allFormFields])
    
    const ticketQuantity = useMemo(() => {
        if (items.length === 0) return 0
        const item = items[0]
        if (item.ticketTypes && item.ticketTypes.length > 0) {
            return item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
        }
        return item.quantity
    }, [items])
    
    const ticketTypeNames = useMemo(() => {
        const names: string[] = []
        if (items.length === 0) return names
        
        const item = items[0]
        if (item.ticketTypes && item.ticketTypes.length > 0) {
            item.ticketTypes.forEach(tt => {
                for (let i = 0; i < tt.quantity; i++) {
                    names.push(tt.ticketTypeName)
                }
            })
        } else {
            for (let i = 0; i < item.quantity; i++) {
                names.push("Ingresso")
            }
        }
        
        return names
    }, [items])
    
    const ticketTypeDescriptions = useMemo(() => {
        const descriptions: string[] = []
        if (items.length === 0) return descriptions
        
        const item = items[0]
        const event = eventsData.find(e => e?.id === item.eventId)
        
        if (item.ticketTypes && item.ticketTypes.length > 0) {
            item.ticketTypes.forEach(tt => {
                const ticketType = event?.TicketTypes?.find(t => t.id === tt.ticketTypeId)
                const description = ticketType?.description || ""
                
                for (let i = 0; i < tt.quantity; i++) {
                    descriptions.push(description)
                }
            })
        } else {
            for (let i = 0; i < item.quantity; i++) {
                descriptions.push("")
            }
        }
        
        return descriptions
    }, [items, eventsData])
    
    const maxStep = hasForms ? 4 : 3
    
    const currentEventCoupon = useMemo(() => {
        if (!eventId || !appliedCoupons[eventId]) return null
        return appliedCoupons[eventId]
    }, [appliedCoupons, eventId])
    
    const subtotalBeforeDiscount = useMemo(() => {
        return items.reduce((sum, item) => {
            const event = eventsData.find(e => e?.id === item.eventId)
            return sum + CheckoutUtils.calculateItemTotal(item, event || null)
        }, 0)
    }, [items, eventsData])
    
    const totalDiscount = useMemo(() => {
        if (!eventId || !currentEventCoupon) return 0
        
        const coupon = currentEventCoupon
        if (coupon.discountType === "PERCENTAGE") {
            return Math.round(subtotalBeforeDiscount * (coupon.discountValue / 100))
        } else {
            return Math.min(coupon.discountValue, subtotalBeforeDiscount)
        }
    }, [eventId, currentEventCoupon, subtotalBeforeDiscount])
    
    const subtotal = useMemo(() => {
        return subtotalBeforeDiscount - totalDiscount
    }, [subtotalBeforeDiscount, totalDiscount])
    
    const total = useMemo(() => {
        if (paymentMethod === "credit") {
            return calculateTotalWithInstallmentFee(subtotal, installments)
        }
        return subtotal
    }, [subtotal, paymentMethod, installments])
    
    useEffect(() => {
        if (paymentMethod === "pix") {
            setInstallments(1)
        }
    }, [paymentMethod])

    // Ensure selected installments do not exceed event's maxInstallments (if provided)
    useEffect(() => {
        const EVENT_MAX = currentEvent?.maxInstallments || 1
        const computedMax = subtotal < 1000 ? 1 : 12
        const finalAllowed = EVENT_MAX ? Math.min(computedMax, EVENT_MAX) : computedMax

        if (installments > finalAllowed) {
            setInstallments(finalAllowed)
        }
    }, [(currentEvent as any)?.maxInstallments, subtotal, installments])
    

    const handleCouponChange = useCallback((eventId: string, value: string) => {
        setCouponCodes((prev) => ({
            ...prev,
            [eventId]: value
        }))
    }, [])

    const handleApplyCoupon = useCallback(async (eventId: string) => {
        const code = (couponCodes[eventId] || "").trim()

        if (!code) {
            Toast.info("Digite o código do cupom antes de aplicar.")
            return
        }

        setCouponLoading((prev) => ({
            ...prev,
            [eventId]: true
        }))

        try {
            const response = await checkCoupon({
                code,
                eventId
            })

            if (response?.success && response?.data) {
                const couponData: { id: string; discountType: "PERCENTAGE" | "FIXED"; discountValue: number } = response.data
                setAppliedCoupons((prev) => ({
                    ...prev,
                    [eventId]: {
                        id: couponData.id,
                        discountType: couponData.discountType,
                        discountValue: couponData.discountValue
                    }
                }))
                Toast.success("Cupom aplicado com sucesso!")
            }
        } catch (error) {
            console.error("Erro ao verificar cupom:", error)
            Toast.error("Não foi possível verificar o cupom.")
        } finally {
            setCouponLoading((prev) => ({
                ...prev,
                [eventId]: false
            }))
        }
    }, [checkCoupon, couponCodes])
    
    const handleNext = () => {
        if (currentStep === 1) {
            if (!isAuthenticated) {
                Toast.info("Por favor, faça login ou cadastre-se para continuar.")
                return
            }

            const requiredFields = [
                { field: buyerData.firstName, name: "Nome" },
                { field: buyerData.lastName, name: "Sobrenome" },
                { field: buyerData.email, name: "E-mail" },
                { field: buyerData.phone, name: "Telefone" },
                { field: buyerData.document, name: "CPF" },
                { field: buyerData.zipCode, name: "CEP" },
                { field: buyerData.street, name: "Rua" },
                { field: buyerData.neighborhood, name: "Bairro" },
                { field: buyerData.city, name: "Cidade" },
                { field: buyerData.state, name: "Estado" },
                { field: buyerData.country, name: "País" }
            ]

            const missingFields = requiredFields.filter(({ field }) => !field || field.trim() === "")

            if (missingFields.length > 0) {
                Toast.info(`Por favor, preencha todos os campos obrigatórios: ${missingFields.map(f => f.name).join(", ")}`)
                return
            }

            if (!buyerData.email.includes("@")) {
                Toast.info("Por favor, digite um e-mail válido.")
                return
            }

            const phoneDigits = buyerData.phone.replace(/\D/g, "")
            if (phoneDigits.length < 10) {
                Toast.info("Por favor, digite um telefone válido.")
                return
            }

            const documentDigits = buyerData.document.replace(/\D/g, "")
            if (documentDigits.length < 11) {
                Toast.info("Por favor, digite um CPF válido.")
                return
            }

            const zipcodeDigits = buyerData.zipCode.replace(/\D/g, "")
            if (zipcodeDigits.length < 8) {
                Toast.info("Por favor, digite um CEP válido.")
                return
            }
        }

        if (currentStep === 3 && hasForms) {
            const eventsWithFormForEachTicket = eventsWithForms.filter(event => event && event.isFormForEachTicket === true)
            
            for (const event of eventsWithFormForEachTicket) {
                if (!event) continue
                const eventFields = formFieldsByEvent[event.id] || []
                
                for (let ticketIndex = 0; ticketIndex < ticketQuantity; ticketIndex++) {
                    const requiredFields = eventFields.filter(f => f.field.required)
                    const missingFields = requiredFields.filter(f => {
                        const key = `${f.eventId}_${ticketIndex}-${f.type}-${f.field.order}`
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
    
    const handleFinalize = async () => {
        const data: TTicketBuy = {
            eventIds: uniqueEventIds,
            eventDatesIds: null,
            eventTicketTypesIds: null,
            eventTicketAmount: null,
            eventForms: null,
            paymentMethod: paymentMethod === "pix" ? "PIX" : "CREDIT_CARD",
            ccInfo: null,
            couponCodes: null,
            vfc: total
        }

        const hasMultipleDays = items.some((item) => item.ticketTypes?.some((ticketType) => ticketType.days && ticketType.days?.length > 0))
        const hasNotMultipleDays = items.some((item) => !item.ticketTypes || item.ticketTypes?.length === 0)

        if (hasMultipleDays) {
            data["eventDatesIds"] = items.reduce((acc, item) => {
              let eventGroup = acc.find((e) => e.eventId === item.eventId)
          
              if (!eventGroup) {
                eventGroup = { eventId: item.eventId, eventDates: [] }
                acc.push(eventGroup)
              }
          
              item.ticketTypes?.forEach((ticketType) => {
                const eventDateId = ticketType.days?.[0] || ""
                const amount = ticketType.quantity || 0
          
                const existingDate = eventGroup.eventDates.find(
                  (d) => d.eventDateId === eventDateId
                )
          
                if (existingDate) {
                  existingDate.amount += amount
                } else {
                  eventGroup.eventDates.push({ eventDateId, amount })
                }
              })
          
              return acc
            }, [] as { eventId: string; eventDates: { eventDateId: string; amount: number }[] }[])
        }
        
        if (hasNotMultipleDays) {
            data["eventTicketAmount"] = items.map((item) => ({
                eventId: item.eventId,
                amount: item.quantity
            }))
        }

        const hasTicketTypes = items.some((item) => item.ticketTypes && item.ticketTypes.length > 0)
        if (hasTicketTypes) {
            data["eventTicketTypesIds"] = items.map((item) => ({
                eventId: item.eventId,
                ticketTypes: item.ticketTypes?.map((ticketType) => ({
                    ticketTypeId: ticketType.ticketTypeId || null,
                    amount: ticketType.quantity,
                    eventDateId: ticketType.days?.[0] || null
                })) || []
            })) || null
        }

        const ticketTypeMap: Record<string, string> = {}

        items.forEach(item => {
        let counter = 0

        item.ticketTypes?.forEach(tt => {
            for (let i = 0; i < tt.quantity; i++) {
                ticketTypeMap[`${item.eventId}_${counter}`] = tt.ticketTypeId
                counter++
                }
            })
        })

        data["eventForms"] = Object.entries(formAnswers).reduce((acc, [key, value]) => {
            const [eventId, rest] = key.split("_")
            const [ticketNumber, type, order] = (rest || "").split("-")
          
            // pega (ou cria) o form do eventId
            let form = acc.find((f) => f.eventId === eventId)
            if (!form) {
              form = { eventId, answers: [] as any[] }
              acc.push(form)
            }
          
            // pega (ou cria) o answer para aquele ticketNumber
            let answer = form.answers.find((a) => a.ticketNumber === ticketNumber)
            if (!answer) {
            
              const item = items.find((it) => it.eventId === eventId)
            
              // aplica o único ticketTypeId do evento
              const ticketTypeId = ticketTypeMap[`${eventId}_${ticketNumber}`] ?? null
            
              answer = {
                ticketNumber,
                ticketTypeId,
                text: null,
                email: null,
                textArea: null,
                select: null,
                multiSelect: null
              }
            
              form.answers.push(answer)
            }
            
          
            // prepara o par label/answer
            const entry = { 
                label: value?.label || null,   // <-- aqui vem o label real da pergunta
                answer: value?.answer ?? null  // <-- aqui vem a resposta
              }
              
          
            // insere no campo correto (cria array se necessário)
            switch (type) {
              case "text":
                answer.text = answer.text || []
                answer.text.push(entry)
                break
              case "email":
                answer.email = answer.email || []
                answer.email.push(entry)
                break
              case "textArea":
                answer.textArea = answer.textArea || []
                answer.textArea.push(entry)
                break
              case "select":
                answer.select = answer.select || []
                answer.select.push(entry)
                break
              case "multiSelect":
                answer.multiSelect = answer.multiSelect || []
                answer.multiSelect.push(entry)
                break
              default:
                // se tiver tipos extras, trate aqui ou ignore
                break
            }
          
            return acc
          }, [] as {
            eventId: string
            answers: {
              ticketNumber: string
              ticketTypeId: string | null
              text: { label: string; answer: string | null }[] | null
              email: { label: string; answer: string | null }[] | null
              textArea: { label: string; answer: string | null }[] | null
              select: { label: string; answer: string | null }[] | null
              multiSelect: { label: string; answer: string | null }[] | null
            }[]
        }[])

        data["couponCodes"] = Object.entries(couponCodes).map(([eventId, couponCode]) => ({
            eventId: eventId,
            couponCode: couponCode
        })) || null
          
        if (data.paymentMethod === "CREDIT_CARD") {
            if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
                Toast.error("Por favor, preencha todos os campos do cartão de crédito.")
                return
            }

            data["ccInfo"] = {
                number: cardData.number,
                holderName: cardData.name,
                exp: cardData.expiry,
                cvv: cardData.cvv,
                installments: installments,
                cardId: null
            }
        }

        console.log(data)

        const response = await buyTicket(data)

        if (response?.success && response?.data) {
            setBuyTicketResponse(response.data)
        }
    }

    const handleEmailCheck = async () => {
        if (!emailInput || !emailInput.includes("@")) {
            Toast.error("Digite um e-mail válido")
            return
        }

        try {
            const response = await checkEmailExists(emailInput)
            if (response?.success && response?.data === true) {
                loginForm.setValue("email", emailInput)
                setShowLoginDialog(true)
            } else {
                setCadastroEmail(emailInput)
                cadastroForm.setValue("email", emailInput)
                setShowCadastroDialog(true)
            }
        } catch (error) {
            Toast.error("Erro ao verificar e-mail. Tente novamente.")
        }
    }

    const handleLogin = async (data: TAuth) => {
        try {
            const response = await loginUser(data)
            if (response && response.success && response.data?.user) {
                const loggedUser = response.data.user
                setUser(loggedUser)
                setBuyerData({
                    firstName: loggedUser.firstName || "",
                    lastName: loggedUser.lastName || "",
                    email: loggedUser.email || "",
                    phone: loggedUser.phone || "",
                    document: loggedUser.document || "",
                    street: loggedUser.Address?.street || "",
                    number: loggedUser.Address?.number || "",
                    complement: loggedUser.Address?.complement || "",
                    neighborhood: loggedUser.Address?.neighborhood || "",
                    zipCode: loggedUser.Address?.zipCode || "",
                    city: loggedUser.Address?.city || "",
                    state: loggedUser.Address?.state || "",
                    country: loggedUser.Address?.country || "Brasil",
                })
                setShowLoginDialog(false)
                loginForm.reset()
                setEmailInput("")
                Toast.success("Login realizado com sucesso!")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message || "Erro ao fazer login. Verifique suas credenciais.")
        }
    }

    const handleCadastro = async (data: TUserCreate) => {
        try {
            const response = await createUser(data)
            if (response.success) {
                setCadastroName(data.firstName)
                setShowCadastroDialog(false)
                setShowConfirmacaoDialog(true)
                setCanResend(false)
                setTimerKey(prev => prev + 1)
                cadastroForm.reset()
                Toast.success("Cadastro realizado! Verifique seu e-mail para confirmar.")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message || "Erro ao criar conta. Tente novamente.")
        }
    }

    const handleConfirmacao = async (data: TUserCreateConfirm) => {
        try {
            const response = await confirmByCode({
                code: data.code,
                email: cadastroEmail
            })
            if (response && response.success && response.data?.isValid) {
                setShowConfirmacaoDialog(false)
                confirmacaoForm.reset()
                Toast.success("Cadastro confirmado com sucesso! Faça login para continuar.")
                setEmailInput(cadastroEmail)
                loginForm.setValue("email", cadastroEmail)
                setShowLoginDialog(true)
            } else {
                Toast.error("Código inválido. Tente novamente.")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message || "Erro ao confirmar código. Tente novamente.")
        }
    }

    const handleResendCode = async () => {
        try {
            await resendConfirmation(cadastroEmail)
            setHasResent(true)
            setCanResend(false)
            setTimerKey(prev => prev + 1)
            Toast.success("Código reenviado com sucesso!")
        } catch (error) {
            Toast.error("Erro ao reenviar código. Tente novamente.")
        }
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
                        <h1 className="text-3xl font-bold text-psi-primary mb-2
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
                                    
                                    {isAuthenticated ? (
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
                                                    CPF *
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
                                                        value={buyerData.zipCode}
                                                        onAccept={(value) => setBuyerData({ ...buyerData, zipCode: value as string })}
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
                                                            Número (opcional)
                                                        </label>
                                                        <Input
                                                            value={buyerData.number}
                                                            onChange={(e) => setBuyerData({ ...buyerData, number: e.target.value })}
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="mt-4">
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Complemento (opcional)
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
                                                            Estado *
                                                        </label>
                                                        <Select
                                                            value={buyerData.state || undefined}
                                                            onValueChange={(value) => {
                                                                setBuyerData({ 
                                                                    ...buyerData, 
                                                                    state: value,
                                                                    city: ""
                                                                })
                                                            }}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Selecione..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {states.map((state) => (
                                                                    <SelectItem key={state.value} value={state.value}>
                                                                        {state.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                                            Cidade *
                                                        </label>
                                                        <Select
                                                            value={buyerData.city || undefined}
                                                            onValueChange={(value) => setBuyerData({ ...buyerData, city: value })}
                                                            disabled={!buyerData.state}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder={buyerData.state ? "Selecione..." : "Selecione um estado primeiro"} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {cities.map((city) => {
                                                                    const cityValue = city.value || ""
                                                                    return (
                                                                        <SelectItem key={cityValue} value={cityValue}>
                                                                            {city.label || ""}
                                                                        </SelectItem>
                                                                    )
                                                                })}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    
                                                    <div>
                                                        <label className="block text-sm font-medium text-psi-dark mb-2">
                                                            País *
                                                        </label>
                                                        <Select
                                                            value={buyerData.country || undefined}
                                                            onValueChange={(value) => setBuyerData({ ...buyerData, country: value })}
                                                        >
                                                            <SelectTrigger className="w-full">
                                                                <SelectValue placeholder="Selecione..." />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {countries.map((country) => (
                                                                    <SelectItem key={country.value} value={country.value}>
                                                                        {country.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-6">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    E-mail *
                                                </label>
                                                <Input
                                                    type="email"
                                                    value={emailInput}
                                                    onChange={(e) => setEmailInput(e.target.value)}
                                                    icon={Mail}
                                                    placeholder="seu@email.com"
                                                    required
                                                />
                                                <p className="text-xs text-psi-dark/60 mt-2">
                                                    Digite seu e-mail para fazer login ou criar uma conta rapidamente
                                                </p>
                                            </div>
                                            
                                            <Button
                                                type="button"
                                                variant="primary"
                                                className="w-full"
                                                size="lg"
                                                onClick={handleEmailCheck}
                                                disabled={isCheckingEmail || !emailInput}
                                            >
                                                {isCheckingEmail ? (
                                                    <LoadingButton />
                                                ) : (
                                                    <>
                                                        Continuar
                                                        <ArrowRight className="size-4 ml-2" />
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    )}
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
                                                            <div className="flex items-center justify-between">
                                                                <h3 className="font-semibold text-psi-dark">{event.name}</h3>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(item.eventId, item.batchId)}
                                                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </button>
                                                            </div>
                                                            
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
                                                                                                isClientTaxed: item.isClientTaxed,
                                                                                                isFree: item.isFree
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
                                                                                                    isClientTaxed: item.isClientTaxed,
                                                                                                    isFree: item.isFree
                                                                                                }, newTotalQuantity)
                                                                                            }
                                                                                            return
                                                                                        }
                                                                                        
                                                                                        updateTicketTypeQuantity(item.eventId, item.batchId, tt.ticketTypeId, qty)
                                                                                    }}
                                                                                    min={1}
                                                                                    max={event?.buyTicketsLimit || 10}
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
                                                                        max={event?.buyTicketsLimit || 10}
                                                                    />
                                                                </div>
                                                                </div>
                                                            )}

                                                            <div className="mt-4 p-4 rounded-xl bg-psi-dark/5 border border-psi-dark/10">
                                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                                    Cupom de desconto (opcional)
                                                                </label>
                                                                {appliedCoupons[event.id] ? (
                                                                    <div className="space-y-2">
                                                                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                                                                            <div className="flex items-center gap-2">
                                                                                <CheckCircle2 className="size-5 text-emerald-600" />
                                                                                <div>
                                                                                    <p className="text-sm font-semibold text-emerald-900">
                                                                                        Cupom {couponCodes[event.id]} aplicado
                                                                                    </p>
                                                                                    <p className="text-xs text-emerald-700">
                                                                                        Desconto: {appliedCoupons[event.id].discountType === "PERCENTAGE" 
                                                                                            ? `${appliedCoupons[event.id].discountValue}%`
                                                                                            : ValueUtils.centsToCurrency(appliedCoupons[event.id].discountValue)}
                                                                                    </p>
                                                                                </div>
                                                                            </div>
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setAppliedCoupons((prev) => {
                                                                                        const newCoupons = { ...prev }
                                                                                        delete newCoupons[event.id]
                                                                                        return newCoupons
                                                                                    })
                                                                                    setCouponCodes((prev) => {
                                                                                        const newCodes = { ...prev }
                                                                                        delete newCodes[event.id]
                                                                                        return newCodes
                                                                                    })
                                                                                }}
                                                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                                            >
                                                                                <Trash2 className="size-4" />
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div className="flex flex-col gap-3
                                                                        sm:flex-row">
                                                                            <Input
                                                                                value={couponCodes[event.id] || ""}
                                                                                onChange={(e) => handleCouponChange(event.id, e.target.value.toUpperCase())}
                                                                                placeholder="DIGITE O CÓDIGO"
                                                                                className="uppercase"
                                                                                maxLength={12}
                                                                                disabled={couponLoading[event.id] === true}
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                variant="secondary"
                                                                                disabled={couponLoading[event.id] === true || !couponCodes[event.id]?.trim()}
                                                                                onClick={() => handleApplyCoupon(event.id)}
                                                                            >
                                                                                {couponLoading[event.id] ? (
                                                                                    <>
                                                                                        <Loader2 className="size-4 animate-spin" />
                                                                                        Verificando...
                                                                                    </>
                                                                                ) : (
                                                                                    "Aplicar"
                                                                                )}
                                                                            </Button>
                                                                        </div>
                                                                        <p className="text-xs text-psi-dark/60 mt-2">
                                                                            Caso possua um cupom para este evento, aplique-o aqui para validar o desconto.
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="pt-2 border-t border-psi-dark/10 space-y-2">
                                                                {appliedCoupons[event.id] && (
                                                                    <div className="flex items-center justify-between text-sm">
                                                                        <span className="text-psi-dark/70">Subtotal:</span>
                                                                        <span className="text-psi-dark/70">
                                                                            {ValueUtils.centsToCurrency(CheckoutUtils.calculateItemTotal(item, event))}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                {currentEventCoupon && (
                                                                    <div className="flex items-center justify-between text-sm">
                                                                        <span className="text-emerald-600 font-medium">Desconto:</span>
                                                                        <span className="text-emerald-600 font-medium">
                                                                            -{ValueUtils.centsToCurrency(totalDiscount)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                                <div className="flex items-center justify-between">
                                                                    <span className="text-sm font-medium text-psi-dark">Total:</span>
                                                                    <p className="text-lg font-semibold text-psi-primary">
                                                                        {ValueUtils.centsToCurrency(
                                                                            CheckoutUtils.calculateItemTotal(item, event) - 
                                                                            (currentEventCoupon ? totalDiscount : 0)
                                                                        )}
                                                                    </p>
                                                                </div>
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
                                        const currentTicketQuantity = isForEachTicket ? ticketQuantity : 1
                                        
                                        return (
                                            <div key={eventId} className="space-y-6">
                                                {Array.from({ length: currentTicketQuantity }).map((_, ticketIndex) => {
                                                    const ticketNumber = ticketIndex + 1
                                                    const currentTicketTypeName = ticketTypeNames?.[ticketIndex] || "Ingresso"
                                                    const currentTicketTypeDescription = ticketTypeDescriptions?.[ticketIndex] || ""
                                                    return (
                                                        <div key={`${eventId}-${ticketIndex}`} className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                                        sm:p-8 shadow-sm">
                                                            <div className="mb-6">
                                                                <h2 className="text-xl font-semibold text-psi-dark mb-1">{eventName}</h2>
                                                                {isForEachTicket && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-psi-primary">Ingresso {ticketNumber} de {currentTicketQuantity}</p>
                                                                        <p className="text-sm font-semibold text-psi-dark">{currentTicketTypeName !== "Ingresso" ? currentTicketTypeName : ""}</p>
                                                                        {currentTicketTypeDescription && (
                                                                            <p className="text-xs text-psi-dark/60 mt-1">{currentTicketTypeDescription}</p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                <p className="text-sm text-psi-dark/60 mt-1">Formulário Personalizado</p>
                                                            </div>
                                                            
                                                            <div className="space-y-6">
                                                                {fields.map((formField) => {
                                                                    const key = isForEachTicket 
                                                                        ? `${formField.eventId}_${ticketIndex}-${formField.type}-${formField.field.order}`
                                                                        : `${formField.eventId}_${formField.type}-${formField.field.order}`
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
                                                                                        value={currentValue?.answer || ""}
                                                                                        onAccept={(value) => setFormAnswers({ ...formAnswers, [key]: { label: formField.field.label, answer: value as string } })}
                                                                                        placeholder={formField.field.placeholder || ""}
                                                                                        min={getInputMaskMin(formField.field.mask)}
                                                                                    />
                                                                                ) : (
                                                                                    <Input
                                                                                        value={currentValue?.answer || ""}
                                                                                        onChange={(e) => setFormAnswers({ ...formAnswers, [key]: { label: formField.field.label, answer: e.target.value } })}
                                                                                        placeholder={formField.field.placeholder || ""}
                                                                                        required={formField.field.required}
                                                                                    />
                                                                                )
                                                                            )}
                                                                            
                                                                            {formField.type === 'email' && (
                                                                                <Input
                                                                                    type="email"
                                                                                    value={currentValue?.answer || ""}
                                                                                    onChange={(e) => setFormAnswers({ ...formAnswers, [key]: { label: formField.field.label, answer: e.target.value } })}
                                                                                    placeholder={formField.field.placeholder || ""}
                                                                                    required={formField.field.required}
                                                                                />
                                                                            )}
                                                                            
                                                                            {formField.type === 'textArea' && (
                                                                                <Textarea
                                                                                    value={currentValue?.answer || ""}
                                                                                    onChange={(e) => setFormAnswers({ ...formAnswers, [key]: { label: formField.field.label, answer: e.target.value } })}
                                                                                    placeholder={formField.field.placeholder || ""}
                                                                                    required={formField.field.required}
                                                                                    className="min-h-[100px]"
                                                                                />
                                                                            )}
                                                                            
                                                                            {formField.type === 'select' && (
                                                                                <Select
                                                                                    value={currentValue?.answer || ""}
                                                                                    onValueChange={(value) => setFormAnswers({ ...formAnswers, [key]: { label: formField.field.label, answer: value } })}
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
                                                                                        const isChecked = Array.isArray(currentValue?.answer) && currentValue?.answer.includes(option)
                                                                                        return (
                                                                                            <div key={optIndex} className="flex items-center gap-2">
                                                                                                <Checkbox
                                                                                                    id={`${key}-${optIndex}`}
                                                                                                    checked={isChecked}
                                                                                                    onCheckedChange={(checked) => {
                                                                                                        const currentArray = Array.isArray(currentValue) ? currentValue : []
                                                                                                        if (checked) {
                                                                                                            setFormAnswers({ ...formAnswers, [key]: { label: formField.field.label, answer: [...currentArray, option] } })
                                                                                                        } else {
                                                                                                            setFormAnswers({ ...formAnswers, [key]: { label: formField.field.label, answer: currentArray.filter((v: string) => v !== option) } })
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
                                            {
                                                items?.[0]?.isFree
                                                ?
                                                (
                                                    <span>Esta compra é gratuita!</span>
                                                )
                                                :
                                                (
                                                    <span>Revise todas as informações e escolha a forma de pagamento</span>
                                                )
                                            }
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-6">
                                        {
                                            items?.[0]?.isFree
                                            ?
                                            (
                                                <></>
                                            )
                                            :
                                            (
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
                                                        
                                                        <div className="pt-4 border-t border-psi-dark/10">
                                                            <SelectInstallment
                                                                value={installments}
                                                                totalValue={subtotal}
                                                                onChange={setInstallments}
                                                                maxInstallmentsFromEvent={(currentEvent as any)?.maxInstallments ?? null}
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            )
                                        }
                                        
                                        <div className="p-4 rounded-xl bg-psi-dark/5">
                                            <h3 className="font-semibold text-psi-dark mb-2">Resumo</h3>
                                            <div className="space-y-2 text-sm">
                                                {totalDiscount > 0 && (
                                                    <>
                                                        <div className="flex items-center justify-between text-psi-dark/70">
                                                            <span>Subtotal:</span>
                                                            <span>{ValueUtils.centsToCurrency(subtotal)}</span>
                                                        </div>
                                                        <div className="flex items-center justify-between text-emerald-600 font-medium">
                                                            <span>Desconto:</span>
                                                            <span>-{ValueUtils.centsToCurrency(totalDiscount)}</span>
                                                        </div>
                                                    </>
                                                )}
                                                <div className="flex items-center justify-between font-semibold text-psi-dark pt-2 border-t border-psi-dark/10">
                                                    <span>Total:</span>
                                                    {
                                                        items?.[0]?.isFree
                                                        ?
                                                        (
                                                        <span>Gratuito</span>
                                                        )
                                                        :
                                                        (
                                                        <span>{ValueUtils.centsToCurrency(total)}</span>
                                                        )
                                                    }
                                                </div>
                                                <p className="text-psi-dark/70"><strong>Itens:</strong> {items.reduce((sum, item) => sum + item.quantity, 0)} ingresso(s)</p>
                                                {
                                                    items?.[0]?.isFree
                                                    ?
                                                    (
                                                    <></>
                                                    )
                                                    :
                                                    (
                                                    <p className="text-psi-dark/70"><strong>Pagamento:</strong> {paymentMethod === "pix" ? "PIX" : "Cartão de Crédito"}</p>
                                                    )
                                                }
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                onClick={handleFinalize}
                                                variant="primary"
                                                size="lg"
                                                className=""
                                                disabled={isBuyingTicket}
                                            >
                                                {isBuyingTicket ? (
                                                    <LoadingButton />
                                                ) : (
                                                    <Check className="size-4" />
                                                )}
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
                                
                                <div className="pt-4 border-t border-psi-dark/10 space-y-2">
                                    {totalDiscount > 0 && (
                                        <>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-psi-dark/70">Subtotal:</span>
                                                <span className="text-psi-dark/70">{ValueUtils.centsToCurrency(subtotalBeforeDiscount)}</span>
                                            </div>
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-emerald-600 font-medium">Desconto:</span>
                                                <span className="text-emerald-600 font-medium">-{ValueUtils.centsToCurrency(totalDiscount)}</span>
                                            </div>
                                        </>
                                    )}
                                    {paymentMethod === "credit" && installments > 1 && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-psi-dark/70">Subtotal após desconto:</span>
                                            <span className="text-psi-dark/70">{ValueUtils.centsToCurrency(subtotal)}</span>
                                        </div>
                                    )}
                                    {paymentMethod === "credit" && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-psi-dark/70">Taxa de parcelamento ({installments}x):</span>
                                            <span className="text-psi-dark/70">{ValueUtils.centsToCurrency(total - subtotal)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t border-psi-dark/10">
                                        <span className="font-semibold text-psi-dark">Total</span>
                                        <span className="text-2xl font-bold text-psi-primary">
                                            {ValueUtils.centsToCurrency(total)}
                                        </span>
                                    </div>
                                    {paymentMethod === "credit" && installments > 1 && (
                                        <p className="text-psi-dark/70 text-xs">
                                            {installments}x de {ValueUtils.centsToCurrency(Math.round(total / installments))}
                                        </p>
                                    )}
                                    {paymentMethod === "credit" && installments === 1 && (
                                        <p className="text-psi-dark/70 text-xs">
                                            À vista com taxa de {ValueUtils.centsToCurrency(total - subtotal)}
                                        </p>
                                    )}
                                                {paymentMethod === "credit" && installments === 1 && (
                                                    <p className="text-psi-dark/70 text-xs">
                                                        À vista com taxa de {ValueUtils.centsToCurrency(total - subtotal)}
                                                    </p>
                                                )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog open={showLoginDialog} onOpenChange={(open) => {
                setShowLoginDialog(open)
                if (!open) {
                    loginForm.reset()
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Fazer Login</DialogTitle>
                        <DialogDescription>
                            Digite sua senha para continuar com o e-mail {loginForm.watch("email") || emailInput}
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                Senha *
                            </label>
                            <Controller
                                name="password"
                                control={loginForm.control}
                                render={({ field }) => (
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Sua senha"
                                            icon={Lock}
                                            className="pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-psi-dark/60 hover:text-psi-dark transition-colors"
                                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            />
                            <FieldError message={loginForm.formState.errors.password?.message || ""} />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            disabled={isLoggingIn}
                        >
                            {isLoggingIn ? (
                                <LoadingButton />
                            ) : (
                                <>
                                    <LogIn className="size-4 mr-2" />
                                    Entrar
                                </>
                            )}
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showCadastroDialog} onOpenChange={(open) => {
                setShowCadastroDialog(open)
                if (!open) {
                    cadastroForm.reset()
                }
            }}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Criar Conta</DialogTitle>
                        <DialogDescription>
                            Preencha os dados abaixo para criar sua conta e continuar com a compra
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={cadastroForm.handleSubmit(handleCadastro)} className="space-y-4">
                        <Controller
                            name="role"
                            control={cadastroForm.control}
                            render={({ field }) => (
                                <input type="hidden" {...field} value="CUSTOMER" />
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                    Nome *
                                </label>
                                <Controller
                                    name="firstName"
                                    control={cadastroForm.control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            icon={UserCircle}
                                            placeholder="Seu nome"
                                            required
                                        />
                                    )}
                                />
                                <FieldError message={cadastroForm.formState.errors.firstName?.message || ""} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                    Sobrenome *
                                </label>
                                <Controller
                                    name="lastName"
                                    control={cadastroForm.control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            placeholder="Seu sobrenome"
                                            required
                                        />
                                    )}
                                />
                                <FieldError message={cadastroForm.formState.errors.lastName?.message || ""} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                    E-mail *
                                </label>
                                <Controller
                                    name="email"
                                    control={cadastroForm.control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            type="email"
                                            value={cadastroEmail || field.value}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                setCadastroEmail(e.target.value)
                                            }}
                                            icon={Mail}
                                            placeholder="seu@email.com"
                                            required
                                        />
                                    )}
                                />
                                <FieldError message={cadastroForm.formState.errors.email?.message || ""} />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                Telefone *
                            </label>
                            <Controller
                                name="phone"
                                control={cadastroForm.control}
                                render={({ field }) => (
                                    <InputMask
                                        {...field}
                                        mask="(00) 00000-0000"
                                        placeholder="(00) 00000-0000"
                                        icon={Phone}
                                        required
                                    />
                                )}
                            />
                            <FieldError message={cadastroForm.formState.errors.phone?.message || ""} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                Senha *
                            </label>
                            <Controller
                                name="password"
                                control={cadastroForm.control}
                                render={({ field }) => (
                                    <div className="relative">
                                        <Input
                                            {...field}
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Sua senha"
                                            icon={Lock}
                                            className="pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-psi-dark/60 hover:text-psi-dark transition-colors"
                                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            />
                            <PasswordStrength password={passwordValue || ""} />
                            <FieldError message={cadastroForm.formState.errors.password?.message || ""} />
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            disabled={isCreatingUser}
                        >
                            {isCreatingUser ? (
                                <LoadingButton />
                            ) : (
                                "Criar Conta"
                            )}
                        </Button>
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-psi-dark/10" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-psi-dark/60">
                                    Ou
                                </span>
                            </div>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            className="w-full"
                            size="lg"
                        >
                            <Icon
                                icon="google"
                                className="size-6"
                            />
                            Continuar com o Google
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showConfirmacaoDialog} onOpenChange={(open) => {
                setShowConfirmacaoDialog(open)
                if (!open) {
                    confirmacaoForm.reset()
                    setCanResend(false)
                    setHasResent(false)
                    setTimerKey(prev => prev + 1)
                }
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Confirmar Cadastro</DialogTitle>
                        <DialogDescription>
                            Olá, <span className="font-semibold">{cadastroName}</span>! Digite o código de 6 dígitos enviado para <span className="font-semibold">{cadastroEmail}</span>
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={confirmacaoForm.handleSubmit(handleConfirmacao)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-psi-dark mb-2 text-center">
                                Código de Verificação
                            </label>
                            <Controller
                                name="code"
                                control={confirmacaoForm.control}
                                render={({ field }) => (
                                    <div className="flex justify-center">
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                )}
                            />
                            <div className="text-center mt-2">
                                <FieldError message={confirmacaoForm.formState.errors.code?.message || ""} />
                            </div>
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            disabled={isConfirmingByCode}
                        >
                            {isConfirmingByCode ? (
                                <LoadingButton />
                            ) : (
                                "Confirmar Cadastro"
                            )}
                        </Button>
                        <div className="text-center">
                            <p className="text-sm text-psi-dark/60">
                                Ainda não recebeu o código?{" "}
                                {hasResent ? (
                                    <span className="text-psi-dark/60 text-sm block mt-2">
                                        Se o código ainda não chegou aguarde. Ou entre em contato com o suporte.
                                    </span>
                                ) : canResend ? (
                                    <button
                                        type="button"
                                        onClick={handleResendCode}
                                        disabled={isResendingConfirmation || hasResent}
                                        className="text-psi-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isResendingConfirmation ? "Reenviando..." : "Reenviar"}
                                    </button>
                                ) : (
                                    <>
                                        <span className="text-psi-dark/60">Reenviar em </span>
                                        <Timer
                                            key={timerKey}
                                            seconds={10}
                                            onFinish={() => setCanResend(true)}
                                            variant="badge"
                                        />
                                    </>
                                )}
                            </p>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </Background>
    )
}

export {
    CheckoutInfo
}

