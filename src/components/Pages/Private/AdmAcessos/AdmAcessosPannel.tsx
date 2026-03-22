"use client"

import { useMemo, useState } from "react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/Pagination/Pagination"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useAccessList } from "@/hooks/Access/useAccessList"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { Toast } from "@/components/Toast/Toast"
import { AlertTriangle, CheckCircle2, Loader2, LogIn, XCircle } from "lucide-react"
import type { TLoginMethod } from "@/types/Access/TAccess"

const getMethodLabel = (method: TLoginMethod) => {
    if (method === "GOOGLE") return "Google"
    return "E-mail e senha"
}

const AdmAcessosPannel = () => {
    const [offset, setOffset] = useState(0)
    const [fromInput, setFromInput] = useState("")
    const [toInput, setToInput] = useState("")
    const [fromFilter, setFromFilter] = useState<string | undefined>(undefined)
    const [toFilter, setToFilter] = useState<string | undefined>(undefined)

    const { data: response, isLoading, isError } = useAccessList({
        offset,
        from: fromFilter,
        to: toFilter
    })

    const payload = response?.data
    const logs = payload?.data ?? []
    const total = payload?.total ?? 0
    const limit = payload?.limit ?? 50

    const totalPages = useMemo(() => {
        return Math.max(1, Math.ceil(total / Math.max(1, limit)))
    }, [total, limit])

    const currentPage = useMemo(() => {
        return Math.floor((payload?.offset ?? offset) / Math.max(1, limit)) + 1
    }, [payload?.offset, offset, limit])

    const applyFilters = () => {
        const trimmedFrom = fromInput.trim()
        const trimmedTo = toInput.trim()

        if (trimmedFrom && trimmedTo && trimmedFrom > trimmedTo) {
            Toast.error("A data inicial não pode ser maior que a data final.")
            return
        }

        setOffset(0)
        setFromFilter(trimmedFrom || undefined)
        setToFilter(trimmedTo || undefined)
    }

    const clearFilters = () => {
        setOffset(0)
        setFromInput("")
        setToInput("")
        setFromFilter(undefined)
        setToFilter(undefined)
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container mt-[90px] py-10 space-y-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-semibold text-psi-primary">Logs de acesso</h1>
                    <p className="text-sm text-psi-dark/60">
                        Visualize os registros de login da plataforma (apenas administradores).
                    </p>
                </div>

                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-4 sm:p-6 shadow-sm space-y-4">
                    <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-xs text-psi-dark/70">De (YYYY-MM-DD)</label>
                            <Input
                                type="date"
                                value={fromInput}
                                onChange={(e) => setFromInput(e.target.value)}
                                max={toInput || undefined}
                            />
                        </div>
                        <div className="flex flex-col gap-1 w-full sm:w-auto">
                            <label className="text-xs text-psi-dark/70">Até (YYYY-MM-DD)</label>
                            <Input
                                type="date"
                                value={toInput}
                                onChange={(e) => setToInput(e.target.value)}
                                min={fromInput || undefined}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" variant="primary" onClick={applyFilters}>
                                Buscar
                            </Button>
                            <Button type="button" variant="outline" onClick={clearFilters}>
                                Limpar
                            </Button>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-psi-dark/60">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando logs de acesso...
                        </div>
                    ) : isError ? (
                        <div className="flex items-center gap-2 text-sm text-red-600">
                            <AlertTriangle className="h-4 w-4" />
                            Não foi possível carregar os logs de acesso.
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                <p className="text-sm text-psi-dark/60">
                                    Total: <span className="font-medium text-psi-dark">{total}</span>
                                </p>
                                {(fromFilter || toFilter) && (
                                    <p className="text-xs text-psi-dark/50">
                                        Período: {fromFilter || "..." } até {toFilter || "..."}
                                    </p>
                                )}
                            </div>

                            <div className="w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Data/Hora</TableHead>
                                            <TableHead>Usuário</TableHead>
                                            <TableHead>Método</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>IP</TableHead>
                                            <TableHead>Dispositivo</TableHead>
                                            <TableHead>Erro</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {logs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={7} className="text-center text-sm text-psi-dark/60 py-10">
                                                    Nenhum acesso encontrado para o período selecionado.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            logs.map((log) => (
                                                <TableRow key={log.id}>
                                                    <TableCell className="whitespace-nowrap text-sm text-psi-dark/70">
                                                        {DateUtils.formatDateUTCString(log.createdAt, "DD/MM/YYYY HH:mm")}
                                                    </TableCell>
                                                    <TableCell className="min-w-[220px]">
                                                        {log.User ? (
                                                            <div className="space-y-0.5">
                                                                <p className="text-sm font-medium text-psi-dark">
                                                                    {log.User.firstName} {log.User.lastName}
                                                                </p>
                                                                <p className="text-xs text-psi-dark/60 truncate">
                                                                    {log.User.email}
                                                                </p>
                                                            </div>
                                                        ) : (
                                                            <span className="text-sm text-psi-dark/50">Usuário não identificado</span>
                                                        )}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                                                            <LogIn className="h-3 w-3 mr-1" />
                                                            {getMethodLabel(log.method)}
                                                        </Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        {log.success ? (
                                                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                                                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                                                Sucesso
                                                            </Badge>
                                                        ) : (
                                                            <Badge variant="secondary" className="bg-red-50 text-red-700 border-red-200">
                                                                <XCircle className="h-3 w-3 mr-1" />
                                                                Falha
                                                            </Badge>
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="font-mono text-xs text-psi-dark/70">
                                                        {log.ip || "-"}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-psi-dark/70 min-w-[180px]">
                                                        {[log.device, log.browser, log.os].filter(Boolean).join(" / ") || "-"}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-psi-dark/70 min-w-[200px]">
                                                        {log.error || "-"}
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="pt-2">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={(page) => {
                                        const nextOffset = (page - 1) * Math.max(1, limit)
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

export {
    AdmAcessosPannel
}