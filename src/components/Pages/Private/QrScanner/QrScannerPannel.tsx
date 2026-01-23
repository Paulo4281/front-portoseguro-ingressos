"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/Input/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { TTicketScanLink } from "@/types/Ticket/TTicket"
import { QrCode, Link2, Trash2, Users, Scan, CheckCircle2, XCircle, Calendar, Ticket, Search, MoreVertical, Check, Info, ImageUp, CircleMinus } from "lucide-react"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { Toast } from "@/components/Toast/Toast"
import { useEventFindByUserId } from "@/hooks/Event/useEventFindByUserId"
import { useEventListBuyers } from "@/hooks/Event/useEventListBuyers"
import type { TEvent, TEventCacheResponse, TEventListBuyers, TEventBuyerValidationInfo } from "@/types/Event/TEvent"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventCache } from "@/hooks/Event/useEventCache"
import { useTicketScanFind } from "@/hooks/TicketScan/useTicketScanFind"
import { useTicketScanCreate } from "@/hooks/TicketScan/useTicketScanCreate"
import { useTicketScanDelete } from "@/hooks/TicketScan/useTicketScanDelete"
import { TicketScanCreateLinkValidator, type TTicketScanCreateLinkForm } from "@/validators/TicketScan/TicketScanValidator"
import { useTicketUpdateExpAt } from "@/hooks/TicketScan/useTicketUpdateExpAt"
import { useTicketScanUpdatePassword } from "@/hooks/TicketScan/useTicketScanUpdatePassword"
import { useTicketScanSessionDeleteByOrganizer } from "@/hooks/TicketScanSession/useTicketScanSessionDeleteByOrganizer"
import { TicketScanUpdateExpAtValidator, TicketScanUpdatePasswordValidator, type TTicketScanUpdateExpAtForm, type TTicketScanUpdatePasswordForm } from "@/validators/TicketScan/TicketScanValidator"
import type { TTicketScanPublic, TTicketScanSessionPublic } from "@/types/TicketScan/TTicketScan"
import { useTicketValidateQrcodeOrganizer } from "@/hooks/Ticket/useTicketValidateQrcodeOrganizer"
import { useTicketValidateOrganizer } from "@/hooks/Ticket/useTicketValidateOrganizer"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const QrScannerPannel = () => {
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const [selectedEventDateId, setSelectedEventDateId] = useState<string>("ALL")
    const [isScanning, setIsScanning] = useState(false)
    const [scanFeedback, setScanFeedback] = useState<string>("")
    const [createLinkDialogOpen, setCreateLinkDialogOpen] = useState(false)
    const [deleteLinkDialog, setDeleteLinkDialog] = useState<{ open: boolean; linkId: string }>({ open: false, linkId: "" })
    const [validatedTickets, setValidatedTickets] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")
    
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const scannerContainerRef = useRef<HTMLDivElement>(null)
    const [scannerId] = useState(() => `qr-reader-${Date.now()}`)
    const lastScanFeedbackAtRef = useRef(0)
    const fileInputRef = useRef<HTMLInputElement | null>(null)
    const [isDecodingQrImage, setIsDecodingQrImage] = useState(false)
    const [fileReaderId] = useState(() => `qr-file-reader-${Date.now()}`)

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

    const { data: eventsData, isLoading: isLoadingEvents } = useEventCache()

    const [events, setEvents] = useState<TEventCacheResponse[]>([])
    const [buyers, setBuyers] = useState<TEventListBuyers[]>([])
    const [selectedEvent, setSelectedEvent] = useState<TEventCacheResponse | null>(null)

    useEffect(() => {
        if (eventsData?.data) {
            setEvents(eventsData.data)
        }
    }, [eventsData])

    useEffect(() => {
        if (selectedEventId) {
            const event = events?.find(e => e.id === selectedEventId)
            setSelectedEvent(event || null)
            setSelectedEventDateId("ALL")
        } else {
            setSelectedEvent(null)
            setSelectedEventDateId("ALL")
        }
    }, [selectedEventId, events])

    const isRecurrent = useMemo(() => {
        return !!selectedEvent?.Recurrence?.id
    }, [selectedEvent])

    const eventDates = useMemo(() => {
        if (!selectedEvent?.EventDates || !Array.isArray(selectedEvent.EventDates)) return []
        return [...selectedEvent.EventDates].sort((a, b) => {
            if (!a.date || !b.date) return 0
            return getDateOrderValue(a.date) - getDateOrderValue(b.date)
        })
    }, [selectedEvent])

    const isTodayEventDate = useMemo(() => {
        if (!selectedEvent?.EventDates || !Array.isArray(selectedEvent.EventDates)) return false
        
        const today = new Date()
        const todayDateString = today.toISOString().split("T")[0]
        
        if (selectedEventDateId === "ALL") {
            return selectedEvent.EventDates.some(eventDate => {
                if (!eventDate.date) return false
                const eventDateString = new Date(eventDate.date).toISOString().split("T")[0]
                return eventDateString === todayDateString
            })
        } else {
            const selectedDate = selectedEvent.EventDates.find(ed => ed.id === selectedEventDateId)
            if (!selectedDate?.date) return false
            const eventDateString = new Date(selectedDate.date).toISOString().split("T")[0]
            return eventDateString === todayDateString
        }
    }, [selectedEvent, selectedEventDateId])

    const { data: buyersData, isLoading: isLoadingBuyers, refetch: refetchBuyers } = useEventListBuyers({
        eventId: selectedEventId,
        eventDateId: selectedEventDateId !== "ALL" ? selectedEventDateId : undefined,
        enabled: !!selectedEventId
    })

    useEffect(() => {
        if (buyersData?.data) {
            setBuyers(buyersData.data)
        }
    }, [buyersData])

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

    const form = useForm<TTicketScanCreateLinkForm>({
        resolver: zodResolver(TicketScanCreateLinkValidator),
        defaultValues: {
            maxUsers: 1,
            password: "",
            expiresAt: (() => {
                const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
                const yyyy = date.getFullYear()
                const mm = String(date.getMonth() + 1).padStart(2, "0")
                const dd = String(date.getDate()).padStart(2, "0")
                const hh = String(date.getHours()).padStart(2, "0")
                const min = String(date.getMinutes()).padStart(2, "0")
                return `${yyyy}-${mm}-${dd}T${hh}:${min}`
            })()
        }
    })

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

    const { data: scanLinksData, isLoading: isLoadingScanLinks, refetch: refetchScanLinks } = useTicketScanFind()
    const { mutateAsync: createScanLink, isPending: isCreatingScanLink } = useTicketScanCreate()
    const { mutateAsync: deleteScanLink, isPending: isDeletingScanLink } = useTicketScanDelete()
    const { mutateAsync: updateScanLinkExpAt, isPending: isUpdatingScanLinkExpAt } = useTicketUpdateExpAt()
    const { mutateAsync: updateScanLinkPassword, isPending: isUpdatingScanLinkPassword } = useTicketScanUpdatePassword()
    const { mutateAsync: forceLogoutSession, isPending: isForcingLogoutSession } = useTicketScanSessionDeleteByOrganizer()
    const { mutateAsync: validateTicketQrCode, isPending: isValidatingTicketQrCode } = useTicketValidateQrcodeOrganizer()
    const { mutateAsync: validateTicketById, isPending: isValidatingTicketById } = useTicketValidateOrganizer()

    const scanLinks = useMemo(() => {
        if (scanLinksData?.data && Array.isArray(scanLinksData.data)) {
            return scanLinksData.data
        }
        return []
    }, [scanLinksData])

    const [manageSessionsDialog, setManageSessionsDialog] = useState<{ open: boolean; linkId: string }>({ open: false, linkId: "" })
    const [updatePasswordDialog, setUpdatePasswordDialog] = useState<{ open: boolean; linkId: string }>({ open: false, linkId: "" })
    const [updateExpAtDialog, setUpdateExpAtDialog] = useState<{ open: boolean; linkId: string }>({ open: false, linkId: "" })
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

    const selectedManageLink = useMemo(() => {
        return scanLinks.find((link: TTicketScanPublic) => link.id === manageSessionsDialog.linkId) || null
    }, [scanLinks, manageSessionsDialog.linkId])

    const sessionsForSelectedLink = useMemo(() => {
        return (selectedManageLink?.TicketScanSessions || []) as TTicketScanSessionPublic[]
    }, [selectedManageLink])

    const updatePasswordForm = useForm<TTicketScanUpdatePasswordForm>({
        resolver: zodResolver(TicketScanUpdatePasswordValidator),
        defaultValues: {
            id: "",
            password: ""
        }
    })

    const updateExpAtForm = useForm<TTicketScanUpdateExpAtForm>({
        resolver: zodResolver(TicketScanUpdateExpAtValidator),
        defaultValues: {
            id: "",
            expiresAt: (() => {
                const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
                const yyyy = date.getFullYear()
                const mm = String(date.getMonth() + 1).padStart(2, "0")
                const dd = String(date.getDate()).padStart(2, "0")
                const hh = String(date.getHours()).padStart(2, "0")
                const min = String(date.getMinutes()).padStart(2, "0")
                return `${yyyy}-${mm}-${dd}T${hh}:${min}`
            })()
        }
    })

    useEffect(() => {
        setValidatedTickets(new Set())
    }, [selectedEventId])

    const handleStartScan = async () => {
        if (!selectedEventId) {
            Toast.error("Selecione um evento primeiro")
            return
        }

        setScanFeedback("Iniciando câmera...")
        setIsScanning(true)
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        const scannerContainer = document.getElementById("qr-scanner-container")
        if (scannerContainer) {
            scannerContainer.scrollIntoView({ behavior: "smooth", block: "center" })
        }
        
        if (!scannerContainerRef.current) {
            setIsScanning(false)
            setScanFeedback("")
            Toast.error("Erro ao inicializar o scanner")
            return
        }

        try {
            const scanner = new Html5Qrcode(scannerId)
            scannerRef.current = scanner

            const config = {
                fps: 10,
                ...(typeof window !== "undefined" && window.innerWidth > 1024
                    ? {
                        qrbox: { width: 400, height: 400 },
                        videoConstraints: {
                            width: { ideal: 1920 },
                            height: { ideal: 1080 }
                        }
                    }
                    : {
                        qrbox: { width: 280, height: 330 },
                        videoConstraints: {
                            width: { ideal: 390 },
                            height: { ideal: 490 }
                        }
                    }
                )
            }

            const onScanSuccess = (decodedText: string) => {
                handleScanSuccess(decodedText)
            }

            const onScanFailure = (errorMessage: string) => {
                const now = Date.now()
                if (now - lastScanFeedbackAtRef.current < 900) {
                    return
                }
                lastScanFeedbackAtRef.current = now
                setScanFeedback(getScanFeedbackMessage(errorMessage))
            }

            const startWithCamera = async (cameraConfig: any) => {
                await scanner.start(cameraConfig, config, onScanSuccess, onScanFailure)
            }

            try {
                await startWithCamera({ facingMode: { ideal: "environment" } })
            } catch (startError) {
                const cameras = await Html5Qrcode.getCameras()
                if (cameras.length > 0) {
                    const backCamera = cameras.find(camera => /back|rear|traseira|environment/i.test(camera.label)) || cameras[cameras.length - 1]
                    await startWithCamera({ deviceId: { exact: backCamera.id } })
                } else {
                    throw startError
                }
            }

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

    const handleCreateLink = async (data: TTicketScanCreateLinkForm) => {
        if (!selectedEventId) {
            Toast.error("Selecione um evento primeiro")
            return
        }

        try {
            const response = await createScanLink({
                eventId: selectedEventId,
                password: data.password,
                maxUsers: data.maxUsers,
                expiresAt: new Date(data.expiresAt).toISOString()
            })

            if (response?.success) {
                Toast.success("Link criado com sucesso!")
                setCreateLinkDialogOpen(false)
                form.reset({
                    maxUsers: 1,
                    password: "",
                    expiresAt: (() => {
                        const date = new Date(Date.now() + 24 * 60 * 60 * 1000)
                        const yyyy = date.getFullYear()
                        const mm = String(date.getMonth() + 1).padStart(2, "0")
                        const dd = String(date.getDate()).padStart(2, "0")
                        const hh = String(date.getHours()).padStart(2, "0")
                        const min = String(date.getMinutes()).padStart(2, "0")
                        return `${yyyy}-${mm}-${dd}T${hh}:${min}`
                    })()
                })
                refetchScanLinks()
            }
        } catch (error) {
            console.error("Erro ao criar link:", error)
            Toast.error("Erro ao criar link")
        }
    }

    const handleDeleteLink = async () => {
        try {
            const response = await deleteScanLink({ id: deleteLinkDialog.linkId })
            if (response?.success) {
                Toast.success("Link excluído com sucesso!")
                setDeleteLinkDialog({ open: false, linkId: "" })
                refetchScanLinks()
            }
        } catch (error) {
            console.error("Erro ao excluir link:", error)
            Toast.error("Erro ao excluir link")
        }
    }

    const handleOpenManageSessions = (linkId: string) => {
        setManageSessionsDialog({ open: true, linkId })
    }

    const handleOpenUpdatePassword = (linkId: string) => {
        updatePasswordForm.reset({ id: linkId, password: "" })
        setUpdatePasswordDialog({ open: true, linkId })
    }

    const handleOpenUpdateExpAt = (linkId: string, expiresAt?: string) => {
        const parsed = expiresAt ? new Date(expiresAt) : new Date(Date.now() + 24 * 60 * 60 * 1000)
        const yyyy = parsed.getFullYear()
        const mm = String(parsed.getMonth() + 1).padStart(2, "0")
        const dd = String(parsed.getDate()).padStart(2, "0")
        const hh = String(parsed.getHours()).padStart(2, "0")
        const min = String(parsed.getMinutes()).padStart(2, "0")

        updateExpAtForm.reset({
            id: linkId,
            expiresAt: `${yyyy}-${mm}-${dd}T${hh}:${min}`
        })
        setUpdateExpAtDialog({ open: true, linkId })
    }

    const handleConfirmUpdatePassword = async (data: TTicketScanUpdatePasswordForm) => {
        try {
            const response = await updateScanLinkPassword({
                id: data.id,
                password: data.password
            })
            if (response?.success) {
                Toast.success("Senha atualizada com sucesso!")
                setUpdatePasswordDialog({ open: false, linkId: "" })
                refetchScanLinks()
            }
        } catch (error) {
            Toast.error("Erro ao atualizar senha")
        }
    }

    const handleConfirmUpdateExpAt = async (data: TTicketScanUpdateExpAtForm) => {
        try {
            const response = await updateScanLinkExpAt({
                id: data.id,
                expiresAt: new Date(data.expiresAt).toISOString()
            })
            if (response?.success) {
                Toast.success("Data de expiração atualizada com sucesso!")
                setUpdateExpAtDialog({ open: false, linkId: "" })
                refetchScanLinks()
            }
        } catch (error) {
            Toast.error("Erro ao atualizar data de expiração")
        }
    }

    const handleForceLogoutSession = async (sessionId: string) => {
        try {
            const response = await forceLogoutSession({ id: sessionId })
            if (response?.success) {
                Toast.success("Desconectado com sucesso!")
                refetchScanLinks()
            }
        } catch (error) {
            Toast.error("Erro ao desconectar")
        }
    }

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {})
            }
        }
    }, [])

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[80px]">
                <div className="mx-auto space-y-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-semibold text-psi-primary">Validar Ingressos</h1>
                            <p className="text-sm text-psi-dark/60 mt-1">Escaneie os QR codes dos ingressos para validar a entrada dos participantes</p>
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
                                onClick={() => setCreateLinkDialogOpen(true)}
                                disabled={!selectedEventId}
                                className="w-full lg:w-auto"
                            >
                                <Link2 className="h-4 w-4" />
                                Criar link de escaneamento
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handlePickQrImage}
                                disabled={!selectedEventId || isDecodingQrImage}
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
                                    disabled={!selectedEventId || isValidatingTicketQrCode}
                                    className="w-full lg:w-auto"
                                >
                                    <Scan className="h-4 w-4" />
                                    Escanear QR Code
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
                
                <div>
                    {
                        events && events.length > 0 && (
                            <>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-10">

                                <div className="lg:col-span-2 space-y-6">
                                    <div className="grid lg:grid-cols-2 gap-6">
                                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                            <h2 className="text-lg font-medium text-psi-dark mb-4">Selecionar Evento</h2>
                                            {isLoadingEvents ? (
                                                <div className="space-y-2">
                                                    <Skeleton className="h-10 w-full" />
                                                </div>
                                            ) : events.length === 0 ? (
                                                <p className="text-sm text-psi-dark/60">Nenhum evento encontrado</p>
                                            ) : (
                                                <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Selecione um evento" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {events.map((event) => (
                                                            <SelectItem key={event.id} value={event.id}>
                                                                {event.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}

                                            {selectedEvent && (
                                                <div className="mt-6 rounded-xl overflow-hidden border border-psi-primary/20 bg-white shadow-sm">
                                                    <div className="relative h-48 w-full overflow-hidden bg-linear-to-br from-psi-primary/10 to-psi-secondary/10">
                                                        {selectedEvent.image ? (
                                                            <img
                                                                src={ImageUtils.getEventImageUrl(selectedEvent.image)}
                                                                alt={selectedEvent.name}
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
                                                                {selectedEvent.name}
                                                            </h3>
                                                            {selectedEvent.EventDates && selectedEvent.EventDates.length > 0 && (
                                                                <div className="flex items-center gap-2 text-white/90 text-sm">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span className="drop-shadow">
                                                                        {selectedEvent.EventDates.length} {selectedEvent.EventDates.length === 1 ? "data" : "datas"}
                                                                    </span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {eventDates.length > 0 && (
                                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                                <h2 className="text-lg font-medium text-psi-dark mb-4">Filtrar por Data do Evento</h2>
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

                                        {selectedEventId && (
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
                                                ) : selectedEvent && eventDates.length > 0 ? (
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
                                        )}

                                        {scanLinks.length > 0 && (
                                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                                <h2 className="text-lg font-medium text-psi-dark mb-4">Links de Escaneamento</h2>
                                                <div className="space-y-3">
                                                    {scanLinks.map((link) => {
                                                        const eventName = events.find((event) => event.id === link.eventId)?.name || "Evento"
                                                        const publicPath = `/qr-scanner-link?pubId=${link.code}`
                                                        const currentUsers = (link.TicketScanSessions?.length || 0)

                                                        return (
                                                        <div key={link.id} className="flex items-center justify-between p-3 rounded-lg border border-psi-primary/10">
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-xs font-medium text-psi-dark truncate">{eventName}</p>
                                                                <button
                                                                    type="button"
                                                                    aria-label="Copiar link de escaneamento"
                                                                    className="text-sm font-medium underline cursor-pointer text-psi-dark/70 truncate text-left outline-none focus-visible:ring-2 focus-visible:ring-psi-primary transition select-text hover:underline w-full"
                                                                    style={{ background: "none", border: "none", padding: 0 }}
                                                                    onClick={() => {
                                                                        const url = `${process.env.NEXT_PUBLIC_FRONT_URL}${publicPath}`
                                                                        navigator.clipboard.writeText(url)
                                                                        Toast.success("Link de escaneamento copiado para a área de transferência")
                                                                    }}
                                                                >
                                                                    {process.env.NEXT_PUBLIC_FRONT_URL}{publicPath}
                                                                </button>
                                                                <div className="flex items-center gap-4 mt-1">
                                                                    <span className="text-xs text-psi-dark/60 flex items-center gap-1">
                                                                        <Users className="h-3 w-3" />
                                                                        {currentUsers}/{link.maxUsers}
                                                                    </span>
                                                                    <span className="text-xs text-psi-dark/60">
                                                                        Expira em {DateUtils.formatDate(link.expiresAt, "DD/MM/YYYY HH:mm")}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <DropdownMenu>
                                                                    <DropdownMenuTrigger asChild>
                                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                                            <MoreVertical className="h-4 w-4" />
                                                                        </Button>
                                                                    </DropdownMenuTrigger>
                                                                    <DropdownMenuContent align="end">
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleOpenManageSessions(link.id)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Users className="h-4 w-4" />
                                                                            Ver conectados ({currentUsers})
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleOpenUpdatePassword(link.id)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <QrCode className="h-4 w-4" />
                                                                            Alterar senha
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleOpenUpdateExpAt(link.id, link.expiresAt)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Calendar className="h-4 w-4" />
                                                                            Alterar expiração
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => setDeleteLinkDialog({ open: true, linkId: link.id })}
                                                                            className="cursor-pointer text-destructive"
                                                                        >
                                                                            <Trash2 className="h-4 w-4" />
                                                                            Excluir link
                                                                        </DropdownMenuItem>
                                                                    </DropdownMenuContent>
                                                                </DropdownMenu>
                                                            </div>
                                                        </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="lg:col-span-2 space-y-6">
                                    {isScanning && (
                                        <div 
                                            id="qr-scanner-container"
                                            className="rounded-xl border border-psi-primary/20 bg-white p-4
                                                sm:p-6">
                                            <div className="mb-3
                                                sm:mb-4">
                                                <p className="text-sm font-medium text-psi-dark">Leitura do QR Code</p>
                                                <p className="text-xs text-psi-dark/60">
                                                    {scanFeedback || "Aponte a câmera para o QR Code. Chegue mais perto e mantenha o celular firme."}
                                                </p>
                                            </div>
                                            <div
                                                id={scannerId}
                                                ref={scannerContainerRef}
                                                className="w-full min-h-[400px]
                                                    sm:min-h-[400px]"
                                            />
                                        </div>
                                    )}

                                    {selectedEventId && (
                                        <>
                                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                                                    <h2 className="text-lg font-medium text-psi-dark">Lista de Compradores</h2>
                                                    <div className="relative w-full sm:w-64">
                                                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-psi-dark/40" />
                                                        <Input
                                                            placeholder="Buscar comprador..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="pl-10"
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
                                                    <p className="text-sm text-psi-dark/60 text-center py-8">Nenhum comprador encontrado</p>
                                                ) : (
                                                    <div className="overflow-x-auto">
                                                        <Table>
                                                            <TableHeader>
                                                                <TableRow>
                                                                    <TableHead>Status</TableHead>
                                                                    <TableHead>Nome</TableHead>
                                                                    <TableHead>Tipo de Ingresso</TableHead>
                                                                    <TableHead>Data do Evento</TableHead>
                                                                    <TableHead>Data do Pagamento</TableHead>
                                                                    <TableHead>Respostas do Formulário</TableHead>
                                                                    <TableHead className="text-right">Ações</TableHead>
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
                                                                        <TableRow key={`${buyer.uniqueKey}-${index}`}>
                                                                            <TableCell>
                                                                                <div className="space-y-1">
                                                                                    {isCancelled ? (
                                                                                        <Badge variant="destructive">
                                                                                            <XCircle className="h-3 w-3 mr-1" />
                                                                                            Cancelado
                                                                                        </Badge>
                                                                                    ) : isValidated ? (
                                                                                        <Badge variant="default" className="bg-green-600">
                                                                                            <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                                            Validado
                                                                                        </Badge>
                                                                                    ) : (
                                                                                        <Badge variant="outline">
                                                                                            <XCircle className="h-3 w-3 mr-1" />
                                                                                            Pendente
                                                                                        </Badge>
                                                                                    )}

                                                                                    {(validationInfo || buyer.eventDateUsedAt) && !isCancelled && (
                                                                                        <p className="text-[11px] text-psi-dark/60">
                                                                                            {validatedByText}
                                                                                            {validatedLocationText}
                                                                                            {validatedWhenText ? ` • ${validatedWhenText}` : ""}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="font-medium">{buyer.customerName}</TableCell>
                                                                            <TableCell>{buyer.ticketTypeName || "-"}</TableCell>
                                                                            <TableCell>
                                                                                {buyer.eventDate ? DateUtils.formatDate(buyer.eventDate, "DD/MM/YYYY") : "-"}
                                                                            </TableCell>
                                                                            <TableCell>
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
                                                                                <div className="text-xs text-psi-dark/70 wrap-break-word">
                                                                                    {formatFormAnswers(buyer.formAnswers || {})}
                                                                                </div>
                                                                            </TableCell>
                                                                            <TableCell className="text-right">
                                                                                <DropdownMenu>
                                                                                    <DropdownMenuTrigger asChild>
                                                                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
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
                                        </>
                                    )}

                                    {!selectedEventId && (
                                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                            <div className="text-center py-12">
                                                <Ticket className="h-12 w-12 text-psi-primary/40 mx-auto mb-4" />
                                                <p className="text-sm text-psi-dark/60">Selecione um evento para começar a validar ingressos</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                            </>
                        )
                    }

                    <Dialog open={createLinkDialogOpen} onOpenChange={setCreateLinkDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Link de Escaneamento</DialogTitle>
                                <DialogDescription>
                                    Crie um link para compartilhar com sua equipe.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(handleCreateLink)} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="expiresAt" className="text-sm font-medium text-psi-dark">
                                        Data de expiração
                                    </label>
                                    <Controller
                                        name="expiresAt"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="expiresAt"
                                                type="datetime-local"
                                                required
                                            />
                                        )}
                                    />
                                    {form.formState.errors.expiresAt && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.expiresAt.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="maxUsers" className="text-sm font-medium text-psi-dark">
                                        Número máximo de pessoas simultâneas
                                    </label>
                                    <Controller
                                        name="maxUsers"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="maxUsers"
                                                type="number"
                                                min={1}
                                                max={99}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                required
                                            />
                                        )}
                                    />
                                    {form.formState.errors.maxUsers && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.maxUsers.message}
                                        </p>
                                    )}
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
                                                required
                                            />
                                        )}
                                    />
                                    {form.formState.errors.password && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCreateLinkDialogOpen(false)}
                                        disabled={isCreatingScanLink}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={isCreatingScanLink}>
                                        {isCreatingScanLink ? "Criando..." : "Criar Link"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <DialogConfirm
                        open={deleteLinkDialog.open}
                        onOpenChange={(open) => setDeleteLinkDialog({ open, linkId: deleteLinkDialog.linkId })}
                        onConfirm={handleDeleteLink}
                        title="Excluir Link"
                        description="Tem certeza que deseja excluir este link? A equipe não conseguirá mais acessá-lo."
                        confirmText="Excluir"
                        cancelText="Cancelar"
                        variant="destructive"
                    />

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

                    <Dialog open={manageSessionsDialog.open} onOpenChange={(open) => setManageSessionsDialog({ open, linkId: manageSessionsDialog.linkId })}>
                        <DialogContent className="max-w-3xl">
                            <DialogHeader>
                                <DialogTitle>Conectados</DialogTitle>
                                <DialogDescription>
                                    Confira quem está conectado e desconecte alguém, se necessário.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-psi-dark/70">
                                        {sessionsForSelectedLink.length} conectado(s) de {selectedManageLink?.maxUsers || 0}
                                    </p>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => refetchScanLinks()}
                                    >
                                        Atualizar
                                    </Button>
                                </div>

                                {sessionsForSelectedLink.length === 0 ? (
                                    <p className="text-sm text-psi-dark/60">Ninguém conectado no momento.</p>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Nome</TableHead>
                                                    <TableHead>Local</TableHead>
                                                    <TableHead>IP</TableHead>
                                                    <TableHead>Conectado em</TableHead>
                                                    <TableHead className="text-right">Ações</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {sessionsForSelectedLink.map((session: TTicketScanSessionPublic) => (
                                                    <TableRow key={session.id}>
                                                        <TableCell className="font-medium">{session.name}</TableCell>
                                                        <TableCell>{session.location || "-"}</TableCell>
                                                        <TableCell className="font-mono text-xs">{session.ip}</TableCell>
                                                        <TableCell>
                                                            {DateUtils.formatDate(session.createdAt, "DD/MM/YYYY HH:mm")}
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <Button
                                                                type="button"
                                                                variant="destructive"
                                                                size="sm"
                                                                disabled={isForcingLogoutSession}
                                                                onClick={() => handleForceLogoutSession(session.id)}
                                                            >
                                                                Desconectar
                                                            </Button>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </div>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setManageSessionsDialog({ open: false, linkId: "" })}
                                >
                                    Fechar
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={updatePasswordDialog.open} onOpenChange={(open) => setUpdatePasswordDialog({ open, linkId: updatePasswordDialog.linkId })}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Alterar senha do link</DialogTitle>
                                <DialogDescription>
                                    Defina uma nova senha para que a equipe possa acessar este link.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={updatePasswordForm.handleSubmit(handleConfirmUpdatePassword)} className="space-y-4">
                                <Controller
                                    name="id"
                                    control={updatePasswordForm.control}
                                    render={({ field }) => (
                                        <input type="hidden" {...field} />
                                    )}
                                />

                                <div className="space-y-2">
                                    <label htmlFor="newPassword" className="text-sm font-medium text-psi-dark">
                                        Nova senha
                                    </label>
                                    <Controller
                                        name="password"
                                        control={updatePasswordForm.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="newPassword"
                                                type="password"
                                                required
                                            />
                                        )}
                                    />
                                    {updatePasswordForm.formState.errors.password?.message && (
                                        <p className="text-xs text-destructive">{updatePasswordForm.formState.errors.password.message}</p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setUpdatePasswordDialog({ open: false, linkId: "" })}
                                        disabled={isUpdatingScanLinkPassword}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={isUpdatingScanLinkPassword}>
                                        {isUpdatingScanLinkPassword ? "Salvando..." : "Salvar"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={updateExpAtDialog.open} onOpenChange={(open) => setUpdateExpAtDialog({ open, linkId: updateExpAtDialog.linkId })}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Alterar expiração do link</DialogTitle>
                                <DialogDescription>
                                    Defina uma nova data de expiração para este link.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={updateExpAtForm.handleSubmit(handleConfirmUpdateExpAt)} className="space-y-4">
                                <Controller
                                    name="id"
                                    control={updateExpAtForm.control}
                                    render={({ field }) => (
                                        <input type="hidden" {...field} />
                                    )}
                                />

                                <div className="space-y-2">
                                    <label htmlFor="expiresAtUpdate" className="text-sm font-medium text-psi-dark">
                                        Data de expiração
                                    </label>
                                    <Controller
                                        name="expiresAt"
                                        control={updateExpAtForm.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="expiresAtUpdate"
                                                type="datetime-local"
                                                required
                                            />
                                        )}
                                    />
                                    {updateExpAtForm.formState.errors.expiresAt?.message && (
                                        <p className="text-xs text-destructive">{updateExpAtForm.formState.errors.expiresAt.message}</p>
                                    )}
                                </div>

                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setUpdateExpAtDialog({ open: false, linkId: "" })}
                                        disabled={isUpdatingScanLinkExpAt}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={isUpdatingScanLinkExpAt}>
                                        {isUpdatingScanLinkExpAt ? "Salvando..." : "Salvar"}
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

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
                </div>
            </div>
        </Background>
    )
}

export {
    QrScannerPannel
}
