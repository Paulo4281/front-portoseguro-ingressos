"use client"

import { useState, useMemo, useCallback, useEffect, useRef } from "react"
import { useForm, Controller } from "react-hook-form"

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
                    renderButton: (element: HTMLElement, config: any) => void
                    prompt: () => void
                }
            }
        }
    }
}
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
import { Switch } from "@/components/ui/switch"
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
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
    ArrowRight,
    MailCheck,
    QrCode,
    Copy,
    ChevronDown,
    RefreshCw,
    AlertCircle,
    Download,
    Link2
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CTAButton } from "@/components/CTAButton/CTAButton"
import { Toast } from "@/components/Toast/Toast"
import { useCouponCheck } from "@/hooks/Coupon/useCouponCheck"
import { useUserCheckEmailExists } from "@/hooks/User/useUserCheckEmailExistst"
import { useAuthLogin } from "@/hooks/Auth/useAuthLogin"
import { useAuthLoginWithGoogle } from "@/hooks/Auth/useAuthLoginWithGoogle"
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
import { DialogCreditCardError } from "@/components/Dialog/DialogCreditCardError/DialogCreditCardError"
import { Timer } from "@/components/Timer/Timer"
import { getStates, getCitiesByState } from "@/utils/Helpers/IBGECitiesAndStates/IBGECitiesAndStates"
import { getCountries, getCountriesSync } from "@/utils/Helpers/Countries/Countries"
import { SelectInstallment, calculateTotalWithInstallmentFee } from "@/components/SelectInstallment/SelectInstallment"
import { useTicketBuy } from "@/hooks/Ticket/useTicketBuy"
import { useTicketBuySeller } from "@/hooks/Ticket/useTicketBuySeller"
import { CheckoutTimer } from "@/components/CheckoutTimer/CheckoutTimer"
import { useTicketHoldCreate } from "@/hooks/TicketHold/useTicketHoldCreate"
import { useTicketHoldUpdateQuantity } from "@/hooks/TicketHold/useTicketHoldUpdateQuantity"
import { TTicketHoldCreate, TTicketHoldCreateResponse } from "@/types/TicketHold/TTicketHold"
import { Badge } from "@/components/ui/badge"
import { useUserUpdate } from "@/hooks/User/useUserUpdate"
import { useUserCreateCustomer } from "@/hooks/User/useUserCreateCustomer"
import { UserProfileUpdateValidator, type TUserProfileUpdate } from "@/validators/User/UserProfileUpdateValidator"
import { Globe, Building2, Hash } from "lucide-react"
import { PaymentService } from "@/services/Payment/PaymentService"
import { useCardFindByUserId } from "@/hooks/Card/useCardFindByUserId"
import type { TCard } from "@/types/Card/TCard"
import { useOrganizerFindClients } from "@/hooks/Client/useOrganizerFindClients"

type TPaymentMethod = "pix" | "credit" | "link"

export type THandleUpdateQuantityParams = {
    eventId: string
    batchId: string
    qty: number
    ticketHoldId: string
}

const CheckoutInfo = () => {
    const { items, updateQuantity, updateTicketTypeQuantity, addItem, removeItem, getTotal, clearCart } = useCart()
    const { user, isAuthenticated, setUser } = useAuthStore()
    const searchParams = useSearchParams()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("pix")
    const isSellerCheckout = searchParams.get("seller") === "true" && user?.role === "SELLER"
    const [paymentLinkUrl, setPaymentLinkUrl] = useState("")

    const { mutateAsync: updateTicketHold, isPending: isUpdatingTicketHold } = useTicketHoldUpdateQuantity()

    const handleUpdateQuantity = async (params: THandleUpdateQuantityParams, updateQuantityCartContext: boolean = true): Promise<boolean> => {
        const { eventId, batchId, qty, ticketHoldId } = params

        const response = await updateTicketHold({
            id: ticketHoldId,
            quantity: qty
        })

        if (response?.success) {
            if (updateQuantityCartContext) {
                updateQuantity(eventId, batchId, qty)
            }
            return true
        }

        return false

    }

    const handleFindTicketHoldId = (eventId: string, batchId: string, eventDateId: string | null, ticketTypeId: string | null) => {
        const ticketHold = ticketHoldData?.find((th) => th.eventDateId === eventDateId && th.ticketTypeId === ticketTypeId)
        if (ticketHold) {
            return ticketHold.id
        }
        return ""
    }

    const { mutateAsync: createTicketHold, isPending: isCreatingTicketHold } = useTicketHoldCreate()

    const [showUpdateProfileDialog, setShowUpdateProfileDialog] = useState(false)
    const [showViewProfileDialog, setShowViewProfileDialog] = useState(false)

    const [emailInput, setEmailInput] = useState("")
    const [showLoginDialog, setShowLoginDialog] = useState(false)
    const [showCadastroDialog, setShowCadastroDialog] = useState(false)
    const [showConfirmacaoDialog, setShowConfirmacaoDialog] = useState(false)
    const [showRegulamentoDialog, setShowRegulamentoDialog] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [canResend, setCanResend] = useState(false)
    const [timerKey, setTimerKey] = useState(0)
    const [hasResent, setHasResent] = useState(false)
    const [cadastroEmail, setCadastroEmail] = useState("")
    const [cadastroName, setCadastroName] = useState("")
    const googleButtonRefCadastro = useRef<HTMLDivElement>(null)
    const [isGoogleScriptLoadedCadastro, setIsGoogleScriptLoadedCadastro] = useState(false)

    const { mutateAsync: checkEmailExists, isPending: isCheckingEmail } = useUserCheckEmailExists()
    const { mutateAsync: loginUser, isPending: isLoggingIn } = useAuthLogin()
    const { mutateAsync: loginWithGoogle, isPending: isLoggingInWithGoogle } = useAuthLoginWithGoogle()
    const { mutateAsync: createUser, isPending: isCreatingUser } = useUserCreate()
    const { mutateAsync: confirmByCode, isPending: isConfirmingByCode } = useUserConfirmationConfirmByCode()
    const { mutateAsync: resendConfirmation, isPending: isResendingConfirmation } = useUserConfirmationResendConfirmation()
    const { mutateAsync: buyTicket, isPending: isBuyingTicket } = useTicketBuy()
    const { mutateAsync: buyTicketSeller, isPending: isBuyingTicketSeller } = useTicketBuySeller()
    const { mutateAsync: updateUser, isPending: isUpdatingUser } = useUserUpdate()
    const { mutateAsync: createCustomer, isPending: isCreatingCustomer } = useUserCreateCustomer()

    const [sellerClientSearch, setSellerClientSearch] = useState("")
    const { data: organizerClientsData, isLoading: isLoadingOrganizerClients } = useOrganizerFindClients({
        offset: 0,
        search: sellerClientSearch,
        isSeller: isSellerCheckout
    })
    const organizerClients = organizerClientsData?.data?.data ?? []
    const [selectedOrganizerClientId, setSelectedOrganizerClientId] = useState("")
    const [clientSelectOpen, setClientSelectOpen] = useState(false)
    const [isNewOrganizerClient, setIsNewOrganizerClient] = useState(false)
    const [newOrganizerClientFirstName, setNewOrganizerClientFirstName] = useState("")
    const [newOrganizerClientLastName, setNewOrganizerClientLastName] = useState("")
    const [newOrganizerClientEmail, setNewOrganizerClientEmail] = useState("")
    const [newOrganizerClientDocument, setNewOrganizerClientDocument] = useState("")
    const [newOrganizerClientPhone, setNewOrganizerClientPhone] = useState("")
    const [newOrganizerClientZipCode, setNewOrganizerClientZipCode] = useState("")
    const [newOrganizerClientAddressNumber, setNewOrganizerClientAddressNumber] = useState("")
    const [newCreatedCustomerUserId, setNewCreatedCustomerUserId] = useState("")
    const [newOrganizerClientDialogOpen, setNewOrganizerClientDialogOpen] = useState(false)

    const [buyTicketResponse, setBuyTicketResponse] = useState<TTicketBuyResponse | null>(null)
    const [showCreditCardErrorDialog, setShowCreditCardErrorDialog] = useState(false)
    const [isCheckingPayment, setIsCheckingPayment] = useState(false)
    const [paymentVerified, setPaymentVerified] = useState(false)
    const [selectedCardId, setSelectedCardId] = useState<string | null>(null)
    const [showNewCardForm, setShowNewCardForm] = useState(false)
    const [isInsured, setIsInsured] = useState(false)
    const [showInsuranceDialog, setShowInsuranceDialog] = useState(false)

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

    const formatBirthForForm = (birth: string | null | undefined): string => {
        if (!birth) return ""
        const [year, month, day] = birth.split("-")
        if (year && month && day) {
            return `${day}/${month}/${year}`
        }
        return birth
    }

    const updateProfileForm = useForm<TUserProfileUpdate>({
        resolver: zodResolver(UserProfileUpdateValidator),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            image: null,
            phone: user?.phone || "",
            document: user?.document || "",
            nationality: user?.nationality || "",
            gender: user?.gender || null,
            birth: formatBirthForForm(user?.birth),
            address: user?.Address ? {
                street: user.Address.street,
                number: user.Address.number || "",
                complement: user.Address.complement || "",
                neighborhood: user.Address.neighborhood,
                zipCode: user.Address?.zipCode,
                city: user.Address.city,
                state: user.Address.state,
                country: user.Address.country,
            } : null
        }
    })

    useEffect(() => {
        if (user && showUpdateProfileDialog) {
            updateProfileForm.reset({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                image: null,
                phone: user.phone || "",
                document: user.document || "",
                nationality: user.nationality || "",
                gender: user.gender || null,
                birth: formatBirthForForm(user.birth),
                address: user.Address ? {
                    street: user.Address.street,
                    number: user.Address.number || "",
                    complement: user.Address.complement || "",
                    neighborhood: user.Address.neighborhood,
                    zipCode: user.Address?.zipCode,
                    city: user.Address.city,
                    state: user.Address.state,
                    country: user.Address.country,
                } : null
            })
        }
    }, [user, showUpdateProfileDialog, updateProfileForm])

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
    const selectedState = updateProfileForm.watch("address.state")
    const cities = useMemo(() => {
        return getCitiesByState(selectedState || "")
    }, [selectedState])
    const [countries, setCountries] = useState(getCountriesSync())

    useEffect(() => {
        if (selectedState) {
            const currentCity = updateProfileForm.getValues("address.city")
            const availableCities = getCitiesByState(selectedState)
            const cityExists = availableCities.some(city => city.value === currentCity)
            if (!cityExists && currentCity) {
                updateProfileForm.setValue("address.city", "")
            }
        }
    }, [selectedState, updateProfileForm])

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
        if (isGoogleScriptLoadedCadastro && googleButtonRefCadastro.current && window.google && showCadastroDialog) {
            try {
                if (googleButtonRefCadastro.current.children.length === 0) {
                    window.google.accounts.id.renderButton(googleButtonRefCadastro.current, {
                        theme: "filled_blue",
                        type: "standard",
                        size: "large",
                        shape: "pill",
                    })
                }
            } catch (error) {
                console.error("Erro ao renderizar botão do Google:", error)
            }
        }
    }, [isGoogleScriptLoadedCadastro, showCadastroDialog])

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

    const getCardBrandIcon = (brand: string | null | undefined): string => {
        if (!brand) return "/icons/payment/card-brand/card-unknown.png"
        const brandLower = brand.toLowerCase()
        const brandMap: Record<string, string> = {
            amex: "card-amex.png",
            discover: "card-discover.png",
            hipercard: "card-hipercard.png",
            jcb: "card-jcb.png",
            mastercard: "card-master.png",
            visa: "card-visa.png",
            elo: "card-elo.png",
            cabal: "card-cabal.png",
            banescard: "card-banescard.png",
        }
        const iconName = brandMap[brandLower] || "card-unknown.png"
        return `/icons/payment/card-brand/${iconName}`
    }

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

    const getActiveEventDateId = useCallback((event: typeof currentEvent, eventDateId: string | null | undefined): string | null => {
        if (event?.Recurrence?.id) {
            return event.EventDates?.find((ed) => ed.isActive === true)?.id || null
        }

        if (!event || !eventDateId) return eventDateId || null
        if (!event.Recurrence) return eventDateId
        const activeEventDate = event.EventDates?.find(ed => ed.isActive === true)
        return activeEventDate?.id || eventDateId
    }, [])

    const [ticketHoldData, setTicketHoldData] = useState<TTicketHoldCreateResponse[] | null>(null)
    const hasRun = useRef(false)

    useEffect(() => {
        if (items.length > 0 && currentEvent && eventId) {
            if (hasRun.current) return

            const createTicketHoldFunc = async () => {
                const ticketHolds: TTicketHoldCreate[] = []
                for (const item of items) {

                    let hasTicketTypes = false
                    let hasMultipleDaysWithTicketTypes = false

                    if (item.ticketTypes && item.ticketTypes.some((ticketType) => ticketType.days && ticketType.days.length > 0)) {
                        for (const ticketType of item.ticketTypes) {
                            const originalEventDateId = ticketType.days?.[0] || null
                            const activeEventDateId = getActiveEventDateId(currentEvent, originalEventDateId)
                            ticketHolds.push({
                                eventId: eventId || "",
                                eventBatchId: item.batchId || "",
                                eventDateId: activeEventDateId,
                                ticketTypeId: ticketType.ticketTypeId || null,
                                quantity: ticketType.quantity
                            })
                        }
                        hasMultipleDaysWithTicketTypes = true
                    }

                    if (item.ticketTypes && item.ticketTypes.length > 0 && !hasMultipleDaysWithTicketTypes) {
                        for (const ticketType of item.ticketTypes) {
                            const originalEventDateId = ticketType.days?.[0] || null
                            const activeEventDateId = getActiveEventDateId(currentEvent, originalEventDateId)
                            ticketHolds.push({
                                eventId: eventId || "",
                                eventBatchId: item.batchId || "",
                                eventDateId: activeEventDateId,
                                ticketTypeId: ticketType.ticketTypeId || null,
                                quantity: ticketType.quantity
                            })
                        }
                        hasTicketTypes = true
                    }

                    if (!hasTicketTypes && !hasMultipleDaysWithTicketTypes) {
                        ticketHolds.push({
                            eventId: eventId || "",
                            eventBatchId: item.batchId || "",
                            eventDateId: null,
                            ticketTypeId: null,
                            quantity: item.quantity
                        })
                    }
                }

                if (isAuthenticated) {
                    const response = await createTicketHold(ticketHolds)

                    if (response?.success && response?.data) {
                        setTicketHoldData(response.data)
                        hasRun.current = true
                    }
                }
            }

            createTicketHoldFunc()
        }
    }, [items, currentEvent, eventId, isAuthenticated])

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

    const shouldFetchCards = useMemo(() => {
        return isAuthenticated && currentStep === maxStep && paymentMethod === "credit"
    }, [isAuthenticated, currentStep, maxStep, paymentMethod])

    const cardQueryRef = useRef<{ initialized: boolean }>({ initialized: false })
    const { data: cardsData, isLoading: isLoadingCards } = useCardFindByUserId({
        enabled: shouldFetchCards && !cardQueryRef.current.initialized
    })
    useEffect(() => {
        if (shouldFetchCards && !cardQueryRef.current.initialized) {
            cardQueryRef.current.initialized = true
        }
    }, [shouldFetchCards])
    
    const cards = useMemo(() => {
        return cardsData?.data || []
    }, [cardsData?.data])

    useEffect(() => {
        if (paymentMethod === "credit" && cards.length > 0 && !selectedCardId && !showNewCardForm) {
            setSelectedCardId(cards[0].id)
        }
    }, [cards, paymentMethod, selectedCardId, showNewCardForm])

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

    const insuranceValue = useMemo(() => {
        if (!isInsured || items?.[0]?.isFree) return 0
        return ValueUtils.calculateInsuranceValue(subtotal)
    }, [isInsured, subtotal, items])

    const total = useMemo(() => {
        const baseTotal = paymentMethod === "credit"
            ? calculateTotalWithInstallmentFee(subtotal, installments)
            : subtotal
        
        return baseTotal + insuranceValue
    }, [subtotal, paymentMethod, installments, insuranceValue])

    useEffect(() => {
        if (paymentMethod === "pix") {
            setInstallments(1)
            setSelectedCardId(null)
            setShowNewCardForm(false)
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
            if (isSellerCheckout) {
                if (!isAuthenticated || user?.role !== "SELLER") {
                    Toast.info("Faça login com uma conta de revendedor para continuar.")
                    return
                }

                if (!isNewOrganizerClient && !selectedOrganizerClientId) {
                    Toast.info("Selecione um cliente do organizador ou cadastre um novo cliente.")
                    return
                }

                if (isNewOrganizerClient) {
                    if (
                        !newOrganizerClientFirstName.trim() ||
                        !newOrganizerClientLastName.trim() ||
                        !newOrganizerClientEmail.trim() ||
                        !newOrganizerClientDocument.trim() ||
                        !newOrganizerClientZipCode.trim() ||
                        !newOrganizerClientAddressNumber.trim()
                    ) {
                        Toast.info("Preencha nome, sobrenome, e-mail, CPF, CEP e número do novo cliente.")
                        return
                    }
                    if (!newCreatedCustomerUserId) {
                        Toast.info("Clique em \"Salvar cliente\" para cadastrar o cliente antes de finalizar a compra.")
                        return
                    }
                }
            }

            if (!isAuthenticated) {
                Toast.info("Por favor, faça login ou cadastre-se para continuar.")
                return
            }

            if (!user) {
                Toast.info("Erro ao carregar dados do usuário. Tente novamente.")
                return
            }

            if (user.role === "ORGANIZER" && !user.isCompleteInfo) {
                Toast.info("Por favor, complete seu cadastro no perfil antes de continuar.")
                return
            }

            if (user.role === "CUSTOMER" && !user.isCompleteInfo) {
                Toast.info("Por favor, complete seus dados antes de continuar.")
                return
            }

            if (isSellerCheckout) {
                if (currentStep < maxStep) {
                    setCurrentStep(currentStep + 1)
                }
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
                    const key = `${f.eventId}_${f.type}-${f.field.order}`
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
            paymentMethod: paymentMethod === "pix" ? "PIX" : paymentMethod === "credit" ? "CREDIT_CARD" : "LINK",
            ccInfo: null,
            couponCodes: null,
            removeTicketHoldIds: null,
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
                    const originalEventDateId = ticketType.days?.[0] || ""
                    const event = eventsData.find(e => e?.id === item.eventId)
                    const eventDateId = event && originalEventDateId ? getActiveEventDateId(event, originalEventDateId) || originalEventDateId : originalEventDateId
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
            data["eventTicketTypesIds"] = items.map((item) => {
                const event = eventsData.find(e => e?.id === item.eventId)
                return {
                    eventId: item.eventId,
                    ticketTypes: item.ticketTypes?.map((ticketType) => {
                        const originalEventDateId = ticketType.days?.[0] || null
                        const activeEventDateId = event ? getActiveEventDateId(event, originalEventDateId) : originalEventDateId
                        return {
                            ticketTypeId: ticketType.ticketTypeId || null,
                            amount: ticketType.quantity,
                            eventDateId: activeEventDateId
                        }
                    }) || []
                }
            }) || null
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
            const parts = (rest || "").split("-")
            
            let ticketNumber: string
            let type: string
            let order: string

            if (parts.length === 3) {
                ticketNumber = parts[0]
                type = parts[1]
                order = parts[2]
            } else if (parts.length === 2) {
                ticketNumber = "0"
                type = parts[0]
                order = parts[1]
            } else {
                return acc
            }

            let form = acc.find((f) => f.eventId === eventId)
            if (!form) {
                form = { eventId, answers: [] as any[] }
                acc.push(form)
            }

            let answer = form.answers.find((a) => a.ticketNumber === ticketNumber)
            if (!answer) {
                const item = items.find((it) => it.eventId === eventId)
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

            const entry = {
                label: value?.label || null,
                answer: value?.answer ?? null
            }

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
            if (selectedCardId) {
                data["ccInfo"] = {
                    number: "" as string,
                    holderName: "" as string,
                    exp: "" as string,
                    cvv: "" as string,
                    installments: installments,
                    cardId: selectedCardId
                }
            } else {
                if (!cardData.number || !cardData.name || !cardData.expiry || !cardData.cvv) {
                    Toast.error("Por favor, preencha todos os campos do cartão de crédito ou selecione um cartão cadastrado.")
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
        }


        data["removeTicketHoldIds"] = ticketHoldData?.map((th) => th.id) || null
        data["isInsured"] = isInsured
        if (isSellerCheckout && user?.id) {
            data["sellerUserId"] = user.id
            const customerUserId = isNewOrganizerClient ? newCreatedCustomerUserId : selectedOrganizerClientId
            data["customerUserId"] = customerUserId || undefined
            if (isNewOrganizerClient) {
                data["organizerClient"] = {
                    firstName: newOrganizerClientFirstName.trim(),
                    lastName: newOrganizerClientLastName.trim(),
                    email: newOrganizerClientEmail.trim().toLowerCase(),
                    phone: newOrganizerClientPhone.trim(),
                    document: newOrganizerClientDocument.trim()
                }
                data["organizerClientId"] = null
            } else {
                data["organizerClientId"] = selectedOrganizerClientId
                data["organizerClient"] = null
            }
        }

        const response = isSellerCheckout
            ? await buyTicketSeller(data)
            : await buyTicket(data)

        if (response?.success && response?.data?.isCreditCardError) {
            setShowCreditCardErrorDialog(true)
            return
        }

        if (paymentMethod === "link" && response?.success) {
            const linkData = response?.data as unknown
            const paymentCode =
                linkData && typeof linkData === "object" && linkData !== null && "paymentCode" in linkData
                    ? String((linkData as { paymentCode?: string }).paymentCode || "")
                    : linkData && typeof linkData === "object" && linkData !== null && "code" in linkData
                        ? String((linkData as { code?: string }).code || "")
                        : ""

            if (!paymentCode) {
                Toast.error("Link gerado, mas não foi possível obter o código do pagamento.")
                return
            }

            const url = `https://portoseguroingressos.com.br/pagamento-link?code=${encodeURIComponent(paymentCode)}`
            setPaymentLinkUrl(url)
            try {
                await navigator.clipboard.writeText(url)
                Toast.success("Link de pagamento gerado e copiado!")
            } catch {
                Toast.success("Link de pagamento gerado!")
            }
            return
        }

        if (response?.success && response?.data?.pixData) {
            setBuyTicketResponse(response.data)
            setPaymentVerified(false)
            if (!response.data.pixData) {
                Toast.success("Compra realizada com sucesso!")
                setTimeout(() => {
                    clearCart()
                    router.push("/meus-ingressos")
                }, 1500)
            }
        } else if (response?.success && response?.data?.confirmedByCreditCard) {
            Toast.success("Compra realizada com sucesso!")
            setTimeout(() => {
                clearCart()
                router.push("/meus-ingressos")
            }, 1500)
        }
    }

    const handleSaveNewOrganizerClient = async () => {
        if (
            !newOrganizerClientFirstName.trim() ||
            !newOrganizerClientLastName.trim() ||
            !newOrganizerClientEmail.trim() ||
            !newOrganizerClientDocument.trim() ||
            !newOrganizerClientZipCode.trim() ||
            !newOrganizerClientAddressNumber.trim()
        ) {
            Toast.info("Preencha nome, sobrenome, e-mail, CPF, CEP e número do endereço do cliente.")
            return
        }
        try {
            const response = await createCustomer({
                firstName: newOrganizerClientFirstName.trim(),
                lastName: newOrganizerClientLastName.trim(),
                email: newOrganizerClientEmail.trim().toLowerCase(),
                phone: newOrganizerClientPhone.trim(),
                document: newOrganizerClientDocument.replace(/\D/g, ""),
                address: {
                    zipCode: newOrganizerClientZipCode.replace(/\D/g, ""),
                    number: newOrganizerClientAddressNumber.trim()
                }
            })
            if (response?.success) {
                const data = response?.data as unknown
                const createdId =
                    data && typeof data === "object" && data !== null && "id" in data
                        ? (data as { id: string }).id
                        : data && typeof data === "object" && data !== null && "user" in data
                            ? (data as { user: { id?: string } }).user?.id
                            : undefined
                if (createdId) setNewCreatedCustomerUserId(createdId)
                Toast.success("Cliente cadastrado. Um e-mail foi enviado para ele definir a senha.")
                setNewOrganizerClientDialogOpen(false)
            } else {
                Toast.error(response?.message ?? "Não foi possível cadastrar o cliente.")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message ?? "Não foi possível cadastrar o cliente.")
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

    const handleCredentialResponseCadastro = useCallback(async (response: { credential: string }) => {
        try {
            const authResponse = await loginWithGoogle(response.credential)
            if (authResponse && authResponse.success && authResponse.data?.user) {
                setUser(authResponse.data.user)
                setShowCadastroDialog(false)
                if (authResponse.data.user.role === "NOT_DEFINED") {
                    router.push("/confirmar-social")
                } else {
                    Toast.success("Login realizado com sucesso!")
                }
            }
        } catch (error) {
            Toast.error("Erro ao fazer login com Google")
        }
    }, [loginWithGoogle, setUser, router])

    useEffect(() => {
        if (!showCadastroDialog) {
            setIsGoogleScriptLoadedCadastro(false)
            return
        }

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_SOCIAL_LOGIN_CLIENT_ID
        if (!clientId) {
            console.error("CLIENT_ID não configurado")
            return
        }

        if (window.google && window.google.accounts) {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: handleCredentialResponseCadastro
            })
            setIsGoogleScriptLoadedCadastro(true)
            return
        }

        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponseCadastro
                })
                setIsGoogleScriptLoadedCadastro(true)
            }
        }
        document.head.appendChild(script)

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script)
            }
        }
    }, [showCadastroDialog, handleCredentialResponseCadastro])

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

    const handleCopyPayload = () => {
        if (buyTicketResponse?.pixData?.payload) {
            navigator.clipboard.writeText(buyTicketResponse.pixData.payload)
            Toast.success("Código PIX copiado!")
        }
    }

    const handleDownloadQrCode = () => {
        if (!buyTicketResponse?.pixData?.encodedImage) return
        const link = document.createElement("a")
        link.href = `data:image/png;base64,${buyTicketResponse.pixData.encodedImage}`
        link.download = "qrcode-pagamento.png"
        link.click()
        Toast.success("QR Code baixado com sucesso!")
    }

    const handleCheckPayment = async () => {
        if (!buyTicketResponse?.paymentId) {
            Toast.error("ID do pagamento não encontrado. Tente finalizar a compra novamente.")
            return
        }

        setIsCheckingPayment(true)
        try {
            const response = await PaymentService.verifyPaymentStatus(buyTicketResponse.paymentId)
            const status = response?.data?.status

            if (status === "CONFIRMED" || status === "RECEIVED") {
                setPaymentVerified(true)
                Toast.success("Pagamento realizado com sucesso! Redirecionando...")
                setTimeout(() => {
                    clearCart()
                }, 1000)
                setTimeout(() => {
                    router.push("/meus-ingressos")
                }, 1500)
            } else {
                Toast.info("Pagamento ainda não foi processado. Tente novamente em alguns instantes.")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message || "Erro ao verificar pagamento. Tente novamente.")
        } finally {
            setIsCheckingPayment(false)
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

    const updateAddressField = (field: string, value: string) => {
        const currentAddress = updateProfileForm.getValues("address") || {}
        const updatedAddress = {
            ...currentAddress,
            [field]: value || ""
        } as any
        
        if (field === "state") {
            updatedAddress.city = ""
        }
        
        updateProfileForm.setValue("address", updatedAddress)
    }

    const handleUpdateProfile = async (data: TUserProfileUpdate) => {
        try {
            const updateData: any = {}

            if (data.firstName) updateData.firstName = data.firstName
            if (data.lastName) updateData.lastName = data.lastName
            if (data.phone) updateData.phone = data.phone
            if (data.document) updateData.document = data.document
            
            if (data.nationality !== undefined) {
                updateData.nationality = data.nationality || null
            }
            
            if (data.gender !== undefined) {
                updateData.gender = data.gender || null
            }

            if (data.birth) {
                updateData.birth = data.birth
            }

            if (data.address) {
                updateData.address = {}
                
                if (data.address.street !== undefined) updateData.address.street = data.address.street || null
                if (data.address.number !== undefined) updateData.address.number = data.address.number || null
                if (data.address.complement !== undefined) updateData.address.complement = data.address.complement || null
                if (data.address.neighborhood !== undefined) updateData.address.neighborhood = data.address.neighborhood || null
                if (data.address.city !== undefined) updateData.address.city = data.address.city || null
                if (data.address.state !== undefined) updateData.address.state = data.address.state || null
                if (data.address.country !== undefined) updateData.address.country = data.address.country || null
                if (data.address.zipCode !== undefined) updateData.address.zipCode = data.address.zipCode || null
            }

            const response = await updateUser(updateData)

            if (response && response.success && response.data) {
                setUser(response.data)
                setShowUpdateProfileDialog(false)
                Toast.success("Perfil atualizado com sucesso!")
            } else {
                Toast.error("Erro ao atualizar perfil. Tente novamente.")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message || "Erro ao atualizar perfil. Tente novamente.")
        }
    }

    const genres = [
        { value: "MALE", label: "Masculino" },
        { value: "FEMALE", label: "Feminino" },
        { value: "PREFER_NOT_TO_SAY", label: "Prefiro não informar" },
    ]

    if (items.length === 0) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-12 mt-[100px]">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <h1 className="text-2xl font-medium text-psi-dark">Carrinho vazio</h1>
                        <p className="text-psi-dark/60">Adicione ingressos ao carrinho antes de finalizar a compra.</p>
                        <Button onClick={() => router.push("/")} variant="primary">
                            {
                                isSellerCheckout ? "Voltar ao painel" : "Voltar para eventos"
                            }
                        </Button>
                    </div>
                </div>
            </Background>
        )
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className={`container py-8
            sm:py-12 ${ user && user.role === "SELLER" ? "mt-0" : "mt-[100px]" }`}>
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-semibold text-psi-primary mb-2
                        sm:text-4xl">
                            Checkout
                        </h1>
                        <p className="text-psi-dark/60">
                            Finalize sua compra de ingressos
                        </p>
                        {
                            isAuthenticated && (
                                <div className="mt-4">
                                    <CheckoutTimer expiresAt={new Date(new Date().getTime() + 1000 * 60 * 60 * 24).toISOString()} onExpire={() => { }} />
                                </div>
                            )
                        }
                        {user?.role === "SELLER" && (
                            <div className="mt-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => {
                                        clearCart()
                                        Toast.success("Carrinho resetado.")
                                    }}
                                    className="text-psi-dark/70 hover:text-destructive hover:border-destructive/50"
                                >
                                    <Trash2 className="h-4 w-4" />
                                    Resetar carrinho
                                </Button>
                            </div>
                        )}
                    </div>

                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {[
                                { number: 1, label: isSellerCheckout ? "Cliente" : "Dados do Comprador", icon: User },
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
                                            <div className={`flex items-center justify-center size-10 rounded-full border-2 transition-all ${isActive
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
                                            sm:text-sm ${isActive
                                                    ? "text-psi-primary"
                                                    : isCompleted
                                                        ? "text-psi-primary"
                                                        : "text-psi-dark/40"
                                                }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {index < (hasForms ? 3 : 2) && (
                                            <div className={`flex-1 h-0.5 mx-2 transition-all ${isCompleted
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
                                    <h2 className="text-xl font-medium text-psi-dark mb-6">
                                        {isSellerCheckout ? "Cliente do Organizador" : "Dados do Comprador"}
                                    </h2>

                                    {isSellerCheckout ? (
                                        <div className="space-y-5">
                                            <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
                                                <p className="text-sm font-medium text-psi-dark mb-1">Selecione o cliente</p>
                                                <p className="text-xs text-psi-dark/70">
                                                    Selecione um cliente do organizador ou cadastre um novo cliente para seguir com a compra.
                                                </p>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-psi-dark">Buscar cliente</label>
                                                <Input
                                                    value={sellerClientSearch}
                                                    onChange={(e) => setSellerClientSearch(e.target.value)}
                                                    placeholder="Digite nome, e-mail ou CPF"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between gap-2">
                                                    <label className="text-sm font-medium text-psi-dark">Cliente do organizador</label>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => {
                                                            if (isNewOrganizerClient) {
                                                                setIsNewOrganizerClient(false)
                                                                setNewOrganizerClientDialogOpen(false)
                                                                setSelectedOrganizerClientId("")
                                                                setNewCreatedCustomerUserId("")
                                                            } else {
                                                                setIsNewOrganizerClient(true)
                                                                setSelectedOrganizerClientId("")
                                                                setNewCreatedCustomerUserId("")
                                                                setNewOrganizerClientDialogOpen(true)
                                                            }
                                                        }}
                                                    >
                                                        {isNewOrganizerClient ? "Usar cliente existente" : "Novo cliente"}
                                                    </Button>
                                                </div>

                                                {!isNewOrganizerClient ? (
                                                    <Popover open={clientSelectOpen} onOpenChange={setClientSelectOpen}>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                type="button"
                                                                variant="outline"
                                                                className="w-full justify-start gap-3 h-auto min-h-10 py-2 px-3 font-normal"
                                                            >
                                                                {(() => {
                                                                    const selected = organizerClients.find((c) => c.id === selectedOrganizerClientId)
                                                                    if (isLoadingOrganizerClients) {
                                                                        return (
                                                                            <span className="flex items-center gap-2 text-psi-dark/60">
                                                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                                                Carregando clientes...
                                                                            </span>
                                                                        )
                                                                    }
                                                                    if (selected) {
                                                                        const phoneFormatted = selected.phone
                                                                            ? selected.phone.replace(/\D/g, '').length === 11
                                                                                ? selected.phone.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
                                                                                : selected.phone.replace(/\D/g, '').length === 10
                                                                                    ? selected.phone.replace(/\D/g, '').replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
                                                                                    : selected.phone
                                                                            : null
                                                                        return (
                                                                            <span className="flex items-center gap-3 text-left">
                                                                                <Avatar className="h-8 w-8 shrink-0">
                                                                                    <AvatarImage src={selected.image ? ImageUtils.getUserImageUrl(selected.image) : undefined} alt="" />
                                                                                    <AvatarFallback className="bg-psi-primary/10 text-psi-primary text-xs">
                                                                                        <User className="h-4 w-4" />
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                <span className="flex flex-col items-start truncate min-w-0">
                                                                                    <span className="font-medium text-psi-dark truncate w-full">{selected.firstName} {selected.lastName}</span>
                                                                                    <span className="text-xs text-psi-dark/60 truncate w-full">{selected.email}{phoneFormatted ? ` • ${phoneFormatted}` : ""}</span>
                                                                                </span>
                                                                            </span>
                                                                        )
                                                                    }
                                                                    return (
                                                                        <span className="text-psi-dark/60">Selecione o cliente</span>
                                                                    )
                                                                })()}
                                                                <ChevronDown className="h-4 w-4 shrink-0 ml-auto opacity-50" />
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                                            <div className="max-h-[280px] overflow-y-auto">
                                                                {organizerClients.length === 0 ? (
                                                                    <div className="py-6 text-center text-sm text-psi-dark/60">
                                                                        Nenhum cliente encontrado
                                                                    </div>
                                                                ) : (
                                                                    organizerClients.map((client) => {
                                                                        const phoneFormatted = client.phone
                                                                            ? client.phone.replace(/\D/g, '').length === 11
                                                                                ? client.phone.replace(/\D/g, '').replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
                                                                                : client.phone.replace(/\D/g, '').length === 10
                                                                                    ? client.phone.replace(/\D/g, '').replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
                                                                                    : client.phone
                                                                            : null
                                                                        const isSelected = selectedOrganizerClientId === client.id
                                                                        return (
                                                                            <button
                                                                                key={client.id}
                                                                                type="button"
                                                                                onClick={() => {
                                                                                    setSelectedOrganizerClientId(client.id)
                                                                                    setClientSelectOpen(false)
                                                                                }}
                                                                                className={`w-full flex items-center gap-3 p-3 text-left transition-colors border-b border-[#E4E6F0] last:border-b-0 hover:bg-psi-primary/5 ${isSelected ? "bg-psi-primary/10" : ""}`}
                                                                            >
                                                                                <Avatar className="h-10 w-10 shrink-0">
                                                                                    <AvatarImage src={client.image ? ImageUtils.getUserImageUrl(client.image) : undefined} alt="" />
                                                                                    <AvatarFallback className="bg-psi-primary/10 text-psi-primary">
                                                                                        <User className="h-5 w-5" />
                                                                                    </AvatarFallback>
                                                                                </Avatar>
                                                                                <div className="flex flex-col min-w-0 flex-1">
                                                                                    <span className="font-medium text-psi-dark truncate">{client.firstName} {client.lastName}</span>
                                                                                    <span className="text-xs text-psi-dark/70 truncate">{client.email}</span>
                                                                                    {phoneFormatted && (
                                                                                        <span className="text-xs text-psi-dark/60 flex items-center gap-1 mt-0.5">
                                                                                            <Phone className="h-3 w-3 shrink-0" />
                                                                                            {phoneFormatted}
                                                                                        </span>
                                                                                    )}
                                                                                </div>
                                                                                {isSelected && <Check className="h-5 w-5 text-psi-primary shrink-0" />}
                                                                            </button>
                                                                        )
                                                                    })
                                                                )}
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                ) : (
                                                    <div className="space-y-3">
                                                        <div className="rounded-xl border border-psi-dark/10 bg-psi-dark/2 p-4 space-y-3">
                                                            <div className="flex items-start justify-between gap-3">
                                                                <div className="space-y-1">
                                                                    <p className="text-sm font-medium text-psi-dark">Novo cliente</p>
                                                                    <p className="text-xs text-psi-dark/60">
                                                                        CEP e número são essenciais para aprovação no cartão e para evitar rejeição no anti-fraude.
                                                                    </p>
                                                                </div>
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setNewOrganizerClientDialogOpen(true)}
                                                                >
                                                                    {newCreatedCustomerUserId ? "Editar" : "Preencher"}
                                                                </Button>
                                                            </div>

                                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-psi-dark/70">
                                                                <div><span className="text-psi-dark/50">Nome:</span> {newOrganizerClientFirstName || "-"}</div>
                                                                <div><span className="text-psi-dark/50">Sobrenome:</span> {newOrganizerClientLastName || "-"}</div>
                                                                <div className="sm:col-span-2"><span className="text-psi-dark/50">E-mail:</span> {newOrganizerClientEmail || "-"}</div>
                                                                <div><span className="text-psi-dark/50">CPF:</span> {newOrganizerClientDocument || "-"}</div>
                                                                <div><span className="text-psi-dark/50">Telefone:</span> {newOrganizerClientPhone || "-"}</div>
                                                                <div><span className="text-psi-dark/50">CEP:</span> {newOrganizerClientZipCode || "-"}</div>
                                                                <div><span className="text-psi-dark/50">Número:</span> {newOrganizerClientAddressNumber || "-"}</div>
                                                            </div>

                                                            {!newCreatedCustomerUserId && (
                                                                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2">
                                                                    Para continuar, preencha e salve o cliente.
                                                                </p>
                                                            )}
                                                            {newCreatedCustomerUserId && (
                                                                <p className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg p-2">
                                                                    Cliente cadastrado. Depois, clique em “Continuar” para seguir com a compra.
                                                                </p>
                                                            )}
                                                        </div>

                                                        <Dialog open={newOrganizerClientDialogOpen} onOpenChange={setNewOrganizerClientDialogOpen}>
                                                            <DialogContent className="max-w-lg">
                                                                <div className="space-y-4">
                                                                    <div className="space-y-1">
                                                                        <h3 className="text-lg font-medium text-psi-dark">Novo cliente</h3>
                                                                        <p className="text-xs text-psi-dark/60">
                                                                            CEP e número são essenciais para aprovação no cartão e para evitar rejeição no anti-fraude.
                                                                        </p>
                                                                    </div>

                                                                    <div className="space-y-4">
                                                                        <div className="rounded-xl border border-psi-dark/10 bg-white p-4 space-y-3">
                                                                            <p className="text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                Informações pessoais
                                                                            </p>
                                                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                                                <Input
                                                                                    value={newOrganizerClientFirstName}
                                                                                    onChange={(e) => setNewOrganizerClientFirstName(e.target.value)}
                                                                                    placeholder="Nome"
                                                                                />
                                                                                <Input
                                                                                    value={newOrganizerClientLastName}
                                                                                    onChange={(e) => setNewOrganizerClientLastName(e.target.value)}
                                                                                    placeholder="Sobrenome"
                                                                                />
                                                                                <Input
                                                                                    className="sm:col-span-2"
                                                                                    type="email"
                                                                                    value={newOrganizerClientEmail}
                                                                                    onChange={(e) => setNewOrganizerClientEmail(e.target.value)}
                                                                                    placeholder="E-mail"
                                                                                />
                                                                                <InputMask
                                                                                    mask="000.000.000-00"
                                                                                    value={newOrganizerClientDocument}
                                                                                    onAccept={(value) => setNewOrganizerClientDocument(String(value))}
                                                                                    placeholder="CPF"
                                                                                    inputMode="numeric"
                                                                                />
                                                                                <InputMask
                                                                                    mask="(00) 00000-0000"
                                                                                    value={newOrganizerClientPhone}
                                                                                    onAccept={(value) => setNewOrganizerClientPhone(String(value))}
                                                                                    placeholder="Telefone"
                                                                                    inputMode="tel"
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <div className="rounded-xl border border-psi-dark/10 bg-white p-4 space-y-3">
                                                                            <p className="text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                Endereço
                                                                            </p>
                                                                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                                                                <InputMask
                                                                                    mask="00000-000"
                                                                                    value={newOrganizerClientZipCode}
                                                                                    onAccept={(value) => setNewOrganizerClientZipCode(String(value))}
                                                                                    placeholder="CEP"
                                                                                    inputMode="numeric"
                                                                                />
                                                                                <Input
                                                                                    value={newOrganizerClientAddressNumber}
                                                                                    onChange={(e) => setNewOrganizerClientAddressNumber(e.target.value)}
                                                                                    placeholder="Número"
                                                                                    inputMode="numeric"
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    </div>

                                                                    <div className="flex items-center justify-end gap-2 pt-2">
                                                                        <Button
                                                                            type="button"
                                                                            variant="outline"
                                                                            onClick={() => setNewOrganizerClientDialogOpen(false)}
                                                                        >
                                                                            Cancelar
                                                                        </Button>
                                                                        <Button
                                                                            type="button"
                                                                            variant="primary"
                                                                            disabled={isCreatingCustomer}
                                                                            onClick={handleSaveNewOrganizerClient}
                                                                        >
                                                                            {isCreatingCustomer ? <LoadingButton /> : "Salvar cliente"}
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </DialogContent>
                                                        </Dialog>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ) : isAuthenticated ? (
                                        <div className="space-y-6">
                                            {user?.role === "CUSTOMER" ? (
                                                user.isCompleteInfo ? (
                                                    <div className="space-y-4">
                                                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                                            <div className="flex items-start gap-3">
                                                                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-emerald-900 mb-1">
                                                                        Dados completos
                                                                    </p>
                                                                    <p className="text-sm text-emerald-700">
                                                                        Seus dados estão completos e prontos para a compra.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            className="w-full"
                                                            onClick={() => setShowViewProfileDialog(true)}
                                                        >
                                                            <UserCircle className="h-4 w-4" />
                                                            Conferir meus dados
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                                            <div className="flex items-start gap-3">
                                                                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-amber-900 mb-1">
                                                                        Dados incompletos
                                                                    </p>
                                                                    <p className="text-sm text-amber-700">
                                                                        Por favor, complete seus dados antes de continuar com a compra.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="primary"
                                                            className="w-full"
                                                            onClick={() => setShowUpdateProfileDialog(true)}
                                                        >
                                                            <UserCircle className="h-4 w-4" />
                                                            Atualizar meus dados
                                                        </Button>
                                                    </div>
                                                )
                                            ) : user?.role === "ORGANIZER" ? (
                                                user.isCompleteInfo ? (
                                                    <div className="space-y-4">
                                                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                                                            <div className="flex items-start gap-3">
                                                                <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-emerald-900 mb-1">
                                                                        Dados completos
                                                                    </p>
                                                                    <p className="text-sm text-emerald-700">
                                                                        Seus dados estão completos e prontos para a compra.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                                            <div className="flex items-start gap-3">
                                                                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                                                <div>
                                                                    <p className="text-sm font-medium text-amber-900 mb-1">
                                                                        Dados incompletos
                                                                    </p>
                                                                    <p className="text-sm text-amber-700">
                                                                        Por favor, vá até "Meu Perfil" e complete seu cadastro antes de continuar com a compra.
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="primary"
                                                            className="w-full"
                                                            onClick={() => router.push("/meu-perfil")}
                                                        >
                                                            <UserCircle className="h-4 w-4" />
                                                            Ir para Meu Perfil
                                                        </Button>
                                                    </div>
                                                )
                                            ) : null}
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
                                                        <ArrowRight className="size-4" />
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
                                    <h2 className="text-xl font-medium text-psi-dark mb-6">Resumo da Compra</h2>

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
                                                                <h3 className="font-medium text-psi-dark">{event.name}</h3>
                                                            </div>

                                                            <div className="animate-pulse transition-opacity duration-700">
                                                                <Badge variant="psi-tertiary" className="text-xs font-medium">
                                                                    Garanta já seu ingresso!
                                                                </Badge>
                                                            </div>

                                                            {item.batchName && (
                                                                <p className="text-sm text-psi-dark/60">Lote: {item.batchName}</p>
                                                            )}

                                                            {event.EventDates && event.EventDates.length > 0 && (() => {
                                                                const datesToShow = event.Recurrence 
                                                                    ? event.EventDates.filter(ed => ed.isActive === true)
                                                                    : event.EventDates
                                                                if (datesToShow.length === 0) return null
                                                                return (
                                                                    <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                                                        <Calendar className="size-4" aria-label="Datas e horários do evento" />
                                                                        <span>
                                                                            {datesToShow.map((ed, index) => (
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
                                                                )
                                                            })()}

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
                                                                                    {tt.days && tt.days.length > 0 && (() => {
                                                                                        const originalEventDateId = tt.days?.[0]
                                                                                        const activeEventDateId = event ? getActiveEventDateId(event, originalEventDateId) : originalEventDateId
                                                                                        const eventDate = event && activeEventDateId 
                                                                                            ? event.EventDates?.find((ed: any) => ed.id === activeEventDateId)
                                                                                            : null
                                                                                        return (
                                                                                            <p className="text-xs text-psi-dark/60 mt-1">
                                                                                                {isMultipleDaysWithTicketTypes && tt.days && tt.days.length > 0
                                                                                                    ? eventDate
                                                                                                        ? formatEventDate(eventDate.date, "DD [de] MMMM [de] YYYY")
                                                                                                        : "Dia selecionado"
                                                                                                    : tt.days && tt.days.length === 1 ? "1 dia selecionado" : tt.days ? `${tt.days.length} dias selecionados` : ""}
                                                                                            </p>
                                                                                        )
                                                                                    })()}
                                                                                </div>
                                                                                <div className="flex items-center gap-3">
                                                                                    <QuantitySelector
                                                                                        value={tt.quantity}
                                                                                        onChange={async (qty) => {
                                                                                            const isDayBasedWithoutTicketTypes = CheckoutUtils.isDayBasedWithoutTicketTypes([tt])
                                                                                            const isMultipleDaysWithTicketTypes = CheckoutUtils.isMultipleDaysWithTicketTypes([tt])
                                                                                            const identifier = CheckoutUtils.getTicketTypeIdentifier(tt)
                                                                                            const underlineIdentifier = CheckoutUtils.getTicketTypeIdentifier(tt, true)

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
                                                                                                    const originalEventDateId = isMultipleDaysWithTicketTypes ? underlineIdentifier?.split("_")[1] : identifier
                                                                                                    const activeEventDateId = event && originalEventDateId ? getActiveEventDateId(event, originalEventDateId) : originalEventDateId
                                                                                                    const ticketTypeId = isMultipleDaysWithTicketTypes ? underlineIdentifier?.split("_")[0] : identifier
                                                                                                    
                                                                                                    let ticketHoldId = ticketHoldData?.find((th) => th.eventDateId === activeEventDateId && th.ticketTypeId === ticketTypeId)?.id || ""

                                                                                                    if (!ticketHoldId) {
                                                                                                        ticketHoldId = ticketHoldData?.find((th) => th.eventDateId === activeEventDateId)?.id || ""
                                                                                                    }

                                                                                                    const success = await handleUpdateQuantity({
                                                                                                        eventId: item.eventId,
                                                                                                        batchId: item.batchId || "",
                                                                                                        qty: qty,
                                                                                                        ticketHoldId: ticketHoldId
                                                                                                    }, false)

                                                                                                    if (success) {
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

                                                                                                }

                                                                                                return
                                                                                            }
                                                                                            const originalEventDateId = item.ticketTypes?.[0]?.days?.[0] || null
                                                                                            const activeEventDateId = event ? getActiveEventDateId(event, originalEventDateId) : originalEventDateId
                                                                                            const success = await handleUpdateQuantity({
                                                                                                eventId: item.eventId,
                                                                                                batchId: item.batchId || "",
                                                                                                qty: qty,
                                                                                                ticketHoldId: ticketHoldData?.find((th) => th.ticketTypeId === tt.ticketTypeId)?.id || ticketHoldData?.find((th) => th.eventDateId === activeEventDateId)?.id || ""
                                                                                            }, false)

                                                                                            if (success) {
                                                                                                updateTicketTypeQuantity(item.eventId, item.batchId, tt.ticketTypeId, qty)
                                                                                            }
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
                                                                            onChange={(qty) => {
                                                                                const originalEventDateId = item.ticketTypes?.[0]?.days?.[0] || null
                                                                                const activeEventDateId = event ? getActiveEventDateId(event, originalEventDateId) : originalEventDateId
                                                                                handleUpdateQuantity({
                                                                                    eventId: item.eventId,
                                                                                    batchId: item.batchId || "",
                                                                                    qty: qty,
                                                                                    ticketHoldId: handleFindTicketHoldId(item.eventId, item.batchId || "", activeEventDateId, item.ticketTypes?.[0]?.ticketTypeId || null)
                                                                                })
                                                                            }}
                                                                            disabled={isUpdatingTicketHold}
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
                                                                                    <p className="text-sm font-medium text-emerald-900">
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

                                                            {/* <div className="pt-2 border-t border-psi-dark/10 space-y-2">
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
                                                                    <p className="text-lg font-medium text-psi-primary">
                                                                        {ValueUtils.centsToCurrency(
                                                                            CheckoutUtils.calculateItemTotal(item, event) -
                                                                            (currentEventCoupon ? totalDiscount : 0)
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div> */}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    <div className="mt-6 p-4 rounded-xl bg-psi-primary/5 border border-psi-primary/20">
                                        <div className="flex items-start gap-3">
                                            <MailCheck className="size-5 text-psi-primary shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="font-medium text-psi-dark">Importante</p>
                                                {
                                                    isSellerCheckout ? (
                                                        <>
                                                        <p className="text-sm text-psi-dark/70">
                                                            Os ingressos serão enviados para o cliente através do e-mail informado.
                                                        </p>
                                                        </>
                                                    )
                                                    : (
                                                        <>
                                                        <p className="text-sm text-psi-dark/70">
                                                            Os ingressos serão enviados para o seu e-mail juntamente com o comprovante de pagamento após a confirmação.
                                                        </p>
                                                        </>
                                                    )
                                                }
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
                                                                <h2 className="text-xl font-medium text-psi-dark mb-1">{eventName}</h2>
                                                                {isForEachTicket && (
                                                                    <div className="space-y-1">
                                                                        <p className="text-sm font-medium text-psi-primary">Ingresso {ticketNumber} de {currentTicketQuantity}</p>
                                                                        <p className="text-sm font-medium text-psi-dark">{currentTicketTypeName !== "Ingresso" ? currentTicketTypeName : ""}</p>
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
                                                                                        const currentArray = Array.isArray(currentValue?.answer) ? currentValue.answer : []
                                                                                        const isChecked = currentArray.includes(option)
                                                                                        return (
                                                                                            <div key={optIndex} className="flex items-center gap-2">
                                                                                                <Checkbox
                                                                                                    id={`${key}-${optIndex}`}
                                                                                                    checked={isChecked}
                                                                                                    onCheckedChange={(checked) => {
                                                                                                        const currentArray = Array.isArray(currentValue?.answer) ? currentValue.answer : []
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
                                        <h2 className="text-2xl font-medium text-psi-dark">Finalizar Compra</h2>
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
                                                        <h3 className="text-lg font-medium text-psi-dark mb-4">Forma de Pagamento</h3>

                                                        <div className="space-y-4 mb-6">
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setPaymentMethod("pix")
                                                                    setPaymentLinkUrl("")
                                                                }}
                                                                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === "pix"
                                                                        ? "border-psi-primary bg-psi-primary/5"
                                                                        : "border-psi-dark/10 hover:border-psi-primary/30"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`size-4 rounded-full border-2 ${paymentMethod === "pix"
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
                                                                        <span className="font-medium text-psi-dark">PIX</span>
                                                                    </div>
                                                                </div>
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setPaymentMethod("credit")
                                                                    setPaymentLinkUrl("")
                                                                }}
                                                                className={`w-full p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === "credit"
                                                                        ? "border-psi-primary bg-psi-primary/5"
                                                                        : "border-psi-dark/10 hover:border-psi-primary/30"
                                                                    }`}
                                                            >
                                                                <div className="flex items-center gap-3">
                                                                    <div className={`size-4 rounded-full border-2 ${paymentMethod === "credit"
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
                                                                        <span className="font-medium text-psi-dark">Cartão de Crédito</span>
                                                                    </div>
                                                                </div>
                                                            </button>

                                                            {isSellerCheckout && (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => setPaymentMethod("link")}
                                                                    className={`w-full p-4 rounded-xl border-2 transition-all text-left ${paymentMethod === "link"
                                                                            ? "border-psi-primary bg-psi-primary/5"
                                                                            : "border-psi-dark/10 hover:border-psi-primary/30"
                                                                        }`}
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`size-4 rounded-full border-2 ${paymentMethod === "link"
                                                                                ? "border-psi-primary bg-psi-primary"
                                                                                : "border-psi-dark/30"
                                                                            }`}>
                                                                            {paymentMethod === "link" && (
                                                                                <div className="size-full rounded-full bg-white scale-50" />
                                                                            )}
                                                                        </div>
                                                                        <div className="flex items-center gap-2">
                                                                            <Link2 className="h-5 w-5 text-psi-primary" />
                                                                            <span className="font-medium text-psi-dark">Link de pagamento</span>
                                                                        </div>
                                                                    </div>
                                                                </button>
                                                            )}
                                                        </div>

                                                        {isSellerCheckout && paymentMethod === "link" && (
                                                            <div className="pt-6 border-t border-psi-dark/10 space-y-3">
                                                                <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
                                                                    <p className="text-sm font-medium text-psi-dark mb-1">Link de pagamento</p>
                                                                    <p className="text-xs text-psi-dark/70">
                                                                        Ao gerar, você poderá copiar o link e enviar ao cliente. O pagamento poderá ser feito por PIX (pré-gerado) ou cartão.
                                                                    </p>
                                                                </div>

                                                                {paymentLinkUrl ? (
                                                                    <div className="space-y-2">
                                                                        <label className="text-sm font-medium text-psi-dark">Link gerado</label>
                                                                        <div className="flex gap-2">
                                                                            <Input value={paymentLinkUrl} readOnly />
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                onClick={async () => {
                                                                                    try {
                                                                                        await navigator.clipboard.writeText(paymentLinkUrl)
                                                                                        Toast.success("Link copiado!")
                                                                                    } catch {
                                                                                        Toast.error("Não foi possível copiar o link.")
                                                                                    }
                                                                                }}
                                                                            >
                                                                                Copiar
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <p className="text-xs text-psi-dark/60">
                                                                        Clique em <span className="font-medium">Gerar link de pagamento</span> na finalização para criar o link.
                                                                    </p>
                                                                )}
                                                            </div>
                                                        )}

                                                        {paymentMethod === "credit" && (
                                                            <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                {isLoadingCards && (
                                                                    <div className="flex items-center justify-center gap-2 py-8">
                                                                        <Loader2 className="h-5 w-5 animate-spin text-psi-primary" />
                                                                        <span className="text-sm text-psi-dark/60">Carregando cartões...</span>
                                                                    </div>
                                                                )}

                                                                {!isLoadingCards && cards.length > 0 && !showNewCardForm && (
                                                                    <div className="space-y-3">
                                                                        <div className="flex items-center justify-between">
                                                                            <h4 className="text-sm font-medium text-psi-dark">Cartões Cadastrados</h4>
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                size="sm"
                                                                                onClick={() => {
                                                                                    setShowNewCardForm(true)
                                                                                    setSelectedCardId(null)
                                                                                }}
                                                                            >
                                                                                <CreditCard className="h-4 w-4" />
                                                                                Novo Cartão
                                                                            </Button>
                                                                        </div>
                                                                        <div className="grid gap-3
                                                                        sm:grid-cols-2">
                                                                            {cards.map((card: TCard) => {
                                                                                const isSelected = selectedCardId === card.id
                                                                                const cardBrandLower = card.brand.toLowerCase()
                                                                                const brandColors: Record<string, { bg: string; text: string }> = {
                                                                                    visa: { bg: "bg-[#1434CB]", text: "text-white" },
                                                                                    mastercard: { bg: "bg-[#EB001B]", text: "text-white" },
                                                                                    amex: { bg: "bg-[#006FCF]", text: "text-white" },
                                                                                    elo: { bg: "bg-[#FFCB05]", text: "text-[#231F20]" },
                                                                                    hipercard: { bg: "bg-[#DF0F50]", text: "text-white" },
                                                                                    jcb: { bg: "bg-[#052F9C]", text: "text-white" },
                                                                                    discover: { bg: "bg-[#00AEEF]", text: "text-white" },
                                                                                    cabal: { bg: "bg-[#000000]", text: "text-white" },
                                                                                    banescard: { bg: "bg-[#000000]", text: "text-white" },
                                                                                }
                                                                                const brandColor = brandColors[cardBrandLower] || { bg: "bg-gray-600", text: "text-white" }

                                                                                return (
                                                                                    <button
                                                                                        key={card.id}
                                                                                        type="button"
                                                                                        onClick={() => setSelectedCardId(card.id)}
                                                                                        className={`relative p-4 rounded-xl border-2 transition-all text-left overflow-hidden ${isSelected
                                                                                                ? "border-psi-primary bg-psi-primary/5"
                                                                                                : "border-psi-dark/10 hover:border-psi-primary/30 bg-white"
                                                                                            }`}
                                                                                    >
                                                                                        <div className={`absolute top-0 right-0 w-20 h-20 ${brandColor.bg} rounded-full -mr-10 -mt-10 opacity-20`} />
                                                                                        <div className="relative space-y-3">
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div className="h-10 flex items-center">
                                                                                                    <img
                                                                                                        src={getCardBrandIcon(card.brand)}
                                                                                                        alt={card.brand}
                                                                                                        className="h-full object-contain"
                                                                                                    />
                                                                                                </div>
                                                                                                {isSelected && (
                                                                                                    <CheckCircle2 className="h-5 w-5 text-psi-primary" />
                                                                                                )}
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/60 mb-1">Número do Cartão</p>
                                                                                                <p className="text-lg font-medium text-psi-dark font-mono">
                                                                                                    •••• •••• •••• {card.last4}
                                                                                                </p>
                                                                                            </div>
                                                                                            <div className="flex items-center justify-between">
                                                                                                <div>
                                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Nome</p>
                                                                                                    <p className="text-sm font-medium text-psi-dark">{card.name}</p>
                                                                                                </div>
                                                                                                <div>
                                                                                                    <p className="text-xs text-psi-dark/60 mb-1">Validade</p>
                                                                                                    <p className="text-sm font-medium text-psi-dark">
                                                                                                        {card.expMonth?.padStart(2, "0")}/{card.expYear?.slice(-2)}
                                                                                                    </p>
                                                                                                </div>
                                                                                            </div>
                                                                                        </div>
                                                                                    </button>
                                                                                )
                                                                            })}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {!isLoadingCards && (showNewCardForm || cards.length === 0) && (
                                                                    <div className="space-y-4">
                                                                        {cards.length > 0 && (
                                                                            <div className="flex items-center justify-between">
                                                                                <h4 className="text-sm font-medium text-psi-dark">Novo Cartão</h4>
                                                                                <Button
                                                                                    type="button"
                                                                                    variant="ghost"
                                                                                    size="sm"
                                                                                    onClick={() => {
                                                                                        setShowNewCardForm(false)
                                                                                        setCardData({ number: "", name: "", expiry: "", cvv: "" })
                                                                                    }}
                                                                                >
                                                                                    Usar cartão cadastrado
                                                                                </Button>
                                                                            </div>
                                                                        )}
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
                                                                                        <img
                                                                                            src={getCardBrandIcon(cardBrand)}
                                                                                            alt={cardBrand}
                                                                                            className="h-10 w-auto object-contain"
                                                                                        />
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

                                                        {buyTicketResponse?.pixData && (
                                                            <div className="space-y-6 pt-6 border-t border-psi-dark/10">
                                                                <div>
                                                                    <h3 className="text-lg font-medium text-psi-dark mb-4">Pagamento via PIX</h3>
                                                                    <p className="text-sm text-psi-dark/70 mb-6">
                                                                        Escaneie o QR Code ou copie o código para realizar o pagamento
                                                                    </p>
                                                                </div>

                                                                <div className="flex justify-center">
                                                                    <div className="p-4 bg-white rounded-xl border border-psi-dark/10">
                                                                        <img
                                                                            src={`data:image/png;base64,${buyTicketResponse.pixData.encodedImage}`}
                                                                            alt="QR Code PIX"
                                                                            className="w-64 h-64
                                                                            sm:w-80 sm:h-80"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-2">
                                                                    <label className="block text-xs font-medium text-psi-dark mb-2">
                                                                        Código PIX (Copia e Cola)
                                                                    </label>
                                                                    <div className="flex gap-2">
                                                                        <Input
                                                                            value={buyTicketResponse.pixData.payload}
                                                                            readOnly
                                                                            className="
                                                                            w-[270px] font-mono text-xs cursor-pointer hover:bg-psi-dark/5
                                                                            lg:w-[500px]
                                                                            "
                                                                            onClick={handleCopyPayload}
                                                                        />
                                                                        {isSellerCheckout && (
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                onClick={handleDownloadQrCode}
                                                                                className="shrink-0"
                                                                            >
                                                                                <Download className="h-4 w-4" />
                                                                                Baixar QrCode
                                                                            </Button>
                                                                        )}
                                                                    </div>
                                                                </div>

                                                                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                                                                    <div className="flex items-start gap-3">
                                                                        <Clock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                                                        <div>
                                                                            <p className="text-sm font-medium text-amber-900 mb-1">
                                                                                Válido até
                                                                            </p>
                                                                            <p className="text-sm text-amber-700">
                                                                                {new Date(buyTicketResponse.pixData.expirationDate).toLocaleString("pt-BR", {
                                                                                    day: "2-digit",
                                                                                    month: "2-digit",
                                                                                    year: "numeric",
                                                                                    hour: "2-digit",
                                                                                    minute: "2-digit"
                                                                                })}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <div className="p-4 rounded-xl bg-psi-primary/5 border border-psi-primary/20">
                                                                    <div className="flex items-start gap-3">
                                                                        <QrCode className="h-5 w-5 text-psi-primary shrink-0 mt-0.5" />
                                                                        <div>
                                                                            <p className="text-sm font-medium text-psi-dark mb-1">
                                                                                {buyTicketResponse.pixData.description}
                                                                            </p>
                                                                            <p className="text-xs text-psi-dark/70">
                                                                                Após realizar o pagamento, o sistema verificará automaticamente a cada 5 segundos. Você também pode verificar manualmente clicando no botão abaixo.
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>

                                                                <Button
                                                                    type="button"
                                                                    variant="primary"
                                                                    className="w-full"
                                                                    size="lg"
                                                                    onClick={handleCheckPayment}
                                                                    disabled={isCheckingPayment || paymentVerified}
                                                                >
                                                                    {isCheckingPayment ? (
                                                                        <>
                                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                                            Verificando...
                                                                        </>
                                                                    ) : (
                                                                        <>
                                                                            <RefreshCw className="h-4 w-4" />
                                                                            Verificar Pagamento
                                                                        </>
                                                                    )}
                                                                </Button>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                        }

                                        {!items?.[0]?.isFree && (
                                            <div className="p-4 rounded-xl border border-psi-dark/10 bg-white">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2 mb-1">
                                                            <h3 className="font-medium text-psi-dark">Seguro da Compra</h3>
                                                            <button
                                                                type="button"
                                                                onClick={() => setShowInsuranceDialog(true)}
                                                                className="text-psi-primary hover:underline text-xs font-medium"
                                                            >
                                                                Entenda como funciona o seguro
                                                            </button>
                                                        </div>
                                                        <p className="text-xs text-psi-dark/60">
                                                            Proteja sua compra contra imprevistos
                                                        </p>
                                                        {isInsured && (
                                                            <p className="text-xs text-emerald-600 font-medium mt-1">
                                                                + {ValueUtils.centsToCurrency(insuranceValue)}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <Switch
                                                        checked={isInsured}
                                                        onCheckedChange={setIsInsured}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="p-4 rounded-xl bg-psi-dark/5">
                                            <h3 className="font-medium text-psi-dark mb-2">Resumo</h3>
                                            <div className="space-y-2 text-sm">
                                                {totalDiscount > 0 && (
                                                    <>
                                                        <div className="flex items-center justify-between text-psi-dark/70">
                                                            <span>Subtotal:</span>
                                                            <span>{ValueUtils.centsToCurrency(subtotal)}</span>
                                                        </div>
                                                    </>
                                                )}
                                                {paymentMethod === "credit" && installments > 1 && (
                                                    <div className="flex items-center justify-between text-psi-dark/70">
                                                        <span>Subtotal após desconto:</span>
                                                        <span>{ValueUtils.centsToCurrency(subtotal)}</span>
                                                    </div>
                                                )}
                                                {paymentMethod === "credit" && (
                                                    <div className="flex items-center justify-between text-psi-dark/70">
                                                        <span>Taxa de parcelamento ({installments}x):</span>
                                                        <span>{ValueUtils.centsToCurrency(calculateTotalWithInstallmentFee(subtotal, installments) - subtotal)}</span>
                                                    </div>
                                                )}
                                                {isInsured && !items?.[0]?.isFree && (
                                                    <div className="flex items-center justify-between text-psi-dark/70">
                                                        <span>Seguro da Compra:</span>
                                                        <span>{ValueUtils.centsToCurrency(insuranceValue)}</span>
                                                    </div>
                                                )}
                                                <div className="flex items-center justify-between font-medium text-psi-dark pt-2 border-t border-psi-dark/10">
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
                                                            <p className="text-psi-dark/70">
                                                                <strong>Pagamento:</strong>{" "}
                                                                {paymentMethod === "pix"
                                                                    ? "PIX"
                                                                    : paymentMethod === "credit"
                                                                        ? "Cartão de Crédito"
                                                                        : "Link de pagamento"}
                                                            </p>
                                                        )
                                                }
                                            </div>
                                        </div>

                                        {!buyTicketResponse?.pixData && (
                                            <div className="space-y-4">
                                                <p className="text-sm text-psi-dark/70 text-center">
                                                    Ao efetuar a compra eu aceito o{" "}
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowRegulamentoDialog(true)}
                                                        className="text-psi-primary hover:underline font-medium"
                                                    >
                                                        regulamento da plataforma para compra de ingressos.
                                                    </button>
                                                </p>
                                                <div className="flex justify-center">
                                                    <Button
                                                        type="button"
                                                        onClick={handleFinalize}
                                                        variant="primary"
                                                        size="lg"
                                                        className=""
                                                        disabled={isBuyingTicket || isBuyingTicketSeller}
                                                    >
                                                        {(isBuyingTicket || isBuyingTicketSeller) ? (
                                                            <LoadingButton />
                                                        ) : (
                                                            <>
                                                            <Check className="size-4" />
                                                            {isSellerCheckout && paymentMethod === "link" ? "Gerar link de pagamento" : "Finalizar Compra"}
                                                            </>
                                                        )}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
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
                                <h3 className="font-medium text-psi-dark mb-4">Resumo do Pedido</h3>

                                <div className="space-y-3 mb-4">
                                    {items.flatMap((item) => {
                                        const event = eventsData.find(e => e?.id === item.eventId)

                                        if (item.ticketTypes && item.ticketTypes.length > 0) {
                                            return item.ticketTypes.map((tt, ttIndex) => {
                                                const originalEventDateId = tt.days && tt.days.length > 0 ? tt.days[0] : null
                                                const activeEventDateId = event ? getActiveEventDateId(event, originalEventDateId) : originalEventDateId
                                                const eventDate = activeEventDateId && event?.EventDates
                                                    ? event.EventDates.find(ed => ed.id === activeEventDateId)
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
                                                        <span className="font-medium text-psi-dark">
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
                                                <span className="font-medium text-psi-dark">
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
                                            <span className="text-psi-dark/70">{ValueUtils.centsToCurrency(calculateTotalWithInstallmentFee(subtotal, installments) - subtotal)}</span>
                                        </div>
                                    )}
                                    {isInsured && !items?.[0]?.isFree && (
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-psi-dark/70">Seguro da Compra:</span>
                                            <span className="text-psi-dark/70">{ValueUtils.centsToCurrency(insuranceValue)}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center justify-between pt-2 border-t border-psi-dark/10">
                                        <span className="font-medium text-psi-dark">Total</span>
                                        <span className="text-2xl font-semibold text-psi-primary">
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
                                            À vista com taxa de {ValueUtils.centsToCurrency(calculateTotalWithInstallmentFee(subtotal, installments) - subtotal)}
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
                                CPF *
                            </label>
                            <Controller
                                name="document"
                                control={cadastroForm.control}
                                render={({ field }) => (
                                    <InputMask
                                        {...field}
                                        mask="000.000.000-00"
                                        placeholder="000.000.000-00"
                                        icon={FileText}
                                        required
                                    />
                                )}
                            />
                            <FieldError message={cadastroForm.formState.errors.document?.message || ""} />
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
                        <p className="text-sm text-psi-dark/70 text-center">
                            Ao me cadastrar eu concordo com os{" "}
                            <Link href="/termos-e-condicoes" className="text-psi-primary hover:underline" target="_blank">
                                termos e condições
                            </Link>
                            {" "}e{" "}
                            <Link href="/politica-de-privacidade" className="text-psi-primary hover:underline" target="_blank">
                                política de privacidade
                            </Link>
                            {" "}do Porto Seguro Ingressos.
                        </p>
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
                        <div className="w-full">
                            <div ref={googleButtonRefCadastro} className="w-full flex justify-center" />
                            {isLoggingInWithGoogle && (
                                <div className="mt-2 flex justify-center">
                                    <LoadingButton />
                                </div>
                            )}
                        </div>
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
                            Olá, <span className="font-medium">{cadastroName}</span>! Digite o código de 6 dígitos enviado para <span className="font-medium">{cadastroEmail}</span>
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
                                            seconds={120}
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

            <Dialog open={showUpdateProfileDialog} onOpenChange={(open) => {
                setShowUpdateProfileDialog(open)
                if (!open) {
                    updateProfileForm.reset()
                }
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Atualizar Dados do Perfil</DialogTitle>
                        <DialogDescription>
                            Complete seus dados para continuar com a compra
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateProfileForm.handleSubmit(handleUpdateProfile)} className="space-y-6">
                        <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                            <h2 className="text-xl font-medium text-psi-dark">Informações Pessoais</h2>

                            <div className="grid gap-4
                            sm:grid-cols-3">
                                <div>
                                    <label htmlFor="firstName" className="block text-sm font-medium text-psi-dark mb-2">
                                        Nome
                                    </label>
                                    <Controller
                                        name="firstName"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                icon={User}
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.firstName?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="lastName" className="block text-sm font-medium text-psi-dark mb-2">
                                        Sobrenome
                                    </label>
                                    <Controller
                                        name="lastName"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                icon={User}
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.lastName?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-psi-dark mb-2">
                                        E-mail
                                    </label>
                                    <Input
                                        type="email"
                                        value={user?.email || ""}
                                        disabled
                                        icon={Mail}
                                        className="bg-psi-dark/5"
                                    />
                                </div>
                            </div>

                            <div className="grid gap-4
                            sm:grid-cols-2">
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium text-psi-dark mb-2">
                                        Telefone
                                    </label>
                                    <Controller
                                        name="phone"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <InputMask
                                                {...field}
                                                value={field.value || ""}
                                                mask="(00) 00000-0000"
                                                placeholder="(00) 00000-0000"
                                                icon={Phone}
                                                inputMode="tel"
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.phone?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="document" className="block text-sm font-medium text-psi-dark mb-2">
                                        CPF
                                    </label>
                                    <Controller
                                        name="document"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <InputMask
                                                {...field}
                                                value={field.value || ""}
                                                mask="000.000.000-00"
                                                placeholder="000.000.000-00"
                                                icon={FileText}
                                                disabled={field.value ? true : false}
                                                className={`${field.value ? "bg-psi-dark/5" : ""}`}
                                                inputMode="numeric"
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.document?.message || ""} />
                                </div>
                            </div>

                            <div className="grid gap-4
                            sm:grid-cols-3">
                                <div>
                                    <label htmlFor="nationality" className="block text-sm font-medium text-psi-dark mb-2">
                                        Nacionalidade
                                    </label>
                                    <Controller
                                        name="nationality"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || undefined}
                                                onValueChange={(value) => field.onChange(value || null)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <div className="flex items-center gap-2">
                                                        <Globe className="size-4 text-muted-foreground" />
                                                        <SelectValue placeholder="Selecione..." />
                                                    </div>
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {countries.map((country) => (
                                                        <SelectItem key={country.value} value={country.value}>
                                                            {country.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.nationality?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="genre" className="block text-sm font-medium text-psi-dark mb-2">
                                        Gênero
                                    </label>
                                    <Controller
                                        name="gender"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || undefined}
                                                onValueChange={(value) => field.onChange(value || null)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Selecione..." />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {genres.map((genre) => (
                                                        <SelectItem key={genre.value} value={genre.value}>
                                                            {genre.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.gender?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="birth" className="block text-sm font-medium text-psi-dark mb-2">
                                        Data de Nascimento
                                    </label>
                                    <Controller
                                        name="birth"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <InputMask
                                                {...field}
                                                value={field.value || ""}
                                                mask="00/00/0000"
                                                placeholder="DD/MM/AAAA"
                                                inputMode="numeric"
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.birth?.message || ""} />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                            <h2 className="text-xl font-medium text-psi-dark">Endereço</h2>

                            <div className="grid gap-4
                            sm:grid-cols-2">
                                <div>
                                    <label htmlFor="address?.zipCode" className="block text-sm font-medium text-psi-dark mb-2">
                                        CEP
                                    </label>
                                    <Controller
                                        name="address.zipCode"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <InputMask
                                                mask="00000-000"
                                                value={field.value || ""}
                                                onAccept={(value) => updateAddressField("zipCode", value as string)}
                                                placeholder="00000-000"
                                                icon={Hash}
                                                inputMode="numeric"
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.address?.zipCode?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="address.complement" className="block text-sm font-medium text-psi-dark mb-2">
                                        Complemento
                                    </label>
                                    <Controller
                                        name="address.complement"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Input
                                                value={field.value || ""}
                                                onChange={(e) => updateAddressField("complement", e.target.value)}
                                                placeholder="Apartamento, bloco, etc."
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.address?.complement?.message || ""} />
                                </div>
                            </div>

                            <div className="grid gap-4
                            sm:grid-cols-3">
                                <div>
                                    <label htmlFor="address.street" className="block text-sm font-medium text-psi-dark mb-2">
                                        Rua
                                    </label>
                                    <Controller
                                        name="address.street"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Input
                                                value={field.value || ""}
                                                onChange={(e) => updateAddressField("street", e.target.value)}
                                                placeholder="Nome da rua"
                                                icon={MapPin}
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.address?.street?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="address.number" className="block text-sm font-medium text-psi-dark mb-2">
                                        Número
                                    </label>
                                    <Controller
                                        name="address.number"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Input
                                                value={field.value || ""}
                                                onChange={(e) => updateAddressField("number", e.target.value)}
                                                placeholder="123"
                                                inputMode="numeric"
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.address?.number?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="address.neighborhood" className="block text-sm font-medium text-psi-dark mb-2">
                                        Bairro
                                    </label>
                                    <Controller
                                        name="address.neighborhood"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Input
                                                value={field.value || ""}
                                                onChange={(e) => updateAddressField("neighborhood", e.target.value)}
                                                placeholder="Nome do bairro"
                                                icon={Building2}
                                            />
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.address?.neighborhood?.message || ""} />
                                </div>
                            </div>

                            <div className="grid gap-4
                            sm:grid-cols-3">
                                <div>
                                    <label htmlFor="address.country" className="block text-sm font-medium text-psi-dark mb-2">
                                        País
                                    </label>
                                    <Controller
                                        name="address.country"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || undefined}
                                                onValueChange={(value) => updateAddressField("country", value)}
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
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.address?.country?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="address.state" className="block text-sm font-medium text-psi-dark mb-2">
                                        Estado
                                    </label>
                                    <Controller
                                        name="address.state"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || undefined}
                                                onValueChange={(value) => {
                                                    field.onChange(value)
                                                    updateAddressField("state", value)
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
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.address?.state?.message || ""} />
                                </div>

                                <div>
                                    <label htmlFor="address.city" className="block text-sm font-medium text-psi-dark mb-2">
                                        Cidade
                                    </label>
                                    <Controller
                                        name="address.city"
                                        control={updateProfileForm.control}
                                        render={({ field }) => (
                                            <Select
                                                value={field.value || undefined}
                                                onValueChange={(value) => updateAddressField("city", value)}
                                                disabled={!selectedState}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder={selectedState ? "Selecione..." : "Selecione um estado primeiro"} />
                                                </SelectTrigger>
                                                <SelectContent key={selectedState || "no-state"}>
                                                    {cities.length > 0 ? (
                                                        cities.map((city) => {
                                                            const cityValue = city.value || ""
                                                            if (!cityValue) return null
                                                            return (
                                                                <SelectItem key={cityValue} value={cityValue}>
                                                                    {city.label || ""}
                                                                </SelectItem>
                                                            )
                                                        })
                                                    ) : (
                                                        <div className="px-2 py-1.5 text-sm text-psi-dark/60">
                                                            Nenhuma cidade encontrada
                                                        </div>
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                    <FieldError message={updateProfileForm.formState.errors.address?.city?.message || ""} />
                                </div>
                            </div>
                        </div>

                        <div className="pt-6 border-t border-psi-dark/10 flex justify-end gap-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setShowUpdateProfileDialog(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                disabled={isUpdatingUser}
                            >
                                {isUpdatingUser ? (
                                    <LoadingButton message="Salvando..." />
                                ) : (
                                    "Salvar Alterações"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={showViewProfileDialog} onOpenChange={setShowViewProfileDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Meus Dados</DialogTitle>
                        <DialogDescription>
                            Visualize seus dados cadastrados
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6">
                        <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                            <h2 className="text-xl font-medium text-psi-dark">Informações Pessoais</h2>

                            <div className="grid gap-4
                            sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        Nome
                                    </label>
                                    <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                        <p className="text-sm text-psi-dark">{user?.firstName || "-"}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        Sobrenome
                                    </label>
                                    <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                        <p className="text-sm text-psi-dark">{user?.lastName || "-"}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        E-mail
                                    </label>
                                    <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                        <p className="text-sm text-psi-dark">{user?.email || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4
                            sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        Telefone
                                    </label>
                                    <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                        <p className="text-sm text-psi-dark">{user?.phone || "-"}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        CPF
                                    </label>
                                    <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                        <p className="text-sm text-psi-dark">{user?.document || "-"}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4
                            sm:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        Nacionalidade
                                    </label>
                                    <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                        <p className="text-sm text-psi-dark">{user?.nationality || "-"}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        Gênero
                                    </label>
                                    <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                        <p className="text-sm text-psi-dark">
                                            {user?.gender === "MALE" ? "Masculino" :
                                                user?.gender === "FEMALE" ? "Feminino" :
                                                    user?.gender === "PREFER_NOT_TO_SAY" ? "Prefiro não informar" : "-"}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                        Data de Nascimento
                                    </label>
                                    <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                        <p className="text-sm text-psi-dark">
                                            {user?.birth ? formatBirthForForm(user.birth) : "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {user?.Address && (
                            <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                <h2 className="text-xl font-medium text-psi-dark">Endereço</h2>

                                <div className="grid gap-4
                                sm:grid-cols-2">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            CEP
                                        </label>
                                        <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                            <p className="text-sm text-psi-dark">{user.Address.zipCode || "-"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Complemento
                                        </label>
                                        <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                            <p className="text-sm text-psi-dark">{user.Address.complement || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4
                                sm:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Rua
                                        </label>
                                        <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                            <p className="text-sm text-psi-dark">{user.Address.street || "-"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Número
                                        </label>
                                        <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                            <p className="text-sm text-psi-dark">{user.Address.number || "-"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Bairro
                                        </label>
                                        <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                            <p className="text-sm text-psi-dark">{user.Address.neighborhood || "-"}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4
                                sm:grid-cols-3">
                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            País
                                        </label>
                                        <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                            <p className="text-sm text-psi-dark">{user.Address.country || "-"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Estado
                                        </label>
                                        <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                            <p className="text-sm text-psi-dark">{user.Address.state || "-"}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                            Cidade
                                        </label>
                                        <div className="p-3 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                            <p className="text-sm text-psi-dark">{user.Address.city || "-"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="pt-6 border-t border-psi-dark/10 flex justify-end">
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    setShowViewProfileDialog(false)
                                    setShowUpdateProfileDialog(true)
                                }}
                            >
                                Atualizar Dados
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showRegulamentoDialog} onOpenChange={setShowRegulamentoDialog}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Regulamento da Plataforma Para Compra de Ingressos</DialogTitle>
                        <DialogDescription>
                            Leia atentamente o regulamento antes de finalizar sua compra
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 text-psi-dark/70">
                        <p className="leading-relaxed">
                            O Porto Seguro Ingressos é uma plataforma de venda de ingressos. Não temos responsabilidade e poder sobre organização e ocorrências relativas a este evento.
                        </p>
                        <div>
                            <p className="font-medium text-psi-dark mb-4">Declaro que:</p>
                            <ol className="space-y-4 list-decimal list-inside">
                                <li className="leading-relaxed">
                                    Estarei presente neste evento por minha livre e espontânea vontade, isentando de quaisquer responsabilidades os ORGANIZADORES e as empresas envolvidas, em meu nome e de meus herdeiros;
                                </li>
                                <li className="leading-relaxed">
                                    Isento organizadores e empresas envolvidas no evento de qualquer responsabilidade sobre objetos deixados por mim em guarda-volumes, chapelaria ou locais indicados pela organização do evento;
                                </li>
                                <li className="leading-relaxed">
                                    Estou ciente que o valor pago não será devolvido em caso de não comparecimento ao evento, bem como não são aceitas substituições / troca de participantes;
                                </li>
                                <li className="leading-relaxed">
                                    Estou de acordo com cobrança de valor adicional da TAXA DE SERVIÇO para cada novo ingresso / inscrição adquirido(a) no sistema, caso haja a respectiva taxa;
                                </li>
                                <li className="leading-relaxed">
                                    Estou ciente que ingressos / inscrições podem encerrar-se a qualquer momento, sob definição da empresa organizadora;
                                </li>
                                <li className="leading-relaxed">
                                    Confirmo que, para garantir meu ingresso / inscrição é necessário efetuar o pagamento do valor total do mesmo, e que, caso não seja pago, o ingresso/inscrição será(ão) cancelado(s) automaticamente no sistema e a vaga liberada;
                                </li>
                                <li className="leading-relaxed">
                                    É de minha responsabilidade obter todas as informações sobre o evento, tais como: data, local e horário;
                                </li>
                                <li className="leading-relaxed">
                                    Estou fisica e mentalmente apto a participar deste evento, nas condições propostas pela organização;
                                </li>
                                <li className="leading-relaxed">
                                    Autorizo a utilização por parte do organizador, patrocinadores e Porto Seguro Ingressos de qualquer dado, fotografia, filme ou outra gravação contendo imagens de minha participação neste evento, em qualquer mídia seja impressa ou eletrônica, incluindo na Internet, para qualquer fim e por tempo indeterminado;
                                </li>
                                <li className="leading-relaxed">
                                    Autorizo recebimento de e-mails, SMS e WhatsApp, bem como qualquer meio digital de comunicação, do ORGANIZADOR e Porto Seguro Ingressos e seus parceiros divulgando informações, notícias e serviços;
                                </li>
                                <li className="leading-relaxed">
                                    Na realização do cadastro, compra de ingressos ou inscrições para terceiros, tenho a autorização deste(s) participante(s), me responsabilizo pela legitimidade de dados fornecidos e garanto que o mesmo tem total ciência desta declaração e do respectivo REGULAMENTO do evento;
                                </li>
                                <li className="leading-relaxed">
                                    Estou ciente que, caso seja autorizado qualquer tipo de estorno, poderá ser cobrada a taxa e/ou custos do processo de reembolso;
                                </li>
                                <li className="leading-relaxed">
                                    Estou totalmente ciente e concordo com o REGULAMENTO ou REGRAS GERAIS deste Evento, bem como do Termo de Uso e Política de Privacidade da plataforma Porto Seguro Ingressos.
                                </li>
                            </ol>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-psi-dark/10">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setShowRegulamentoDialog(false)}
                        >
                            Entendi
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <Dialog open={showInsuranceDialog} onOpenChange={setShowInsuranceDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Seguro da Compra</DialogTitle>
                        <DialogDescription>
                            Entenda como funciona o seguro para proteger sua compra de ingressos
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 text-psi-dark/70">
                        <div className="p-4 rounded-xl bg-psi-primary/5 border border-psi-primary/20">
                            <div className="flex items-start gap-3">
                                <CheckCircle2 className="h-5 w-5 text-psi-primary shrink-0 mt-0.5" />
                                <div>
                                    <p className="font-medium text-psi-dark mb-1">
                                        O que é o Seguro da Compra?
                                    </p>
                                    <p className="text-sm leading-relaxed">
                                        O seguro da compra é uma proteção adicional que você pode contratar para proteger sua compra de ingressos contra imprevistos que possam impedir sua participação no evento.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <p className="font-medium text-psi-dark mb-4">Como funciona o seguro?</p>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                    <p className="text-sm leading-relaxed mb-2">
                                        <strong className="text-psi-dark">Valor do Seguro:</strong>
                                    </p>
                                    <ul className="text-sm space-y-2 list-disc list-inside ml-2">
                                        <li>Para compras abaixo de R$ 499,99: seguro fixo de R$ 19,90</li>
                                        <li>Para compras acima de R$ 499,99: seguro de 5% do valor total da compra</li>
                                    </ul>
                                </div>

                                <div className="p-4 rounded-lg bg-psi-dark/5 border border-psi-dark/10">
                                    <p className="text-sm leading-relaxed mb-2">
                                        <strong className="text-psi-dark">Proteção oferecida:</strong>
                                    </p>
                                    <p className="text-sm leading-relaxed">
                                        O seguro cobre situações imprevistas que possam impedir sua participação no evento, como problemas de saúde, emergências familiares, entre outras situações cobertas pela apólice.
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-amber-50 border border-amber-200">
                                    <div className="flex items-start gap-3">
                                        <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-900 mb-1">
                                                Importante
                                            </p>
                                            <p className="text-sm text-amber-700 leading-relaxed">
                                                O seguro é opcional e não é obrigatório para finalizar sua compra. No entanto, recomendamos fortemente a contratação do seguro para evitar dores de cabeça em caso de imprevistos. Imprevistos podem acontecer e ter o seguro pode facilitar muito sua vida.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end pt-4 border-t border-psi-dark/10">
                        <Button
                            type="button"
                            variant="primary"
                            onClick={() => setShowInsuranceDialog(false)}
                        >
                            Entendi
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <DialogCreditCardError
                open={showCreditCardErrorDialog}
                onOpenChange={setShowCreditCardErrorDialog}
            />
        </Background>
    )
}

export {
    CheckoutInfo
}

