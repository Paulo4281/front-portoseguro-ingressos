"use client"

import { type ChangeEvent } from "react"
import { FileText, Upload, Loader2 } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { TNotaFiscal } from "@/types/NotaFiscal/TNotaFiscal"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"

type TDialogNotaFiscalOrganizerProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    customerName: string
    paymentId: string | null
    notaFiscal: TNotaFiscal | undefined
    onUploadPdf: (paymentId: string, event: ChangeEvent<HTMLInputElement>) => Promise<void>
    onUploadXml: (paymentId: string, event: ChangeEvent<HTMLInputElement>) => Promise<void>
    uploadingPdf: boolean
    uploadingXml: boolean
}

const DialogNotaFiscalOrganizer = ({
    open,
    onOpenChange,
    customerName,
    paymentId,
    notaFiscal,
    onUploadPdf,
    onUploadXml,
    uploadingPdf,
    uploadingXml
}: TDialogNotaFiscalOrganizerProps) => {
    const hasPdf = !!notaFiscal?.pdfLink
    const hasXml = !!notaFiscal?.xmlLink
    const hasNotaFiscal = hasPdf || hasXml
    const requested = !!notaFiscal?.requested

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-psi-primary" />
                        Informações fiscais
                    </DialogTitle>
                    <DialogDescription>
                        Nota fiscal referente à compra de <strong>{customerName}</strong>
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge className={hasNotaFiscal ? "bg-green-50 text-green-700 border-green-200" : "bg-amber-50 text-amber-700 border-amber-200"}>
                            {hasNotaFiscal ? "Disponível" : "Pendente"}
                        </Badge>
                        {requested && (
                            <Badge className="bg-red-50 text-red-700 border-red-200">
                                Cliente solicitou NF
                            </Badge>
                        )}
                    </div>

                    {hasNotaFiscal ? (
                        <div className="flex flex-wrap items-center gap-2">
                            {hasPdf && (
                                <a
                                    href={ImageUtils.getNotaFiscalFileUrl(notaFiscal?.pdfLink)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="sm">
                                        <FileText className="h-4 w-4" />
                                        Visualizar PDF
                                    </Button>
                                </a>
                            )}
                            {hasXml && (
                                <a
                                    href={ImageUtils.getNotaFiscalFileUrl(notaFiscal?.xmlLink)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Button variant="outline" size="sm">
                                        <FileText className="h-4 w-4" />
                                        Visualizar XML
                                    </Button>
                                </a>
                            )}
                        </div>
                    ) : paymentId ? (
                        <div className="space-y-3">
                            <p className="text-sm text-psi-dark/70">
                                A nota fiscal desta compra ainda não foi enviada. Envie o PDF e/ou o XML para disponibilizar ao cliente.
                            </p>
                            <div className="flex flex-wrap items-center gap-2">
                                <input
                                    id="dialog-nf-upload-pdf"
                                    type="file"
                                    accept="application/pdf,.pdf"
                                    className="hidden"
                                    onChange={(e) => onUploadPdf(paymentId, e)}
                                />
                                <Button
                                    variant="tertiary"
                                    size="sm"
                                    onClick={() => document.getElementById("dialog-nf-upload-pdf")?.click()}
                                    disabled={uploadingPdf}
                                >
                                    {uploadingPdf ? (
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

                                <input
                                    id="dialog-nf-upload-xml"
                                    type="file"
                                    accept=".xml,text/xml,application/xml"
                                    className="hidden"
                                    onChange={(e) => onUploadXml(paymentId, e)}
                                />
                                <Button
                                    variant="tertiary"
                                    size="sm"
                                    onClick={() => document.getElementById("dialog-nf-upload-xml")?.click()}
                                    disabled={uploadingXml}
                                >
                                    {uploadingXml ? (
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
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-psi-dark/60">Nenhum pagamento associado a esta compra.</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}

export { DialogNotaFiscalOrganizer }
