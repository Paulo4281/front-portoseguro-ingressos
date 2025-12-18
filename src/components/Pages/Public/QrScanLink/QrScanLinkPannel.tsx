"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import { Input } from "@/components/Input/Input"
import { QrCode, Scan, Lock, Search, CheckCircle2, XCircle, Info, MoreVertical, Check, LogOut, ImageUp } from "lucide-react"
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
import type { TEventListBuyers } from "@/types/Event/TEvent"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
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

    const { mutateAsync: authenticateSession, isPending: isAuthenticating } = useTicketScanSessionCreate()
    const { mutateAsync: logoutSession, isPending: isLoggingOut } = useTicketScanSessionDelete()
    const { mutateAsync: validateTicketQrCode, isPending: isValidatingTicketQrCode } = useTicketValidateQrcodeWorker()
    const { mutateAsync: validateTicketById, isPending: isValidatingTicketById } = useTicketValidateWorker()

    const { data: buyersData, isLoading: isLoadingBuyers, isError: isBuyersError, refetch: refetchBuyers } = useEventListBuyersSession(isAuthenticated)

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
    }, [pubId])

    useEffect(() => {
        const next = new Set<string>()
        buyers.forEach((buyer) => {
            if (buyer.status === "USED" || !!buyer.validationInfo) {
                next.add(`${buyer.customerName}-${buyer.paymentDate}`)
            }
        })
        setValidatedTickets(next)
    }, [buyers])

    const filteredBuyers = useMemo(() => {
        if (!searchQuery) return buyers

        const query = searchQuery.toLowerCase()
        return buyers.filter((buyer: TEventListBuyers) =>
            buyer.customerName.toLowerCase().includes(query) ||
            buyer.ticketTypeName?.toLowerCase().includes(query) ||
            buyer.eventDates.some((date) => date.toLowerCase().includes(query))
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
                                <h1 className="text-2xl font-bold text-psi-dark">Link inválido</h1>
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
                                <h1 className="text-2xl font-bold text-psi-dark">Acesso Restrito</h1>
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
                            <h1 className="text-3xl font-bold text-psi-primary">Validar Ingressos</h1>
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
                                <LogOut className="h-4 w-4 mr-2" />
                                Sair
                            </Button>
                            <Button
                                variant="outline"
                                onClick={handlePickQrImage}
                                disabled={isDecodingQrImage}
                                className="w-full lg:w-auto"
                            >
                                <ImageUp className="h-4 w-4 mr-2" />
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
                                    <Scan className="h-4 w-4 mr-2" />
                                    Escanear QR Code
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

                        {isScanning && (
                            <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                                <div className="mb-4">
                                    <p className="text-sm font-semibold text-psi-dark">Leitura do QR Code</p>
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
                    </div>

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
                                                                        <Check className="h-4 w-4 mr-2" />
                                                                        {isValidatingTicketById ? "Validando..." : "Validar"}
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
                                                <span className="font-semibold text-psi-dark">Método:</span>{" "}
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
                                                        <span className="font-semibold text-psi-dark">Nome:</span>{" "}
                                                        {buyerInfoDialog.buyer.validationInfo.name || "-"}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-psi-dark">Local:</span>{" "}
                                                        {buyerInfoDialog.buyer.validationInfo.location || "-"}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-psi-dark">IP:</span>{" "}
                                                        {buyerInfoDialog.buyer.validationInfo.ip || "-"}
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-psi-dark">Código do link de validação:</span>{" "}
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
