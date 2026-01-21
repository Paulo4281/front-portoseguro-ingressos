"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import Image from "next/image"
import {
    Star,
    Calendar,
    Clock,
    MapPin,
    MessageSquare,
    Mail,
    Lock,
    UserPlus,
    ArrowRight,
    CheckCircle2
} from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/Card/Card"
import { Input } from "@/components/Input/Input"
import { FieldError } from "@/components/FieldError/FieldError"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { Skeleton } from "@/components/ui/skeleton"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { formatEventDate, formatEventTime } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { cn } from "@/lib/utils"
import { useOpinionPollFindByCode } from "@/hooks/OpinionPoll/useOpinionPollFindByCode"
import { useOpinionPollCommentFindByUserId } from "@/hooks/OpinionPollComment/useOpinionPollCommentFindByUserId"
import { useOpinionPollCommentCreate } from "@/hooks/OpinionPollComment/useOpinionPollCommentCreate"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useAuthLogin } from "@/hooks/Auth/useAuthLogin"
import { useAuthLoginWithGoogle } from "@/hooks/Auth/useAuthLoginWithGoogle"
import { useRouter } from "next/navigation"
import { AuthValidator } from "@/validators/Auth/AuthValidator"
import { TAuth } from "@/types/Auth/TAuth"
import { Toast } from "@/components/Toast/Toast"
import { z } from "zod"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
                    renderButton: (element: HTMLElement, config: any) => void
                    prompt: () => void
                }
            }
        }
    }
}

const OpinionPollCommentValidator = z.object({
    stars: z.number().min(1, { error: "Selecione uma avaliação" }).max(5),
    comment: z.string().max(600, { error: "O comentário deve ter no máximo 600 caracteres" }).optional().nullable()
})

type TOpinionPollCommentForm = z.infer<typeof OpinionPollCommentValidator>

const PesquisaPannel = () => {
    const searchParams = useSearchParams()
    const code = searchParams.get("id") || ""
    const { user, isAuthenticated, setUser } = useAuthStore()
    const router = useRouter()
    const { mutateAsync: loginUser, isPending: isLoggingIn } = useAuthLogin()
    const { mutateAsync: loginWithGoogle, isPending: isLoggingInWithGoogle } = useAuthLoginWithGoogle()
    const googleButtonRef = useRef<HTMLDivElement>(null)
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false)

    const { data: pollData, isLoading: isLoadingPoll, refetch: refetchPoll } = useOpinionPollFindByCode(code)
    const poll = pollData?.data || null

    const { data: userCommentData, isLoading: isLoadingComment, refetch: refetchComment } = useOpinionPollCommentFindByUserId(
        isAuthenticated && poll ? poll.id : undefined
    )
    const userComment = userCommentData?.data || null

    const { mutateAsync: createComment, isPending: isSubmitting } = useOpinionPollCommentCreate()

    const commentForm = useForm<TOpinionPollCommentForm>({
        resolver: zodResolver(OpinionPollCommentValidator),
        defaultValues: {
            stars: 5,
            comment: ""
        }
    })

    const loginForm = useForm<TAuth>({
        resolver: zodResolver(AuthValidator)
    })

    const [rating, setRating] = useState<number>(5)
    const [hoveredRating, setHoveredRating] = useState<number | null>(null)
    const comment = commentForm.watch("comment") || ""

    useEffect(() => {
        if (userComment) {
            setRating(userComment.stars)
            commentForm.setValue("stars", userComment.stars)
            commentForm.setValue("comment", userComment.comment || "")
        }
    }, [userComment, commentForm])

    useEffect(() => {
        if (isAuthenticated && poll) {
            refetchComment()
        }
    }, [isAuthenticated, poll, refetchComment])

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_SOCIAL_LOGIN_CLIENT_ID
        if (!clientId || !googleButtonRef.current) return

        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse
                })
                setIsGoogleScriptLoaded(true)
                if (googleButtonRef.current) {
                    window.google.accounts.id.renderButton(googleButtonRef.current, {
                        theme: "outline",
                        size: "large",
                        width: "100%",
                        text: "signin_with",
                        locale: "pt-BR"
                    })
                }
            }
        }
        document.head.appendChild(script)

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script)
            }
        }
    }, [])

    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        try {
            const authResponse = await loginWithGoogle(response.credential)
            if (authResponse && authResponse.success && authResponse.data?.user) {
                setUser(authResponse.data.user)
                Toast.success("Login realizado com sucesso!")
                if (authResponse.data.user.role === "NOT_DEFINED") {
                    router.push("/confirmar-social")
                } else {
                    refetchComment()
                }
            }
        } catch (error) {
            Toast.error("Erro ao fazer login")
        }
    }, [loginWithGoogle, setUser, router, refetchComment])

    const handleLoginSubmit = async (data: TAuth) => {
        const response = await loginUser(data)
        if (response && response.success && response.data?.user) {
            setUser(response.data.user)
            Toast.success("Login realizado com sucesso!")
            if (response.data.user.role === "NOT_DEFINED") {
                router.push("/confirmar-social")
            } else {
                refetchComment()
            }
        }
    }

    const handleStarClick = (starValue: number) => {
        setRating(starValue)
        commentForm.setValue("stars", starValue)
    }

    const handleStarHover = (starValue: number) => {
        setHoveredRating(starValue)
    }

    const handleStarLeave = () => {
        setHoveredRating(null)
    }

    const displayRating = hoveredRating || rating

    const handleSubmit = async (data: TOpinionPollCommentForm) => {
        if (!poll) return

        try {
            await createComment({
                opinionPollId: poll.id,
                stars: data.stars,
                comment: data.comment || null
            })
            Toast.success("Avaliação enviada com sucesso! Obrigado!")
            commentForm.reset()
            setRating(5)
            refetchComment()
            refetchPoll()
        } catch (error) {}
    }

    const commentLength = comment.length
    const maxCommentLength = 600

    const renderStars = (ratingValue: number) => {
        return Array.from({ length: 5 }, (_, index) => {
            const starValue = index + 1
            return (
                <Star
                    key={index}
                    className={cn(
                        "h-5 w-5",
                        starValue <= ratingValue
                            ? "fill-psi-tertiary text-psi-tertiary"
                            : "fill-none text-psi-dark/20"
                    )}
                />
            )
        })
    }

    if (!code) {
        return (
            <Background variant="light">
                <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center mt-[80px]">
                    <Card>
                        <div className="p-12 text-center">
                            <p className="text-psi-dark/60 text-lg">
                                Código da pesquisa não encontrado
                            </p>
                        </div>
                    </Card>
                </div>
            </Background>
        )
    }

    if (isLoadingPoll) {
        return (
            <Background variant="light">
                <div className="container mx-auto px-4 py-8 min-h-screen flex flex-col mt-[80px]">
                    <div className="max-w-2xl mx-auto w-full space-y-6">
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </div>
            </Background>
        )
    }

    if (!poll) {
        return (
            <Background variant="light">
                <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center mt-[80px]">
                    <Card>
                        <div className="p-12 text-center">
                            <p className="text-psi-dark/60 text-lg">
                                Pesquisa não encontrada
                            </p>
                        </div>
                    </Card>
                </div>
            </Background>
        )
    }

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
                                    <div className="space-y-3">

                                        <img src={ImageUtils.getEventImageUrl(poll.event.image || "")} alt={poll.event.name} className="w-full h-100 object-cover rounded-lg" />

                                        <h2 className="text-xl font-semibold text-psi-dark">
                                            {poll.event.name}
                                        </h2>
                                        
                                        <div className="space-y-2 text-sm text-psi-dark/70">
                                            {poll.event.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="h-4 w-4 text-psi-primary" />
                                                    <span>{poll.event.location}</span>
                                                </div>
                                            )}
                                            {poll.event.dates && poll.event.dates.length > 0 && (
                                                <div className="space-y-1">
                                                    {poll.event.dates.map((eventDate) => (
                                                        <div key={eventDate.id} className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-psi-primary shrink-0" />
                                                            <span>
                                                                {eventDate.date && formatEventDate(eventDate.date, "DD/MM/YYYY")}
                                                                {eventDate.hourStart && (
                                                                    <>
                                                                        {" - "}
                                                                        <Clock className="h-3 w-3 inline text-psi-primary mr-1" />
                                                                        {formatEventTime(eventDate.hourStart, eventDate.hourEnd)}
                                                                    </>
                                                                )}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {!isAuthenticated ? (
                            <Card>
                                <div className="p-6">
                                    <div className="relative overflow-hidden bg-linear-to-t bg-[#EAE7FE] p-8 border-2 border-psi-primary/10 rounded-lg">
                                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 bg-psi-primary/20" />
                                        <div className="relative space-y-6">
                                            <div className="text-center space-y-2">
                                                <h3 className="text-2xl font-bold text-psi-dark">
                                                    Faça login para avaliar este evento
                                                </h3>
                                                <p className="text-sm text-psi-dark/60">
                                                    Você precisa estar logado para enviar sua avaliação
                                                </p>
                                            </div>

                                            <div className="max-w-sm mx-auto">
                                                <div className="space-y-4">
                                                    <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Controller
                                                                name="email"
                                                                control={loginForm.control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        type="email"
                                                                        placeholder="seu@email.com"
                                                                        icon={Mail}
                                                                        className="bg-white/90 rounded-full"
                                                                        required
                                                                    />
                                                                )}
                                                            />
                                                            <FieldError message={loginForm.formState.errors.email?.message || ""} />
                                                        </div>

                                                        <div className="space-y-2">
                                                            <Controller
                                                                name="password"
                                                                control={loginForm.control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        type="password"
                                                                        placeholder="Sua senha"
                                                                        icon={Lock}
                                                                        className="bg-white/90 rounded-full"
                                                                        required
                                                                    />
                                                                )}
                                                            />
                                                            <FieldError message={loginForm.formState.errors.password?.message || ""} />
                                                        </div>

                                                        <Button
                                                            type="submit"
                                                            variant="primary"
                                                            className="w-full"
                                                            size="lg"
                                                            disabled={isLoggingIn}
                                                        >
                                                            {isLoggingIn ? <LoadingButton /> : "Entrar"}
                                                        </Button>
                                                    </form>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                            ) : isLoadingComment ? (
                                <Card>
                                    <div className="p-6">
                                        <Skeleton className="h-32 w-full" />
                                    </div>
                                </Card>
                            ) : userComment ? (
                                <Card>
                                    <div className="p-6 space-y-4">
                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle2 className="h-5 w-5" />
                                            <h3 className="text-lg font-semibold">Você já avaliou este evento. Obrigado!</h3>
                                        </div>
                                        <div className="p-4 bg-psi-primary/5 rounded-lg border border-psi-primary/10">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1">
                                                    <p className="font-medium text-psi-dark text-sm mb-1">
                                                        Sua avaliação
                                                    </p>
                                                    <div className="flex items-center gap-1 mt-2">
                                                        {renderStars(userComment.stars)}
                                                    </div>
                                                </div>
                                            </div>
                                            {userComment.comment && (
                                                <div className="mt-3 pt-3 border-t border-psi-primary/20">
                                                    <p className="text-sm text-psi-dark/70">
                                                        {userComment.comment}
                                                    </p>
                                                </div>
                                            )}
                                            <p className="text-xs text-psi-dark/40 mt-3">
                                                {DateUtils.formatDate(userComment.createdAt, "DD/MM/YYYY [às] HH:mm")}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            ) : (
                                <Card>
                                    <form onSubmit={commentForm.handleSubmit(handleSubmit)} className="space-y-6 p-4">
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
                                                <Controller
                                                    name="comment"
                                                    control={commentForm.control}
                                                    render={({ field }) => (
                                                        <Textarea
                                                            {...field}
                                                            value={field.value || ""}
                                                            placeholder="Conte-nos sua experiência com este evento..."
                                                            maxLength={maxCommentLength}
                                                            className="min-h-32 resize-none"
                                                        />
                                                    )}
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
                            )}
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    PesquisaPannel
}
