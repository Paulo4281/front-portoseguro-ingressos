/* eslint-disable react/no-unescaped-entities */
"use client"

import { useMemo, useState } from "react"
import { Background } from "@/components/Background/Background"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Pagination } from "@/components/Pagination/Pagination"
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
} from "@/components/ui/dialog"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { Loader2 } from "lucide-react"
import { useCronLogFind } from "@/hooks/CronLog/useCronLogFind"

const statusConfig: Record<string, { label: string; badgeClass: string }> = {
    SUCCESS: { label: "Sucesso", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    OK: { label: "Sucesso", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    FAILED: { label: "Falhou", badgeClass: "bg-red-50 text-red-700 border-red-200" },
    ERROR: { label: "Erro", badgeClass: "bg-red-50 text-red-700 border-red-200" },
    RUNNING: { label: "Rodando", badgeClass: "bg-blue-50 text-blue-700 border-blue-200" },
    PENDING: { label: "Pendente", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
}

const formatDuration = (ms: number) => {
    if (!Number.isFinite(ms) || ms < 0) return "-"
    if (ms < 1000) return `${Math.round(ms)}ms`
    const seconds = ms / 1000
    if (seconds < 60) return `${seconds.toFixed(seconds < 10 ? 2 : 1)}s`
    const minutes = Math.floor(seconds / 60)
    const rem = seconds % 60
    return `${minutes}m ${rem.toFixed(0)}s`
}

const AdmCronsLogPannel = () => {
    const [offset, setOffset] = useState(0)
    const [nameInput, setNameInput] = useState("")
    const [nameFilter, setNameFilter] = useState<string>("")
    const [errorDialog, setErrorDialog] = useState<{ name: string; error: string } | null>(null)

    const { data: res, isLoading, isError } = useCronLogFind({
        offset,
        name: nameFilter || undefined
    })

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

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container mt-[90px] py-10 space-y-6">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold text-psi-primary">Cron Log</h1>
                        <p className="text-sm text-psi-dark/60">
                            Execuções das crons dos últimos 7 dias (status e detalhes).
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <div className="flex gap-2 w-full sm:w-[380px]">
                            <Input
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                placeholder="Filtrar por nome (ex.: ticket, payout, balance)"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        setOffset(0)
                                        setNameFilter(nameInput.trim())
                                    }
                                }}
                            />
                            <Button
                                type="button"
                                variant="primary"
                                onClick={() => {
                                    setOffset(0)
                                    setNameFilter(nameInput.trim())
                                }}
                            >
                                Buscar
                            </Button>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                setOffset(0)
                                setNameInput("")
                                setNameFilter("")
                            }}
                        >
                            Limpar
                        </Button>
                    </div>
                </div>

                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-4 sm:p-6 shadow-sm">
                    {isLoading ? (
                        <div className="flex items-center gap-2 text-sm text-psi-dark/60">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando...
                        </div>
                    ) : isError ? (
                        <div className="text-sm text-red-600">
                            Não foi possível carregar os logs de crons.
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                                <p className="text-sm text-psi-dark/60">
                                    Total: <span className="font-medium text-psi-dark">{total}</span>
                                </p>
                                {!!nameFilter && (
                                    <p className="text-xs text-psi-dark/50">
                                        Filtro: <span className="font-mono">{nameFilter}</span>
                                    </p>
                                )}
                            </div>

                            <div className="w-full overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Nome</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Início</TableHead>
                                            <TableHead>Fim</TableHead>
                                            <TableHead>Duração</TableHead>
                                            <TableHead>Erro</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {items.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={6} className="text-center text-sm text-psi-dark/60 py-10">
                                                    Nenhuma execução encontrada.
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            items.map((item) => {
                                                const cfg = statusConfig[item.status] ?? { label: item.status, badgeClass: "bg-gray-50 text-gray-700 border-gray-200" }
                                                const startedAt = item.startedAt ? DateUtils.formatDateUTCString(item.startedAt, "DD/MM/YYYY HH:mm") : "-"
                                                const finishedAt = item.finishedAt ? DateUtils.formatDateUTCString(item.finishedAt, "DD/MM/YYYY HH:mm") : "-"

                                                return (
                                                    <TableRow key={item.id}>
                                                        <TableCell className="font-medium text-psi-dark whitespace-nowrap">
                                                            {item.name}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Badge variant="secondary" className={cfg.badgeClass}>
                                                                {cfg.label}
                                                            </Badge>
                                                        </TableCell>
                                                        <TableCell className="text-sm text-psi-dark/70 whitespace-nowrap">
                                                            {startedAt}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-psi-dark/70 whitespace-nowrap">
                                                            {finishedAt}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-psi-dark/70 whitespace-nowrap">
                                                            {formatDuration(item.durationMs)}
                                                        </TableCell>
                                                        <TableCell className="text-sm text-psi-dark/70">
                                                            {item.errorMessage ? (
                                                                <Button
                                                                    type="button"
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={() => setErrorDialog({ name: item.name, error: item.errorMessage! })}
                                                                >
                                                                    Ver erro
                                                                </Button>
                                                            ) : (
                                                                <span className="text-psi-dark/40">-</span>
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })
                                        )}
                                    </TableBody>
                                </Table>
                            </div>

                            <div className="pt-4">
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

                <Dialog open={!!errorDialog} onOpenChange={(open) => !open && setErrorDialog(null)}>
                    <DialogContent className="max-w-2xl">
                        <DialogHeader>
                            <DialogTitle>Erro da cron</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-3">
                            <p className="text-sm text-psi-dark/60">
                                Cron: <span className="font-mono text-psi-dark">{errorDialog?.name}</span>
                            </p>
                            <pre className="whitespace-pre-wrap wrap-break-word rounded-xl border border-[#E4E6F0] bg-psi-dark/2 p-4 text-xs text-psi-dark/80 max-h-[60vh] overflow-auto">
                                {errorDialog?.error}
                            </pre>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        </Background>
    )
}

export {
    AdmCronsLogPannel
}