"use client"

import { useMemo, useState, type ChangeEvent } from "react"
import Link from "next/link"
import { FileText, Search, AlertCircle, Upload, Loader2, Receipt, Copy } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Input } from "@/components/Input/Input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Pagination } from "@/components/Pagination/Pagination"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription
} from "@/components/ui/dialog"
import { useNotaFiscalListAdmin } from "@/hooks/NotaFiscal/useNotaFiscalListAdmin"
import { usePaymentCalculateTotalOrganizerFee } from "@/hooks/Payment/usePaymentCalculateTotalOrganizerFee"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { NotaFiscalService } from "@/services/NotaFiscal/NotaFiscalService"
import { Toast } from "@/components/Toast/Toast"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { DocumentUtils } from "@/utils/Helpers/DocumentUtils/DocumentUtils"
import type { TNotaFiscal } from "@/types/NotaFiscal/TNotaFiscal"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"

const monthLabels: Record<number, string> = {
    1: "Jan",
    2: "Fev",
    3: "Mar",
    4: "Abr",
    5: "Mai",
    6: "Jun",
    7: "Jul",
    8: "Ago",
    9: "Set",
    10: "Out",
    11: "Nov",
    12: "Dez"
}

const TIPO_ATIVIDADE = "0103 Processamento, armazenamento ou hospedagem de dados, aplicativos e sistemas de informação"
const CNAE = "7311-4/00 Agências de publicidade"
const ALIQUOTA = "5,00%"

const AdmNotasFiscaisPannel = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [statusFilter, setStatusFilter] = useState<"all" | "DONE" | "PENDING">("all")
    const [userIdOwnerFilter, setUserIdOwnerFilter] = useState("")
    const [uploadingPdfById, setUploadingPdfById] = useState<string | null>(null)
    const [uploadingXmlById, setUploadingXmlById] = useState<string | null>(null)
    const [dadosFiscaisNota, setDadosFiscaisNota] = useState<TNotaFiscal | null>(null)
    const [dadosFiscaisMonth, setDadosFiscaisMonth] = useState<number>(new Date().getMonth() + 1)
    const [dadosFiscaisYear, setDadosFiscaisYear] = useState<number>(new Date().getFullYear())

    const limit = 50
    const offset = (currentPage - 1) * limit

    const {
        data,
        isLoading,
        isError,
        refetch
    } = useNotaFiscalListAdmin({
        offset,
        status: statusFilter === "all" ? undefined : statusFilter,
        userIdOwner: userIdOwnerFilter.trim() || ""
    })

    const notas = useMemo(() => data?.data?.data || [], [data])
    const total = useMemo(() => data?.data?.total || 0, [data])
    const totalPages = useMemo(() => (total > 0 ? Math.ceil(total / limit) : 0), [total])

    const { data: totalFeeData, isLoading: isLoadingFee } = usePaymentCalculateTotalOrganizerFee({
        userId: dadosFiscaisNota?.userIdOwner ?? "",
        yearReference: dadosFiscaisYear,
        monthReference: dadosFiscaisMonth,
        enabled: !!dadosFiscaisNota?.userIdOwner
    })

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => Toast.success("Copiado.")).catch(() => {})
    }

    const openDadosFiscais = (nota: TNotaFiscal) => {
        setDadosFiscaisNota(nota)
        setDadosFiscaisMonth(nota.monthReference)
        setDadosFiscaisYear(nota.yearReference)
    }

    const handleStatusChange = (value: "all" | "DONE" | "PENDING") => {
        setStatusFilter(value)
        setCurrentPage(1)
    }

    const handleUserIdOwnerChange = (value: string) => {
        setUserIdOwnerFilter(value)
        setCurrentPage(1)
    }

    const handleUploadPdfByAdmin = async (notaId: string, event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ""
        if (!file) return

        try {
            setUploadingPdfById(notaId)
            await NotaFiscalService.uploadPdfByAdmin({ id: notaId }, file)
            Toast.success("PDF enviado com sucesso.")
            await refetch()
        } catch {
            // O tratamento detalhado de erro já acontece na camada da API.
        } finally {
            setUploadingPdfById(null)
        }
    }

    const handleUploadXmlByAdmin = async (notaId: string, event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        event.target.value = ""
        if (!file) return

        try {
            setUploadingXmlById(notaId)
            await NotaFiscalService.uploadXmlByAdmin({ id: notaId }, file)
            Toast.success("XML enviado com sucesso.")
            await refetch()
        } catch {
            // O tratamento detalhado de erro já acontece na camada da API.
        } finally {
            setUploadingXmlById(null)
        }
    }

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-10 mt-[100px]
            sm:py-12">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold text-psi-primary">Notas Fiscais</h1>
                        <p className="text-sm text-psi-dark/70">
                            Gestão de notas fiscais por organizador com paginação e filtros.
                        </p>
                    </div>

                    <div className="rounded-2xl border border-psi-primary/20 bg-white p-4 shadow-sm">
                        <div className="grid gap-3
                        sm:grid-cols-2
                        lg:grid-cols-3">
                            <Input
                                icon={Search}
                                value={userIdOwnerFilter}
                                onChange={(e) => handleUserIdOwnerChange(e.target.value)}
                                placeholder="Filtrar por userIdOwner (UUID)"
                            />
                            <Select value={statusFilter} onValueChange={handleStatusChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Todos</SelectItem>
                                    <SelectItem value="DONE">Concluídas</SelectItem>
                                    <SelectItem value="PENDING">Pendentes</SelectItem>
                                </SelectContent>
                            </Select>
                            <div className="flex items-center justify-end">
                                <Badge variant="outline" className="text-psi-dark/70">
                                    Total: {total}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-psi-primary/20 bg-white shadow-sm overflow-hidden">
                        {isLoading ? (
                            <div className="p-4 space-y-3">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <Skeleton key={item} className="h-16 w-full" />
                                ))}
                            </div>
                        ) : isError ? (
                            <div className="p-8 text-center space-y-2">
                                <AlertCircle className="h-5 w-5 text-red-500 mx-auto" />
                                <p className="text-sm text-psi-dark/70">Erro ao carregar notas fiscais.</p>
                            </div>
                        ) : notas.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-psi-dark/70">Nenhuma nota fiscal encontrada.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-psi-dark/10">
                                {notas.map((nota) => {
                                    const hasPdf = !!nota.pdfLink
                                    const hasXml = !!nota.xmlLink
                                    const status = hasPdf || hasXml ? "DONE" : "PENDING"

                                    return (
                                        <div key={nota.id} className="p-4
                                        sm:p-5">
                                            <div className="flex flex-col gap-4
                                            lg:flex-row
                                            lg:items-center
                                            lg:justify-between">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 flex-wrap">
                                                        <p className="text-sm font-medium text-psi-dark truncate max-w-[200px]" title={nota.id}>{nota.id}</p>
                                                        <Badge className={status === "DONE" ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                                                            {status === "DONE" ? "Concluída" : "Pendente"}
                                                        </Badge>
                                                        <Badge variant={ nota.type === "CLIENT" ? "psi-secondary" : "psi-primary" }>{nota.type === "CLIENT" ? "Cliente" : "Organizador"}</Badge>
                                                        {nota.requested && (
                                                            <Badge className="bg-blue-50 text-blue-700 border-blue-200">
                                                                Solicitada
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    {nota.organizer ? (
                                                        <div className="flex items-start gap-3">
                                                            {nota.organizer.logoUrl && (
                                                                <img
                                                                    src={nota.organizer.logoUrl}
                                                                    alt={`Logo ${nota.organizer.companyName || nota.organizer.firstName}`}
                                                                    className="h-10 w-10 shrink-0 rounded-lg border border-psi-primary/20 object-cover bg-psi-primary/5"
                                                                />
                                                            )}
                                                            <div className="space-y-0.5 min-w-0">
                                                                <p className="text-sm font-medium text-psi-dark">
                                                                    {nota.organizer.firstName} {nota.organizer.lastName}
                                                                    {nota.organizer.companyName && ` • ${nota.organizer.companyName}`}
                                                                </p>
                                                                <p className="text-xs text-psi-dark/60">{nota.organizer.email}</p>
                                                                {nota.organizer.phone && (
                                                                    <p className="text-xs text-psi-dark/60">{DocumentUtils.formatPhone(nota.organizer.phone || "")}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <p className="text-xs text-psi-dark/60">Owner: {nota.userIdOwner || "-"}</p>
                                                    )}
                                                    {
                                                        nota.paymentId && (
                                                            <>
                                                            <p className="text-xs text-psi-dark/60">id do pagamento: <span className="font-bold text-[15px]">{nota.paymentId || "-"}</span></p>
                                                            </>
                                                        )
                                                    }
                                                    {
                                                        nota.monthReference && nota.yearReference && (
                                                            <>
                                                            <p className="text-xs text-psi-dark/60">
                                                                Referência: <span className="font-bold text-[15px]">{monthLabels[nota.monthReference] || nota.monthReference}/{nota.yearReference}</span>
                                                            </p>
                                                            </>
                                                        )
                                                    }
                                                    <p className="text-xs text-psi-dark/60">id do usuário: {nota.userIdOwner}</p>
                                                    <p className="text-xs text-psi-dark/60">
                                                        Criada em: {DateUtils.formatDate(nota.createdAt, "DD/MM/YYYY [às] HH:mm")}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-2 flex-wrap">
                                                    {nota.type === "ORGANIZER" && nota.userIdOwner && (
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDadosFiscais(nota)}
                                                        >
                                                            <Receipt className="h-4 w-4" />
                                                            Dados fiscais
                                                        </Button>
                                                    )}
                                                    {nota.type !== "CLIENT" && !hasPdf && (
                                                        <>
                                                            <input
                                                                id={`upload-pdf-${nota.id}`}
                                                                type="file"
                                                                accept="application/pdf,.pdf"
                                                                className="hidden"
                                                                onChange={(event) => handleUploadPdfByAdmin(nota.id, event)}
                                                            />
                                                            <Button
                                                                variant="tertiary"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const input = document.getElementById(`upload-pdf-${nota.id}`) as HTMLInputElement | null
                                                                    input?.click()
                                                                }}
                                                                disabled={uploadingPdfById === nota.id}
                                                            >
                                                                {uploadingPdfById === nota.id ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                        Enviando PDF...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="h-4 w-4" />
                                                                        Subir PDF
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}
                                                    {nota.type !== "CLIENT" && !hasXml && (
                                                        <>
                                                            <input
                                                                id={`upload-xml-${nota.id}`}
                                                                type="file"
                                                                accept=".xml,text/xml,application/xml"
                                                                className="hidden"
                                                                onChange={(event) => handleUploadXmlByAdmin(nota.id, event)}
                                                            />
                                                            <Button
                                                                variant="tertiary"
                                                                size="sm"
                                                                onClick={() => {
                                                                    const input = document.getElementById(`upload-xml-${nota.id}`) as HTMLInputElement | null
                                                                    input?.click()
                                                                }}
                                                                disabled={uploadingXmlById === nota.id}
                                                            >
                                                                {uploadingXmlById === nota.id ? (
                                                                    <>
                                                                        <Loader2 className="h-4 w-4 animate-spin" />
                                                                        Enviando XML...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <Upload className="h-4 w-4" />
                                                                        Subir XML
                                                                    </>
                                                                )}
                                                            </Button>
                                                        </>
                                                    )}
                                                    {hasPdf && (
                                                        <Link href={ImageUtils.getNotaFiscalFileUrl(nota.pdfLink)} target="_blank">
                                                            <Button variant="outline" size="sm">
                                                                <FileText className="h-4 w-4" />
                                                                Abrir PDF
                                                            </Button>
                                                        </Link>
                                                    )}
                                                    {hasXml && (
                                                        <Link href={ImageUtils.getNotaFiscalFileUrl(nota.xmlLink)} target="_blank">
                                                            <Button variant="outline" size="sm">
                                                                <FileText className="h-4 w-4" />
                                                                Abrir XML
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center pt-2">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            <Dialog open={!!dadosFiscaisNota} onOpenChange={(open) => !open && setDadosFiscaisNota(null)}>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Dados fiscais</DialogTitle>
                        <DialogDescription>
                            Informações para preenchimento de NF. Altere o período abaixo para recalcular o valor do serviço.
                        </DialogDescription>
                    </DialogHeader>
                    {dadosFiscaisNota && (
                        <div className="space-y-4 pt-2">
                            <div className="flex gap-2">
                                <Select value={String(dadosFiscaisMonth)} onValueChange={(v) => setDadosFiscaisMonth(Number(v))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Mês" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(monthLabels).map(([num, label]) => (
                                            <SelectItem key={num} value={num}>{label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Select value={String(dadosFiscaisYear)} onValueChange={(v) => setDadosFiscaisYear(Number(v))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Ano" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map((y) => (
                                            <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {(() => {
                                const addr = dadosFiscaisNota.organizer?.address
                                return [
                                    { label: "CNPJ", value: dadosFiscaisNota.organizer?.cnpj ?? "—" },
                                    { label: "Nome/Razão social", value: dadosFiscaisNota.organizer?.companyName || (dadosFiscaisNota.organizer ? `${dadosFiscaisNota.organizer.firstName} ${dadosFiscaisNota.organizer.lastName}`.trim() : "—") },
                                    { label: "CEP", value: addr?.zipCode ?? "—" },
                                    { label: "Município/UF", value: addr ? `${addr.city}/${addr.state}` : "—" },
                                    { label: "Logradouro", value: addr?.street ?? "—" },
                                    { label: "Bairro", value: addr?.neighborhood ?? "—" },
                                    { label: "Número", value: addr?.number ?? "—" },
                                    { label: "Tipo de atividade no município", value: TIPO_ATIVIDADE },
                                    { label: "CNAE", value: CNAE },
                                    {
                                        label: "Descrição dos serviços",
                                        value: `Taxas de utilização da plataforma digital para intermediação e processamento de venda de ingressos do evento(s) realizados no período de ${monthLabels[dadosFiscaisMonth] || dadosFiscaisMonth}/${dadosFiscaisYear}`
                                    },
                                    {
                                        label: "Valor do serviço",
                                        value: isLoadingFee
                                            ? "Carregando..."
                                            : totalFeeData != null
                                                ? ValueUtils.centsToCurrency(totalFeeData.totalOrganizerFee) || 0
                                                : "—"
                                    },
                                    { label: "Alíquota", value: ALIQUOTA }
                                ]
                            })().map(({ label, value }) => (
                                <div key={label} className="flex flex-col gap-1">
                                    <span className="text-xs font-medium text-psi-dark/70">{label}</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-psi-dark flex-1 min-w-0 wrap-break-word bg-psi-primary/5 border border-psi-primary/20 rounded-lg px-3 py-2">
                                            {value}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="shrink-0"
                                            onClick={() => copyToClipboard(String(value))}
                                            disabled={value === "—" || value === "Carregando..."}
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </Background>
    )
}

export {
    AdmNotasFiscaisPannel
}