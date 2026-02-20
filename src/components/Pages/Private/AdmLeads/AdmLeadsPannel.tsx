/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useMemo, useState } from "react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Pagination } from "@/components/Pagination/Pagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { ChevronDown, Loader2 } from "lucide-react"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { useLeadFind } from "@/hooks/Lead/useLeadFind"
import type { TLead } from "@/types/Lead/TLead"
import { cn } from "@/lib/utils"

const LeadDetailsCollapse = ({ lead }: { lead: TLead }) => {
    const rows: { label: string; value: string | null | undefined }[] = [
        { label: "IP", value: lead.ipAddress },
        { label: "User-Agent", value: lead.userAgent },
        { label: "Navegador", value: lead.browser },
        { label: "Sistema", value: lead.os },
        { label: "Dispositivo", value: lead.device },
        { label: "Origem", value: lead.origin },
        { label: "Referrer", value: lead.referrer },
        { label: "Criado em", value: lead.createdAt ? DateUtils.formatDate(lead.createdAt, "DD/MM/YYYY HH:mm") : null },
        { label: "Atualizado em", value: lead.updatedAt ? DateUtils.formatDate(lead.updatedAt, "DD/MM/YYYY HH:mm") : null },
    ]
    return (
        <div className="p-4 bg-psi-dark/3 rounded-xl border border-psi-dark/10 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
                {rows.map(({ label, value }) => (
                    value != null && value !== "" ? (
                        <div key={label} className="flex flex-col gap-0.5">
                            <span className="text-psi-dark/60 font-medium">{label}</span>
                            <span className="text-psi-dark/90 wrap-break-word break-all">{value}</span>
                        </div>
                    ) : null
                ))}
            </div>
            {lead.metadata != null && Object.keys(lead.metadata).length > 0 && (
                <div className="flex flex-col gap-1">
                    <span className="text-sm text-psi-dark/60 font-medium">Metadata</span>
                    <pre className="text-xs text-psi-dark/80 bg-white/80 rounded-lg p-3 overflow-x-auto wrap-break-word max-h-40 overflow-y-auto border border-psi-dark/10">
                        {JSON.stringify(lead.metadata, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    )
}

const AdmLeadsPannel = () => {
    const [offset, setOffset] = useState(0)
    const [openRows, setOpenRows] = useState<Record<string, boolean>>({})

    const { data: res, isLoading, isError } = useLeadFind({ offset })

    const payload = res?.data
    const items = payload?.data ?? []
    const limit = payload?.limit ?? 20
    const total = payload?.total ?? 0

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(total / Math.max(1, limit)))
    }, [total, limit])

    const currentPage = useMemo(() => {
        return Math.floor((payload?.offset ?? offset) / Math.max(1, limit)) + 1
    }, [payload?.offset, offset, limit])

    const toggleRow = (leadId: string) => {
        setOpenRows((prev) => ({ ...prev, [leadId]: !prev[leadId] }))
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container mt-[90px] py-10 space-y-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-semibold text-psi-primary">Leads</h1>
                    <p className="text-sm text-psi-dark/60">
                        Lista de leads capturados pelo chatbot e formulários.
                    </p>
                </div>

                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-4 sm:p-6 shadow-sm">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-psi-dark/60">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando...
                        </div>
                    ) : isError ? (
                        <div className="text-sm text-red-600">
                            Não foi possível carregar os leads.
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between gap-2 mb-4">
                                <p className="text-sm text-psi-dark/60">
                                    Total: <span className="font-medium text-psi-dark">{total}</span>
                                </p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setOffset(0)}
                                    disabled={offset === 0}
                                >
                                    Primeira página
                                </Button>
                            </div>

                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-10" />
                                            <TableHead>Nome</TableHead>
                                            <TableHead>WhatsApp</TableHead>
                                            <TableHead>E-mail</TableHead>
                                            <TableHead>Origem</TableHead>
                                            <TableHead>Criado em</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-sm text-psi-dark/60">
                                                    Nenhum lead encontrado.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            items.map((lead) => (
                                                <React.Fragment key={lead.id}>
                                                    <TableRow className={cn(openRows[lead.id] && "border-b-0")}>
                                                        <TableCell className="align-middle p-2">
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleRow(lead.id)}
                                                                className="p-1.5 rounded-md hover:bg-psi-dark/5 transition-colors"
                                                                aria-label={openRows[lead.id] ? "Recolher detalhes" : "Ver detalhes"}
                                                            >
                                                                <ChevronDown className={cn("h-4 w-4 text-psi-dark/70 transition-transform duration-200", openRows[lead.id] && "rotate-180")} />
                                                            </button>
                                                        </TableCell>
                                                        <TableCell className="font-medium text-psi-dark">
                                                            {lead.name}
                                                        </TableCell>
                                                        <TableCell className="text-psi-dark/80 font-mono">
                                                            {lead.phone}
                                                        </TableCell>
                                                        <TableCell className="text-psi-dark/70">
                                                            {lead.email || "—"}
                                                        </TableCell>
                                                        <TableCell className="text-psi-dark/70 max-w-[240px] truncate">
                                                            {lead.origin || "—"}
                                                        </TableCell>
                                                        <TableCell className="text-psi-dark/70">
                                                            {lead.createdAt ? DateUtils.formatDate(lead.createdAt, "DD/MM/YYYY HH:mm") : "—"}
                                                        </TableCell>
                                                    </TableRow>
                                                    {openRows[lead.id] && (
                                                        <TableRow key={`${lead.id}-details`} className="border-t-0">
                                                            <TableCell colSpan={6} className="p-0 bg-transparent">
                                                                <div className="px-2 pb-3 pt-0">
                                                                    <LeadDetailsCollapse lead={lead} />
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </React.Fragment>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="mt-4">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => {
                                        const nextOffset = (page - 1) * limit
                                        setOffset(nextOffset)
                                    }}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </Background>
    )
}

export { AdmLeadsPannel }