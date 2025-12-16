"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileSpreadsheet, FileText, Code, Download, Loader2, Calendar, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { useEventListBuyers } from "@/hooks/Event/useEventListBuyers"
import { useEventFindById } from "@/hooks/Event/useEventFindById"
import { Toast } from "@/components/Toast/Toast"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { formatEventDate, formatEventTime } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import type { TEventListBuyers, TEvent } from "@/types/Event/TEvent"
import type { TEventDate } from "@/types/Event/TEventDate"
import type { TTicketType } from "@/types/TicketType/TTicketType"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

type TDialogExportBuyersListProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    eventId: string
    eventName?: string
    eventDateId?: string
    ticketTypeId?: string
    onFormatSelect?: (format: "pdf" | "xlsx" | "csv" | "json") => void
}

const DialogExportBuyersList = ({ 
    open, 
    onOpenChange, 
    eventId,
    eventName,
    eventDateId: initialEventDateId,
    ticketTypeId: initialTicketTypeId,
    onFormatSelect 
}: TDialogExportBuyersListProps) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedFormat, setSelectedFormat] = useState<"pdf" | "xlsx" | "csv" | "json" | null>(null)
    const [selectedEventDateId, setSelectedEventDateId] = useState<string | undefined>(initialEventDateId)
    const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | undefined>(initialTicketTypeId)

    const { data: eventData, isLoading: isLoadingEvent } = useEventFindById(eventId)
    const event = eventData?.data as TEvent | undefined

    const { data: buyersData, refetch, isFetching } = useEventListBuyers({
        eventId,
        eventDateId: selectedEventDateId,
        ticketTypeId: selectedTicketTypeId,
        enabled: false
    })

    const [buyers, setBuyers] = useState<TEventListBuyers[]>([])

    useEffect(() => {
        if (buyersData?.data) {
            setBuyers(buyersData.data)
        }
    }, [buyersData])

    useEffect(() => {
        if (open) {
            setSelectedEventDateId(initialEventDateId)
            setSelectedTicketTypeId(initialTicketTypeId)
        }
    }, [open, initialEventDateId, initialTicketTypeId])

    const handleFormatSelect = async (format: "pdf" | "xlsx" | "csv" | "json") => {
        setSelectedFormat(format)
        setIsGenerating(true)

        try {
            const response = await refetch()
            
            if (!response.data?.success || !response.data?.data) {
                Toast.error("Erro ao buscar lista de compradores")
                setIsGenerating(false)
                setSelectedFormat(null)
                return
            }

            const buyersData = response.data.data

            if (format === "pdf") {
                generatePDF(buyersData, eventName || "Evento")
            } else if (format === "xlsx") {
                Toast.info("Exportação em Excel será implementada em breve")
            } else if (format === "csv") {
                Toast.info("Exportação em CSV será implementada em breve")
            } else if (format === "json") {
                Toast.info("Exportação em JSON será implementada em breve")
            }

            if (onFormatSelect) {
                onFormatSelect(format)
            }
            
            onOpenChange(false)
        } catch (error) {
            console.error("Erro ao exportar lista:", error)
            Toast.error("Erro ao exportar lista de compradores")
        } finally {
            setIsGenerating(false)
            setSelectedFormat(null)
        }
    }

    const generatePDF = (buyers: TEventListBuyers[], eventName: string) => {
        const doc = new jsPDF()
        
        doc.setFontSize(18)
        doc.text("Lista de Compradores", 14, 20)
        
        doc.setFontSize(12)
        doc.text(`Evento: ${eventName}`, 14, 30)
        doc.text(`Data de geração: ${DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm")}`, 14, 36)
        doc.text(`Total de compradores: ${buyers.length}`, 14, 42)

        const formatFormAnswers = (formAnswers: Record<string, any>): string => {
            if (!formAnswers || Object.keys(formAnswers).length === 0) {
                return "-"
            }

            const formattedAnswers: string[] = []

            Object.entries(formAnswers).forEach(([key, value]) => {
                if (value === null || value === undefined || value === "") {
                    return
                }

                if (Array.isArray(value)) {
                    const arrayValues = value
                        .map((item: any) => {
                            if (typeof item === "object" && item !== null) {
                                if (item.label && item.answer) {
                                    return `${item.label}: ${item.answer}`
                                }
                                return JSON.stringify(item)
                            }
                            return String(item)
                        })
                        .filter(Boolean)
                    if (arrayValues.length > 0) {
                        formattedAnswers.push(`${key}: ${arrayValues.join(", ")}`)
                    }
                } else if (typeof value === "object" && value !== null) {
                    if (value.label && value.answer) {
                        formattedAnswers.push(`${value.label}: ${value.answer}`)
                    } else {
                        formattedAnswers.push(`${key}: ${JSON.stringify(value)}`)
                    }
                } else {
                    formattedAnswers.push(`${key}: ${String(value)}`)
                }
            })

            return formattedAnswers.length > 0 ? formattedAnswers.join("; ") : "-"
        }

        const tableData = buyers.map((buyer, index) => [
            (index + 1).toString(),
            buyer.customerName || "-",
            buyer.ticketTypeName || "-",
            buyer.eventDates?.map((date) => DateUtils.formatDate(date, "DD/MM/YYYY")).join(", ") || "-",
            buyer.paymentDate ? DateUtils.formatDate(typeof buyer.paymentDate === "string" ? buyer.paymentDate : buyer.paymentDate.toISOString(), "DD/MM/YYYY HH:mm") : "-",
            formatFormAnswers(buyer.formAnswers || {})
        ])

        autoTable(doc, {
            startY: 50,
            head: [["#", "Nome", "Tipo de Ingresso", "Datas do Evento", "Data do Pagamento", "Respostas do Formulário"]],
            body: tableData,
            styles: { fontSize: 8 },
            headStyles: { fillColor: [108, 75, 255] },
            columnStyles: {
                0: { cellWidth: 15 },
                1: { cellWidth: 50 },
                2: { cellWidth: 40 },
                3: { cellWidth: 40 },
                4: { cellWidth: 35 },
                5: { cellWidth: 60 }
            },
            margin: { left: 0, right: 0 }
        })

        const fileName = `lista-compradores-${eventName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.pdf`
        doc.save(fileName)
        
        Toast.success("PDF gerado com sucesso!")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full p-6">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-psi-dark">
                        <FileSpreadsheet className="h-5 w-5 text-psi-primary" />
                        Gerar Lista de Compradores
                    </DialogTitle>
                    <DialogDescription className="text-psi-dark/70 mt-2">
                        Escolha o formato em que deseja exportar a lista de compradores do evento.
                    </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4 py-4">
                    {((event?.EventDates && event.EventDates.length > 0) || (event?.TicketTypes && event.TicketTypes && event.TicketTypes.length > 0)) ? (
                        <div className="space-y-3 p-4 rounded-xl border border-psi-primary/20 bg-psi-primary/5">
                            <p className="text-sm font-semibold text-psi-dark">Filtros (Opcional)</p>
                            
                            {event?.EventDates && event.EventDates.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-psi-dark/70 flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        Data do Evento
                                    </label>
                                    <Select
                                        value={selectedEventDateId || "all"}
                                        onValueChange={(value) => setSelectedEventDateId(value === "all" ? undefined : value)}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Todas as datas" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todas as datas</SelectItem>
                                            {event.EventDates.map((eventDate: TEventDate) => (
                                                <SelectItem key={eventDate.id} value={eventDate.id}>
                                                    {eventDate.date 
                                                        ? `${formatEventDate(eventDate.date, "DD/MM/YYYY")}${eventDate.hourStart ? ` - ${formatEventTime(eventDate.hourStart, eventDate.hourEnd)}` : ""}`
                                                        : "Data não definida"
                                                    }
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}

                            {event?.TicketTypes && Array.isArray(event.TicketTypes) && event.TicketTypes.length > 0 && (
                                <div className="space-y-2">
                                    <label className="text-xs font-medium text-psi-dark/70 flex items-center gap-2">
                                        <Ticket className="h-4 w-4" />
                                        Tipo de Ingresso
                                    </label>
                                    <Select
                                        value={selectedTicketTypeId || "all"}
                                        onValueChange={(value) => setSelectedTicketTypeId(value === "all" ? undefined : value)}
                                    >
                                        <SelectTrigger className="w-full bg-white">
                                            <SelectValue placeholder="Todos os tipos" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">Todos os tipos</SelectItem>
                                            {event.TicketTypes.map((ticketType: TTicketType) => (
                                                <SelectItem key={ticketType.id} value={ticketType.id}>
                                                    {ticketType.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            )}
                        </div>
                    ) : null}

                    <div className="space-y-3">
                    <button
                        onClick={() => handleFormatSelect("pdf")}
                        disabled={isGenerating || isFetching}
                        className={cn(
                            "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                    {isGenerating && selectedFormat === "pdf" ? (
                                        <Loader2 className="h-6 w-6 text-psi-primary animate-spin" />
                                    ) : (
                                        <FileText className="h-6 w-6 text-psi-primary" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-psi-dark">PDF</p>
                                        <Badge variant="secondary" className="bg-psi-primary/10 text-psi-primary border-psi-primary/20">
                                            Mais utilizado
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-psi-dark/60 mt-1">
                                        Performance ideal para impressão e compartilhamento
                                    </p>
                                </div>
                            </div>
                            {isGenerating && selectedFormat === "pdf" ? (
                                <Loader2 className="h-5 w-5 text-psi-primary animate-spin" />
                            ) : (
                                <Download className="h-5 w-5 text-psi-dark/40" />
                            )}
                        </div>
                    </button>

                    <button
                        onClick={() => handleFormatSelect("xlsx")}
                        disabled={isGenerating || isFetching}
                        className={cn(
                            "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed",
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                    <FileSpreadsheet className="h-6 w-6 text-psi-primary/80" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-psi-dark">Excel (xlsx)</p>
                                    </div>
                                    <p className="text-xs text-psi-dark/60 mt-1">
                                        Formato ideal para análise e edição
                                    </p>
                                </div>
                            </div>
                            <Download className="h-5 w-5 text-psi-dark/40" />
                        </div>
                    </button>

                    <button
                        onClick={() => handleFormatSelect("csv")}
                        disabled={isGenerating || isFetching}
                        className={cn(
                            "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed",
                            "focus:outline-none focus:ring-2 focus:ring-psi-primary focus:ring-offset-2"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-psi-secondary/10 flex items-center justify-center">
                                    <FileText className="h-6 w-6 text-psi-secondary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-psi-dark">CSV</p>
                                    <p className="text-xs text-psi-dark/60 mt-1">
                                        Formato simples e compatível
                                    </p>
                                </div>
                            </div>
                            <Download className="h-5 w-5 text-psi-dark/40" />
                        </div>
                    </button>

                    <button
                        onClick={() => handleFormatSelect("json")}
                        disabled={isGenerating || isFetching}
                        className={cn(
                            "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left disabled:opacity-50 disabled:cursor-not-allowed",
                            "focus:outline-none focus:ring-2 focus:ring-psi-primary focus:ring-offset-2"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-psi-tertiary/10 flex items-center justify-center">
                                    <Code className="h-6 w-6 text-psi-tertiary" />
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-psi-dark">JSON</p>
                                    <p className="text-xs text-psi-dark/60 mt-1">
                                        Formato para integração e desenvolvimento
                                    </p>
                                </div>
                            </div>
                            <Download className="h-5 w-5 text-psi-dark/40" />
                        </div>
                    </button>
                    </div>
                </div>

                <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-3">
                    <DialogClose asChild>
                        <Button variant="outline" className="w-full sm:w-auto">
                            Cancelar
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export { DialogExportBuyersList }

