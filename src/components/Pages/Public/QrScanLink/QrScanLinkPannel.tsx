"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import { Input } from "@/components/Input/Input"
import { QrCode, Scan, Lock, Search, CheckCircle2, XCircle, Info, MoreVertical, Check, LogOut, ImageUp, Calendar, Ticket, CircleMinus } from "lucide-react"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { Toast } from "@/components/Toast/Toast"
import { useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { TicketScanSessionAuthenticateValidator, type TTicketScanSessionAuthenticateForm } from "@/validators/TicketScanSession/TicketScanSessionValidator"
import { useTicketScanSessionCreate } from "@/hooks/TicketScanSession/useTicketScanSessionCreate"
import { useTicketScanSessionDelete } from "@/hooks/TicketScanSession/useTicketScanSessionDelete"
import { useTicketValidateQrcodeWorker } from "@/hooks/Ticket/useTicketValidateQrcodeWorker"
import { useTicketValidateWorker } from "@/hooks/Ticket/useTicketValidateWorker"
import { useEventListBuyersSession } from "@/hooks/Event/useEventListBuyersSession"
import { useEventCacheSession } from "@/hooks/Event/useEventCacheSession"
import type { TEventListBuyers, TEventBuyerValidationInfo } from "@/types/Event/TEvent"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const QrScanLinkPannel = () => {
    const searchParams = useSearchParams()
    const pubId = (searchParams.get("pubId") || "").trim()
    const isValidPubId = useMemo(() => /^PSI-TS-[a-zA-Z0-9]{9}$/.test(pubId), [pubId])
    const sessionStorageKey = useMemo(() => (isValidPubId ? `psi_tss_authed_${pubId}` : ""), [isValidPubId, pubId])

    const [isAuthenticated, setIsAuthenticated] = useState(false)

    const [isScanning, setIsScanning] = useState(false)
    const [scanFeedback, setScanFeedback] = useState<string>("")
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const scannerContainerRef = useRef<HTMLDivElement>(null)
    const [scannerId] = useState(() => `qr-reader-link-${Date.now()}`)
    const lastScanFeedbackAtRef = useRef(0)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isDecodingQrImage, setIsDecodingQrImage] = useState(false)
    const [fileReaderId] = useState(() => `qr-file-reader-link-${Date.now()}`)

    const getScanFeedbackMessage = (raw: string) => {
        const msg = (raw || "").toLowerCase()

        if (msg.includes("notfoundexception") || msg.includes("no qr code found")) {
            return "Aponte a câmera para o QR Code. Chegue mais perto e mantenha o celular firme."
        }

        if (msg.includes("formatexception") || msg.includes("checksumexception")) {
            return "QR Code ilegível. Tente melhorar a iluminação e enquadrar melhor."
        }

        if (msg.includes("permission") || msg.includes("notallowederror")) {
            return "Permissão da câmera negada. Libere o acesso e tente novamente."
        }

        return "Procurando QR Code..."
    }

    const [validatedTickets, setValidatedTickets] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")
    const [selectedEventDateId, setSelectedEventDateId] = useState<string>("ALL")
    const [buyerInfoDialog, setBuyerInfoDialog] = useState<{ open: boolean; buyer: TEventListBuyers | null }>({ open: false, buyer: null })
    const [qrImageErrorDialog, setQrImageErrorDialog] = useState<{ open: boolean; title: string; description: string }>({
        open: false,
        title: "",
        description: ""
    })
    const [confirmValidateDialog, setConfirmValidateDialog] = useState<{ open: boolean; buyer: TExpandedBuyer | null }>({
        open: false,
        buyer: null
    })

    const { mutateAsync: authenticateSession, isPending: isAuthenticating } = useTicketScanSessionCreate()
    const { mutateAsync: logoutSession, isPending: isLoggingOut } = useTicketScanSessionDelete()
    const { mutateAsync: validateTicketQrCode, isPending: isValidatingTicketQrCode } = useTicketValidateQrcodeWorker()
    const { mutateAsync: validateTicketById, isPending: isValidatingTicketById } = useTicketValidateWorker()

    const { data: eventCacheData } = useEventCacheSession(isAuthenticated)
    const { data: buyersData, isLoading: isLoadingBuyers, isError: isBuyersError, refetch: refetchBuyers } = useEventListBuyersSession(
        isAuthenticated,
        selectedEventDateId !== "ALL" ? selectedEventDateId : undefined
    )

    const buyers = useMemo(() => {
        if (buyersData?.data && Array.isArray(buyersData.data)) {
            return buyersData.data
        }
        return []
    }, [buyersData])

    useEffect(() => {
        if (!sessionStorageKey) {
            return
        }
        const saved = sessionStorage.getItem(sessionStorageKey)
        if (saved === "true") {
            setIsAuthenticated(true)
        }
    }, [sessionStorageKey])

    useEffect(() => {
        if (isAuthenticated && isBuyersError) {
            setIsAuthenticated(false)
            if (sessionStorageKey) {
                sessionStorage.removeItem(sessionStorageKey)
            }
        }
    }, [isAuthenticated, isBuyersError])

    useEffect(() => {
        setValidatedTickets(new Set())
        setSearchQuery("")
        setSelectedEventDateId("ALL")
    }, [pubId])

    useEffect(() => {
        const next = new Set<string>()
        buyers.forEach((buyer) => {
            buyer.eventDates.forEach((eventDate) => {
                if (eventDate.status === "USED" || eventDate.usedAt) {
                    next.add(`${buyer.customerName}-${buyer.paymentDate}-${eventDate.date}`)
                }
            })
        })
        setValidatedTickets(next)
    }, [buyers])

    const eventDates = useMemo(() => {
        if (!eventCacheData?.data?.EventDates || !Array.isArray(eventCacheData.data.EventDates)) return []
        return [...eventCacheData.data.EventDates].sort((a, b) => {
            if (!a.date || !b.date) return 0
            return getDateOrderValue(a.date) - getDateOrderValue(b.date)
        })
    }, [eventCacheData])

    const isTodayEventDate = useMemo(() => {
        if (!eventCacheData?.data?.EventDates || !Array.isArray(eventCacheData.data.EventDates)) return false
        
        const today = new Date()
        const todayDateString = today.toISOString().split("T")[0]
        
        if (selectedEventDateId === "ALL") {
            return eventCacheData.data.EventDates.some(eventDate => {
                if (!eventDate.date) return false
                const eventDateString = new Date(eventDate.date).toISOString().split("T")[0]
                return eventDateString === todayDateString
            })
        } else {
            const selectedDate = eventCacheData.data.EventDates.find(ed => ed.id === selectedEventDateId)
            if (!selectedDate?.date) return false
            const eventDateString = new Date(selectedDate.date).toISOString().split("T")[0]
            return eventDateString === todayDateString
        }
    }, [eventCacheData, selectedEventDateId])

    const filteredBuyers = useMemo(() => {
        if (!searchQuery) return buyers

        const query = searchQuery.toLowerCase()
        return buyers.filter((buyer: TEventListBuyers) =>
            buyer.customerName.toLowerCase().includes(query) ||
            buyer.ticketTypeName?.toLowerCase().includes(query) ||
            buyer.eventDates.some(eventDate => eventDate.date.toLowerCase().includes(query))
        )
    }, [buyers, searchQuery])

    type TExpandedBuyer = TEventListBuyers & {
        eventDate: string
        eventDateStatus?: "USED" | "PENDING" | "CANCELLED" | "REFUNDED" | "CONFIRMED" | null
        eventDateUsedAt?: string | null
        eventDateValidationInfo?: TEventBuyerValidationInfo
        uniqueKey: string
    }

    const expandedBuyers = useMemo(() => {
        const expanded: TExpandedBuyer[] = []
        filteredBuyers.forEach((buyer) => {
            if (buyer.eventDates && buyer.eventDates.length > 0) {
                buyer.eventDates.forEach((eventDate) => {
                    expanded.push({
                        ...buyer,
                        eventDate: eventDate.date,
                        eventDateStatus: eventDate.status,
                        eventDateUsedAt: eventDate.usedAt,
                        eventDateValidationInfo: eventDate.validationInfo,
                        uniqueKey: `${buyer.customerName}-${buyer.paymentDate}-${eventDate.date}`
                    })
                })
            } else {
                expanded.push({
                    ...buyer,
                    eventDate: "",
                    eventDateStatus: undefined,
                    eventDateUsedAt: undefined,
                    eventDateValidationInfo: undefined,
                    uniqueKey: `${buyer.customerName}-${buyer.paymentDate}`
                })
            }
        })
        return expanded
    }, [filteredBuyers])

    const validationStats = useMemo(() => {
        const validatable = expandedBuyers.filter((buyer) => buyer.status !== "CANCELLED" && buyer.status !== "REFUNDED")
        const total = validatable.length
        const validated = validatable.filter((buyer: TExpandedBuyer) => {
            return validatedTickets.has(buyer.uniqueKey)
        }).length
        return { total, validated, remaining: total - validated }
    }, [expandedBuyers, validatedTickets])

    const formatFormAnswers = (formAnswers: Record<string, any>): string => {
        if (!formAnswers || Object.keys(formAnswers).length === 0) {
            return "-"
        }

        const formattedAnswers: string[] = []
        const metadataFields = ["ticketNumber", "ticketTypeId"]

        Object.entries(formAnswers).forEach(([key, value]) => {
            if (metadataFields.includes(key)) {
                return
            }

            if (value === null || value === undefined || value === "") {
                return
            }

            if (Array.isArray(value)) {
                value.forEach((item: any) => {
                    if (typeof item === "object" && item !== null) {
                        if (item.label && item.answer) {
                            formattedAnswers.push(`${item.label}: ${item.answer}`)
                        }
                    } else if (item) {
                        formattedAnswers.push(String(item))
                    }
                })
            } else if (typeof value === "object" && value !== null) {
                if (value.label && value.answer) {
                    formattedAnswers.push(`${value.label}: ${value.answer}`)
                }
            } else {
                formattedAnswers.push(`${key}: ${String(value)}`)
            }
        })

        return formattedAnswers.length > 0 ? formattedAnswers.join("; ") : "-"
    }


    const handleAuthenticate = async (data: TTicketScanSessionAuthenticateForm) => {
        if (!isValidPubId) {
            Toast.error("Código inválido")
            return
        }

        try {
            const response = await authenticateSession({
                code: data.code,
                password: data.password,
                name: data.name,
                location: data.location ? String(data.location) : null
            })

            if (response?.success) {
                setIsAuthenticated(true)
                if (sessionStorageKey) {
                    sessionStorage.setItem(sessionStorageKey, "true")
                }
                Toast.success("Acesso liberado")
                refetchBuyers()
                return
            }
        } catch (error) {}
    }

    const handleLogout = async () => {
        try {
            await logoutSession()
        } catch (error) {
        }
        setIsAuthenticated(false)
        setValidatedTickets(new Set())
        handleStopScan()
        if (sessionStorageKey) {
            sessionStorage.removeItem(sessionStorageKey)
        }
    }

    const handleStartScan = async () => {
        if (!isAuthenticated) {
            Toast.error("Faça login para iniciar o escaneamento")
            return
        }
        setScanFeedback("Iniciando câmera...")
        setIsScanning(true)
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!scannerContainerRef.current) {
            setIsScanning(false)
            setScanFeedback("")
            Toast.error("Erro ao inicializar o scanner")
            return
        }

        try {
            const scanner = new Html5Qrcode(scannerId)
            scannerRef.current = scanner

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    handleScanSuccess(decodedText)
                },
                (errorMessage) => {
                    const now = Date.now()
                    if (now - lastScanFeedbackAtRef.current < 900) {
                        return
                    }
                    lastScanFeedbackAtRef.current = now
                    setScanFeedback(getScanFeedbackMessage(errorMessage))
                }
            )
            setScanFeedback("Procurando QR Code...")
        } catch (error) {
            console.error("Erro ao iniciar scanner:", error)
            setIsScanning(false)
            setScanFeedback("")
            Toast.error("Erro ao iniciar a câmera. Verifique as permissões.")
        }
    }

    const handleStopScan = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current?.clear()
                scannerRef.current = null
                setIsScanning(false)
                setScanFeedback("")
            }).catch((error) => {
                console.error("Erro ao parar scanner:", error)
            })
        }
    }

    const handlePickQrImage = () => {
        fileInputRef.current?.click()
    }

    const handleQrImageSelected = async (file?: File | null) => {
        if (!file) {
            return
        }

        try {
            setIsDecodingQrImage(true)
            setScanFeedback("Lendo QR Code pela foto...")
            handleStopScan()

            const reader = new Html5Qrcode(fileReaderId)
            const decodedText = await reader.scanFile(file, true)
            await reader.clear()

            if (decodedText) {
                await handleScanSuccess(decodedText, "photo")
            } else {
                setQrImageErrorDialog({
                    open: true,
                    title: "Não foi possível ler o QR Code",
                    description: "Tente enviar uma foto mais nítida (boa iluminação, sem tremor e com o QR Code inteiro no enquadramento)."
                })
            }
        } catch (error) {
            setQrImageErrorDialog({
                open: true,
                title: "Não foi possível ler o QR Code",
                description: "Tente novamente com outra foto (evite reflexo/baixa luz e aproxime o QR Code da câmera)."
            })
        } finally {
            setIsDecodingQrImage(false)
        }
    }

    const handleScanSuccess = async (qrData: string, origin: "camera" | "photo" = "camera") => {
        setScanFeedback("Validando ingresso...")
        handleStopScan()
        
        try {
            const response = await validateTicketQrCode({
                qrcodeToken: qrData,
                method: origin === "photo" ? "qr-image" : "qr-scan"
            })
            if (response?.success && response?.data) {
                if (response.data.isValid) {
                    Toast.success("Ingresso validado com sucesso!")
                    refetchBuyers()
                    return
                }

                const reason = response.data.reason || "Ingresso inválido"
                if (origin === "photo") {
                    setQrImageErrorDialog({
                        open: true,
                        title: "Ingresso inválido",
                        description: reason
                    })
                } else {
                    Toast.error(reason)
                }
                return
            }

            if (origin === "photo") {
                setQrImageErrorDialog({
                    open: true,
                    title: "Erro ao validar",
                    description: "Não foi possível validar o ingresso. Tente novamente."
                })
            } else {
                Toast.error("Erro ao validar ingresso")
            }
        } catch (error) {
            console.error("Erro ao escanear:", error)
            if (origin === "photo") {
                setQrImageErrorDialog({
                    open: true,
                    title: "Erro ao validar",
                    description: "Não foi possível validar o ingresso. Tente novamente."
                })
            } else {
                Toast.error("Erro ao validar ingresso")
            }
        }
    }

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {})
            }
        }
    }, [])

    const form = useForm<TTicketScanSessionAuthenticateForm>({
        resolver: zodResolver(TicketScanSessionAuthenticateValidator),
        defaultValues: {
            code: pubId,
            name: "",
            password: "",
            location: ""
        }
    })

    useEffect(() => {
        form.setValue("code", pubId)
    }, [pubId, form])

    const handleValidateTicket = async (buyer: TExpandedBuyer) => {
        if (!buyer.ticketId) {
            Toast.error("Não foi possível validar este ingresso")
            return
        }

        try {
            const response = await validateTicketById({ ticketId: buyer.ticketId })
            if (response?.success && response?.data) {
                if (response.data.isValid) {
                    Toast.success(`Ingresso de ${buyer.customerName} validado com sucesso!`)
                    refetchBuyers()
                    return
                }

                Toast.error(response.data.reason || "Ingresso inválido")
                return
            }

            Toast.error("Erro ao validar ingresso")
        } catch (error) {
            Toast.error("Erro ao validar ingresso")
        }
    }

    const handleOpenConfirmValidate = (buyer: TExpandedBuyer) => {
        setConfirmValidateDialog({ open: true, buyer })
    }

    const handleViewMoreInfo = (buyer: TExpandedBuyer) => {
        const originalBuyer = buyers.find(b => b.ticketId === buyer.ticketId)
        if (originalBuyer) {
            setBuyerInfoDialog({ open: true, buyer: originalBuyer })
        }
    }

    if (!isValidPubId) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-8 mt-[80px]">
                    <div className="max-w-md mx-auto">
                        <div className="rounded-xl border border-psi-primary/20 bg-white p-8 space-y-4">
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-16 h-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                    <Lock className="h-8 w-8 text-psi-primary" />
                                </div>
                                <h1 className="text-2xl font-semibold text-psi-dark">Link inválido</h1>
                                <p className="text-sm text-psi-dark/60">
                                    Verifique se o link foi copiado corretamente.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    if (!isAuthenticated) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-8 mt-[80px]">
                    <div className="max-w-md mx-auto">
                        <div className="rounded-xl border border-psi-primary/20 bg-white p-8 space-y-6">
                            <div className="text-center space-y-2">
                                <div className="mx-auto w-16 h-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                    <Lock className="h-8 w-8 text-psi-primary" />
                                </div>
                                <h1 className="text-2xl font-semibold text-psi-dark">Acesso Restrito</h1>
                                <p className="text-sm text-psi-dark/60">
                                    Insira a senha fornecida pelo organizador para acessar o escaneamento
                                </p>
                            </div>
                            <form onSubmit={form.handleSubmit(handleAuthenticate)} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="code" className="text-sm font-medium text-psi-dark">
                                        Código
                                    </label>
                                    <Controller
                                        name="code"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="code"
                                                type="text"
                                                disabled
                                                required
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="name" className="text-sm font-medium text-psi-dark">
                                        Seu nome
                                    </label>
                                    <Controller
                                        name="name"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="name"
                                                type="text"
                                                placeholder="Digite seu nome"
                                                required
                                            />
                                        )}
                                    />
                                    {form.formState.errors.name?.message && (
                                        <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="location" className="text-sm font-medium text-psi-dark">
                                        Local (opcional)
                                    </label>
                                    <Controller
                                        name="location"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
                                                id="location"
                                                type="text"
                                                placeholder="Ex: Entrada principal"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-psi-dark">
                                        Senha
                                    </label>
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="password"
                                                type="password"
                                                placeholder="Digite a senha"
                                                required
                                            />
                                        )}
                                    />
                                    {form.formState.errors.password?.message && (
                                        <p className="text-xs text-destructive">{form.formState.errors.password.message}</p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    variant="primary"
                                    className="w-full"
                                    disabled={isAuthenticating}
                                >
                                    {isAuthenticating ? "Acessando..." : "Acessar"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[80px]">
                <div className="mx-auto space-y-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold text-psi-primary">Validar Ingressos</h1>
                            <p className="text-sm text-psi-dark/60 mt-1">Escaneie os QR codes dos ingressos para validar a entrada dos participantes</p>
                            <p className="text-xs text-psi-dark/50 mt-1">Código: {pubId}</p>
                        </div>
                        <div className="flex flex-col w-full lg:w-auto lg:flex-row gap-3">
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                className="hidden"
                                onChange={(e) => {
                                    handleQrImageSelected(e.target.files?.[0] || null)
                                    e.currentTarget.value = ""
                                }}
                            />
                            <div id={fileReaderId} className="hidden" />
                            <Button
                                variant="outline"
                                onClick={handleLogout}
                                disabled={isLoggingOut}
                                className="w-full lg:w-auto"
                            >
                                <LogOut className="h-4 w-4" />
                                Sair
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handlePickQrImage}
                                disabled={isDecodingQrImage}
                                className="w-full lg:w-auto"
                            >
                                <ImageUp className="h-4 w-4" />
                                {isDecodingQrImage ? "Lendo foto..." : "Ler pela foto"}
                            </Button>
                            {isScanning ? (
                                <Button
                                    variant="destructive"
                                    onClick={handleStopScan}
                                    className="w-full lg:w-auto"
                                >
                                    Parar Escaneamento
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={handleStartScan}
                                    disabled={isValidatingTicketQrCode}
                                    className="w-full lg:w-auto"
                                >
                                    <Scan className="h-4 w-4" />
                                    Escanear QR Code
                                </Button>
                            )}
                        </div>
                    </div>

                    {eventCacheData?.data && (
                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6 mb-6">
                            <div className="rounded-xl overflow-hidden border border-psi-primary/20 bg-white">
                                <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-psi-primary/10 to-psi-secondary/10">
                                    {eventCacheData.data.image ? (
                                        <img
                                            src={ImageUtils.getEventImageUrl(eventCacheData.data.image)}
                                            alt={eventCacheData.data.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Ticket className="h-16 w-16 text-psi-primary/30" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-linear-to-t from-psi-dark/60 via-psi-dark/20 to-transparent" />
                                    <div className="absolute bottom-0 left-0 right-0 p-4">
                                        <h3 className="text-lg font-semibold text-white mb-1 drop-shadow-lg">
                                            {eventCacheData.data.name}
                                        </h3>
                                        {eventCacheData.data.EventDates && eventCacheData.data.EventDates.length > 0 && (
                                            <div className="flex items-center gap-2 text-white/90 text-sm">
                                                <Calendar className="h-4 w-4" />
                                                <span className="drop-shadow">
                                                    {eventCacheData.data.EventDates.length} {eventCacheData.data.EventDates.length === 1 ? "data" : "datas"}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {eventDates.length > 0 && (
                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="rounded-xl bg-linear-to-br from-psi-primary/20 to-psi-secondary/20 p-2">
                                        <Calendar className="h-5 w-5 text-psi-primary" />
                                    </div>
                                    <h2 className="text-lg font-semibold text-psi-dark">Filtrar por Data</h2>
                                </div>
                                <Select value={selectedEventDateId} onValueChange={setSelectedEventDateId}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Selecione uma data" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">Todas as datas</SelectItem>
                                        {eventDates.map((eventDate) => (
                                            <SelectItem key={eventDate.id} value={eventDate.id}>
                                                {eventDate.date ? formatEventDate(eventDate.date, "DD/MM/YYYY") : "Sem data"}
                                                {eventDate.hourStart && ` - ${formatEventTime(eventDate.hourStart, eventDate.hourEnd)}`}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}

                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                            {isTodayEventDate ? (
                                <div className="mb-4 p-4 rounded-xl bg-linear-to-r from-green-50 to-emerald-50 border-2 border-green-400 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-green-500 p-2">
                                            <CheckCircle2 className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-green-900">Hoje é o dia do evento!</p>
                                            <p className="text-sm text-green-700">Você pode validar ingressos normalmente.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : eventCacheData?.data && eventDates.length > 0 ? (
                                <div className="mb-4 p-4 rounded-xl bg-linear-to-r from-amber-50 to-orange-50 border-2 border-amber-400 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-full bg-amber-500 p-2">
                                            <XCircle className="h-5 w-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-amber-900">Hoje não é o dia do evento</p>
                                            <p className="text-sm text-amber-700">Aguarde a data correta para validar ingressos.</p>
                                        </div>
                                    </div>
                                </div>
                            ) : null}
                            <div className="flex items-center gap-3 mb-5">
                                <div className="rounded-lg bg-linear-to-br from-psi-primary/20 to-psi-secondary/20 p-2">
                                    <Ticket className="h-5 w-5 text-psi-primary" />
                                </div>
                                <h2 className="text-lg font-semibold text-psi-dark">Estatísticas de Validação</h2>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-4 rounded-xl bg-linear-to-br from-psi-primary/10 via-psi-primary/5 to-psi-primary/10 border border-psi-primary/20">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-psi-primary/20 p-2">
                                            <Ticket className="h-5 w-5 text-psi-primary" />
                                        </div>
                                        <span className="text-sm font-medium text-psi-dark/80">Total de ingressos</span>
                                    </div>
                                    <span className="text-2xl font-bold text-psi-primary">{validationStats.total}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-linear-to-br from-green-50 via-green-50/50 to-green-50 border border-green-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-green-100 p-2">
                                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                                        </div>
                                        <span className="text-sm font-medium text-psi-dark/80">Validados</span>
                                    </div>
                                    <span className="text-2xl font-bold text-green-600">{validationStats.validated}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-xl bg-linear-to-br from-amber-50 via-amber-50/50 to-amber-50 border border-amber-200/50">
                                    <div className="flex items-center gap-3">
                                        <div className="rounded-lg bg-amber-100 p-2">
                                            <CircleMinus className="h-5 w-5 text-amber-600" />
                                        </div>
                                        <span className="text-sm font-medium text-psi-dark/80">Pendentes</span>
                                    </div>
                                    <span className="text-2xl font-bold text-amber-600">{validationStats.remaining}</span>
                                </div>
                                {validationStats.total > 0 && (
                                    <div className="mt-4 pt-4 border-t border-psi-primary/10">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-medium text-psi-dark/60">Progresso de validação</span>
                                            <span className="text-xs font-semibold text-psi-primary">
                                                {Math.round((validationStats.validated / validationStats.total) * 100)}%
                                            </span>
                                        </div>
                                        <div className="w-full h-2 bg-psi-primary/10 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-linear-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                                                style={{ width: `${(validationStats.validated / validationStats.total) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {isScanning && (
                            <div className="lg:col-span-2 rounded-xl border border-psi-primary/20 bg-white p-6">
                                <div className="mb-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="rounded-lg bg-linear-to-br from-psi-primary/20 to-psi-secondary/20 p-2">
                                            <Scan className="h-5 w-5 text-psi-primary animate-pulse" />
                                        </div>
                                        <p className="text-base font-semibold text-psi-dark">Leitura do QR Code</p>
                                    </div>
                                    <p className="text-sm text-psi-dark/70 ml-11">
                                        {scanFeedback || "Aponte a câmera para o QR Code. Chegue mais perto e mantenha o celular firme."}
                                    </p>
                                </div>
                                <div
                                    id={scannerId}
                                    ref={scannerContainerRef}
                                    className="w-full rounded-xl overflow-hidden border border-psi-primary/10"
                                />
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="rounded-xl bg-linear-to-br from-psi-primary/20 to-psi-secondary/20 p-2">
                                    <Search className="h-5 w-5 text-psi-primary" />
                                </div>
                                <h2 className="text-lg font-semibold text-psi-dark">Lista de Compradores</h2>
                            </div>
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-psi-dark/40" />
                                <Input
                                    placeholder="Buscar comprador..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 border-psi-primary/20 focus:border-psi-primary/50"
                                />
                            </div>
                        </div>

                        {isLoadingBuyers ? (
                            <div className="space-y-2">
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                                <Skeleton className="h-12 w-full" />
                            </div>
                        ) : expandedBuyers.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="inline-flex rounded-xl bg-psi-primary/10 p-4 mb-4">
                                    <Search className="h-8 w-8 text-psi-primary/60" />
                                </div>
                                <p className="text-sm font-medium text-psi-dark/70">Nenhum comprador encontrado</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-psi-primary/10">
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-psi-primary/5">
                                            <TableHead className="font-semibold text-psi-dark">Status</TableHead>
                                            <TableHead className="font-semibold text-psi-dark">Nome</TableHead>
                                            <TableHead className="font-semibold text-psi-dark">Tipo de Ingresso</TableHead>
                                            <TableHead className="font-semibold text-psi-dark">Data do Evento</TableHead>
                                            <TableHead className="font-semibold text-psi-dark">Data do Pagamento</TableHead>
                                            <TableHead className="font-semibold text-psi-dark">Respostas do Formulário</TableHead>
                                            <TableHead className="text-right font-semibold text-psi-dark">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {expandedBuyers.map((buyer: TExpandedBuyer, index: number) => {
                                            const isValidated = validatedTickets.has(buyer.uniqueKey) || buyer.eventDateStatus === "USED" || !!buyer.eventDateUsedAt
                                            const isCancelled = buyer.status === "CANCELLED" || buyer.eventDateStatus === "CANCELLED"
                                            const validationInfo = buyer.eventDateValidationInfo
                                            const validatedAt = buyer.eventDateUsedAt || validationInfo?.validatedAt
                                            const validatedByOrganizer = validationInfo?.validatedByOrganizer
                                            const validatedByText = validatedByOrganizer
                                                ? "Organizador"
                                                : validationInfo?.name
                                                    ? validationInfo.name
                                                    : "Equipe"
                                            const validatedWhenText = validatedAt ? DateUtils.formatDate(validatedAt, "DD/MM/YYYY HH:mm") : ""
                                            const validatedLocationText = validationInfo?.location ? ` • ${validationInfo.location}` : ""

                                            return (
                                                <TableRow key={`${buyer.uniqueKey}-${index}`} className="hover:bg-psi-primary/5 transition-colors">
                                                    <TableCell>
                                                        <div className="space-y-1.5">
                                                            {isCancelled ? (
                                                                <Badge variant="destructive" className="font-medium">
                                                                    <XCircle className="h-3.5 w-3.5 mr-1.5" />
                                                                    Cancelado
                                                                </Badge>
                                                            ) : isValidated ? (
                                                                <Badge variant="default" className="bg-linear-to-r from-green-600 to-green-500 text-white font-medium shadow-sm">
                                                                    <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                                                                    Validado
                                                                </Badge>
                                                            ) : (
                                                                <Badge variant="outline" className="border-amber-300 text-amber-700 bg-amber-50 font-medium">
                                                                    <CircleMinus className="h-3.5 w-3.5 mr-1.5" />
                                                                    Pendente
                                                                </Badge>
                                                            )}

                                                            {(validationInfo || buyer.eventDateUsedAt) && !isCancelled && (
                                                                <p className="text-[11px] text-psi-dark/60 leading-tight">
                                                                    {validatedByText}
                                                                    {validatedLocationText}
                                                                    {validatedWhenText ? ` • ${validatedWhenText}` : ""}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="font-semibold text-psi-dark">{buyer.customerName}</TableCell>
                                                    <TableCell className="text-psi-dark/80">{buyer.ticketTypeName || "-"}</TableCell>
                                                    <TableCell className="text-psi-dark/80">
                                                        {buyer.eventDate ? DateUtils.formatDate(buyer.eventDate, "DD/MM/YYYY") : "-"}
                                                    </TableCell>
                                                    <TableCell className="text-psi-dark/80">
                                                        {buyer.paymentDate
                                                            ? DateUtils.formatDate(
                                                                typeof buyer.paymentDate === "string"
                                                                    ? buyer.paymentDate
                                                                    : buyer.paymentDate.toISOString(),
                                                                "DD/MM/YYYY HH:mm"
                                                            )
                                                            : "-"
                                                        }
                                                    </TableCell>
                                                    <TableCell className="max-w-xs">
                                                        <div className="text-xs text-psi-dark/70 wrap-break-word leading-relaxed">
                                                            {formatFormAnswers(buyer.formAnswers || {})}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <DropdownMenu>
                                                            <DropdownMenuTrigger asChild>
                                                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-psi-primary/10">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </Button>
                                                            </DropdownMenuTrigger>
                                                            <DropdownMenuContent align="end">
                                                                {!isValidated && !isCancelled && (
                                                                    <DropdownMenuItem
                                                                        onClick={() => handleOpenConfirmValidate(buyer)}
                                                                        disabled={isValidatingTicketById}
                                                                        className="cursor-pointer"
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                        {isValidatingTicketById ? "Validando..." : "Validar"}
                                                                    </DropdownMenuItem>
                                                                )}
                                                                <DropdownMenuItem
                                                                    onClick={() => handleViewMoreInfo(buyer)}
                                                                    className="cursor-pointer"
                                                                >
                                                                    <Info className="h-4 w-4" />
                                                                    Conferir mais informações
                                                                </DropdownMenuItem>
                                                            </DropdownMenuContent>
                                                        </DropdownMenu>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        })}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Dialog open={buyerInfoDialog.open} onOpenChange={(open) => setBuyerInfoDialog({ open, buyer: open ? buyerInfoDialog.buyer : null })}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Mais informações</DialogTitle>
                        <DialogDescription>
                            Confira os detalhes do comprador e as respostas do formulário.
                        </DialogDescription>
                    </DialogHeader>

                    {buyerInfoDialog.buyer && (
                        <div className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="space-y-1">
                                    <p className="text-xs text-psi-dark/60">Nome</p>
                                    <p className="text-sm font-medium text-psi-dark">{buyerInfoDialog.buyer.customerName}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-psi-dark/60">Tipo de ingresso</p>
                                    <p className="text-sm font-medium text-psi-dark">{buyerInfoDialog.buyer.ticketTypeName || "-"}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-psi-dark/60">Datas do evento</p>
                                    <div className="space-y-1">
                                        {buyerInfoDialog.buyer.eventDates.map((eventDate, idx) => (
                                            <div key={idx} className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-psi-dark">
                                                    {DateUtils.formatDate(eventDate.date, "DD/MM/YYYY")}
                                                </p>
                                                {eventDate.status === "USED" && eventDate.usedAt && (
                                                    <Badge variant="default" className="bg-green-600 text-xs">
                                                        Validado em {DateUtils.formatDate(eventDate.usedAt, "DD/MM/YYYY HH:mm")}
                                                    </Badge>
                                                )}
                                                {eventDate.status === "CONFIRMED" && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Confirmado
                                                    </Badge>
                                                )}
                                                {eventDate.status === "PENDING" && (
                                                    <Badge variant="outline" className="text-xs">
                                                        Pendente
                                                    </Badge>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-psi-dark/60">Data do pagamento</p>
                                    <p className="text-sm font-medium text-psi-dark">
                                        {buyerInfoDialog.buyer.paymentDate
                                            ? DateUtils.formatDate(
                                                typeof buyerInfoDialog.buyer.paymentDate === "string"
                                                    ? buyerInfoDialog.buyer.paymentDate
                                                    : buyerInfoDialog.buyer.paymentDate.toISOString(),
                                                "DD/MM/YYYY HH:mm"
                                            )
                                            : "-"}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-psi-dark/60">Validações por Data</p>
                                <div className="space-y-3">
                                    {buyerInfoDialog.buyer.eventDates.map((eventDate, idx) => (
                                        <div key={idx} className="rounded-lg border border-psi-primary/10 bg-white p-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-sm font-medium text-psi-dark">
                                                    {DateUtils.formatDate(eventDate.date, "DD/MM/YYYY")}
                                                </p>
                                                {eventDate.status === "USED" && eventDate.usedAt ? (
                                                    <Badge variant="default" className="bg-green-600">
                                                        Validado
                                                    </Badge>
                                                ) : eventDate.status === "CONFIRMED" ? (
                                                    <Badge variant="outline">
                                                        Confirmado
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline">
                                                        Pendente
                                                    </Badge>
                                                )}
                                            </div>
                                            {eventDate.validationInfo ? (
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-psi-dark/80">
                                                        <Badge variant="outline">
                                                            {eventDate.validationInfo.validatedByOrganizer ? "Organizador" : "Equipe"}
                                                        </Badge>
                                                        <span>
                                                            {eventDate.validationInfo.validatedAt
                                                                ? DateUtils.formatDate(eventDate.validationInfo.validatedAt, "DD/MM/YYYY HH:mm")
                                                                : eventDate.usedAt
                                                                    ? DateUtils.formatDate(eventDate.usedAt, "DD/MM/YYYY HH:mm")
                                                                    : "-"}
                                                        </span>
                                                    </div>

                                                    <div className="text-xs text-psi-dark/70">
                                                        <span className="font-medium text-psi-dark">Método:</span>{" "}
                                                        {eventDate.validationInfo.method === "qr-scan"
                                                            ? "Câmera"
                                                            : eventDate.validationInfo.method === "qr-image"
                                                                ? "Foto"
                                                                : eventDate.validationInfo.method === "button"
                                                                    ? "Botão"
                                                                    : "-"}
                                                    </div>

                                                    {!eventDate.validationInfo.validatedByOrganizer && (
                                                        <div className="grid gap-3 sm:grid-cols-2 text-xs text-psi-dark/70">
                                                            <div>
                                                                <span className="font-medium text-psi-dark">Nome:</span>{" "}
                                                                {eventDate.validationInfo.name || "-"}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-psi-dark">Local:</span>{" "}
                                                                {eventDate.validationInfo.location || "-"}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-psi-dark">IP:</span>{" "}
                                                                {eventDate.validationInfo.ip || "-"}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-psi-dark">Código do link de validação:</span>{" "}
                                                                {eventDate.validationInfo.code || "-"}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-xs text-psi-dark/60">Ainda não validado.</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <p className="text-xs text-psi-dark/60">Respostas do formulário</p>
                                <div className="max-h-[240px] overflow-auto rounded-lg border border-psi-primary/10 bg-psi-primary/5 p-3">
                                    <p className="text-sm text-psi-dark/80 whitespace-pre-wrap wrap-break-word">
                                        {formatFormAnswers(buyerInfoDialog.buyer.formAnswers || {}).split("; ").join("\n")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setBuyerInfoDialog({ open: false, buyer: null })}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DialogConfirm
                open={confirmValidateDialog.open}
                onOpenChange={(open) => setConfirmValidateDialog({ open, buyer: open ? confirmValidateDialog.buyer : null })}
                onConfirm={async () => {
                    if (!confirmValidateDialog.buyer) {
                        return
                    }
                    await handleValidateTicket(confirmValidateDialog.buyer)
                    setConfirmValidateDialog({ open: false, buyer: null })
                }}
                title="Confirmar validação"
                description="Após validar, não é possível desfazer. Deseja realmente prosseguir?"
                confirmText="Validar"
                cancelText="Cancelar"
                isLoading={isValidatingTicketById}
                variant="default"
            />

            <Dialog open={qrImageErrorDialog.open} onOpenChange={(open) => setQrImageErrorDialog((prev) => ({ ...prev, open }))}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>{qrImageErrorDialog.title || "Atenção"}</DialogTitle>
                        <DialogDescription>
                            {qrImageErrorDialog.description}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setQrImageErrorDialog({ open: false, title: "", description: "" })}
                        >
                            Fechar
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </Background>
    )
}

export {
    QrScanLinkPannel
}
