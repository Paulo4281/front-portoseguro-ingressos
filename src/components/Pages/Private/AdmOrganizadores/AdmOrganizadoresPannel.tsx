"use client"

import { useMemo, useState } from "react"
import React from "react"
import { useOrganizerFind } from "@/hooks/Organizer/useOrganizerFind"
import { useOrganizerAccept } from "@/hooks/Organizer/useOrganizerAccept"
import { useOrganizerReject } from "@/hooks/Organizer/useOrganizerReject"
import type { TUser } from "@/types/User/TUser"
import { Background } from "@/components/Background/Background"
import { Skeleton } from "@/components/ui/skeleton"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { Toast } from "@/components/Toast/Toast"
import {
    Building2,
    ChevronDown,
    Mail,
    Phone,
    Calendar,
    CheckCircle2,
    XCircle,
    Clock,
    Search,
    Filter,
    FileText,
    User,
    CreditCard,
    Wallet,
    Instagram,
    Facebook,
    ImageIcon,
    X,
    ZoomIn
} from "lucide-react"

const AdmOrganizadoresPannel = () => {
    const [filters, setFilters] = useState<{
        name?: string
        verificationStatus?: "PENDING" | "APPROVED" | "REJECTED"
        createdAt?: string
    }>({})
    const [offset, setOffset] = useState(0)
    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean
        organizerId: string
        organizerName: string
        status: "APPROVED" | "REJECTED"
    }>({
        open: false,
        organizerId: "",
        organizerName: "",
        status: "APPROVED"
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

    const { data, isLoading, refetch } = useOrganizerFind({
        offset,
        ...filters
    })

    const { mutateAsync: acceptOrganizer, isPending: isAccepting } = useOrganizerAccept()
    const { mutateAsync: rejectOrganizer, isPending: isRejecting } = useOrganizerReject()

    const organizers = useMemo(() => {
        if (data?.data?.data && Array.isArray(data.data.data)) {
            return data.data.data
        }
        return []
    }, [data])

    const total = useMemo(() => {
        return data?.data?.total || 0
    }, [data])

    const limit = 30
    const totalPages = Math.ceil(total / limit)
    const currentPage = Math.floor(offset / limit) + 1

    const toggleRow = (organizerId: string) => {
        setOpenRows((prev) => ({
            ...prev,
            [organizerId]: !prev[organizerId]
        }))
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return ""
        if (dateString.includes("/")) {
            return dateString
        }
        return new Date(dateString).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        })
    }

    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString("pt-BR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    const getStatusBadge = (status: "PENDING" | "APPROVED" | "REJECTED" | null | undefined) => {
        if (status === "APPROVED") {
            return (
                <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Aprovado
                </Badge>
            )
        }
        if (status === "REJECTED") {
            return (
                <Badge variant="destructive" className="bg-red-100 text-red-700 border-red-200">
                    <XCircle className="h-3 w-3 mr-1" />
                    Rejeitado
                </Badge>
            )
        }
        if (status === "PENDING") {
            return (
                <Badge variant="secondary" className="bg-amber-100 text-amber-700 border-amber-200">
                    <Clock className="h-3 w-3 mr-1" />
                    Pendente
                </Badge>
            )
        }
        return (
            <Badge variant="secondary">
                Não verificado
            </Badge>
        )
    }

    const handleFilterChange = (key: string, value: string | undefined) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value || undefined
        }))
        setOffset(0)
    }

    const handleApprove = (organizer: TUser) => {
        setConfirmDialog({
            open: true,
            organizerId: organizer.Organizer?.id || "",
            organizerName: `${organizer.firstName} ${organizer.lastName}`,
            status: "APPROVED"
        })
    }

    const handleReject = (organizer: TUser) => {
        setConfirmDialog({
            open: true,
            organizerId: organizer.Organizer?.id || "",
            organizerName: `${organizer.firstName} ${organizer.lastName}`,
            status: "REJECTED"
        })
    }

    const handleConfirmStatus = async () => {
        try {
            const response = confirmDialog.status === "APPROVED"
                ? await acceptOrganizer({ organizerId: confirmDialog.organizerId })
                : await rejectOrganizer({ organizerId: confirmDialog.organizerId })

            if (response.success) {
                Toast.success(
                    confirmDialog.status === "APPROVED"
                        ? "Organizador aprovado com sucesso"
                        : "Organizador rejeitado com sucesso"
                )
                setConfirmDialog({ open: false, organizerId: "", organizerName: "", status: "APPROVED" })
                refetch()
            }
        } catch (error) {
        }
    }

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px] container">
            <section className="space-y-8 px-4
            sm:px-6
            lg:px-8">
                <div className="space-y-4">
                    <div className="space-y-3">
                        <h1 className="text-3xl font-medium text-psi-primary
                        sm:text-4xl">
                            Gerenciar Organizadores
                        </h1>
                        <p className="text-psi-dark/70 max-w-3xl">
                            Visualize e gerencie todos os organizadores da plataforma. Aprove ou rejeite solicitações de verificação.
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
                        sm:flex-1
                        sm:max-w-2xl">
                            <div className="flex-1">
                                <Input
                                    placeholder="Buscar por nome..."
                                    value={filters.name || ""}
                                    onChange={(e) => handleFilterChange("name", e.target.value)}
                                    icon={Search}
                                />
                            </div>
                            <div className="w-full
                            sm:w-[200px]">
                                <Select
                                    value={filters.verificationStatus || "all"}
                                    onValueChange={(value) => handleFilterChange("verificationStatus", value === "all" ? undefined : value)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Todos os status</SelectItem>
                                        <SelectItem value="PENDING">Pendente</SelectItem>
                                        <SelectItem value="APPROVED">Aprovado</SelectItem>
                                        <SelectItem value="REJECTED">Rejeitado</SelectItem>
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
                        <div className="overflow-x-hidden w-full">
                            <Table className="w-full table-fixed">
                            <TableHeader>
                                <TableRow className="border-b border-psi-dark/10 hover:bg-transparent bg-psi-dark/2">
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Organizador</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Contato</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider">Status</TableHead>
                                    <TableHead className="h-16 px-6 text-psi-dark font-medium text-sm uppercase tracking-wider text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {organizers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-40 text-center">
                                            <div className="flex flex-col items-center justify-center gap-4 py-8">
                                                <div className="h-16 w-16 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                                    <Building2 className="h-8 w-8 text-psi-primary/60" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-base font-medium text-psi-dark">Nenhum organizador encontrado</p>
                                                    <p className="text-sm text-psi-dark/50">Tente ajustar os filtros de busca.</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    organizers.map((organizer) => {
                                        const initials = `${organizer.firstName.charAt(0)}${organizer.lastName.charAt(0)}`.toUpperCase()
                                        const org = organizer.Organizer
                                        
                                        return (
                                            <React.Fragment key={organizer.id}>
                                                <TableRow className="border-b border-psi-dark/5 hover:bg-psi-dark/3 transition-colors">
                                                    <TableCell className="py-5 px-6">
                                                        <div className="flex items-center gap-4">
                                                            {org?.logo ? (
                                                                <img
                                                                    src={ImageUtils.getOrganizerLogoUrl(org.logo)}
                                                                    alt={`Logo ${organizer.firstName}`}
                                                                    className="h-12 w-12 rounded-full object-cover shrink-0"
                                                                />
                                                            ) : (
                                                                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-psi-primary/20 to-psi-primary/10 flex items-center justify-center shrink-0">
                                                                    <span className="text-sm font-medium text-psi-primary">
                                                                        {initials}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            <div className="space-y-1 min-w-0">
                                                                <p className="font-medium text-psi-dark text-base">
                                                                    {organizer.firstName} {organizer.lastName}
                                                                </p>
                                                                {org?.companyName && (
                                                                    <p className="text-xs text-psi-dark/50 flex items-center gap-1.5">
                                                                        <Building2 className="h-3 w-3" />
                                                                        {org.companyName}
                                                                    </p>
                                                                )}
                                                                <p className="text-xs text-psi-dark/50 flex items-center gap-1.5">
                                                                    <Calendar className="h-3 w-3" />
                                                                    Cadastrado em {formatDate(organizer.createdAt)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        <div className="space-y-2">
                                                            <div className="flex items-center gap-2.5 text-sm text-psi-dark/80">
                                                                <div className="h-8 w-8 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                                                    <Mail className="h-3.5 w-3.5 text-psi-primary" />
                                                                </div>
                                                                <span className="truncate">{organizer.email}</span>
                                                            </div>
                                                            {organizer.phone && (
                                                                <div className="flex items-center gap-2.5 text-sm text-psi-dark/80">
                                                                    <div className="h-8 w-8 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                                                        <Phone className="h-3.5 w-3.5 text-psi-primary" />
                                                                    </div>
                                                                    <span>{organizer.phone}</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6">
                                                        {getStatusBadge(org?.verificationStatus as "PENDING" | "APPROVED" | "REJECTED" | null | undefined)}
                                                    </TableCell>
                                                    <TableCell className="py-5 px-6 text-right">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRow(organizer.id)}
                                                            className="inline-flex items-center gap-2 text-sm font-medium text-psi-primary hover:text-psi-primary/80 transition-all hover:gap-3 px-3 py-1.5 rounded-lg hover:bg-psi-primary/5"
                                                        >
                                                            Ver detalhes
                                                            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${openRows[organizer.id] ? "rotate-180" : ""}`} />
                                                        </button>
                                                    </TableCell>
                                                </TableRow>
                                                {openRows[organizer.id] && (
                                                    <TableRow key={`${organizer.id}-details`} className="border-0">
                                                        <TableCell colSpan={4} className="p-0 w-full">
                                                            <div className="bg-gradient-to-br from-psi-dark/2 to-psi-dark/5 px-4 py-6 space-y-6 border-t border-psi-dark/10 overflow-x-hidden w-full
                                                            sm:px-6
                                                            md:px-8
                                                            md:py-8
                                                            md:space-y-8">
                                                                <div className="grid gap-6 w-full
                                                                md:grid-cols-2
                                                                lg:grid-cols-3">
                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm min-w-0">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <User className="h-4 w-4 text-psi-primary shrink-0" />
                                                                            Nome completo
                                                                        </div>
                                                                        <p className="text-base font-medium text-psi-dark break-words">
                                                                            {organizer.firstName} {organizer.lastName}
                                                                        </p>
                                                                    </div>
                                                                    {organizer.document && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm min-w-0 w-full">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <FileText className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                CPF
                                                                            </div>
                                                                            <p className="text-base font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                {organizer.document}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {organizer.birth && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm min-w-0 w-full">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Calendar className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                Data de nascimento
                                                                            </div>
                                                                            <p className="text-base font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                {formatDate(organizer.birth)}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {org?.companyName && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm min-w-0 w-full">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Building2 className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                Nome da empresa
                                                                            </div>
                                                                            <p className="text-base font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                {org.companyName}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {org?.companyDocument && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm min-w-0 w-full">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <FileText className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                CNPJ
                                                                            </div>
                                                                            <p className="text-base font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                {org.companyDocument}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {org?.supportEmail && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm min-w-0 w-full">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Mail className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                Email de suporte
                                                                            </div>
                                                                            <p className="text-base font-medium text-psi-dark break-all overflow-wrap-anywhere">
                                                                                {org.supportEmail}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    {org?.supportPhone && (
                                                                        <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm min-w-0 w-full">
                                                                            <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                <Phone className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                Telefone de suporte
                                                                            </div>
                                                                            <p className="text-base font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                {org.supportPhone}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>

                                                                {org?.description && (
                                                                    <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-3 shadow-sm min-w-0 w-full overflow-hidden
                                                                    md:p-6">
                                                                        <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                            <FileText className="h-4 w-4 text-psi-primary shrink-0" />
                                                                            Descrição
                                                                        </div>
                                                                        <textarea
                                                                            value={org.description}
                                                                            className="w-full h-32 p-2 rounded-lg border border-psi-dark/10 bg-white/80 text-sm text-psi-dark/70 resize-none"
                                                                            readOnly
                                                                        />
                                                                    </div>
                                                                )}

                                                                {(org?.pixAddressKey || org?.bankAccountNumber) && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <h3 className="text-base font-medium text-psi-dark flex items-center gap-2">
                                                                            <CreditCard className="h-5 w-5 text-psi-primary" />
                                                                            Informações bancárias
                                                                        </h3>
                                                                        <div className="grid gap-4
                                                                        md:grid-cols-2">
                                                                            {org.bankAccountNumber && (
                                                                                <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-3 shadow-sm min-w-0 w-full">
                                                                                    <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                        <CreditCard className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                        Conta bancária
                                                                                    </div>
                                                                                    <div className="space-y-2 min-w-0 w-full">
                                                                                        {org.Bank && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">Banco</p>
                                                                                                <p className="text-sm text-psi-dark/70 break-words overflow-wrap-anywhere">
                                                                                                    {org.Bank.name} ({org.Bank.code})
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {org.bankAccountName && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">Nome da conta</p>
                                                                                                <p className="text-sm font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                                    {org.bankAccountName}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {org.bankAccountOwnerName && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">Titular</p>
                                                                                                <p className="text-sm font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                                    {org.bankAccountOwnerName}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {org.bankAccountOwnerDocument && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">CPF/CNPJ do titular</p>
                                                                                                <p className="text-sm text-psi-dark/70 break-words overflow-wrap-anywhere">
                                                                                                    {org.bankAccountOwnerDocument}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        {org.bankAccountOwnerBirth && (
                                                                                            <div>
                                                                                                <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">Data de nascimento do titular</p>
                                                                                                <p className="text-sm text-psi-dark/70 break-words overflow-wrap-anywhere">
                                                                                                    {formatDate(org.bankAccountOwnerBirth)}
                                                                                                </p>
                                                                                            </div>
                                                                                        )}
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">Dados da conta</p>
                                                                                            <p className="text-base font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                                Ag: {org.bankAccountAgency} - Conta: {org.bankAccountNumber}-{org.bankAccountDigit}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">Tipo de conta</p>
                                                                                            <p className="text-sm text-psi-dark/70 break-words overflow-wrap-anywhere">
                                                                                                {org.bankAccountType === "CONTA_CORRENTE" ? "Conta Corrente" : "Conta Poupança"}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {org.pixAddressKey && (
                                                                                <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-3 shadow-sm min-w-0 w-full">
                                                                                    <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                        <Wallet className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                        Chave PIX
                                                                                    </div>
                                                                                    <div className="space-y-2">
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">Chave</p>
                                                                                            <p className="text-base font-medium text-psi-dark break-all overflow-wrap-anywhere">
                                                                                                {org.pixAddressKey}
                                                                                            </p>
                                                                                        </div>
                                                                                        <div>
                                                                                            <p className="text-xs text-psi-dark/50 uppercase tracking-wide mb-1">Tipo</p>
                                                                                            <p className="text-sm text-psi-dark/70 break-words overflow-wrap-anywhere">
                                                                                                {org.pixAddressType}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                        {org.payoutMethod && (
                                                                            <div className="rounded-2xl border border-psi-dark/10 bg-white/80 p-4 space-y-2 shadow-sm min-w-0 w-full">
                                                                                <div className="flex items-center gap-2 text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                    <CreditCard className="h-4 w-4 text-psi-primary shrink-0" />
                                                                                    Método de repasse preferido
                                                                                </div>
                                                                                <p className="text-base font-medium text-psi-dark break-words overflow-wrap-anywhere">
                                                                                    {org.payoutMethod === "PIX" ? "PIX" : "Conta Bancária"}
                                                                                </p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}

                                                                {(org?.identityDocumentFront || org?.identityDocumentBack || org?.identityDocumentSelfie) && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <h3 className="text-base font-medium text-psi-dark flex items-center gap-2">
                                                                            <ImageIcon className="h-5 w-5 text-psi-primary" />
                                                                            Documentos de identidade
                                                                        </h3>
                                                                        <div className="grid gap-4
                                                                        md:grid-cols-3">
                                                                            {org.identityDocumentFront && (
                                                                                <div className="space-y-2">
                                                                                    <p className="text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                        Frente do RG
                                                                                    </p>
                                                                                    <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-2 shadow-sm overflow-hidden group cursor-pointer relative"
                                                                                        onClick={() => setImageModal({
                                                                                            open: true,
                                                                                            src: ImageUtils.getOrganizerIdentityDocumentUrl(org.identityDocumentFront),
                                                                                            alt: "Frente do RG"
                                                                                        })}
                                                                                    >
                                                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                                                                                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                                        </div>
                                                                                        <img
                                                                                            src={ImageUtils.getOrganizerIdentityDocumentUrl(org.identityDocumentFront)}
                                                                                            alt="Frente do RG"
                                                                                            className="w-full h-auto rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {org.identityDocumentBack && (
                                                                                <div className="space-y-2">
                                                                                    <p className="text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                        Verso do RG
                                                                                    </p>
                                                                                    <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-2 shadow-sm overflow-hidden group cursor-pointer relative"
                                                                                        onClick={() => setImageModal({
                                                                                            open: true,
                                                                                            src: ImageUtils.getOrganizerIdentityDocumentUrl(org.identityDocumentBack),
                                                                                            alt: "Verso do RG"
                                                                                        })}
                                                                                    >
                                                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                                                                                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                                        </div>
                                                                                        <img
                                                                                            src={ImageUtils.getOrganizerIdentityDocumentUrl(org.identityDocumentBack)}
                                                                                            alt="Verso do RG"
                                                                                            className="w-full h-auto rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                            {org.identityDocumentSelfie && (
                                                                                <div className="space-y-2">
                                                                                    <p className="text-xs font-medium text-psi-dark/60 uppercase tracking-wide">
                                                                                        Selfie com RG
                                                                                    </p>
                                                                                    <div className="rounded-xl border border-psi-dark/10 bg-white/80 p-2 shadow-sm overflow-hidden group cursor-pointer relative"
                                                                                        onClick={() => setImageModal({
                                                                                            open: true,
                                                                                            src: ImageUtils.getOrganizerIdentityDocumentUrl(org.identityDocumentSelfie),
                                                                                            alt: "Selfie com RG"
                                                                                        })}
                                                                                    >
                                                                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors z-10 flex items-center justify-center">
                                                                                            <ZoomIn className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                                                                        </div>
                                                                                        <img
                                                                                            src={ImageUtils.getOrganizerIdentityDocumentUrl(org.identityDocumentSelfie)}
                                                                                            alt="Selfie com RG"
                                                                                            className="w-full h-auto rounded-lg object-cover transition-transform duration-300 group-hover:scale-110"
                                                                                        />
                                                                                    </div>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {(org?.instagramUrl || org?.facebookUrl) && (
                                                                    <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                                                        <h3 className="text-base font-medium text-psi-dark flex items-center gap-2">
                                                                            Redes sociais
                                                                        </h3>
                                                                        <div className="flex flex-wrap gap-3">
                                                                            {org.instagramUrl && (
                                                                                <a
                                                                                    href={org.instagramUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
                                                                                >
                                                                                    <Instagram className="h-4 w-4" />
                                                                                    Instagram
                                                                                </a>
                                                                            )}
                                                                            {org.facebookUrl && (
                                                                                <a
                                                                                    href={org.facebookUrl}
                                                                                    target="_blank"
                                                                                    rel="noopener noreferrer"
                                                                                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                                                                >
                                                                                    <Facebook className="h-4 w-4" />
                                                                                    Facebook
                                                                                </a>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                )}

                                                                {org?.verificationStatus === "PENDING" && (
                                                                    <div className="flex flex-col gap-3 pt-6 border-t border-psi-dark/10
                                                                    sm:flex-row
                                                                    sm:gap-4
                                                                    lg:justify-end!
                                                                    ">
                                                                        <Button
                                                                            variant="destructive"
                                                                            onClick={() => handleReject(organizer)}
                                                                        >
                                                                            <XCircle className="h-4 w-4 shrink-0" />
                                                                            <span className="truncate">Rejeitar organizador</span>
                                                                        </Button>
                                                                        <Button
                                                                            variant="primary"
                                                                            onClick={() => handleApprove(organizer)}
                                                                        >
                                                                            <CheckCircle2 className="h-4 w-4 shrink-0" />
                                                                            <span className="truncate">Aprovar organizador</span>
                                                                        </Button>
                                                                    </div>
                                                                )}
                                                            </div>
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
                                    Mostrando {offset + 1} a {Math.min(offset + limit, total)} de {total} organizadores
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

                <DialogConfirm
                    open={confirmDialog.open}
                    onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
                    onConfirm={handleConfirmStatus}
                    title={confirmDialog.status === "APPROVED" ? "Aprovar organizador?" : "Rejeitar organizador?"}
                    description={
                        confirmDialog.status === "APPROVED"
                            ? `Tem certeza que deseja aprovar o organizador "${confirmDialog.organizerName}"? Esta ação permitirá que ele crie e gerencie eventos na plataforma.`
                            : `Tem certeza que deseja rejeitar o organizador "${confirmDialog.organizerName}"? Esta ação impedirá que ele crie eventos até que seja aprovado novamente.`
                    }
                    confirmText={confirmDialog.status === "APPROVED" ? "Aprovar" : "Rejeitar"}
                    variant={confirmDialog.status === "APPROVED" ? "default" : "destructive"}
                    isLoading={isAccepting || isRejecting}
                />

                <Dialog open={imageModal.open} onOpenChange={(open) => setImageModal({ ...imageModal, open })}>
                    <DialogContent className="max-w-4xl w-full p-0 bg-transparent border-0">
                        <div className="relative bg-white rounded-lg overflow-hidden">
                            <button
                                onClick={() => setImageModal({ ...imageModal, open: false })}
                                className="absolute top-4 right-4 z-20 h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
                            >
                                <X className="h-5 w-5 text-white" />
                            </button>
                            <img
                                src={imageModal.src}
                                alt={imageModal.alt}
                                className="w-full h-auto max-h-[90vh] object-contain"
                            />
                        </div>
                    </DialogContent>
                </Dialog>
            </section>
        </Background>
    )
}

export {
    AdmOrganizadoresPannel
}
