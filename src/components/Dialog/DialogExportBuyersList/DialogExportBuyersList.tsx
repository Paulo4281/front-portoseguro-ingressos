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
import * as XLSX from "xlsx"

type TDialogExportBuyersListProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    eventId: string
    eventName?: string
    eventDateId?: string
    ticketTypeId?: string
    eventData: TEvent
    onFormatSelect?: (format: "pdf" | "xlsx" | "csv" | "json") => void
}

const DialogExportBuyersList = ({ 
    open, 
    onOpenChange, 
    eventId,
    eventName,
    eventDateId: initialEventDateId,
    ticketTypeId: initialTicketTypeId,
    eventData,
    onFormatSelect 
}: TDialogExportBuyersListProps) => {
    const [isGenerating, setIsGenerating] = useState(false)
    const [selectedFormat, setSelectedFormat] = useState<"pdf" | "xlsx" | "csv" | "json" | null>(null)
    const [selectedEventDateId, setSelectedEventDateId] = useState<string | undefined>(initialEventDateId)
    const [selectedTicketTypeId, setSelectedTicketTypeId] = useState<string | undefined>(initialTicketTypeId)

    const event = eventData

    const { data: buyersData, refetch, isFetching } = useEventListBuyers({
        eventId,
        eventDateId: selectedEventDateId,
        ticketTypeId: selectedTicketTypeId,
        onlyConfirmed: true,
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
                generatePDF(buyersData)
            } else if (format === "xlsx") {
                generateXLSX(buyersData)
            } else if (format === "csv") {
                generateCSV(buyersData)
            } else if (format === "json") {
                generateJSON(buyersData)
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

    const formatFormAnswers = (formAnswers: Record<string, any>, type: "pdf" | "xlsx" | "csv" | "json"): string => {
        if (!formAnswers || Object.keys(formAnswers).length === 0) {
            return "-"
        }

        const formattedAnswers: string[] = []
        const metadataFields = ["ticketNumber", "ticketTypeId"]
        const separator = type === "xlsx" ? " || " : type === "csv" ? " | " : "\n"

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
                            if (type === "xlsx") {
                                formattedAnswers.push(`${item.label}: ${item.answer}`)
                            } else {
                                formattedAnswers.push(`${item.label}: ${item.answer} `)
                            }
                        }
                    } else if (item) {
                        formattedAnswers.push(String(item))
                    }
                })
            } else if (typeof value === "object" && value !== null) {
                if (value.label && value.answer) {
                    if (type === "xlsx") {
                        formattedAnswers.push(`${value.label}: ${value.answer}`)
                    } else {
                        formattedAnswers.push(`${value.label}: ${value.answer} `)
                    }
                }
            } else {
                formattedAnswers.push(String(value))
            }
        })

        return formattedAnswers.length > 0 ? formattedAnswers.join(separator) : "-"
    }

    const generatePDF = (buyers: TEventListBuyers[]) => {
        const doc = new jsPDF()
        
        doc.setFontSize(18)
        doc.text("Lista de participantes", 14, 20)
        
        doc.setFontSize(12)
        doc.text(`Evento: ${eventData.name}`, 14, 30)
        doc.text(`Data de geração: ${DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm")}`, 14, 36)
        doc.text(`Total de ingressos: ${buyers.length}`, 14, 42)

        const tableData = buyers.map((buyer, index) => [
            (index + 1).toString(),
            buyer.customerName || "-",
            buyer.ticketTypeName || "-",
            buyer.eventDates?.map((date) => DateUtils.formatDate(date, "DD/MM/YYYY")).join(", ") || "-",
            buyer.paymentDate ? DateUtils.formatDate(typeof buyer.paymentDate === "string" ? buyer.paymentDate : buyer.paymentDate.toISOString(), "DD/MM/YYYY HH:mm") : "-",
            formatFormAnswers(buyer.formAnswers || {}, "pdf")
        ])

        autoTable(doc, {
            startY: 50,
            head: [["#", "Nome", "Tipo de Ingresso", "Datas do Evento", "Data do Pagamento", "Respostas do Formulário"]],
            body: tableData,
            styles: { 
                fontSize: 9,
                cellPadding: 2.5,
                overflow: "linebreak",
                cellWidth: "wrap",
                lineWidth: 0.1,
                lineColor: [200, 200, 200]
            },
            headStyles: { 
                fillColor: [108, 75, 255],
                textColor: [255, 255, 255],
                fontStyle: "bold",
                fontSize: 9
            },
            columnStyles: {
                0: { cellWidth: 12, halign: "center" },
                1: { cellWidth: 35 },
                2: { cellWidth: 30 },
                3: { cellWidth: 28 },
                4: { cellWidth: 30 },
                5: { 
                    cellWidth: 55,
                    cellPadding: 3
                }
            },
            margin: { left: 14, right: 14 },
            didParseCell: (data: any) => {
                if (data.column.index === 5 && data.cell.text) {
                    const text = data.cell.text[0]
                    if (typeof text === "string" && text.includes("\n")) {
                        data.cell.text = text.split("\n")
                    }
                }
            },
            alternateRowStyles: {
                fillColor: [250, 250, 250]
            }
        })

        const fileName = `lista-compradores-${eventData.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.pdf`
        doc.save(fileName)
        
        Toast.success("PDF gerado com sucesso!")
    }

    const generateXLSX = (buyers: TEventListBuyers[]) => {
        const worksheetData: any[] = []

        worksheetData.push(["Lista de Participantes"])
        worksheetData.push([])
        worksheetData.push(["Evento", eventData.name])
        worksheetData.push(["Data de geração", DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm")])
        worksheetData.push(["Total de ingressos", buyers.length])
        worksheetData.push([])

        const headers = ["#", "Nome", "Tipo de Ingresso", "Datas do Evento", "Data do Pagamento", "Respostas do Formulário"]
        worksheetData.push(headers)

        buyers.forEach((buyer, index) => {
            worksheetData.push([
                index + 1,
                buyer.customerName || "-",
                buyer.ticketTypeName || "-",
                buyer.eventDates?.map((date) => DateUtils.formatDate(date, "DD/MM/YYYY")).join(", ") || "-",
                buyer.paymentDate 
                    ? DateUtils.formatDate(
                        typeof buyer.paymentDate === "string" 
                            ? buyer.paymentDate 
                            : buyer.paymentDate.toISOString(), 
                        "DD/MM/YYYY HH:mm"
                    )
                    : "-",
                formatFormAnswers(buyer.formAnswers || {}, "xlsx")
            ])
        })

        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

        const columnWidths = [
            { wch: 5 },
            { wch: 30 },
            { wch: 25 },
            { wch: 25 },
            { wch: 20 },
            { wch: 50 }
        ]
        worksheet["!cols"] = columnWidths

        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1")
        for (let row = 7; row <= range.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: 5 })
            if (!worksheet[cellAddress]) continue
            if (!worksheet[cellAddress].s) worksheet[cellAddress].s = {}
            if (!worksheet[cellAddress].s.alignment) worksheet[cellAddress].s.alignment = {}
            worksheet[cellAddress].s.alignment.wrapText = true
            worksheet[cellAddress].s.alignment.vertical = "top"
        }

        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Participantes")

        const fileName = `lista-compradores-${eventData.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.xlsx`
        XLSX.writeFile(workbook, fileName)
        
        Toast.success("Arquivo Excel gerado com sucesso!")
    }

    const escapeCSVField = (field: string): string => {
        if (field.includes(",") || field.includes('"') || field.includes("\n")) {
            return `"${field.replace(/"/g, '""')}"`
        }
        return field
    }

    const generateCSV = (buyers: TEventListBuyers[]) => {
        const csvRows: string[] = []

        csvRows.push("Lista de Participantes")
        csvRows.push("")
        csvRows.push(`Evento,${escapeCSVField(eventData.name)}`)
        csvRows.push(`Data de geração,${escapeCSVField(DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm"))}`)
        csvRows.push(`Total de ingressos,${buyers.length}`)
        csvRows.push("")

        const headers = ["#", "Nome", "Tipo de Ingresso", "Datas do Evento", "Data do Pagamento", "Respostas do Formulário"]
        csvRows.push(headers.map(escapeCSVField).join(","))

        buyers.forEach((buyer, index) => {
            const row = [
                (index + 1).toString(),
                buyer.customerName || "-",
                buyer.ticketTypeName || "-",
                buyer.eventDates?.map((date) => DateUtils.formatDate(date, "DD/MM/YYYY")).join(", ") || "-",
                buyer.paymentDate 
                    ? DateUtils.formatDate(
                        typeof buyer.paymentDate === "string" 
                            ? buyer.paymentDate 
                            : buyer.paymentDate.toISOString(), 
                        "DD/MM/YYYY HH:mm"
                    )
                    : "-",
                formatFormAnswers(buyer.formAnswers || {}, "csv")
            ]
            csvRows.push(row.map(escapeCSVField).join(","))
        })

        const csvContent = csvRows.join("\n")
        const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `lista-compradores-${eventData.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.csv`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        Toast.success("Arquivo CSV gerado com sucesso!")
    }

    const generateJSON = (buyers: TEventListBuyers[]) => {
        const jsonData = {
            evento: {
                id: eventData.id,
                nome: eventData.name,
                dataGeracao: DateUtils.formatDate(new Date().toISOString(), "DD/MM/YYYY HH:mm"),
                totalIngressos: buyers.length
            },
            participantes: buyers.map((buyer, index) => ({
                numero: index + 1,
                nome: buyer.customerName || null,
                tipoIngresso: buyer.ticketTypeName || null,
                datasEvento: buyer.eventDates?.map((date) => DateUtils.formatDate(date, "DD/MM/YYYY")) || [],
                dataPagamento: buyer.paymentDate 
                    ? DateUtils.formatDate(
                        typeof buyer.paymentDate === "string" 
                            ? buyer.paymentDate 
                            : buyer.paymentDate.toISOString(), 
                        "DD/MM/YYYY HH:mm"
                    )
                    : null,
                respostasFormulario: buyer.formAnswers || {}
            }))
        }

        const jsonContent = JSON.stringify(jsonData, null, 2)
        const blob = new Blob([jsonContent], { type: "application/json;charset=utf-8;" })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `lista-compradores-${eventData.name.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-${Date.now()}.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        
        Toast.success("Arquivo JSON gerado com sucesso!")
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
                            <p className="text-sm font-medium text-psi-dark">Filtros (Opcional)</p>
                            
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
                                        <p className="text-sm font-medium text-psi-dark">PDF</p>
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
                                        <p className="text-sm font-medium text-psi-dark">Excel (xlsx)</p>
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
                                    <p className="text-sm font-medium text-psi-dark">CSV</p>
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
                                    <p className="text-sm font-medium text-psi-dark">JSON</p>
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

