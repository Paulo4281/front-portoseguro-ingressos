"use client"

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
import { FileSpreadsheet, FileText, Code, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type TDialogExportBuyersListProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onFormatSelect?: (format: "xlsx" | "csv" | "json") => void
}

const DialogExportBuyersList = ({ open, onOpenChange, onFormatSelect }: TDialogExportBuyersListProps) => {
    const handleFormatSelect = (format: "xlsx" | "csv" | "json") => {
        if (onFormatSelect) {
            onFormatSelect(format)
        }
        onOpenChange(false)
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
                
                <div className="space-y-3 py-4">
                    <button
                        onClick={() => handleFormatSelect("xlsx")}
                        className={cn(
                            "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left",
                            "focus:outline-none focus:ring-2 focus:ring-psi-primary focus:ring-offset-2"
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                    <FileSpreadsheet className="h-6 w-6 text-psi-primary" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-semibold text-psi-dark">Excel (xlsx)</p>
                                        <Badge variant="secondary" className="bg-psi-primary/10 text-psi-primary border-psi-primary/20">
                                            Mais utilizado
                                        </Badge>
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
                        className={cn(
                            "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left",
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
                        className={cn(
                            "w-full p-4 rounded-xl border-2 border-[#E4E6F0] bg-white hover:border-psi-primary hover:bg-psi-primary/5 transition-all duration-200 text-left",
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

