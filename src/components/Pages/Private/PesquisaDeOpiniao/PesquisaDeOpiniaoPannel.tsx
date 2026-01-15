"use client"

import { useState } from "react"
import {
    Star,
    Copy,
    Check,
    Calendar,
    Link as LinkIcon,
    Users,
    MessageSquare,
    ChevronDown,
    ChevronUp,
    QrCode,
    Download
} from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Card } from "@/components/Card/Card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useOpinionPollFind } from "@/hooks/OpinionPoll/useOpinionPollFind"
import { Toast } from "@/components/Toast/Toast"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { QRCodeSVG } from "qrcode.react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

const PesquisaDeOpiniaoPannel = () => {
    const { data, isLoading } = useOpinionPollFind()
    const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)
    const [openPolls, setOpenPolls] = useState<Record<string, boolean>>({})
    const [qrCodeDialogOpen, setQrCodeDialogOpen] = useState<string | null>(null)

    const polls = data?.data || []

    const getPollLink = (poll: { code: string }) => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : ""
        return `${baseUrl}/pesquisa?id=${poll.code}`
    }

    const togglePoll = (pollId: string) => {
        setOpenPolls(prev => ({
            ...prev,
            [pollId]: !prev[pollId]
        }))
    }

    const handleCopyLink = async (link: string, pollId: string) => {
        try {
            await navigator.clipboard.writeText(link)
            setCopiedLinkId(pollId)
            Toast.success("Link copiado para a área de transferência!")
            setTimeout(() => setCopiedLinkId(null), 2000)
        } catch (error) {
            Toast.error("Erro ao copiar link")
        }
    }

    const handleDownloadQRCode = (pollCode: string) => {
        const qrCodeElement = document.getElementById(`qr-code-${pollCode}`)
        if (!qrCodeElement) return

        const svg = qrCodeElement.querySelector("svg")
        if (!svg) return

        const svgData = new XMLSerializer().serializeToString(svg)
        const canvas = document.createElement("canvas")
        const ctx = canvas.getContext("2d")
        const img = new Image()

        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height
            ctx?.drawImage(img, 0, 0)
            
            canvas.toBlob((blob) => {
                if (!blob) return
                
                const url = URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `qrcode-pesquisa-${pollCode}.jpg`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)
                
                Toast.success("QR Code baixado com sucesso!")
            }, "image/jpeg", 0.95)
        }

        img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)))
    }

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1
            return (
                <Star
                    key={index}
                    className={cn(
                        "h-5 w-5",
                        starValue <= rating
                            ? "fill-psi-tertiary text-psi-tertiary"
                            : "fill-none text-psi-dark/20"
                    )}
                />
            )
        })
    }

    return (
        <Background variant="light">
            <div className="container mx-auto px-4 py-8 space-y-6 mt-[80px]">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-psi-primary">Pesquisa de Opinião</h1>
                    <p className="text-psi-dark/60">
                        Visualize os links de pesquisa gerados automaticamente após os eventos e acompanhe as respostas dos clientes
                    </p>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Card key={i}>
                                <div className="p-6">
                                    <Skeleton className="h-32 w-full" />
                                </div>
                            </Card>
                        ))}
                    </div>
                ) : polls.length === 0 ? (
                    <Card>
                        <div className="p-12 text-center">
                            <MessageSquare className="h-16 w-16 text-psi-dark/20 mx-auto mb-4" />
                            <p className="text-psi-dark/60 text-lg">
                                Nenhuma pesquisa de opinião disponível ainda
                            </p>
                            <p className="text-psi-dark/40 text-sm mt-2">
                                As pesquisas são geradas automaticamente após o encerramento dos eventos
                            </p>
                        </div>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {polls.map(poll => {
                            const isOpen = openPolls[poll.id] || false
                            
                            return (
                                <Card key={poll.id}>
                                    <Collapsible open={isOpen} onOpenChange={() => togglePoll(poll.id)}>
                                        <div className="p-6">
                                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <h2 className="text-xl font-semibold text-psi-dark">
                                                            {poll.event.name}
                                                        </h2>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-psi-dark/60">
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>{poll.commentsCount} resposta{poll.commentsCount !== 1 ? "s" : ""}</span>
                                                        </div>
                                                        {poll.averageStars > 0 && (
                                                            <div className="flex items-center gap-2">
                                                                <Star className="h-4 w-4 fill-psi-tertiary text-psi-tertiary" />
                                                                <span className="font-medium">
                                                                    {poll.averageStars.toFixed(1)} de 5.0
                                                                </span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <CollapsibleTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="shrink-0"
                                                        >
                                                            {isOpen ? (
                                                                <ChevronUp className="size-8 text-psi-primary" />
                                                            ) : (
                                                                <ChevronDown className="size-8 text-psi-primary" />
                                                            )}
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                </div>
                                            </div>

                                            <CollapsibleContent className="space-y-4 mt-4 pt-4 border-t border-psi-dark/10">
                                                <div>
                                                    <label className="text-sm font-medium text-psi-dark mb-2 block">
                                                        Link da Pesquisa
                                                    </label>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 flex items-center gap-2 p-3 bg-psi-primary/5 border border-psi-primary/20 rounded-lg">
                                                            <LinkIcon className="h-4 w-4 text-psi-primary shrink-0" />
                                                            <span className="text-sm text-psi-dark/70 truncate flex-1">
                                                                {getPollLink(poll)}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleCopyLink(getPollLink(poll), poll.id)}
                                                            className="shrink-0"
                                                            title="Copiar link"
                                                        >
                                                            {copiedLinkId === poll.id ? (
                                                                <Check className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => setQrCodeDialogOpen(poll.id)}
                                                            className="shrink-0"
                                                            title="Ver QR Code"
                                                        >
                                                            <QrCode className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>

                                                {poll.comments && poll.comments.length > 0 && (
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-psi-dark mb-4">
                                                            Respostas dos Clientes ({poll.comments.length})
                                                        </h3>
                                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                                            {poll.comments.map(comment => (
                                                                <div
                                                                    key={comment.id}
                                                                    className="p-4 bg-psi-primary/5 rounded-lg border border-psi-primary/10"
                                                                >
                                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-psi-dark text-sm">
                                                                                {comment.User.firstName} {comment.User.lastName}
                                                                            </p>
                                                                            <p className="text-xs text-psi-dark/60 mt-1">
                                                                                {comment.User.email}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 shrink-0">
                                                                            {renderStars(comment.stars)}
                                                                        </div>
                                                                    </div>
                                                                    {comment.comment && (
                                                                        <div className="mt-3 pt-3 border-t border-psi-primary/20">
                                                                            <p className="text-sm text-psi-dark/70">
                                                                                {comment.comment}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    <p className="text-xs text-psi-dark/40 mt-3">
                                                                        {DateUtils.formatDate(comment.createdAt, "DD/MM/YYYY [às] HH:mm")}
                                                                    </p>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </CollapsibleContent>
                                        </div>
                                    </Collapsible>
                                </Card>
                            )
                        })}
                    </div>
                )}

            <Dialog open={qrCodeDialogOpen !== null} onOpenChange={(open) => {
                if (!open) setQrCodeDialogOpen(null)
            }}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>QR Code da Pesquisa</DialogTitle>
                        <DialogDescription>
                            Escaneie o QR Code para acessar a pesquisa de opinião
                        </DialogDescription>
                    </DialogHeader>
                    {qrCodeDialogOpen && (() => {
                        const poll = polls.find(p => p.id === qrCodeDialogOpen)
                        if (!poll) return null
                        
                        const pollLink = getPollLink(poll)
                        
                        return (
                            <div className="space-y-4 mt-4">
                                <div className="flex justify-center p-4 bg-white rounded-lg border border-psi-primary/20">
                                    <div id={`qr-code-${poll.code}`}>
                                        <QRCodeSVG
                                            value={pollLink}
                                            size={256}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                </div>
                                <div className="text-center space-y-2">
                                    <p className="text-sm font-medium text-psi-dark">
                                        {poll.event.name}
                                    </p>
                                    <p className="text-xs text-psi-dark/60">
                                        {pollLink}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => handleCopyLink(pollLink, poll.id)}
                                    >
                                        {copiedLinkId === poll.id ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                Copiado!
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-4 w-4 mr-2" />
                                                Copiar Link
                                            </>
                                        )}
                                    </Button>
                                    <Button
                                        variant="primary"
                                        className="flex-1"
                                        onClick={() => handleDownloadQRCode(poll.code)}
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Baixar QR Code
                                    </Button>
                                </div>
                            </div>
                        )
                    })()}
                </DialogContent>
            </Dialog>
            </div>
        </Background>
    )
}

export {
    PesquisaDeOpiniaoPannel
}
