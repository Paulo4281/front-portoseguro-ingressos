"use client"

import { useState, useMemo } from "react"
import React from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
    MessageSquare,
    Search,
    ChevronDown,
    ChevronUp,
    Send,
    CheckCircle2,
    Clock,
    XCircle,
    Image as ImageIcon,
    ZoomIn,
    X
} from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { FieldError } from "@/components/FieldError/FieldError"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useSupportFindAdmin } from "@/hooks/Support/useSupportFindAdmin"
import { useSupportReply } from "@/hooks/Support/useSupportReply"
import { useSupportUpdateStatus } from "@/hooks/Support/useSupportUpdateStatus"
import { Toast } from "@/components/Toast/Toast"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { formatEventDate } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import type { TSupportSubject, TSupportStatus } from "@/types/Support/TSupport"
import { useEventFindById } from "@/hooks/Event/useEventFindById"
import Link from "next/link"

const SupportReplyValidator = z.object({
    answer: z.string()
        .min(1, { error: "A resposta é obrigatória" })
        .max(1000, { error: "A resposta deve ter no máximo 1000 caracteres" })
})

type TSupportReplyForm = z.infer<typeof SupportReplyValidator>

const subjectLabels: Record<TSupportSubject, string> = {
    ACCOUNT_ISSUES: "Problemas com a conta",
    PAYMENT_ISSUES: "Problemas com pagamentos",
    EVENT_MANAGEMENT: "Gerenciamento de eventos",
    EVENT_POSTPONEMENT: "Postergação de eventos",
    EVENT_CANCELLATION: "Cancelamento de eventos",
    TICKET_SALES: "Vendas de ingressos",
    TECHNICAL_ISSUES: "Problemas técnicos",
    FEATURE_REQUEST: "Solicitação de funcionalidade",
    OTHER: "Outro"
}

const statusLabels: Record<TSupportStatus, string> = {
    PENDING: "Pendente",
    NOT_SOLVED: "Não Resolvido",
    SOLVED: "Resolvido"
}

const SupportAdminPannel = () => {
    const [filters, setFilters] = useState<{
        status?: TSupportStatus
        subject?: TSupportSubject
        userId?: string
    }>({})
    const [offset, setOffset] = useState(0)
    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})
    const [replyDialog, setReplyDialog] = useState<{
        open: boolean
        supportId: string
        supportCode: string
    }>({
        open: false,
        supportId: "",
        supportCode: ""
    })
    const [imageModal, setImageModal] = useState<{
        open: boolean
        src: string
        alt: string
    }>({
        open: false,
        src: "",
        alt: ""
    })

    const limit = 30
    const currentPage = Math.floor(offset / limit) + 1

    const { data, isLoading, refetch } = useSupportFindAdmin({
        offset,
        ...filters
    })

    const { mutateAsync: replySupport, isPending: isReplying } = useSupportReply()
    const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useSupportUpdateStatus()

    const supports = useMemo(() => {
        if (data?.data?.data && Array.isArray(data.data.data)) {
            return data.data.data
        }
        return []
    }, [data])

    const total = data?.data?.total || 0
    const totalPages = total > 0 ? Math.ceil(total / limit) : 0

    const form = useForm<TSupportReplyForm>({
        resolver: zodResolver(SupportReplyValidator),
        defaultValues: {
            answer: ""
        }
    })

    const handleFilterChange = (key: keyof typeof filters, value: string | undefined) => {
        setFilters(prev => ({
            ...prev,
            [key]: value || undefined
        }))
        setOffset(0)
    }

    const handleReply = async (data: TSupportReplyForm) => {
        try {
            const response = await replySupport({
                id: replyDialog.supportId,
                answer: data.answer
            })

            if (response?.success) {
                Toast.success("Resposta enviada com sucesso!")
                form.reset()
                setReplyDialog({ open: false, supportId: "", supportCode: "" })
                refetch()
            }
        } catch (error) {
            console.error("Erro ao responder suporte:", error)
        }
    }

    const handleUpdateStatus = async (supportId: string, status: TSupportStatus) => {
        try {
            const response = await updateStatus({
                id: supportId,
                status
            })

            if (response?.success) {
                Toast.success("Status atualizado com sucesso!")
                refetch()
            }
        } catch (error) {
            console.error("Erro ao atualizar status:", error)
        }
    }

    const toggleRow = (supportId: string) => {
        setOpenRows(prev => ({
            ...prev,
            [supportId]: !prev[supportId]
        }))
    }

    const parseAdditionalInfo = (additionalInfo: any): Record<string, any> | null => {
        if (!additionalInfo) return null
        try {
            if (typeof additionalInfo === "string") {
                return JSON.parse(additionalInfo)
            }
            return additionalInfo
        } catch {
            return null
        }
    }

    return (
        <>
            <Background variant="light" className="min-h-screen py-10 mt-[80px] container">
                <section className="space-y-8 px-4
                sm:px-6
                lg:px-8">
                    <div className="space-y-4">
                        <div className="space-y-3">
                            <h1 className="text-3xl font-medium text-psi-primary
                            sm:text-4xl">
                                Gerenciar Suporte
                            </h1>
                            <p className="text-psi-dark/70 max-w-3xl">
                                Visualize e gerencie todos os chamados de suporte da plataforma. Responda aos usuários e atualize o status dos chamados.
                            </p>
                        </div>
                    </div>

                    <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 shadow-lg shadow-black/5 p-6 space-y-6">
                        <div className="flex flex-col gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between">
                            <div className="flex flex-col gap-4
                            sm:flex-row
                            sm:max-w-2xl">
                                <div className="flex-1">
                                    <Input
                                        placeholder="Buscar por ID do usuário..."
                                        value={filters.userId || ""}
                                        onChange={(e) => handleFilterChange("userId", e.target.value || undefined)}
                                        icon={Search}
                                    />
                                </div>
                                <div className="w-full
                                sm:w-[200px]">
                                    <Select
                                        value={filters.status || "all"}
                                        onValueChange={(value) => handleFilterChange("status", value === "all" ? undefined : value as TSupportStatus)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os status</SelectItem>
                                            <SelectItem value="PENDING">Pendente</SelectItem>
                                            <SelectItem value="NOT_SOLVED">Não Resolvido</SelectItem>
                                            <SelectItem value="SOLVED">Resolvido</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="w-full
                                sm:w-[200px]">
                                    <Select
                                        value={filters.subject || "all"}
                                        onValueChange={(value) => handleFilterChange("subject", value === "all" ? undefined : value as TSupportSubject)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Assunto" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os assuntos</SelectItem>
                                            {Object.entries(subjectLabels).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="space-y-4">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <Skeleton key={index} className="h-20 w-full rounded-3xl" />
                            ))}
                        </div>
                    ) : (
                        <div className="rounded-3xl border border-[#E4E6F0] bg-white/90 shadow-lg shadow-black/5 overflow-hidden">
                            <div className="overflow-x-auto w-full">
                                <Table className="w-full">
                                    <TableHeader>
                                        <TableRow className="border-b border-psi-dark/10 hover:bg-transparent bg-psi-dark/2">
                                            <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider w-[50px]"></TableHead>
                                            <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Código</TableHead>
                                            <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Usuário</TableHead>
                                            <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Assunto</TableHead>
                                            <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Status</TableHead>
                                            <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Data</TableHead>
                                            <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider text-right">Ações</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {supports.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="h-40 text-center">
                                                    <div className="flex flex-col items-center justify-center gap-4 py-8">
                                                        <div className="h-16 w-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                                            <MessageSquare className="h-8 w-8 text-psi-primary/60" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-base font-medium text-psi-dark">Nenhum chamado encontrado</p>
                                                            <p className="text-sm text-psi-dark/50">Tente ajustar os filtros de busca.</p>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            supports.map((support) => {
                                                const isOpen = openRows[support.id] || false
                                                const user = support.User

                                                return (
                                                    <React.Fragment key={support.id}>
                                                        <TableRow className="border-b border-psi-dark/5 hover:bg-psi-dark/3 transition-colors">
                                                            <TableCell className="py-4 px-6">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => toggleRow(support.id)}
                                                                    className="h-8 w-8"
                                                                >
                                                                    {isOpen ? (
                                                                        <ChevronUp className="h-4 w-4" />
                                                                    ) : (
                                                                        <ChevronDown className="h-4 w-4" />
                                                                    )}
                                                                </Button>
                                                            </TableCell>
                                                            <TableCell className="py-4 px-6">
                                                                <span className="font-mono text-sm font-medium text-psi-primary">
                                                                    {support.code}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="py-4 px-6">
                                                                {user ? (
                                                                    <div className="space-y-1">
                                                                        <p className="font-medium text-psi-dark text-sm">
                                                                            {user.firstName} {user.lastName}
                                                                        </p>
                                                                        <p className="text-xs text-psi-dark/50">
                                                                            {user.email}
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <span className="text-sm text-psi-dark/50">N/A</span>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-4 px-6">
                                                                <span className="text-sm text-psi-dark">
                                                                    {subjectLabels[support.subject]}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="py-4 px-6">
                                                                {support.status === "SOLVED" ? (
                                                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                                                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                        {statusLabels[support.status]}
                                                                    </Badge>
                                                                ) : support.status === "NOT_SOLVED" ? (
                                                                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
                                                                        <XCircle className="h-3 w-3 mr-1" />
                                                                        {statusLabels[support.status]}
                                                                    </Badge>
                                                                ) : (
                                                                    <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">
                                                                        <Clock className="h-3 w-3 mr-1" />
                                                                        {statusLabels[support.status]}
                                                                    </Badge>
                                                                )}
                                                            </TableCell>
                                                            <TableCell className="py-4 px-6">
                                                                <span className="text-xs text-psi-dark/70">
                                                                    {formatEventDate(support.createdAt, "DD/MM/YYYY [às] HH:mm")}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell className="py-4 px-6 text-right">
                                                                <div className="flex items-center justify-end gap-2">
                                                                    {!support.answer && (
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={() => setReplyDialog({
                                                                                open: true,
                                                                                supportId: support.id,
                                                                                supportCode: support.code
                                                                            })}
                                                                            disabled={isReplying}
                                                                        >
                                                                            <Send className="h-3 w-3 mr-1" />
                                                                            Responder
                                                                        </Button>
                                                                    )}
                                                                    <Select
                                                                        value={support.status}
                                                                        onValueChange={(value) => handleUpdateStatus(support.id, value as TSupportStatus)}
                                                                        disabled={isUpdatingStatus}
                                                                    >
                                                                        <SelectTrigger className="w-[140px]">
                                                                            <SelectValue />
                                                                        </SelectTrigger>
                                                                        <SelectContent>
                                                                            <SelectItem value="PENDING">Pendente</SelectItem>
                                                                            <SelectItem value="NOT_SOLVED">Não Resolvido</SelectItem>
                                                                            <SelectItem value="SOLVED">Resolvido</SelectItem>
                                                                        </SelectContent>
                                                                    </Select>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                        {isOpen && (
                                                            <TableRow className="bg-psi-dark/2">
                                                                <TableCell colSpan={7} className="p-6">
                                                                    <SupportDetails
                                                                        support={support}
                                                                        parseAdditionalInfo={parseAdditionalInfo}
                                                                        setImageModal={setImageModal}
                                                                    />
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </React.Fragment>
                                                )
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            {totalPages > 1 && (
                                <div className="flex items-center justify-between px-6 py-4 border-t border-psi-dark/10 bg-psi-dark/2">
                                    <p className="text-sm text-psi-dark/70">
                                        Mostrando {offset + 1} a {Math.min(offset + limit, total)} de {total} chamados
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            variant="outline"
                                            onClick={() => setOffset(Math.max(0, offset - limit))}
                                            disabled={offset === 0}
                                        >
                                            Anterior
                                        </Button>
                                        <Button
                                            variant="outline"
                                            onClick={() => setOffset(Math.min((totalPages - 1) * limit, offset + limit))}
                                            disabled={currentPage >= totalPages}
                                        >
                                            Próxima
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </Background>

            <Dialog open={replyDialog.open} onOpenChange={(open) => {
                if (!open) {
                    setReplyDialog({ open: false, supportId: "", supportCode: "" })
                    form.reset()
                }
            }}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Responder Chamado #{replyDialog.supportCode}</DialogTitle>
                        <DialogDescription>
                            Digite sua resposta para o usuário. Esta resposta será enviada por email.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={form.handleSubmit(handleReply)} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-psi-dark/70 mb-2">
                                Resposta *
                            </label>
                            <Controller
                                name="answer"
                                control={form.control}
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        placeholder="Digite sua resposta..."
                                        className="min-h-[150px]"
                                        maxLength={1000}
                                        required
                                    />
                                )}
                            />
                            <FieldError message={form.formState.errors.answer?.message || ""} />
                            <p className="text-xs text-psi-dark/50 mt-1">
                                {form.watch("answer")?.length || 0}/1000 caracteres
                            </p>
                        </div>
                        <div className="flex items-center justify-end gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setReplyDialog({ open: false, supportId: "", supportCode: "" })
                                    form.reset()
                                }}
                                disabled={isReplying}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                disabled={isReplying}
                            >
                                {isReplying ? (
                                    <LoadingButton message="Enviando..." />
                                ) : (
                                    <>
                                        <Send className="h-4 w-4" />
                                        Enviar Resposta
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            <Dialog open={imageModal.open} onOpenChange={(open) => {
                if (!open) {
                    setImageModal({ open: false, src: "", alt: "" })
                }
            }}>
                <DialogContent className="max-w-4xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center justify-between">
                            <span>Imagem do Chamado</span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex items-center justify-center">
                        <img
                            src={imageModal.src}
                            alt={imageModal.alt}
                            className="max-w-full h-auto rounded-lg"
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}

type TSupportDetailsProps = {
    support: any
    parseAdditionalInfo: (info: any) => Record<string, any> | null
    setImageModal: (modal: { open: boolean; src: string; alt: string }) => void
}

const SupportDetails = ({ support, parseAdditionalInfo, setImageModal }: TSupportDetailsProps) => {
    const additionalInfo = parseAdditionalInfo(support.additionalInfo)
    const eventId = additionalInfo?.eventId
    const { data: eventData } = useEventFindById(eventId || "temp")

    return (
        <div className="space-y-4">
            <div>
                <h4 className="text-sm font-medium text-psi-dark mb-2">Descrição</h4>
                <p className="text-sm text-psi-dark/70 whitespace-pre-wrap">
                    {support.description}
                </p>
            </div>
            {additionalInfo && Object.keys(additionalInfo).length > 0 && (
                <div className="p-3 rounded-lg border border-psi-primary/20 bg-psi-primary/5">
                    <h4 className="text-sm font-medium text-psi-dark mb-2">Informações Adicionais</h4>
                    <div className="space-y-1">
                        {eventId && eventId !== "temp" && (
                            <div className="text-xs text-psi-dark/70">
                                <span className="font-medium">Evento: </span>
                                {eventData?.data ? (
                                    <Link 
                                        href={`/ver-evento/${eventData.data.slug}`}
                                        target="_blank"
                                        className="text-psi-primary hover:underline"
                                    >
                                        {eventData.data.name}
                                    </Link>
                                ) : (
                                    <span className="text-psi-dark/50">Carregando...</span>
                                )}
                            </div>
                        )}
                        {Object.entries(additionalInfo).map(([key, value]) => {
                            if (key === "eventId") return null
                            return (
                                <div key={key} className="text-xs text-psi-dark/70">
                                    <span className="font-medium">{key}: </span>
                                    <span>{String(value)}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
            {support.image && (
                <div>
                    <h4 className="text-sm font-medium text-psi-dark mb-2">Imagem</h4>
                    <div className="relative inline-block">
                        <img
                            src={ImageUtils.getSupportImageUrl(support.image)}
                            alt="Imagem do chamado"
                            className="max-w-xs h-auto rounded-lg border border-psi-primary/20 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setImageModal({
                                open: true,
                                src: ImageUtils.getSupportImageUrl(support.image!),
                                alt: "Imagem do chamado"
                            })}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 h-8 w-8 bg-white/90 hover:bg-white"
                            onClick={() => setImageModal({
                                open: true,
                                src: ImageUtils.getSupportImageUrl(support.image!),
                                alt: "Imagem do chamado"
                            })}
                        >
                            <ZoomIn className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
            {support.answer && (
                <div className="pt-4 border-t border-psi-dark/10">
                    <div className="flex items-center gap-2 mb-2">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                        <h4 className="text-sm font-medium text-psi-dark">Resposta do Suporte</h4>
                    </div>
                    <p className="text-sm text-psi-dark/70 whitespace-pre-wrap">
                        {support.answer}
                    </p>
                    {support.answerAt && (
                        <p className="text-xs text-psi-dark/50 mt-2">
                            Respondido em {formatEventDate(support.answerAt, "DD/MM/YYYY [às] HH:mm")}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}

export {
    SupportAdminPannel
}
