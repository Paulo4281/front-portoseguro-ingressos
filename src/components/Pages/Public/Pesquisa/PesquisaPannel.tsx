"use client"

import { useState } from "react"
import Image from "next/image"
import {
    Star,
    Calendar,
    Clock,
    MapPin,
    MessageSquare
} from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/Card/Card"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { cn } from "@/lib/utils"

const MOCK_EVENT = {
    id: "event-1",
    name: "Show de Rock em Porto Seguro",
    image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80",
    date: "2024-01-15T20:00:00Z",
    location: "Praia de Taperapuan - Porto Seguro, BA"
}

const PesquisaPannel = () => {
    const [rating, setRating] = useState<number>(5)
    const [hoveredRating, setHoveredRating] = useState<number | null>(null)
    const [comment, setComment] = useState<string>("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleStarClick = (starValue: number) => {
        setRating(starValue)
    }

    const handleStarHover = (starValue: number) => {
        setHoveredRating(starValue)
    }

    const handleStarLeave = () => {
        setHoveredRating(null)
    }

    const displayRating = hoveredRating || rating

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setIsSubmitting(false)
    }

    const commentLength = comment.length
    const maxCommentLength = 600

    return (
        <Background variant="light">
            <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col">
                <div className="max-w-2xl mx-auto w-full flex-1 flex flex-col mt-[80px]">
                    <div className="space-y-6 mb-8">
                        <div className="text-center space-y-2">
                            <h1 className="text-3xl font-bold text-psi-primary">Pesquisa de Satisfação</h1>
                            <p className="text-psi-dark/60">
                                Sua opinião é muito importante para nós!
                            </p>
                        </div>

                        <Card>
                            <div className="p-6 space-y-6">
                                <div className="space-y-4">
                                    {MOCK_EVENT.image && (
                                        <div className="relative w-full h-90 rounded-lg overflow-hidden">
                                            <img
                                                src={MOCK_EVENT.image}
                                                alt={MOCK_EVENT.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                    )}
                                    
                                    <div className="space-y-3">
                                        <h2 className="text-xl font-semibold text-psi-dark">
                                            {MOCK_EVENT.name}
                                        </h2>
                                        
                                        <div className="space-y-2 text-sm text-psi-dark/70">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="h-4 w-4 text-psi-primary" />
                                                <span>
                                                    {DateUtils.formatDate(MOCK_EVENT.date, "DD/MM/YYYY")}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4 text-psi-primary" />
                                                <span>
                                                    {DateUtils.formatDate(MOCK_EVENT.date, "HH:mm")}
                                                </span>
                                            </div>
                                            {MOCK_EVENT.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-psi-primary" />
                                                    <span>{MOCK_EVENT.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <form onSubmit={handleSubmit} className="space-y-6 p-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-sm font-medium text-psi-dark mb-3 block">
                                            Como você avalia este evento? <span className="text-destructive">*</span>
                                        </label>
                                        <div 
                                            className="flex items-center gap-2"
                                            onMouseLeave={handleStarLeave}
                                        >
                                            {Array.from({ length: 5 }, (_, index) => {
                                                const starValue = index + 1
                                                return (
                                                    <button
                                                        key={index}
                                                        type="button"
                                                        onClick={() => handleStarClick(starValue)}
                                                        onMouseEnter={() => handleStarHover(starValue)}
                                                        className="focus:outline-none focus:ring-2 focus:ring-psi-primary focus:ring-offset-2 rounded transition-transform hover:scale-110"
                                                    >
                                                        <Star
                                                            className={cn(
                                                                "h-10 w-10 transition-colors",
                                                                starValue <= displayRating
                                                                    ? "fill-psi-tertiary text-psi-tertiary"
                                                                    : "fill-none text-psi-dark/20"
                                                            )}
                                                        />
                                                    </button>
                                                )
                                            })}
                                        </div>
                                        <p className="text-xs text-psi-dark/50 mt-2">
                                            {displayRating === 1 && "Péssimo"}
                                            {displayRating === 2 && "Ruim"}
                                            {displayRating === 3 && "Regular"}
                                            {displayRating === 4 && "Bom"}
                                            {displayRating === 5 && "Excelente"}
                                        </p>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <MessageSquare className="h-4 w-4 text-psi-dark" />
                                            <label className="text-sm font-medium text-psi-dark">
                                                Comentário (opcional)
                                            </label>
                                        </div>
                                        <Textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            placeholder="Conte-nos sua experiência com este evento..."
                                            maxLength={maxCommentLength}
                                            className="min-h-32 resize-none"
                                        />
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-psi-dark/50">
                                                Seu comentário nos ajuda a melhorar cada vez mais
                                            </p>
                                            <p className={cn(
                                                "text-xs",
                                                commentLength >= maxCommentLength
                                                    ? "text-destructive"
                                                    : "text-psi-dark/50"
                                            )}>
                                                {commentLength}/{maxCommentLength}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-psi-dark/10">
                                    <Button
                                        type="submit"
                                        variant="primary"
                                        className="w-full"
                                        disabled={isSubmitting || rating < 1}
                                    >
                                        {isSubmitting ? "Enviando..." : "Enviar Avaliação"}
                                    </Button>
                                </div>
                            </form>
                        </Card>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    PesquisaPannel
}
