"use client"

import { useMemo, useState } from "react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/Input/Input"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Pagination } from "@/components/Pagination/Pagination"
import { Toast } from "@/components/Toast/Toast"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { useCampaignAdminList } from "@/hooks/Campaign/useCampaignAdminList"
import { useCampaignAdminSendNow } from "@/hooks/Campaign/useCampaignAdminSendNow"
import { useCampaignAdminSendSingleLog } from "@/hooks/Campaign/useCampaignAdminSendSingleLog"
import { useCampaignAdminUpdateLogStatus } from "@/hooks/Campaign/useCampaignAdminUpdateLogStatus"
import { useCampaignAdminUpdateLogStatusBulk } from "@/hooks/Campaign/useCampaignAdminUpdateLogStatusBulk"
import { useWebpushCampaignAdminList } from "@/hooks/WebpushCampaign/useWebpushCampaignAdminList"
import { useWebpushCampaignAdminSendNow } from "@/hooks/WebpushCampaign/useWebpushCampaignAdminSendNow"
import { useWebpushCampaignAdminSendSingleLog } from "@/hooks/WebpushCampaign/useWebpushCampaignAdminSendSingleLog"
import { useWebpushCampaignAdminUpdateLogStatus } from "@/hooks/WebpushCampaign/useWebpushCampaignAdminUpdateLogStatus"
import { useWebpushCampaignAdminUpdateLogStatusBulk } from "@/hooks/WebpushCampaign/useWebpushCampaignAdminUpdateLogStatusBulk"
import type { TCampaignAdmin, TCampaignAdminLog, TCampaignAdminStatus } from "../../../../types/Campaign/TCampaignAdmin"
import type { TWebpushCampaignAdmin, TWebpushCampaignAdminLog, TWebpushCampaignAdminStatus } from "../../../../types/Webpush/TWebpushCampaignAdmin"
import type { TCampaignLogStatus } from "@/types/CampaignLog/TCampaignLog"
import type { WebpushStatus } from "@/types/Webpush/TWebpushTypes"
import { AlertCircle, CheckCircle2, Clock, MailCheck, MailOpen, MailWarning, MailX, Send, Zap } from "lucide-react"

const limit = 30

const emailLogStatusOptions: TCampaignLogStatus[] = [
    "PENDING",
    "QUEUED",
    "PROCESSING",
    "ACCEPTED",
    "DELIVERED",
    "OPENED",
    "CLICKED",
    "FAILED",
    "BOUNCED",
    "COMPLAINED",
    "UNSUBSCRIBED"
]

const webpushLogStatusOptions: WebpushStatus[] = [
    "SENT",
    "QUEUED",
    "PROCESSING",
    "FAILED"
]

const formatDateTime = (value?: string | null) =>
    value ? DateUtils.formatDate(value, "DD/MM/YYYY HH:mm") : "-"

const emailCampaignStatusConfig: Record<TCampaignAdminStatus, { label: string; className: string }> = {
    PENDING: { label: "Pendente", className: "bg-amber-50 text-amber-600 border-amber-200" },
    PROCESSING: { label: "Processando", className: "bg-blue-50 text-blue-600 border-blue-200" },
    SENT: { label: "Enviado", className: "bg-green-50 text-green-600 border-green-200" },
    FAILED: { label: "Falhou", className: "bg-red-50 text-red-600 border-red-200" }
}

const webpushCampaignStatusConfig: Record<TWebpushCampaignAdminStatus, { label: string; className: string }> = {
    PENDING: { label: "Pendente", className: "bg-amber-50 text-amber-600 border-amber-200" },
    PROCESSING: { label: "Processando", className: "bg-blue-50 text-blue-600 border-blue-200" },
    SENT: { label: "Enviado", className: "bg-green-50 text-green-600 border-green-200" },
    FAILED: { label: "Falhou", className: "bg-red-50 text-red-600 border-red-200" }
}

const getEmailLogStatusConfig = (status: TCampaignLogStatus) => {
    switch (status) {
        case "DELIVERED":
            return { label: "Entregue", className: "bg-green-50 text-green-600 border-green-200", icon: MailCheck }
        case "FAILED":
            return { label: "Falhou", className: "bg-red-50 text-red-600 border-red-200", icon: MailX }
        case "BOUNCED":
            return { label: "Retornou", className: "bg-orange-50 text-orange-600 border-orange-200", icon: MailWarning }
        case "PENDING":
            return { label: "Pendente", className: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock }
        case "QUEUED":
            return { label: "Na fila", className: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock }
        case "PROCESSING":
            return { label: "Processando", className: "bg-blue-50 text-blue-600 border-blue-200", icon: Clock }
        case "ACCEPTED":
            return { label: "Aceito", className: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: Clock }
        case "OPENED":
            return { label: "Aberto", className: "bg-blue-50 text-blue-600 border-blue-200", icon: MailOpen }
        case "CLICKED":
            return { label: "Clicado", className: "bg-green-50 text-green-600 border-green-200", icon: MailCheck }
        case "COMPLAINED":
            return { label: "Reclamado", className: "bg-red-50 text-red-600 border-red-200", icon: AlertCircle }
        case "UNSUBSCRIBED":
            return { label: "Descadastrado", className: "bg-red-50 text-red-600 border-red-200", icon: MailX }
        default:
            return { label: status, className: "bg-gray-50 text-gray-600 border-gray-200", icon: AlertCircle }
    }
}

const getWebpushLogStatusConfig = (status: WebpushStatus) => {
    switch (status) {
        case "SENT":
            return { label: "Enviado", className: "bg-green-50 text-green-600 border-green-200", icon: CheckCircle2 }
        case "QUEUED":
            return { label: "Na fila", className: "bg-amber-50 text-amber-600 border-amber-200", icon: Clock }
        case "PROCESSING":
            return { label: "Processando", className: "bg-blue-50 text-blue-600 border-blue-200", icon: Clock }
        case "FAILED":
            return { label: "Falhou", className: "bg-red-50 text-red-600 border-red-200", icon: AlertCircle }
        default:
            return { label: status, className: "bg-gray-50 text-gray-600 border-gray-200", icon: AlertCircle }
    }
}

const AdmCrmManagerPannel = () => {
    const [activeTab, setActiveTab] = useState<"email" | "webpush">("email")
    const [filterUserId, setFilterUserId] = useState("")
    const [filterStartDate, setFilterStartDate] = useState("")
    const [filterEndDate, setFilterEndDate] = useState("")
    const [currentPageEmail, setCurrentPageEmail] = useState(1)
    const [currentPageWebpush, setCurrentPageWebpush] = useState(1)

    const [emailSelectedLogIdsByCampaign, setEmailSelectedLogIdsByCampaign] = useState<Record<string, string[]>>({})
    const [webpushSelectedLogIdsByCampaign, setWebpushSelectedLogIdsByCampaign] = useState<Record<string, string[]>>({})
    const [emailLogStatusDrafts, setEmailLogStatusDrafts] = useState<Record<string, TCampaignLogStatus>>({})
    const [webpushLogStatusDrafts, setWebpushLogStatusDrafts] = useState<Record<string, WebpushStatus>>({})
    const [emailBulkStatusByCampaign, setEmailBulkStatusByCampaign] = useState<Record<string, TCampaignLogStatus>>({})
    const [webpushBulkStatusByCampaign, setWebpushBulkStatusByCampaign] = useState<Record<string, WebpushStatus>>({})
    const [confirmSendCampaign, setConfirmSendCampaign] = useState<{
        open: boolean
        type: "email" | "webpush"
        campaignId: string
        name?: string | null
    }>({
        open: false,
        type: "email",
        campaignId: ""
    })
    const [confirmSendLog, setConfirmSendLog] = useState<{
        open: boolean
        type: "email" | "webpush"
        logId: string
        recipient?: string
    }>({
        open: false,
        type: "email",
        logId: ""
    })

    const filters = useMemo(() => ({
        userId: filterUserId.trim() || undefined,
        startDate: filterStartDate || undefined,
        endDate: filterEndDate || undefined
    }), [filterUserId, filterStartDate, filterEndDate])

    const emailOffset = (currentPageEmail - 1) * limit
    const webpushOffset = (currentPageWebpush - 1) * limit

    const {
        data: emailCampaignsData,
        isLoading: emailCampaignsLoading,
        refetch: refetchEmailCampaigns
    } = useCampaignAdminList({
        offset: emailOffset,
        userId: filters.userId,
        startDate: filters.startDate,
        endDate: filters.endDate
    })

    const {
        data: webpushCampaignsData,
        isLoading: webpushCampaignsLoading,
        refetch: refetchWebpushCampaigns
    } = useWebpushCampaignAdminList({
        offset: webpushOffset,
        userId: filters.userId,
        startDate: filters.startDate,
        endDate: filters.endDate
    })

    const { mutateAsync: sendEmailCampaignNow, isPending: isSendingEmailCampaign } = useCampaignAdminSendNow()
    const { mutateAsync: sendEmailLogNow, isPending: isSendingEmailLog } = useCampaignAdminSendSingleLog()
    const { mutateAsync: updateEmailLogStatus, isPending: isUpdatingEmailLogStatus } = useCampaignAdminUpdateLogStatus()
    const { mutateAsync: updateEmailLogStatusBulk, isPending: isUpdatingEmailLogStatusBulk } = useCampaignAdminUpdateLogStatusBulk()

    const { mutateAsync: sendWebpushCampaignNow, isPending: isSendingWebpushCampaign } = useWebpushCampaignAdminSendNow()
    const { mutateAsync: sendWebpushLogNow, isPending: isSendingWebpushLog } = useWebpushCampaignAdminSendSingleLog()
    const { mutateAsync: updateWebpushLogStatus, isPending: isUpdatingWebpushLogStatus } = useWebpushCampaignAdminUpdateLogStatus()
    const { mutateAsync: updateWebpushLogStatusBulk, isPending: isUpdatingWebpushLogStatusBulk } = useWebpushCampaignAdminUpdateLogStatusBulk()

    const emailCampaigns = emailCampaignsData?.data?.data || []
    const webpushCampaigns = webpushCampaignsData?.data?.data || []

    const emailTotalPages = Math.max(1, Math.ceil((emailCampaignsData?.data?.total || 0) / limit))
    const webpushTotalPages = Math.max(1, Math.ceil((webpushCampaignsData?.data?.total || 0) / limit))
    const isSendingCampaignConfirm = confirmSendCampaign.type === "email" ? isSendingEmailCampaign : isSendingWebpushCampaign
    const isSendingLogConfirm = confirmSendLog.type === "email" ? isSendingEmailLog : isSendingWebpushLog

    const toggleLogSelection = (type: "email" | "webpush", campaignId: string, logId: string, checked: boolean) => {
        const setState = type === "email" ? setEmailSelectedLogIdsByCampaign : setWebpushSelectedLogIdsByCampaign
        setState(prev => {
            const current = new Set(prev[campaignId] || [])
            if (checked) {
                current.add(logId)
            } else {
                current.delete(logId)
            }
            return { ...prev, [campaignId]: Array.from(current) }
        })
    }

    const toggleSelectAllLogs = (type: "email" | "webpush", campaignId: string, logIds: string[], checked: boolean) => {
        const setState = type === "email" ? setEmailSelectedLogIdsByCampaign : setWebpushSelectedLogIdsByCampaign
        setState(prev => ({
            ...prev,
            [campaignId]: checked ? logIds : []
        }))
    }

    const clearSelectedLogs = (type: "email" | "webpush", campaignId: string) => {
        const setState = type === "email" ? setEmailSelectedLogIdsByCampaign : setWebpushSelectedLogIdsByCampaign
        setState(prev => ({ ...prev, [campaignId]: [] }))
    }

    const handleSendCampaignNow = async (type: "email" | "webpush", campaignId: string) => {
        try {
            if (type === "email") {
                await sendEmailCampaignNow(campaignId)
                await refetchEmailCampaigns()
                Toast.success("Campanha de e-mail enviada para processamento")
            } else {
                await sendWebpushCampaignNow(campaignId)
                await refetchWebpushCampaigns()
                Toast.success("Campanha de webpush enviada para processamento")
            }
        } catch (error) {
            Toast.error("Erro ao enviar campanha")
        }
    }

    const handleSendSingleLog = async (type: "email" | "webpush", logId: string) => {
        try {
            if (type === "email") {
                await sendEmailLogNow(logId)
                await refetchEmailCampaigns()
                Toast.success("Log enviado com sucesso")
            } else {
                await sendWebpushLogNow(logId)
                await refetchWebpushCampaigns()
                Toast.success("Log enviado com sucesso")
            }
        } catch (error) {
            Toast.error("Erro ao enviar log")
        }
    }

    const handleUpdateLogStatus = async (type: "email" | "webpush", logId: string, status: string) => {
        try {
            if (type === "email") {
                await updateEmailLogStatus({ campaignLogId: logId, data: { status: status as TCampaignLogStatus } })
                await refetchEmailCampaigns()
                Toast.success("Status atualizado")
            } else {
                await updateWebpushLogStatus({ campaignLogId: logId, data: { status: status as WebpushStatus } })
                await refetchWebpushCampaigns()
                Toast.success("Status atualizado")
            }
        } catch (error) {
            Toast.error("Erro ao atualizar status")
        }
    }

    const handleBulkUpdateStatus = async (type: "email" | "webpush", campaignId: string) => {
        if (type === "email") {
            const selectedIds = emailSelectedLogIdsByCampaign[campaignId] || []
            const status = emailBulkStatusByCampaign[campaignId]

            if (!selectedIds.length || !status) {
                Toast.error("Selecione logs e um status")
                return
            }

            try {
                await updateEmailLogStatusBulk({ logIds: selectedIds, status })
                await refetchEmailCampaigns()
                clearSelectedLogs("email", campaignId)
                Toast.success("Status atualizado em lote")
            } catch (error) {
                Toast.error("Erro ao atualizar status em lote")
            }
            return
        }

        const selectedIds = webpushSelectedLogIdsByCampaign[campaignId] || []
        const status = webpushBulkStatusByCampaign[campaignId]

        if (!selectedIds.length || !status) {
            Toast.error("Selecione logs e um status")
            return
        }

        try {
            await updateWebpushLogStatusBulk({ logIds: selectedIds, status })
            await refetchWebpushCampaigns()
            clearSelectedLogs("webpush", campaignId)
            Toast.success("Status atualizado em lote")
        } catch (error) {
            Toast.error("Erro ao atualizar status em lote")
        }
    }

    const renderCampaignDetails = (campaign: TCampaignAdmin) => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm text-psi-dark/70">
            <div>
                <p className="text-xs text-psi-dark/50">Campaign ID</p>
                <p className="font-medium text-psi-dark break-all">{campaign.id}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">User ID</p>
                <p className="font-medium text-psi-dark break-all">{campaign.userId}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Template ID</p>
                <p className="font-medium text-psi-dark break-all">{campaign.templateId}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Tags</p>
                <p className="font-medium text-psi-dark break-all">{campaign.tagIds?.length ? campaign.tagIds.join(", ") : "-"}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Evento</p>
                <p className="font-medium text-psi-dark break-all">{campaign.eventId || "-"}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Cupom</p>
                <p className="font-medium text-psi-dark break-all">{campaign.couponId || "-"}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Pesquisa</p>
                <p className="font-medium text-psi-dark break-all">{campaign.opinionPollId || "-"}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Criado em</p>
                <p className="font-medium text-psi-dark">{formatDateTime(campaign.createdAt)}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Atualizado em</p>
                <p className="font-medium text-psi-dark">{formatDateTime(campaign.updatedAt)}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Iniciado por admin</p>
                <p className="font-medium text-psi-dark">{campaign.startedByAdmin ? "Sim" : "Não"}</p>
                <p className="text-xs text-psi-dark/50">{formatDateTime(campaign.startedByAdminAt)}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Iniciado por cron</p>
                <p className="font-medium text-psi-dark">{campaign.startedByCron ? "Sim" : "Não"}</p>
                <p className="text-xs text-psi-dark/50">{formatDateTime(campaign.startedByCronAt)}</p>
            </div>
        </div>
    )

    const renderWebpushCampaignDetails = (campaign: TWebpushCampaignAdmin) => (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 text-sm text-psi-dark/70">
            <div>
                <p className="text-xs text-psi-dark/50">Campaign ID</p>
                <p className="font-medium text-psi-dark break-all">{campaign.id}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">User ID</p>
                <p className="font-medium text-psi-dark break-all">{campaign.userId}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Template ID</p>
                <p className="font-medium text-psi-dark break-all">{campaign.templateId}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Tags</p>
                <p className="font-medium text-psi-dark break-all">{campaign.tagIds?.length ? campaign.tagIds.join(", ") : "-"}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Evento</p>
                <p className="font-medium text-psi-dark break-all">{campaign.eventId || "-"}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Cupom</p>
                <p className="font-medium text-psi-dark break-all">{campaign.couponId || "-"}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Criado em</p>
                <p className="font-medium text-psi-dark">{formatDateTime(campaign.createdAt)}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Atualizado em</p>
                <p className="font-medium text-psi-dark">{formatDateTime(campaign.updatedAt)}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Iniciado por admin</p>
                <p className="font-medium text-psi-dark">{campaign.startedByAdmin ? "Sim" : "Não"}</p>
                <p className="text-xs text-psi-dark/50">{formatDateTime(campaign.startedByAdminAt)}</p>
            </div>
            <div>
                <p className="text-xs text-psi-dark/50">Iniciado por cron</p>
                <p className="font-medium text-psi-dark">{campaign.startedByCron ? "Sim" : "Não"}</p>
                <p className="text-xs text-psi-dark/50">{formatDateTime(campaign.startedByCronAt)}</p>
            </div>
        </div>
    )

    const renderEmailLogs = (campaign: TCampaignAdmin) => {
        const selectedIds = emailSelectedLogIdsByCampaign[campaign.id] || []
        const bulkStatus = emailBulkStatusByCampaign[campaign.id]
        const allLogIds = campaign.logs.map((log: TCampaignAdminLog) => log.id)
        const allSelected = allLogIds.length > 0 && selectedIds.length === allLogIds.length

        return (
            <details className="rounded-lg border border-psi-dark/10 p-4 bg-white">
                <summary className="cursor-pointer text-sm font-semibold text-psi-dark flex items-center justify-between">
                    Logs ({campaign.logs.length})
                    <span className="text-xs text-psi-dark/50">Clique para {campaign.logs.length ? "expandir" : "ver"}</span>
                </summary>
                {campaign.logs.length === 0 ? (
                    <p className="text-sm text-psi-dark/60 mt-4">Nenhum log encontrado</p>
                ) : (
                    <div className="mt-4 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={(checked) => toggleSelectAllLogs("email", campaign.id, allLogIds, !!checked)}
                                />
                                <span className="text-xs text-psi-dark/60">Selecionar todos</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                <Select
                                    value={bulkStatus || ""}
                                    onValueChange={(value) => setEmailBulkStatusByCampaign(prev => ({ ...prev, [campaign.id]: value as TCampaignLogStatus }))}
                                >
                                    <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Status para lote" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {emailLogStatusOptions.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkUpdateStatus("email", campaign.id)}
                                    disabled={isUpdatingEmailLogStatusBulk}
                                >
                                    Atualizar selecionados
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => clearSelectedLogs("email", campaign.id)}
                                >
                                    Limpar seleção
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {campaign.logs.map((log: TCampaignAdminLog) => {
                                const statusConfig = getEmailLogStatusConfig(log.status)
                                const StatusIcon = statusConfig.icon
                                const draftStatus = emailLogStatusDrafts[log.id] || log.status

                                return (
                                    <div key={log.id} className="border border-psi-dark/10 rounded-lg p-3">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={selectedIds.includes(log.id)}
                                                onCheckedChange={(checked) => toggleLogSelection("email", campaign.id, log.id, !!checked)}
                                            />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge className={statusConfig.className}>
                                                        <StatusIcon className="h-3.5 w-3.5 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                    <span className="text-xs text-psi-dark/60">{log.email}</span>
                                                </div>
                                                <div className="text-xs text-psi-dark/60 space-y-1">
                                                    <p>ID: {log.id}</p>
                                                    <p>Message ID: {log.mailgunMessageId || "-"}</p>
                                                    <p>Erro: {log.errorMessage || "-"}</p>
                                                    <p>Criado em: {formatDateTime(log.createdAt)}</p>
                                                    <p>Atualizado em: {formatDateTime(log.updatedAt)}</p>
                                                    <p>Opened: {formatDateTime(log.openedAt)}</p>
                                                    <p>Clicked: {formatDateTime(log.clickedAt)}</p>
                                                    <p>Single send: {log.adminTriggeredSingleSend ? "Sim" : "Não"} {log.adminTriggeredSingleSendAt ? `• ${formatDateTime(log.adminTriggeredSingleSendAt)}` : ""}</p>
                                                    <p>Admin update: {log.adminUpdatedStatus ? "Sim" : "Não"} {log.adminUpdatedStatusAt ? `• ${formatDateTime(log.adminUpdatedStatusAt)}` : ""} {log.adminUpdatedStatusTo ? `• ${log.adminUpdatedStatusTo}` : ""}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Select
                                                    value={draftStatus}
                                                    onValueChange={(value) => setEmailLogStatusDrafts(prev => ({ ...prev, [log.id]: value as TCampaignLogStatus }))}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {emailLogStatusOptions.map(status => (
                                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdateLogStatus("email", log.id, draftStatus)}
                                                    disabled={isUpdatingEmailLogStatus}
                                                >
                                                    Atualizar status
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setConfirmSendLog({
                                                        open: true,
                                                        type: "email",
                                                        logId: log.id,
                                                        recipient: log.email
                                                    })}
                                                    disabled={log.status !== "QUEUED" || isSendingEmailLog}
                                                >
                                                    Disparar e-mail
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </details>
        )
    }

    const renderWebpushLogs = (campaign: TWebpushCampaignAdmin) => {
        const selectedIds = webpushSelectedLogIdsByCampaign[campaign.id] || []
        const bulkStatus = webpushBulkStatusByCampaign[campaign.id]
        const allLogIds = campaign.logs.map((log: TWebpushCampaignAdminLog) => log.id)
        const allSelected = allLogIds.length > 0 && selectedIds.length === allLogIds.length

        return (
            <details className="rounded-lg border border-psi-dark/10 p-4 bg-white">
                <summary className="cursor-pointer text-sm font-semibold text-psi-dark flex items-center justify-between">
                    Logs ({campaign.logs.length})
                    <span className="text-xs text-psi-dark/50">Clique para {campaign.logs.length ? "expandir" : "ver"}</span>
                </summary>
                {campaign.logs.length === 0 ? (
                    <p className="text-sm text-psi-dark/60 mt-4">Nenhum log encontrado</p>
                ) : (
                    <div className="mt-4 space-y-4">
                        <div className="flex flex-col md:flex-row md:items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={allSelected}
                                    onCheckedChange={(checked) => toggleSelectAllLogs("webpush", campaign.id, allLogIds, !!checked)}
                                />
                                <span className="text-xs text-psi-dark/60">Selecionar todos</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                                <Select
                                    value={bulkStatus || ""}
                                    onValueChange={(value) => setWebpushBulkStatusByCampaign(prev => ({ ...prev, [campaign.id]: value as WebpushStatus }))}
                                >
                                    <SelectTrigger className="w-[220px]">
                                        <SelectValue placeholder="Status para lote" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {webpushLogStatusOptions.map(status => (
                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleBulkUpdateStatus("webpush", campaign.id)}
                                    disabled={isUpdatingWebpushLogStatusBulk}
                                >
                                    Atualizar selecionados
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => clearSelectedLogs("webpush", campaign.id)}
                                >
                                    Limpar seleção
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {campaign.logs.map((log: TWebpushCampaignAdminLog) => {
                                const statusConfig = getWebpushLogStatusConfig(log.status)
                                const StatusIcon = statusConfig.icon
                                const draftStatus = webpushLogStatusDrafts[log.id] || log.status

                                return (
                                    <div key={log.id} className="border border-psi-dark/10 rounded-lg p-3">
                                        <div className="flex items-start gap-3">
                                            <Checkbox
                                                checked={selectedIds.includes(log.id)}
                                                onCheckedChange={(checked) => toggleLogSelection("webpush", campaign.id, log.id, !!checked)}
                                            />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center gap-2">
                                                    <Badge className={statusConfig.className}>
                                                        <StatusIcon className="h-3.5 w-3.5 mr-1" />
                                                        {statusConfig.label}
                                                    </Badge>
                                                    <span className="text-xs text-psi-dark/60">User ID: {log.userId}</span>
                                                </div>
                                                <div className="text-xs text-psi-dark/60 space-y-1">
                                                    <p>ID: {log.id}</p>
                                                    <p>Erro: {log.errorMessage || "-"}</p>
                                                    <p>Criado em: {formatDateTime(log.createdAt)}</p>
                                                    <p>Atualizado em: {formatDateTime(log.updatedAt)}</p>
                                                    <p>Single send: {log.adminTriggeredSingleSend ? "Sim" : "Não"} {log.adminTriggeredSingleSendAt ? `• ${formatDateTime(log.adminTriggeredSingleSendAt)}` : ""}</p>
                                                    <p>Admin update: {log.adminUpdatedStatus ? "Sim" : "Não"} {log.adminUpdatedStatusAt ? `• ${formatDateTime(log.adminUpdatedStatusAt)}` : ""} {log.adminUpdatedStatusTo ? `• ${log.adminUpdatedStatusTo}` : ""}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <Select
                                                    value={draftStatus}
                                                    onValueChange={(value) => setWebpushLogStatusDrafts(prev => ({ ...prev, [log.id]: value as WebpushStatus }))}
                                                >
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {webpushLogStatusOptions.map(status => (
                                                            <SelectItem key={status} value={status}>{status}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleUpdateLogStatus("webpush", log.id, draftStatus)}
                                                    disabled={isUpdatingWebpushLogStatus}
                                                >
                                                    Atualizar status
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={() => setConfirmSendLog({
                                                        open: true,
                                                        type: "webpush",
                                                        logId: log.id,
                                                        recipient: log.userId
                                                    })}
                                                    disabled={log.status !== "QUEUED" || isSendingWebpushLog}
                                                >
                                                    Disparar webpush
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}
            </details>
        )
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[80px] space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold text-psi-primary">CRM Admin</h1>
                    <p className="text-sm text-psi-dark/60">Acompanhe campanhas, logs e auditoria dos organizadores</p>
                </div>

                <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                    <div className="flex flex-col lg:flex-row lg:items-end gap-4">
                        <div className="flex-1">
                            <label className="text-xs text-psi-dark/60 mb-1 block">User ID</label>
                            <Input
                                placeholder="Filtrar por userId"
                                value={filterUserId}
                                onChange={(e) => {
                                    setFilterUserId(e.target.value)
                                    setCurrentPageEmail(1)
                                    setCurrentPageWebpush(1)
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-psi-dark/60 mb-1 block">Data inicial</label>
                            <Input
                                type="date"
                                value={filterStartDate}
                                onChange={(e) => {
                                    setFilterStartDate(e.target.value)
                                    setCurrentPageEmail(1)
                                    setCurrentPageWebpush(1)
                                }}
                            />
                        </div>
                        <div>
                            <label className="text-xs text-psi-dark/60 mb-1 block">Data final</label>
                            <Input
                                type="date"
                                value={filterEndDate}
                                onChange={(e) => {
                                    setFilterEndDate(e.target.value)
                                    setCurrentPageEmail(1)
                                    setCurrentPageWebpush(1)
                                }}
                            />
                        </div>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setFilterUserId("")
                                setFilterStartDate("")
                                setFilterEndDate("")
                                setCurrentPageEmail(1)
                                setCurrentPageWebpush(1)
                            }}
                        >
                            Limpar filtros
                        </Button>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button
                        variant={activeTab === "email" ? "primary" : "outline"}
                        onClick={() => setActiveTab("email")}
                    >
                        Campanhas de E-mail
                    </Button>
                    <Button
                        variant={activeTab === "webpush" ? "primary" : "outline"}
                        onClick={() => setActiveTab("webpush")}
                    >
                        Campanhas de Webpush
                    </Button>
                </div>

                {activeTab === "email" && (
                    <div className="space-y-4">
                        {emailCampaignsLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-40 w-full" />
                                ))}
                            </div>
                        ) : emailCampaigns.length === 0 ? (
                            <div className="rounded-xl border border-psi-primary/20 bg-white p-8 text-center text-psi-dark/60">
                                Nenhuma campanha de e-mail encontrada
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {emailCampaigns.map((campaign: TCampaignAdmin) => {
                                    const statusConfig = emailCampaignStatusConfig[campaign.status]

                                    return (
                                        <div key={campaign.id} className="rounded-xl border border-psi-primary/20 bg-white p-6 space-y-4">
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h2 className="text-lg font-semibold text-psi-dark">
                                                            {campaign.name || "Campanha sem nome"}
                                                        </h2>
                                                        <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                                                    </div>
                                                    <p className="text-sm text-psi-dark/60">
                                                        Total: {campaign.totalRecipients} • Enviados: {campaign.sentCount}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setConfirmSendCampaign({
                                                            open: true,
                                                            type: "email",
                                                            campaignId: campaign.id,
                                                            name: campaign.name
                                                        })}
                                                        disabled={isSendingEmailCampaign}
                                                    >
                                                        <Send className="h-4 w-4" />
                                                        Enviar agora
                                                    </Button>
                                                </div>
                                            </div>

                                            {renderCampaignDetails(campaign)}

                                            {renderEmailLogs(campaign)}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPageEmail}
                            totalPages={emailTotalPages}
                            onPageChange={setCurrentPageEmail}
                        />
                    </div>
                )}

                {activeTab === "webpush" && (
                    <div className="space-y-4">
                        {webpushCampaignsLoading ? (
                            <div className="space-y-3">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} className="h-40 w-full" />
                                ))}
                            </div>
                        ) : webpushCampaigns.length === 0 ? (
                            <div className="rounded-xl border border-psi-primary/20 bg-white p-8 text-center text-psi-dark/60">
                                Nenhuma campanha de webpush encontrada
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {webpushCampaigns.map((campaign: TWebpushCampaignAdmin) => {
                                    const statusConfig = webpushCampaignStatusConfig[campaign.status]

                                    return (
                                        <div key={campaign.id} className="rounded-xl border border-psi-primary/20 bg-white p-6 space-y-4">
                                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h2 className="text-lg font-semibold text-psi-dark">
                                                            {campaign.name || "Campanha sem nome"}
                                                        </h2>
                                                        <Badge className={statusConfig.className}>{statusConfig.label}</Badge>
                                                    </div>
                                                    <p className="text-sm text-psi-dark/60">
                                                        Total: {campaign.totalRecipients} • Enviados: {campaign.sentCount}
                                                    </p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        variant="outline"
                                                        onClick={() => setConfirmSendCampaign({
                                                            open: true,
                                                            type: "webpush",
                                                            campaignId: campaign.id,
                                                            name: campaign.name
                                                        })}
                                                        disabled={isSendingWebpushCampaign}
                                                    >
                                                        <Send className="h-4 w-4" />
                                                        Enviar agora
                                                    </Button>
                                                </div>
                                            </div>

                                            {renderWebpushCampaignDetails(campaign)}

                                            {renderWebpushLogs(campaign)}
                                        </div>
                                    )
                                })}
                            </div>
                        )}

                        <Pagination
                            currentPage={currentPageWebpush}
                            totalPages={webpushTotalPages}
                            onPageChange={setCurrentPageWebpush}
                        />
                    </div>
                )}

                <DialogConfirm
                    open={confirmSendCampaign.open}
                    onOpenChange={(open) => setConfirmSendCampaign(prev => ({ ...prev, open }))}
                    onConfirm={async () => {
                        if (!confirmSendCampaign.campaignId) {
                            setConfirmSendCampaign(prev => ({ ...prev, open: false }))
                            return
                        }
                        await handleSendCampaignNow(confirmSendCampaign.type, confirmSendCampaign.campaignId)
                        setConfirmSendCampaign(prev => ({ ...prev, open: false }))
                    }}
                    title={`Enviar campanha de ${confirmSendCampaign.type === "email" ? "e-mail" : "webpush"} agora?`}
                    description={
                        confirmSendCampaign.name
                            ? `Campanha: ${confirmSendCampaign.name}. Os logs serão processados imediatamente.`
                            : "Os logs serão processados imediatamente."
                    }
                    confirmText="Enviar agora"
                    cancelText="Cancelar"
                    isLoading={isSendingCampaignConfirm}
                    variant="default"
                />

                <DialogConfirm
                    open={confirmSendLog.open}
                    onOpenChange={(open) => setConfirmSendLog(prev => ({ ...prev, open }))}
                    onConfirm={async () => {
                        if (!confirmSendLog.logId) {
                            setConfirmSendLog(prev => ({ ...prev, open: false }))
                            return
                        }
                        await handleSendSingleLog(confirmSendLog.type, confirmSendLog.logId)
                        setConfirmSendLog(prev => ({ ...prev, open: false }))
                    }}
                    title={`Disparar ${confirmSendLog.type === "email" ? "e-mail" : "webpush"} deste log?`}
                    description={
                        confirmSendLog.recipient
                            ? `Destinatário: ${confirmSendLog.recipient}.`
                            : "Esse log será disparado imediatamente."
                    }
                    confirmText="Disparar"
                    cancelText="Cancelar"
                    isLoading={isSendingLogConfirm}
                    variant="default"
                />
            </div>
        </Background>
    )
}

export { AdmCrmManagerPannel }