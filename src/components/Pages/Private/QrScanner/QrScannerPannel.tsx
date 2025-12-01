"use client"

import { useState, useRef, useEffect } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/Input/Input"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useTicketScan } from "@/hooks/Ticket/useTicketQrScan"
import { TicketService } from "@/services/Ticket/TicketService"
import type { TTicketScanLink } from "@/types/Ticket/TTicket"
import { QrCode, Link2, Trash2, Users, Scan } from "lucide-react"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { Toast } from "@/components/Toast/Toast"

const createLinkSchema = z.object({
    maxUsers: z.number().min(1, { error: "Mínimo de 1 usuário" }).max(100, { error: "Máximo de 100 usuários" }),
    password: z.string().min(4, { error: "Senha deve ter no mínimo 4 caracteres" }).max(50, { error: "Senha deve ter no máximo 50 caracteres" })
})

type TCreateLinkForm = z.infer<typeof createLinkSchema>

const QrScannerPannel = () => {
    const [isScanning, setIsScanning] = useState(false)
    const [scanLinks, setScanLinks] = useState<TTicketScanLink[]>([])
    const [createLinkDialogOpen, setCreateLinkDialogOpen] = useState(false)
    const [deleteLinkDialog, setDeleteLinkDialog] = useState<{ open: boolean; linkId: string }>({ open: false, linkId: "" })
    const scannerRef = useRef<Html5Qrcode | null>(null)
    const scannerContainerRef = useRef<HTMLDivElement>(null)
    const [scannerId] = useState(() => `qr-reader-${Date.now()}`)
    const { mutateAsync: scanTicket, isPending: isScanningPending } = useTicketScan()

    const [qrCodeData, setQrCodeData] = useState<any>(null)

    const form = useForm<TCreateLinkForm>({
        resolver: zodResolver(createLinkSchema),
        defaultValues: {
            maxUsers: 1,
            password: ""
        }
    })

    useEffect(() => {
        loadScanLinks()
    }, [])

    const loadScanLinks = async () => {
        try {
            const response = await TicketService.getScanLinks()
            if (response?.success && response?.data) {
                setScanLinks(response.data)
            }
        } catch (error) {
            console.error("Erro ao carregar links:", error)
        }
    }

    const handleStartScan = async () => {
        setIsScanning(true)
        
        await new Promise(resolve => setTimeout(resolve, 100))
        
        if (!scannerContainerRef.current) {
            setIsScanning(false)
            Toast.error("Erro ao inicializar o scanner")
            return
        }

        try {
            const scanner = new Html5Qrcode(scannerId)
            scannerRef.current = scanner

            await scanner.start(
                { facingMode: "environment" },
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 }
                },
                (decodedText) => {
                    console.log("QR Code lido:", decodedText)
                    setQrCodeData(decodedText)
                    handleScanSuccess(decodedText)
                },
                (errorMessage) => {
                    // Ignorar erros de leitura contínua
                }
            )
        } catch (error) {
            console.error("Erro ao iniciar scanner:", error)
            setIsScanning(false)
            Toast.error("Erro ao iniciar a câmera. Verifique as permissões.")
        }
    }

    const handleStopScan = () => {
        if (scannerRef.current) {
            scannerRef.current.stop().then(() => {
                scannerRef.current?.clear()
                scannerRef.current = null
                setIsScanning(false)
            }).catch((error) => {
                console.error("Erro ao parar scanner:", error)
            })
        }
    }

    const handleScanSuccess = async (qrData: string) => {
        handleStopScan()
        console.log("Dados do QR Code antes de enviar:", qrData)
        
        try {
            const response = await TicketService.scanWithData(qrData)
            if (response?.success) {
                Toast.success("Ingresso validado com sucesso!")
            } else {
                Toast.error("Erro ao validar ingresso")
            }
        } catch (error) {
            console.error("Erro ao escanear:", error)
            Toast.error("Erro ao validar ingresso")
        }
    }

    const handleCreateLink = async (data: TCreateLinkForm) => {
        if (scanLinks.length >= 5) {
            Toast.error("Você já possui o máximo de 5 links ativos")
            return
        }

        try {
            const response = await TicketService.createScanLink(data)
            if (response?.success) {
                Toast.success("Link criado com sucesso!")
                setCreateLinkDialogOpen(false)
                form.reset()
                loadScanLinks()
            }
        } catch (error) {
            console.error("Erro ao criar link:", error)
            Toast.error("Erro ao criar link")
        }
    }

    const handleDeleteLink = async () => {
        try {
            const response = await TicketService.deleteScanLink({ linkId: deleteLinkDialog.linkId })
            if (response?.success) {
                Toast.success("Link excluído com sucesso!")
                setDeleteLinkDialog({ open: false, linkId: "" })
                loadScanLinks()
            }
        } catch (error) {
            console.error("Erro ao excluir link:", error)
            Toast.error("Erro ao excluir link")
        }
    }

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current.stop().catch(() => {})
            }
        }
    }, [])

    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[80px]">
                <div className="max-w-4xl mx-auto space-y-6">
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-psi-primary">Escaneamento de QR Code</h1>
                            <p className="text-sm text-psi-dark/60 mt-1">Escaneie os ingressos dos participantes</p>
                        </div>
                        <div className="flex flex-col mt-4 lg:mt-0 lg:flex-row lg:items-cente justify-start lg:justify-end gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setCreateLinkDialogOpen(true)}
                                disabled={scanLinks.length >= 5}
                            >
                                <Link2 className="h-4 w-4 mr-2" />
                                Criar link de escaneamento
                            </Button>
                            {isScanning ? (
                                <Button
                                    variant="destructive"
                                    onClick={handleStopScan}
                                >
                                    Parar Escaneamento
                                </Button>
                            ) : (
                                <Button
                                    variant="primary"
                                    onClick={handleStartScan}
                                >
                                    <Scan className="h-4 w-4 mr-2" />
                                    Escanear
                                </Button>
                            )}
                        </div>
                    </div>

                    {isScanning && (
                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                            <div
                                id={scannerId}
                                ref={scannerContainerRef}
                                className="w-full"
                            />
                        </div>
                    )}

                    {scanLinks.length > 0 && (
                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                            <h2 className="text-xl font-semibold text-psi-dark mb-4">Links de Escaneamento</h2>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Link</TableHead>
                                        <TableHead>Usuários Conectados</TableHead>
                                        <TableHead>Máximo de Usuários</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {scanLinks.map((link) => (
                                        <TableRow key={link.id}>
                                            <TableCell className="font-mono text-sm">
                                                {link.link}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <Users className="h-4 w-4 text-psi-primary" />
                                                    <span>{link.currentUsers}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{link.maxUsers}</TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => setDeleteLinkDialog({ open: true, linkId: link.id })}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    {!qrCodeData || qrCodeData && (
                        <div className="rounded-xl border border-psi-primary/20 bg-white p-6">
                            <h2 className="text-xl font-semibold text-psi-dark mb-4">Dados do QR Code</h2>
                            <pre className="text-sm text-psi-dark/60 bg-psi-dark/5 p-4 rounded-lg overflow-auto">{qrCodeData}</pre>
                        </div>
                    )}

                    <Dialog open={createLinkDialogOpen} onOpenChange={setCreateLinkDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Criar Link de Escaneamento</DialogTitle>
                                <DialogDescription>
                                    Crie um link para compartilhar com sua equipe. Máximo de 5 links ativos.
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={form.handleSubmit(handleCreateLink)} className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="maxUsers" className="text-sm font-medium text-psi-dark">
                                        Número máximo de pessoas simultâneas
                                    </label>
                                    <Controller
                                        name="maxUsers"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="maxUsers"
                                                type="number"
                                                min={1}
                                                max={100}
                                                onChange={(e) => field.onChange(Number(e.target.value))}
                                                required
                                            />
                                        )}
                                    />
                                    {form.formState.errors.maxUsers && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.maxUsers.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="password" className="text-sm font-medium text-psi-dark">
                                        Senha
                                    </label>
                                    <Controller
                                        name="password"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id="password"
                                                type="password"
                                                required
                                            />
                                        )}
                                    />
                                    {form.formState.errors.password && (
                                        <p className="text-xs text-destructive">
                                            {form.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setCreateLinkDialogOpen(false)}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" variant="primary">
                                        Criar Link
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>

                    <DialogConfirm
                        open={deleteLinkDialog.open}
                        onOpenChange={(open) => setDeleteLinkDialog({ open, linkId: deleteLinkDialog.linkId })}
                        onConfirm={handleDeleteLink}
                        title="Excluir Link"
                        description="Tem certeza que deseja excluir este link? A equipe não conseguirá mais acessá-lo."
                        confirmText="Excluir"
                        cancelText="Cancelar"
                        variant="destructive"
                    />
                </div>
            </div>
        </Background>
    )
}

export {
    QrScannerPannel
}
