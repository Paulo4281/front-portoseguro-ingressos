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
import { QrCode, Link2, Trash2, Users, Scan, CheckCircle2, XCircle, Calendar, Ticket, Search, MoreVertical, Check, Info } from "lucide-react"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { Toast } from "@/components/Toast/Toast"
import { useEventFindByUserId } from "@/hooks/Event/useEventFindByUserId"
import { useEventListBuyers } from "@/hooks/Event/useEventListBuyers"
import type { TEvent, TEventListBuyers } from "@/types/Event/TEvent"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventCache } from "@/hooks/Event/useEventCache"
import { TicketService } from "@/services/Ticket/TicketService"
import { useTicketScanFind } from "@/hooks/TicketScan/useTicketScanFind"
import { useTicketScanCreate } from "@/hooks/TicketScan/useTicketScanCreate"
import { useTicketScanDelete } from "@/hooks/TicketScan/useTicketScanDelete"
import { TicketScanCreateLinkValidator, type TTicketScanCreateLinkForm } from "@/validators/TicketScan/TicketScanValidator"
import { useTicketUpdateExpAt } from "@/hooks/TicketScan/useTicketUpdateExpAt"
import { useTicketScanUpdatePassword } from "@/hooks/TicketScan/useTicketScanUpdatePassword"
import { useTicketScanSessionDeleteByOrganizer } from "@/hooks/TicketScanSession/useTicketScanSessionDeleteByOrganizer"
import { TicketScanUpdateExpAtValidator, TicketScanUpdatePasswordValidator, type TTicketScanUpdateExpAtForm, type TTicketScanUpdatePasswordForm } from "@/validators/TicketScan/TicketScanValidator"
import type { TTicketScanPublic, TTicketScanSessionPublic } from "@/types/TicketScan/TTicketScan"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const QrScannerPannel = () => {
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const [isScanning, setIsScanning] = useState(false)
    const [createLinkDialogOpen, setCreateLinkDialogOpen] = useState(false)
    const [deleteLinkDialog, setDeleteLinkDialog] = useState<{ open: boolean; linkId: string }>({ open: false, linkId: "" })
    const [validatedTickets, setValidatedTickets] = useState<Set<string>>(new Set())
    const [searchQuery, setSearchQuery] = useState("")
    
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const scannerContainerRef = useRef<HTMLDivElement>(null)
    const [scannerId] = useState(() => `qr-reader-${Date.now()}`)

    const { data: eventsData, isLoading: isLoadingEvents } = useEventCache()

    const { data: buyersData, isLoading: isLoadingBuyers, refetch: refetchBuyers } = useEventListBuyers({
        eventId: selectedEventId,
        enabled: !!selectedEventId
    })

    const [events, setEvents] = useState<TEvent[]>([])
    const [buyers, setBuyers] = useState<TEventListBuyers[]>([])

    useEffect(() => {
        if (eventsData?.data) {
            setEvents(eventsData.data)
        }
    }, [eventsData])

    useEffect(() => {
        if (buyersData?.data) {
            setBuyers(buyersData.data)
        }
    }, [buyersData])

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
        const total = filteredBuyers.length
        const validated = filteredBuyers.filter((buyer: TEventListBuyers) => {
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

        setIsScanning(true)
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!scannerContainerRef.current) {
            setIsScanning(false)
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
                }
            )
        } catch (error) {
            console.error("Erro ao iniciar scanner:", error)
            setIsScanning(false)
            Toast.error("Erro ao iniciar a câmera. Verifique as permissões.")
        }
    }

    const handleStopScan = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current?.clear()
                scannerRef.current = null
                setIsScanning(false)
            }).catch((error) => {
                console.error("Erro ao parar scanner:", error)
            })
        }
    }

    const handleScanSuccess = async (qrData: string) => {
        handleStopScan()
        
        try {
            const response = await TicketService.scanWithData(qrData)
            if (response?.success && response?.data) {
                const scanResponse = response.data
                
                if (scanResponse.status === "VALID") {
                    const buyerKey = findBuyerByQrCode(qrData)
                    if (buyerKey) {
                        setValidatedTickets(prev => new Set([...prev, buyerKey]))
                        Toast.success("Ingresso validado com sucesso!")
                        refetchBuyers()
                    } else {
                        Toast.success("Ingresso válido, mas não encontrado na lista deste evento")
                    }
                } else {
                    Toast.error(scanResponse.description || "Ingresso inválido")
                }
            } else {
                Toast.error("Erro ao validar ingresso")
            }
        } catch (error) {
            console.error("Erro ao escanear:", error)
            Toast.error("Erro ao validar ingresso")
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

    const handleValidateTicket = (buyer: TEventListBuyers) => {
        const key = `${buyer.customerName}-${buyer.paymentDate}`
        setValidatedTickets(prev => new Set([...prev, key]))
        Toast.success(`Ingresso de ${buyer.customerName} validado com sucesso!`)
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

    const [selectedEvent, setSelectedEvent] = useState<TEvent | null>(null)

    useEffect(() => {
        if (selectedEventId) {
            const event = events?.find(e => e.id === selectedEventId)
            setSelectedEvent(event || null)
        }
    }, [selectedEventId, events])

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[80px]">
                <div className="mx-auto space-y-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-psi-primary">Validar Ingressos</h1>
                            <p className="text-sm text-psi-dark/60 mt-1">Escaneie os QR codes dos ingressos para validar a entrada dos participantes</p>
                        </div>
                        <div className="flex flex-col w-full lg:w-auto lg:flex-row gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setCreateLinkDialogOpen(true)}
                                disabled={!selectedEventId}
                                className="w-full lg:w-auto"
                            >
                                <Link2 className="h-4 w-4 mr-2" />
                                Criar link de escaneamento
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
                                    disabled={!selectedEventId}
                                    className="w-full lg:w-auto"
                                >
                                    <Scan className="h-4 w-4 mr-2" />
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
                                            <h2 className="text-lg font-semibold text-psi-dark mb-4">Selecionar Evento</h2>
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
                                                    {selectedEvent.location && (
                                                        <p className="text-xs text-psi-dark/60 flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {selectedEvent.location}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {selectedEventId && (
                                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                                <h2 className="text-lg font-semibold text-psi-dark mb-4">Estatísticas</h2>
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-psi-primary/5">
                                                        <span className="text-sm text-psi-dark/70">Total de ingressos</span>
                                                        <span className="text-lg font-semibold text-psi-primary">{validationStats.total}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                                                        <span className="text-sm text-psi-dark/70 flex items-center gap-2">
                                                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                                                            Validados
                                                        </span>
                                                        <span className="text-lg font-semibold text-green-600">{validationStats.validated}</span>
                                                    </div>
                                                    <div className="flex items-center justify-between p-3 rounded-lg bg-orange-50">
                                                        <span className="text-sm text-psi-dark/70 flex items-center gap-2">
                                                            <XCircle className="h-4 w-4 text-orange-600" />
                                                            Pendentes
                                                        </span>
                                                        <span className="text-lg font-semibold text-orange-600">{validationStats.remaining}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {scanLinks.length > 0 && (
                                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                                <h2 className="text-lg font-semibold text-psi-dark mb-4">Links de Escaneamento</h2>
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
                                                                    className="text-sm font-semibold underline cursor-pointer text-psi-dark/70 truncate text-left outline-none focus-visible:ring-2 focus-visible:ring-psi-primary transition select-text hover:underline w-full"
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
                                                                            <Users className="h-4 w-4 mr-2" />
                                                                            Ver conectados ({currentUsers})
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleOpenUpdatePassword(link.id)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <QrCode className="h-4 w-4 mr-2" />
                                                                            Alterar senha
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => handleOpenUpdateExpAt(link.id, link.expiresAt)}
                                                                            className="cursor-pointer"
                                                                        >
                                                                            <Calendar className="h-4 w-4 mr-2" />
                                                                            Alterar expiração
                                                                        </DropdownMenuItem>
                                                                        <DropdownMenuItem
                                                                            onClick={() => setDeleteLinkDialog({ open: true, linkId: link.id })}
                                                                            className="cursor-pointer text-destructive"
                                                                        >
                                                                            <Trash2 className="h-4 w-4 mr-2" />
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
                                                    <h2 className="text-lg font-semibold text-psi-dark">Lista de Compradores</h2>
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
                                                                    
                                                                    return (
                                                                        <TableRow key={index}>
                                                                            <TableCell>
                                                                                {isValidated ? (
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
                                                                                        {!isValidated && (
                                                                                            <DropdownMenuItem
                                                                                                onClick={() => handleValidateTicket(buyer)}
                                                                                                className="cursor-pointer"
                                                                                            >
                                                                                                <Check className="h-4 w-4 mr-2" />
                                                                                                Validar
                                                                                            </DropdownMenuItem>
                                                                                        )}
                                                                                        <DropdownMenuItem
                                                                                            onClick={() => handleViewMoreInfo(buyer)}
                                                                                            className="cursor-pointer"
                                                                                        >
                                                                                            <Info className="h-4 w-4 mr-2" />
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
                </div>
            </div>
        </Background>
    )
}

export {
    QrScannerPannel
}
