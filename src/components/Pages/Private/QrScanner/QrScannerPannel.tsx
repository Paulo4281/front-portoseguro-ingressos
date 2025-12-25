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
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { Toast } from "@/components/Toast/Toast"
import { useEventFindByUserId } from "@/hooks/Event/useEventFindByUserId"
import { useEventListBuyers } from "@/hooks/Event/useEventListBuyers"
import type { TEvent, TEventCacheResponse, TEventListBuyers } from "@/types/Event/TEvent"
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
            if (buyer.status === "USED" || !!buyer.validationInfo) {
                next.add(`${buyer.customerName}-${buyer.paymentDate}`)
            }
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
            buyer.eventDates.some(date => date.toLowerCase().includes(query))
        )
    }, [buyers, searchQuery])

    const validationStats = useMemo(() => {
        const validatable = filteredBuyers.filter((buyer) => buyer.status !== "CANCELLED" && buyer.status !== "REFUNDED")
        const total = validatable.length
        const validated = validatable.filter((buyer: TEventListBuyers) => {
            const key = `${buyer.customerName}-${buyer.paymentDate}`
            return validatedTickets.has(key)
        }).length
        return { total, validated, remaining: total - validated }
    }, [filteredBuyers, validatedTickets])

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
    const [confirmValidateDialog, setConfirmValidateDialog] = useState<{ open: boolean; buyer: TEventListBuyers | null }>({
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
                    fps: 15,
                    qrbox: { width: 300, height: 300 },
                    videoConstraints: {
                        width: { ideal: 1920 },
                        height: { ideal: 1080 }
                    }
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
                    const buyerKey = findBuyerKeyByTicketId(response.data.ticketId) || findBuyerByQrCode(qrData)
                    if (buyerKey) {
                        setValidatedTickets((prev) => new Set([...prev, buyerKey]))
                    }
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

    const findBuyerByQrCode = (qrData: string): string | null => {
        for (const buyer of buyers) {
            const key = `${buyer.customerName}-${buyer.paymentDate}`
            if (qrData.includes(buyer.customerName) || qrData.includes(key)) {
                return key
            }
        }
        return null
    }

    const findBuyerKeyByTicketId = (ticketId?: string | null): string | null => {
        if (!ticketId) {
            return null
        }
        const buyer = buyers.find((b) => b.ticketId === ticketId)
        if (!buyer) {
            return null
        }
        return `${buyer.customerName}-${buyer.paymentDate}`
    }

    const handleValidateTicket = async (buyer: TEventListBuyers) => {
        if (!buyer.ticketId) {
            Toast.error("Não foi possível validar este ingresso")
            return
        }

        try {
            const response = await validateTicketById({ ticketId: buyer.ticketId })
            if (response?.success && response?.data) {
                if (response.data.isValid) {
                    const key = `${buyer.customerName}-${buyer.paymentDate}`
                    setValidatedTickets((prev) => new Set([...prev, key]))
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

    const handleOpenConfirmValidate = (buyer: TEventListBuyers) => {
        setConfirmValidateDialog({ open: true, buyer })
    }

    const handleViewMoreInfo = (buyer: TEventListBuyers) => {
        setBuyerInfoDialog({ open: true, buyer })
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
                                                <div className="mt-4 p-4 rounded-lg bg-psi-primary/5 border border-psi-primary/20">
                                                    <p className="text-sm font-medium text-psi-dark mb-2">{selectedEvent.name}</p>
                                                    {/* {selectedEvent.location && (
                                                        <p className="text-xs text-psi-dark/60 flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {selectedEvent.location}
                                                        </p>
                                                    )} */}
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
                                                <h2 className="text-lg font-medium text-psi-dark mb-4">Estatísticas</h2>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-psi-primary/5">
                                                        <span className="text-sm text-psi-dark/70">Total de ingressos</span>
                                                        <span className="text-lg font-medium text-psi-primary">{validationStats.total}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                                                        <span className="text-sm text-psi-dark/70 flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            Validados
                                                        </span>
                                                        <span className="text-lg font-medium text-green-600">{validationStats.validated}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                                                        <span className="text-sm text-psi-dark/70 flex items-center gap-2">
                                                            <CircleMinus className="h-4 w-4 text-yellow-500" />
                                                            Pendentes
                                                        </span>
                                                        <span className="text-lg font-medium text-yellow-500">{validationStats.remaining}</span>
                                                    </div>
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
                                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                            <div className="mb-4">
                                                <p className="text-sm font-medium text-psi-dark">Leitura do QR Code</p>
                                                <p className="text-xs text-psi-dark/60">
                                                    {scanFeedback || "Aponte a câmera para o QR Code. Chegue mais perto e mantenha o celular firme."}
                                                </p>
                                            </div>
                                            <div
                                                id={scannerId}
                                                ref={scannerContainerRef}
                                                className="w-full"
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
                                                ) : filteredBuyers.length === 0 ? (
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
                                                                {filteredBuyers.map((buyer: TEventListBuyers, index: number) => {
                                                                    const key = `${buyer.customerName}-${buyer.paymentDate}`
                                                                    const isValidated = validatedTickets.has(key)
                                                                    const isCancelled = buyer.status === "CANCELLED"
                                                                    const validatedAt = buyer.validationInfo?.validatedAt
                                                                    const validatedByOrganizer = buyer.validationInfo?.validatedByOrganizer
                                                                    const validatedByText = validatedByOrganizer
                                                                        ? "Organizador"
                                                                        : buyer.validationInfo?.name
                                                                            ? buyer.validationInfo.name
                                                                            : "Equipe"
                                                                    const validatedWhenText = validatedAt ? DateUtils.formatDate(validatedAt, "DD/MM/YYYY HH:mm") : ""
                                                                    const validatedLocationText = buyer.validationInfo?.location ? ` • ${buyer.validationInfo.location}` : ""
                                                                    
                                                                    return (
                                                                        <TableRow key={index}>
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

                                                                                    {buyer.validationInfo && !isCancelled && (
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
                                                                                {buyer.eventDates.map((date) => DateUtils.formatDate(date, "DD/MM/YYYY")).join(", ")}
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
                                            <p className="text-sm font-medium text-psi-dark">
                                                {buyerInfoDialog.buyer.eventDates.map((date) => DateUtils.formatDate(date, "DD/MM/YYYY")).join(", ")}
                                            </p>
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
                                        <p className="text-xs text-psi-dark/60">Validação</p>
                                        <div className="rounded-lg border border-psi-primary/10 bg-white p-3">
                                            {buyerInfoDialog.buyer.validationInfo ? (
                                                <div className="space-y-2">
                                                    <div className="flex flex-wrap items-center gap-2 text-sm text-psi-dark/80">
                                                        <Badge variant="outline">
                                                            {buyerInfoDialog.buyer.validationInfo.validatedByOrganizer ? "Organizador" : "Equipe"}
                                                        </Badge>
                                                        <span>
                                                            {buyerInfoDialog.buyer.validationInfo.validatedAt
                                                                ? DateUtils.formatDate(buyerInfoDialog.buyer.validationInfo.validatedAt, "DD/MM/YYYY HH:mm")
                                                                : "-"}
                                                        </span>
                                                    </div>

                                                    <div className="text-xs text-psi-dark/70">
                                                        <span className="font-medium text-psi-dark">Método:</span>{" "}
                                                        {buyerInfoDialog.buyer.validationInfo.method === "qr-scan"
                                                            ? "Câmera"
                                                            : buyerInfoDialog.buyer.validationInfo.method === "qr-image"
                                                                ? "Foto"
                                                                : buyerInfoDialog.buyer.validationInfo.method === "button"
                                                                    ? "Botão"
                                                                    : "-"}
                                                    </div>

                                                    {!buyerInfoDialog.buyer.validationInfo.validatedByOrganizer && (
                                                        <div className="grid gap-3 sm:grid-cols-2 text-xs text-psi-dark/70">
                                                            <div>
                                                                <span className="font-medium text-psi-dark">Nome:</span>{" "}
                                                                {buyerInfoDialog.buyer.validationInfo.name || "-"}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-psi-dark">Local:</span>{" "}
                                                                {buyerInfoDialog.buyer.validationInfo.location || "-"}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-psi-dark">IP:</span>{" "}
                                                                {buyerInfoDialog.buyer.validationInfo.ip || "-"}
                                                            </div>
                                                            <div>
                                                                <span className="font-medium text-psi-dark">Código do link de validação:</span>{" "}
                                                                {buyerInfoDialog.buyer.validationInfo.code || "-"}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <p className="text-sm text-psi-dark/60">Ainda não validado.</p>
                                            )}
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
