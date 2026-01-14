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
    ChevronUp
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

const PesquisaDeOpiniaoPannel = () => {
    const { data, isLoading } = useOpinionPollFind()
    const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null)
    const [openPolls, setOpenPolls] = useState<Record<string, boolean>>({})

    const polls = data?.data?.data || []

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
                                                            {poll.eventName}
                                                        </h2>
                                                    </div>
                                                    <div className="flex flex-wrap items-center gap-4 text-sm text-psi-dark/60">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4" />
                                                            <span>
                                                                {DateUtils.formatDate(poll.eventDate, "DD/MM/YYYY [às] HH:mm")}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Users className="h-4 w-4" />
                                                            <span>{poll.totalResponses} resposta{poll.totalResponses !== 1 ? "s" : ""}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Star className="h-4 w-4 fill-psi-tertiary text-psi-tertiary" />
                                                            <span className="font-medium">
                                                                {poll.averageRating.toFixed(1)} de 5.0
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center gap-1">
                                                        {renderStars(Math.round(poll.averageRating))}
                                                    </div>
                                                    <CollapsibleTrigger asChild>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="shrink-0"
                                                        >
                                                            {isOpen ? (
                                                                <ChevronUp className="h-5 w-5 text-psi-primary" />
                                                            ) : (
                                                                <ChevronDown className="h-5 w-5 text-psi-primary" />
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
                                                                {poll.link}
                                                            </span>
                                                        </div>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            onClick={() => handleCopyLink(poll.link, poll.id)}
                                                            className="shrink-0"
                                                            title="Copiar link"
                                                        >
                                                            {copiedLinkId === poll.id ? (
                                                                <Check className="h-4 w-4 text-green-600" />
                                                            ) : (
                                                                <Copy className="h-4 w-4" />
                                                            )}
                                                        </Button>
                                                    </div>
                                                </div>

                                                {poll.responses.length > 0 && (
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-psi-dark mb-4">
                                                            Respostas dos Clientes ({poll.responses.length})
                                                        </h3>
                                                        <div className="space-y-4 max-h-96 overflow-y-auto">
                                                            {poll.responses.map(response => (
                                                                <div
                                                                    key={response.id}
                                                                    className="p-4 bg-psi-primary/5 rounded-lg border border-psi-primary/10"
                                                                >
                                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                                        <div className="flex-1 min-w-0">
                                                                            <p className="font-medium text-psi-dark text-sm">
                                                                                {response.customerName}
                                                                            </p>
                                                                            <p className="text-xs text-psi-dark/60 mt-1">
                                                                                {response.customerEmail}
                                                                            </p>
                                                                        </div>
                                                                        <div className="flex items-center gap-1 shrink-0">
                                                                            {renderStars(response.rating)}
                                                                        </div>
                                                                    </div>
                                                                    {response.comment && (
                                                                        <div className="mt-3 pt-3 border-t border-psi-primary/20">
                                                                            <p className="text-sm text-psi-dark/70">
                                                                                {response.comment}
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                    <p className="text-xs text-psi-dark/40 mt-3">
                                                                        {DateUtils.formatDate(response.createdAt, "DD/MM/YYYY [às] HH:mm")}
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
            </div>
        </Background>
    )
}

export {
    PesquisaDeOpiniaoPannel
}
