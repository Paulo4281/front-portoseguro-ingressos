"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton/CTAButton"
import { ArrowUpRight, Lock, ShieldCheck, Ticket, Music2, SunMedium, Waves, PartyPopper, TrendingDown, Users, CreditCard, TrendingUp, Megaphone, Tag, Fingerprint, Cpu, Sparkles, Globe2, CheckCircle2, HeartHandshake, DollarSign, Star, BookOpen, ArrowRight, DollarSignIcon, Book, Car, Building2, Trophy, UtensilsCrossed, Heart, Music, Church, Mail, UserPlus, Zap } from "lucide-react"
import { useEventFindFeatured } from "@/hooks/Event/useEventFindFeatured"
import { CardEvent } from "@/components/Card/CardEvent/CardEvent"
import { Carousel } from "@/components/Carousel/Carousel"
import { SearchEvent } from "@/components/Search/SearchEvent/SearchEvent"
import { Category } from "@/components/Category/Category"
import { Background } from "@/components/Background/Background"
import Image from "next/image"
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import { EventCategoryIconHandler } from "@/utils/Helpers/EventCategoryIconHandler/EventCategoryIconHandler"
import { TEvent } from "@/types/Event/TEvent"
import { Toast } from "@/components/Toast/Toast"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { AuthValidator } from "@/validators/Auth/AuthValidator"
import { TAuth } from "@/types/Auth/TAuth"
import { Input } from "@/components/Input/Input"
import { FieldError } from "@/components/FieldError/FieldError"
import { useAuthLogin } from "@/hooks/Auth/useAuthLogin"
import { useAuthLoginWithGoogle } from "@/hooks/Auth/useAuthLoginWithGoogle"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useAuthStore } from "@/stores/Auth/AuthStore"

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

const HomeHero = () => {
    const { data: eventsData, isLoading, isError } = useEventFindFeatured()
    const [featuredEvents, setFeaturedEvents] = useState<TEvent[]>([])
    const { user, isAuthenticated, setUser } = useAuthStore()
    const router = useRouter()
    const { mutateAsync: loginUser, isPending: isLoggingIn } = useAuthLogin()
    const { mutateAsync: loginWithGoogle, isPending: isLoggingInWithGoogle } = useAuthLoginWithGoogle()
    const googleButtonRef = useRef<HTMLDivElement>(null)
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false)
    
    const loginForm = useForm<TAuth>({
        resolver: zodResolver(AuthValidator)
    })

    useEffect(() => {
        if (eventsData?.success) {
            const events = Array.isArray(eventsData.data) ? eventsData.data : []
            setFeaturedEvents(events)
        } else if (eventsData?.data && Array.isArray(eventsData.data)) {
            setFeaturedEvents(eventsData.data)
        } else {
            setFeaturedEvents([])
        }
    }, [eventsData])

    const { data: eventCategoriesData, isLoading: isEventCategoriesLoading } = useEventCategoryFind()

    const handleLoginSubmit = async (data: TAuth) => {
        const response = await loginUser(data)
        if (response && response.success && response.data?.user) {
            setUser(response.data.user)
            Toast.success("Login realizado com sucesso!")
            if (response.data.user.role === "NOT_DEFINED") {
                router.push("/confirmar-social")
            } else {
                loginForm.reset()
            }
        }
    }

    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        try {
            const authResponse = await loginWithGoogle(response.credential)
            if (authResponse && authResponse.success && authResponse.data?.user) {
                setUser(authResponse.data.user)
                Toast.success("Login realizado com sucesso!")
                if (authResponse.data.user.role === "NOT_DEFINED") {
                    router.push("/confirmar-social")
                }
            }
        } catch (error) {
            Toast.error("Erro ao fazer login com Google")
        }
    }, [loginWithGoogle, setUser, router])

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_SOCIAL_LOGIN_CLIENT_ID
        if (!clientId) {
            console.error("[HomeHero] CLIENT_ID não configurado")
            return
        }

        const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]')
        
        if (existingScript) {
            if (window.google?.accounts?.id) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleCredentialResponse
                    })
                    setIsGoogleScriptLoaded(true)
                } catch (error) {
                    console.error("[HomeHero] Erro ao inicializar Google (script existente):", error)
                }
            } else {
                console.warn("[HomeHero] window.google.accounts.id não disponível mesmo com script existente")
                const checkInterval = setInterval(() => {
                    if (window.google?.accounts?.id) {
                        try {
                            window.google.accounts.id.initialize({
                                client_id: clientId,
                                callback: handleCredentialResponse
                            })
                            setIsGoogleScriptLoaded(true)
                            clearInterval(checkInterval)
                        } catch (error) {
                            console.error("[HomeHero] Erro ao inicializar Google (retry):", error)
                        }
                    }
                }, 500)
                setTimeout(() => {
                    clearInterval(checkInterval)
                    console.warn("[HomeHero] Timeout ao aguardar window.google.accounts.id")
                }, 10000)
            }
            return
        }

        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = () => {
            if (window.google && window.google.accounts) {
                try {
                    window.google.accounts.id.initialize({
                        client_id: clientId,
                        callback: handleCredentialResponse
                    })
                    setIsGoogleScriptLoaded(true)
                } catch (error) {
                    console.error("[HomeHero] Erro ao inicializar Google:", error)
                }
            } else {
                console.warn("[HomeHero] window.google não disponível após onload")
                const retryInterval = setInterval(() => {
                    if (window.google?.accounts?.id) {
                        try {
                            window.google.accounts.id.initialize({
                                client_id: clientId,
                                callback: handleCredentialResponse
                            })
                            setIsGoogleScriptLoaded(true)
                            clearInterval(retryInterval)
                        } catch (error) {
                            console.error("[HomeHero] Erro ao inicializar Google (retry):", error)
                        }
                    }
                }, 500)
                setTimeout(() => {
                    clearInterval(retryInterval)
                    console.warn("[HomeHero] Timeout ao aguardar window.google após onload")
                }, 10000)
            }
        }
        script.onerror = () => {
            console.error("[HomeHero] Erro ao carregar script do Google")
        }
        document.head.appendChild(script)

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script)
            }
        }
    }, [handleCredentialResponse])

    useEffect(() => {
        if (!isGoogleScriptLoaded || !window.google?.accounts?.id) {
            if (!isGoogleScriptLoaded) {
                console.warn("[HomeHero] isGoogleScriptLoaded é false")
            }
            if (!window.google?.accounts?.id) {
                console.warn("[HomeHero] window.google.accounts.id não está disponível")
            }
            return
        }

        const renderButton = () => {
            if (!googleButtonRef.current) {
                console.warn("[HomeHero] googleButtonRef.current ainda é null, aguardando...")
                return false
            }

            try {
                if (googleButtonRef.current.children.length === 0) {
                    window.google.accounts.id.renderButton(googleButtonRef.current, {
                        theme: "filled_blue",
                        type: "standard",
                        size: "large",
                        shape: "pill",
                        width: "100%"
                    })
                    setTimeout(() => {
                    }, 1000)
                    return true
                } else {
                    return true
                }
            } catch (error) {
                console.error("[HomeHero] Erro ao renderizar botão do Google:", error)
                return false
            }
        }

        if (renderButton()) {
            return
        }

        const retryInterval = setInterval(() => {
            if (renderButton()) {
                clearInterval(retryInterval)
            }
        }, 200)

        const timeout = setTimeout(() => {
            clearInterval(retryInterval)
            console.warn("[HomeHero] Timeout ao aguardar ref para renderizar botão")
        }, 10000)

        return () => {
            clearInterval(retryInterval)
            clearTimeout(timeout)
        }
    }, [isGoogleScriptLoaded])

    const heroCategories = useMemo(() => {
        if (eventCategoriesData?.data && Array.isArray(eventCategoriesData.data)) {
            return eventCategoriesData.data
        }
        return []
    }, [eventCategoriesData])

    const featuredSlides = useMemo(() => {
        if (!Array.isArray(featuredEvents)) return []
        return featuredEvents.map((event) => (
            <div key={event.id} className="w-full max-w-[280px]
            sm:max-w-[320px]
            lg:max-w-[300px]">
                <CardEvent event={event} />
            </div>
        ))
    }, [featuredEvents])

    const categorySlides = useMemo(() => {
        return heroCategories.map((category) => (
            <div key={category.id} className="w-[180px]
            sm:w-[200px]">
                <Link href={`/ver-eventos?categoryId=${category.id}`}>
                    <Category icon={EventCategoryIconHandler(category.name)} title={category.name} />
                </Link>
            </div>
        ))
    }, [heroCategories])

    const buyerAssuranceHighlights = [
        {
            title: "Organizadores verificados",
            description: "Todos os produtores passam por verificação manual e compliance rigoroso. Você compra apenas de organizadores autorizados e confiáveis.",
            icon: CheckCircle2
        },
        {
            title: "Proteção total",
            description: "Pagamentos criptografados, monitoramento antifraude 24/7 e suporte humano para qualquer imprevisto.",
            icon: ShieldCheck
        },
        {
            title: "Processo transparente",
            description: "Você acompanha cada etapa da compra em tempo real e recebe notificações claras sobre status e QR Codes.",
            icon: Fingerprint
        },
        {
            title: "Plataforma moderna",
            description: "Infraestrutura em nuvem com redundância global e performance pensada para picos de alta demanda.",
            icon: Cpu
        }
    ]

    const organizerAdvantages = [
        {
            title: "Plataforma verificada",
            description: "Processo de compliance rigoroso e verificação manual. Apenas organizadores autorizados podem publicar eventos, garantindo credibilidade e confiança.",
            icon: ShieldCheck
        },
        {
            title: "Autenticidade regional",
            description: "Operamos exclusivamente em Porto Seguro, entendendo a realidade dos produtores locais e do público.",
            icon: Globe2
        },
        {
            title: "Taxas que cabem no bolso",
            description: `${process.env.NEXT_PUBLIC_TAX_FEE_PERCENTAGE}% acima de ${ ValueUtils.centsToCurrency(Number(process.env.NEXT_PUBLIC_TAX_THRESHOLD_CENTS)) } ou ${ ValueUtils.centsToCurrency(Number(process.env.NEXT_PUBLIC_TAX_FEE_FIXED_BELOW_THRESHOLD)) } fixo. Sem letrinhas miúdas, sem retenções injustas.`,
            icon: TrendingDown
        },
        {
            title: "Tecnologia aplicada",
            description: "Dashboard inteligente, relatórios em tempo real e integrações via API para repasses automáticos.",
            icon: Sparkles
        },
        {
            title: "Equipe próxima",
            description: "Acompanhamos o evento do planejamento ao pós-venda com suporte dedicado e consultoria estratégica.",
            icon: HeartHandshake
        }
    ]

    return (
        <Background variant="hero" className="flex min-h-screen flex-col overflow-x-hidden">
            <section className="flex flex-col mt-[100px] w-full">
                <div className="space-y-16">
                    {featuredEvents.length > 0 && (
                        <div className="space-y-8">
                            <div className="container flex items-center justify-between">
                                <div className="space-y-2">
                                    <h2 className="text-5xl font-semibold text-psi-dark
                                    sm:text-3xl
                                    lg:text-4xl tracking-tight">
                                        Eventos em <span className="text-psi-primary">destaque</span>
                                    </h2>
                                    <p className="text-md text-psi-dark/60
                                    sm:text-base">
                                        +{featuredEvents.length} eventos incríveis para você conferir!
                                    </p>
                                </div>
                            </div>

                            <div className="relative w-full flex justify-center mx-auto overflow-visible">
                                <Carousel
                                    items={featuredSlides}
                                    className="px-4 py-2
                                    sm:px-6
                                    lg:px-8"
                                    loop
                                    autoplay
                                    speed={1200}
                                    pauseOnHover={true}
                                    slidesPerView={1}
                                    autoplayDelay={3000}
                                    showNavigation
                                    allowTouchMove
                                    spaceBetween={0}
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 2,
                                        },
                                        1024: {
                                            slidesPerView: 3,
                                        },
                                        1200: {
                                            slidesPerView: 3,
                                        },
                                        1400: {
                                            slidesPerView: 4,
                                        },
                                        1600: {
                                            slidesPerView: 5,
                                        }
                                    }}
                                />
                            </div>

                            {!isAuthenticated && (
                                <div className="w-full mb-12">
                                    <div className="relative overflow-hidden bg-linear-to-t bg-[#EAE7FE] p-8 border-2 border-psi-primary/10
                                    sm:p-10
                                    lg:p-12 neon-border">
                                        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                                        <div className="relative space-y-6">
                                            <div className="text-center space-y-2">
                                                <h3 className="text-2xl font-bold text-psi-dark
                                                sm:text-3xl">
                                                    Acesse sua conta e <span className="text-psi-primary">acelere suas compras</span>
                                                </h3>
                                                <p className="text-sm text-psi-dark/60
                                                sm:text-base">
                                                    Faça login rápido ou crie sua conta gratuitamente
                                                </p>
                                            </div>

                                            <div className="grid gap-6
                                            lg:grid-cols-2 lg:gap-8 max-w-4xl mx-auto">
                                                <div className="space-y-4">
                                                    <form onSubmit={loginForm.handleSubmit(handleLoginSubmit)} className="space-y-4">
                                                        <div className="space-y-2">
                                                            <Controller
                                                                name="email"
                                                                control={loginForm.control}
                                                                render={({ field }) => (
                                                                    <Input
                                                                        {...field}
                                                                        id="home-email"
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
                                                                        id="home-password"
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
                                                            {
                                                                isLoggingIn ? (
                                                                    <LoadingButton />
                                                                ) : (
                                                                    <>
                                                                        Entrar
                                                                    </>
                                                                )
                                                            }
                                                        </Button>
                                                    </form>

                                                    <div className="relative">
                                                        <div className="absolute inset-0 flex items-center">
                                                            <div className="w-full border-t border-border" />
                                                        </div>
                                                        <div className="relative flex justify-center text-xs uppercase">
                                                            <span className="
                                                            dark:bg-psi-dark
                                                            px-2
                                                            text-muted-foreground">
                                                                Ou
                                                            </span>
                                                        </div>
                                                    </div>

                                                    <div className="w-full min-h-[40px] flex flex-col items-center">
                                                        <div 
                                                            ref={(el) => {
                                                                googleButtonRef.current = el
                                                            }} 
                                                            className="w-full flex justify-center"
                                                            style={{ minHeight: '40px' }}
                                                        />
                                                        {isLoggingInWithGoogle && (
                                                            <div className="mt-2 flex justify-center">
                                                                <LoadingButton />
                                                            </div>
                                                        )}
                                                        {!isGoogleScriptLoaded && (
                                                            <div className="text-xs text-psi-dark/40 mt-2">
                                                                Carregando Google Sign-In...
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-col justify-start space-y-4 lg:border-l lg:border-psi-primary/20 lg:pl-8">
                                                    <div className="text-center lg:text-left space-y-3">
                                                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-psi-secondary/10 text-psi-secondary">
                                                            <Star className="h-4 w-4" />
                                                            <span className="text-sm font-semibold">Novo por aqui?</span>
                                                        </div>
                                                        <p className="text-sm text-psi-dark/70">
                                                            Crie sua conta gratuitamente e ganhe acesso a ofertas exclusivas, checkout mais rápido e muito mais!
                                                        </p>
                                                    </div>

                                                    <Button
                                                        asChild
                                                        variant="secondary"
                                                        size="lg"
                                                        className="w-full group"
                                                    >
                                                        <Link href="/cadastro">
                                                            <UserPlus className="h-4 w-4" />
                                                            Criar conta grátis
                                                            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="flex w-full flex-col items-center">
                                <div className="
                                w-full flex justify-center px-8 mb-4
                                lg:container lg:px-0 lg:mb-8
                                ">
                                    <SearchEvent className="w-full max-w-2xl" />
                                </div>

                                <div className="w-full">
                                    <h2 className="text-3xl font-medium text-center text-psi-dark tracking-tight
                                    sm:text-4xl
                                    lg:text-5xl">
                                        <span className="text-psi-primary font-semibold">+50 categorias</span><br className="lg:hidden" /> para todos os estilos
                                    </h2>
                                    <p className="text-sm text-center text-psi-dark/60 container
                                    sm:text-base">
                                        Explore eventos por categoria e encontre o que mais combina com você
                                    </p>
                                </div>

                                <div className="w-full">
                                    <Carousel
                                        items={categorySlides}
                                        className="px-2"
                                        slidesPerView={2}
                                        spaceBetween={12}
                                        loop
                                        autoplay
                                        continuous
                                        speed={2600}
                                        breakpoints={{
                                            640: {
                                                slidesPerView: 3,
                                                spaceBetween: 16
                                            },
                                            1024: {
                                                slidesPerView: 7,
                                                spaceBetween: 20
                                            },
                                            1600: {
                                                slidesPerView: 10,
                                                spaceBetween: 24
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-10 w-full container mt-[-40px]
                    lg:grid-cols-[1.1fr_0.9fr] lg:mt-0
                    ">
                        <div className="space-y-10 w-full relative">
                            <div className="space-y-6">
                                <h1 className="text-4xl font-medium leading-tight text-psi-dark
                                md:text-5xl
                                lg:text-6xl">
                                    A forma mais sofisticada de <span className="bg-linear-to-r from-psi-primary via-psi-secondary to-psi-tertiary bg-clip-text text-transparent font-extrabold">viver os eventos</span> da capital do descobrimento.
                                </h1>

                                <p className="text-lg text-psi-dark/75
                                md:text-xl">
                                    Conectamos organizadores locais e apaixonados pela cena cultural com uma experiência de compra inteligente, transparente e com taxas justas.
                                </p>
                            </div>

                            <div className="relative flex flex-wrap items-center gap-4
                            sm:gap-6 min-h-[120px]
                            sm:min-h-[140px]
                            lg:min-h-[160px]">

                                <div className="
                                absolute left-[50vw] bottom-[30px] w-[100px] h-auto z-10 pointer-events-none
                                xss:left-[50vw] xss:bottom-[64px] xss:w-[100px]
                                xs:left-0 xs:bottom-[65px] xs:w-[100px]
                                sm:w-[250px] sm:left-[400px] sm:bottom-[-60px]
                                lg:w-[260px] lg:left-[465px] lg:bottom-[-30px]
                                3xl:w-[320px] 3xl:left-[500px] 3xl:bottom-[-95px]
                                ">
                                    <Image
                                        src="/images/porto-seguro-ingressos-cabral.png"
                                        alt="Pedro Álvares Cabral apontando para as taxas da plataforma"
                                        width={350}
                                        height={437}
                                        className="object-contain w-full h-auto -scale-x-100 xs:scale-x-100 sm:-scale-x-100 lg:scale-x-100"
                                        priority
                                    />
                                </div>

                                <div className="relative z-20 flex flex-col gap-4
                                sm:gap-6">
                                    
                                    <div className="relative flex flex-wrap items-center gap-4
                                    sm:gap-6
                                    ">
                                        <Button
                                            asChild
                                            size="lg"
                                            variant="tertiary"
                                            className="group"
                                        >
                                            <Link href="/ver-eventos" aria-label="Explorar eventos disponíveis">
                                                <ArrowUpRight className="size-4 group-hover:scale-170 transition-transform duration-300" />
                                                Explorar eventos
                                            </Link>
                                        </Button>

                                        <Button asChild size="lg" variant="dark">
                                            <Link href="/casos-de-uso" aria-label="Acessar área de casos de uso">
                                                <Book /> Casos de uso
                                            </Link>
                                        </Button>
                                    </div>
                                    
                                </div>
                            </div>
                        </div>

                        <div className="space-y-8 rounded-[32px] border border-[#E4E6F0] bg-white/80 p-4
                        sm:p-6
                        lg:p-8 shadow-lg shadow-black/5 overflow-hidden flex flex-col justify-between">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 bg-psi-secondary/10 text-psi-secondary font-medium px-3 py-1.5 rounded-full text-xs uppercase tracking-wider">
                                    Seus eventos, nossa prioridade!
                                </span>
                                <h2 className="text-3xl
                                sm:text-4xl
                                lg:text-5xl font-medium text-psi-dark leading-tight">
                                    Evolua sua bilheteria
                                </h2>
                                <p className="text-sm text-psi-dark/75
                                md:text-lg max-w-xl">
                                    Descubra como é simples publicar, vender e gerenciar seus eventos em Porto Seguro numa plataforma feita para você. Segurança, controle de vendas e repasse rápido, tudo no seu ritmo.
                                </p>
                            </div>
                            <div className="rounded-3xl border border-psi-primary/15 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/10 p-4
                            sm:p-6
                            lg:p-8
                            shadow-lg shadow-black/5
                            flex flex-col gap-5 w-full"
                                aria-label="Tabela de taxas da plataforma"
                            >
                                <div className="flex flex-col
                                sm:flex-row sm:items-center sm:justify-between gap-4
                                sm:gap-4">
                                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                                        <span className="text-xs uppercase tracking-wider text-psi-dark/60">Acima de { ValueUtils.centsToCurrency(Number(process.env.NEXT_PUBLIC_TAX_THRESHOLD_CENTS)) }</span>
                                        <div className="flex items-end gap-2 flex-wrap">
                                            <span className="text-4xl
                                            sm:text-5xl
                                            lg:text-7xl font-extrabold text-psi-secondary leading-none
                                            ">{process.env.NEXT_PUBLIC_TAX_FEE_PERCENTAGE}%</span>
                                            <span className="text-sm
                                            sm:text-base
                                            md:text-xs text-psi-dark/60 font-medium pb-1">por ingresso</span>
                                        </div>
                                    </div>
                                    <div className="hidden
                                    sm:block border-l border-psi-primary/10 h-12 mx-4" aria-hidden="true" />
                                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0
                                    sm:items-start">
                                        <span className="text-xs uppercase tracking-wider text-psi-dark/60">Até { ValueUtils.centsToCurrency(Number(process.env.NEXT_PUBLIC_TAX_THRESHOLD_CENTS)) }</span>
                                        <div className="flex items-end gap-2 flex-wrap">
                                            <span className="text-4xl
                                            sm:text-5xl
                                            lg:text-[44px] font-extrabold text-psi-secondary leading-none
                                            3xl:text-6xl
                                            ">{ ValueUtils.centsToCurrency(Number(process.env.NEXT_PUBLIC_TAX_FEE_FIXED_BELOW_THRESHOLD)).replace(",00", "") }</span>
                                            <span className="text-sm
                                            sm:text-base
                                            md:text-xs text-psi-dark/60 font-medium pb-1">por ingresso</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    <TrendingDown className="h-5 w-5 text-psi-secondary shrink-0" aria-hidden="true" />
                                    <span className="text-sm text-psi-dark/65">
                                        Taxas 100% transparentes e as menores da região.
                                    </span>
                                </div>
                            </div>
                            <div className="flex sm:flex-row gap-4 sm:gap-6 items-center">
                                <CTAButton
                                    href="/cadastro?org=true"
                                    text="Anuncie seu evento"
                                    variant="secondary"
                                    icon={Megaphone}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white pt-12">
                <div className="container space-y-10">
                    <div className="space-y-3 text-center max-w-3xl mx-auto">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-psi-primary/10 text-psi-primary text-xs font-medium uppercase tracking-wide">
                            <Sparkles className="h-3 w-3 mr-1" />
                            Casos de Uso
                        </span>
                        <h2 className="text-3xl font-semibold text-psi-dark
                        sm:text-4xl">
                            Uma Plataforma para <span className="text-psi-primary">Todos os Eventos</span>
                        </h2>
                        <p className="text-psi-dark/70 text-sm
                        sm:text-base">
                            Dos eventos mais simples aos mais complexos, nossa plataforma oferece tecnologia de ponta e suporte humanizado
                        </p>
                    </div>

                    <div className="grid grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4 gap-6">
                        {[
                            {
                                id: 3,
                                icon: Trophy,
                                title: "Eventos Esportivos",
                                description: "Maratonas, campeonatos e competições esportivas com formulários personalizados e validação em tempo real.",
                                image: "porto-seguro-ingressos-eventos-esportivos"
                            },
                            {
                                id: 8,
                                icon: Music,
                                title: "Eventos Musicais",
                                description: "Shows, festivais e eventos musicais com lotes automáticos, recorrência e gestão em tempo real.",
                                image: "porto-seguro-ingressos-eventos-musica"
                            },
                            {
                                id: 10,
                                icon: Church,
                                title: "Eventos Religiosos",
                                description: "Celebrações, retiros e encontros espirituais com experiência respeitosa e organizada.",
                                image: "porto-seguro-ingressos-eventos-religiosos"
                            },
                            {
                                id: 4,
                                icon: UtensilsCrossed,
                                title: "Eventos Gastronômicos",
                                description: "Festivais de comida e experiências culinárias com tipos de ingressos flexíveis e preços por data.",
                                image: "porto-seguro-ingressos-eventos-gastronomia"
                            }
                        ].map((useCase) => {
                            const IconComponent = useCase.icon
                            return (
                                <div
                                    key={useCase.id}
                                    className="group relative overflow-hidden rounded-2xl border border-psi-primary/20 bg-white shadow-lg shadow-psi-primary/5 hover:shadow-xl hover:shadow-psi-primary/20 transition-all duration-500"
                                >
                                    <div className="relative h-64 overflow-hidden bg-linear-to-br from-psi-primary/10 to-psi-secondary/10">
                                        <Image
                                            src={`/images/casos-de-uso/${useCase.image}.jpg`}
                                            alt={useCase.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-linear-to-t from-psi-dark/60 via-psi-dark/20 to-transparent" />
                                        <div className="absolute top-4 left-4 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                                            <IconComponent className="h-5 w-5 text-psi-primary" />
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 space-y-3">
                                        <h3 className="text-lg font-semibold text-psi-dark">
                                            {useCase.title}
                                        </h3>
                                        <p className="text-sm text-psi-dark/70 leading-relaxed line-clamp-3">
                                            {useCase.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="flex justify-center pt-4">
                        <Button asChild size="lg" variant="primary" className="group">
                            <Link href="/casos-de-uso">
                                Ver todos os casos de uso
                                <ArrowRight className="h-4 w-4 transition-transform" />
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <section className="w-full bg-white py-4 lg:py-6">
                <div className="container space-y-10">
                    <div className="space-y-3 text-center max-w-3xl mx-auto">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-psi-primary/10 text-psi-primary text-xs font-medium uppercase tracking-wide">
                            Confiança em cada etapa
                        </span>
                        <h2 className="text-3xl font-semibold text-psi-dark
                        sm:text-4xl">
                            Experiências de compra seguras e transparentes
                        </h2>
                        <p className="text-psi-dark/70 text-sm
                        sm:text-base">
                            Cada ingresso é validado, rastreado e entregue com clareza para que turistas e moradores<br /> comprem sem receios. Todos os organizadores são verificados manualmente antes de publicar eventos.
                        </p>
                    </div>

                    <div className="grid grid-cols-1
                    md:grid-cols-2
                    lg:grid-cols-4 gap-6">
                        {buyerAssuranceHighlights.map((highlight) => {
                            const Icon = highlight.icon
                            const isFirst = highlight.title === "Organizadores verificados"
                            return (
                                <div key={highlight.title} className={`rounded-3xl border p-6 shadow-lg shadow-black/5 flex flex-col gap-4 ${isFirst ? "border-psi-light/80 bg-linear-to-br from-psi-primary/40 via-psi-secondary to-psi-primary/70" : "border-[#E4E6F0] bg-linear-to-br from-white via-white to-psi-primary/5"}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${isFirst ? "bg-psi-light/90 text-psi-primary" : "bg-psi-primary/10 text-psi-primary"}`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className={`text-lg font-medium text-psi-dark ${isFirst ? "text-psi-light" : ""}`}>{highlight.title}</h3>
                                    </div>
                                    <p className={`text-sm text-psi-dark/70 flex-1 ${isFirst ? "text-psi-light text-shadow-2xs" : ""}`}>
                                        {highlight.description}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </section>

            <section className="w-full bg-psi-dark text-white py-12
            sm:py-16
            lg:py-20">
                <div className="container space-y-10">
                    <div className="grid gap-8
                    lg:grid-cols-[1.2fr_0.8fr] items-start">
                        <div className="space-y-4">
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-medium uppercase tracking-wide">
                                Plataforma para organizadores
                            </span>
                            <h2 className="text-3xl font-semibold
                            sm:text-4xl">
                                Conte sua história em uma plataforma independente, autêntica e tecnológica.
                            </h2>
                            <p className="text-white/80 text-sm
                            sm:text-base">
                                Somos locais, falamos a língua da orla e entregamos tecnologia de ponta para quem cria experiências inesquecíveis. Todos os organizadores passam por verificação manual e compliance antes de publicar eventos.
                            </p>

                            <div className="grid grid-cols-1
                            sm:grid-cols-2 gap-4 pt-4">
                                {organizerAdvantages.map((advantage, index) => {
                                    const Icon = advantage.icon
                                    return (
                                        <div key={advantage.title} className={`rounded-2xl border border-white/10 bg-white/5 p-4 flex flex-col gap-2 ${index === 0 ? "bg-linear-to-br border-0! from-psi-primary/40 via-psi-secondary to-psi-primary/70" : ""}`}>
                                            <div className={`flex items-center gap-2 text-psi-tertiary ${index === 0 ? "text-psi-light" : ""}`}>
                                                <Icon className="h-4 w-4" />
                                                <span className="text-xs uppercase tracking-widest text-white/70">{advantage.title}</span>
                                            </div>
                                            <p className={`text-sm text-white/85 ${index === 0 ? "text-psi-light text-shadow-2xs" : ""}`}>{advantage.description}</p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="rounded-[28px] border border-white/15 bg-linear-to-br from-white/10 via-white/5 to-white/5 p-6 space-y-6">
                        <div className="
                                absolute left-[28.5vw] bottom-[3225px] w-[100px] h-auto z-10 pointer-events-none
                                xss:left-[28.5vw] xss:bottom-[3105px] xss:w-[100px]
                                xs:left-[57vw] xs:bottom-[2735px] xs:w-[160px]
                                sm:w-[170px] sm:left-[400px] sm:bottom-[1600px]
                                lg:w-[320px] lg:left-[980px] lg:bottom-[1400px]
                                3xl:w-[300px] 3xl:left-[1260px] 3xl:bottom-[1370px]
                                ">
                                    <Image
                                        src="/images/porto-seguro-ingressos-forte.png"
                                        alt=""
                                        width={350}
                                        height={437}
                                        className="object-contain w-full h-auto -scale-x-100 lg:scale-x-100"
                                        priority
                                    />
                                </div>
                            <div className="space-y-3">
                                <h3 className="text-2xl font-medium">Assuma o controle da sua bilheteria</h3>
                                <p className="text-white/80 text-sm">
                                    Tenha visibilidade de vendas, libere lotes com automações inteligentes e receba relatórios que ajudam nas decisões.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="rounded-2xl bg-white/10 p-4">
                                    <div className="flex-col lg:flex items-start gap-2">
                                        <DollarSign className="mb-2 lg:mb-0 size-4 text-white/60" />
                                        <p className="text-xs text-white/60 uppercase tracking-widest">Tempo médio de repasse</p>
                                    </div>
                                    <p className="text-3xl font-semibold text-psi-tertiary mt-2">48h</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-4">
                                    <div className="flex-col lg:flex items-start gap-2">
                                        <Star className="mb-2 lg:mb-0 size-4 text-white/60" />
                                        <p className="text-xs text-white/60 uppercase tracking-widest">Satisfação dos produtores</p>
                                    </div>
                                    <p className="text-3xl font-semibold text-emerald-300 mt-2">5/5</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3">
                                <CTAButton
                                    href="/cadastro?org=true"
                                    text="Anuncie seu evento"
                                    variant="secondary"
                                    icon={Megaphone}
                                />
                                <Button asChild size="lg" variant="ghost" className="text-white! hover:bg-transparent!">
                                    <Link href="/recursos">
                                        Conhecer recursos completos
                                        <ArrowRight className="size-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="relative w-full overflow-hidden">
                <div className="relative min-h-[620px]
                sm:min-h-[750px]
                lg:min-h-[850px] flex items-center">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/porto-seguro-ingressos-cidade.jpeg"
                            alt="Praia paradisíaca de Porto Seguro - Bahia"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-black/80"
                        />
                        <div className="absolute inset-0 bg-linear-to-br from-psi-primary/80 via-psi-secondary/60 to-psi-dark/70
                        sm:from-psi-primary/80 sm:via-psi-secondary/40 sm:to-psi-dark/70
                        lg:from-psi-primary/60 lg:via-psi-secondary/30 lg:to-psi-dark/60" />
                        <div className="absolute inset-0 bg-linear-to-t from-psi-dark/50 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 container py-20
                    sm:py-28
                    lg:py-32">
                        <div className="grid gap-20
                        lg:grid-cols-[1.1fr_1fr] lg:gap-24 items-center">
                            <div className="max-w-2xl space-y-8 text-white">
                                <div>
                                    <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/15 backdrop-blur-md text-white text-[13px] font-semibold uppercase tracking-widest border border-white/25 shadow"
                                    >
                                        Costa do Descobrimento
                                    </span>
                                </div>
                                <h2 className="text-5xl font-bold leading-tight
                                sm:text-6xl
                                lg:text-7xl"
                                    style={{ letterSpacing: "-0.04em" }}
                                >
                                    Viva o melhor de <span className="text-psi-tertiary drop-shadow">Porto Seguro</span> <br />
                                    e região
                                </h2>
                                <p className="text-xl
                                sm:text-2xl max-w-xl text-white/90 font-light">
                                    Uma plataforma exclusiva para conectar produtores, moradores e turistas aos eventos mais autênticos do sul da Bahia — com total segurança e experiência premium.
                                </p>
                                <div className="flex flex-wrap gap-3 pt-3">
                                    {[
                                        "Porto Seguro",
                                        "Arraial D'Ajuda",
                                        "Trancoso",
                                        "Caraíva",
                                        "Cabrália",
                                        "Coroa Vermelha"
                                    ].map((city) => (
                                        <span
                                            key={city}
                                            className="inline-flex items-center px-4 py-2 rounded-full bg-white/85 text-psi-dark text-xs font-semibold shadow border border-white/50"
                                        >
                                            {city}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-4 pt-6
                                sm:flex-row sm:items-center">
                                    <CTAButton
                                        size="xl"
                                        text="Anuncie seu evento"
                                        variant="tertiary"
                                        icon={Megaphone}
                                        href="/cadastro?org=true"
                                        className="hover:bg-psi-primary! hover:text-white! min-w-[220px]"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-7 max-w-xl">
                                <div className="rounded-3xl border border-psi-primary/10 bg-white/95 shadow-2xl backdrop-blur-lg p-8
                                transition-all hover:scale-[1.025] hover:shadow-psi-secondary/30 hover:border-psi-secondary/20">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="w-14 h-14 rounded-2xl bg-psi-primary/10 flex items-center justify-center">
                                            <Users className="w-7 h-7 text-psi-primary" />
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-bold text-psi-primary leading-tight">Para Organizadores</h3>
                                            <span className="text-sm text-psi-dark/70 leading-none">Impulsione seus eventos</span>
                                        </div>
                                    </div>
                                    <p className="text-base text-psi-dark/80 leading-relaxed mb-3">
                                        Alavanque sua bilheteria com taxas únicas, repasse em até <span className="text-psi-secondary font-semibold">48h</span> e acompanhamento em tempo real. Ganhe destaque perante turistas e público local.
                                    </p>
                                    <ul className="grid gap-2 pt-2">
                                        <li className="flex items-center gap-2 text-sm text-psi-dark/85">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Taxas regionais e transparentes
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-psi-dark/85">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Recebimento rápido e seguro pós-evento
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-psi-dark/85">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Suporte local e personalizado
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-psi-dark/85">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Painel com vendas e relatórios
                                        </li>
                                    </ul>
                                </div>

                                <div className="rounded-3xl border border-psi-secondary/10 bg-white/95 shadow-2xl backdrop-blur-lg p-8
                                transition-all hover:scale-[1.025] hover:shadow-psi-tertiary/30 hover:border-psi-tertiary/20">
                                    <div className="flex items-center gap-4 mb-2">
                                        <span className="w-14 h-14 rounded-2xl bg-psi-secondary/10 flex items-center justify-center">
                                            <Ticket className="w-7 h-7 text-psi-secondary" />
                                        </span>
                                        <div>
                                            <h3 className="text-xl font-bold text-psi-secondary leading-tight">Para Compradores</h3>
                                            <span className="text-sm text-psi-dark/70 leading-none">Explore experiências reais</span>
                                        </div>
                                    </div>
                                    <p className="text-base text-psi-dark/80 leading-relaxed mb-3">
                                        Encontre eventos autênticos, compre com facilidade e tenha seus ingressos na palma da mão, direto no seu celular.
                                    </p>
                                    <ul className="grid gap-2 pt-2">
                                        <li className="flex items-center gap-2 text-sm text-psi-dark/85">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Ingressos digitais e QR Code seguro
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-psi-dark/85">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Eventos verificados e regionais
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-psi-dark/85">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Suporte em português Brasil
                                        </li>
                                        <li className="flex items-center gap-2 text-sm text-psi-dark/85">
                                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                            Taxas fixas, sem surpresas
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section>
                <div className="container mx-auto mt-8">
                    <h3 className="text-2xl font-semibold text-psi-dark mb-6 text-center">
                        Perguntas Frequentes (FAQ)
                    </h3>
                    <div className="
                    grid grid-cols-1 gap-4
                    lg:grid-cols-2
                    ">
                        <div className="rounded-2xl border border-psi-primary/10 bg-white/95 p-5">
                            <button
                                type="button"
                                aria-expanded="false"
                                aria-controls="faq-1"
                                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-psi-primary"
                                tabIndex={0}
                            >
                                <span className="text-psi-primary font-medium">
                                    Como funciona a compra de ingressos pela plataforma?
                                </span>
                            </button>
                            <div id="faq-1" className="mt-2 text-psi-dark/70 text-sm">
                                Você pode explorar eventos, selecionar ingressos desejados e finalizar a compra de forma 100% online com pagamento seguro. Após a confirmação, o ingresso digital com QR Code fica disponível na sua conta.
                            </div>
                        </div>
                        <div className="rounded-2xl border border-psi-primary/10 bg-white/95 p-5">
                            <button
                                type="button"
                                aria-expanded="false"
                                aria-controls="faq-2"
                                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-psi-primary"
                                tabIndex={0}
                            >
                                <span className="text-psi-primary font-medium">
                                    Quem pode anunciar eventos na plataforma?
                                </span>
                            </button>
                            <div id="faq-2" className="mt-2 text-psi-dark/70 text-sm">
                                Qualquer organizador local, casas de show ou produtoras de Porto Seguro podem se cadastrar, passar pelo processo de verificação e anunciar seus eventos facilmente.
                            </div>
                        </div>
                        <div className="rounded-2xl border border-psi-primary/10 bg-white/95 p-5">
                            <button
                                type="button"
                                aria-expanded="false"
                                aria-controls="faq-3"
                                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-psi-primary"
                                tabIndex={0}
                            >
                                <span className="text-psi-primary font-medium">
                                    As taxas são realmente menores que as dos concorrentes?
                                </span>
                            </button>
                            <div id="faq-3" className="mt-2 text-psi-dark/70 text-sm">
                                Sim! Temos taxa reduzida de {process.env.NEXT_PUBLIC_TAX_FEE_PERCENTAGE}% em ingressos acima de {ValueUtils.centsToCurrency(Number(process.env.NEXT_PUBLIC_TAX_THRESHOLD_CENTS))} e valor fixo abaixo disso, bem diferente dos concorrentes nacionais.
                            </div>
                        </div>
                        <div className="rounded-2xl border border-psi-primary/10 bg-white/95 p-5">
                            <button
                                type="button"
                                aria-expanded="false"
                                aria-controls="faq-4"
                                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-psi-primary"
                                tabIndex={0}
                            >
                                <span className="text-psi-primary font-medium">
                                    O pagamento é seguro? Como funciona o repasse para o organizador?
                                </span>
                            </button>
                            <div id="faq-4" className="mt-2 text-psi-dark/70 text-sm">
                                O valor dos ingressos é protegido até a data do evento e o repasse é feito de forma direta e transparente após a realização, sempre para a conta cadastrada do organizador.
                            </div>
                        </div>
                        <div className="rounded-2xl border border-psi-primary/10 bg-white/95 p-5">
                            <button
                                type="button"
                                aria-expanded="false"
                                aria-controls="faq-5"
                                className="w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-psi-primary"
                                tabIndex={0}
                            >
                                <span className="text-psi-primary font-medium">
                                    Preciso ser morador de Porto Seguro para comprar ou anunciar?
                                </span>
                            </button>
                            <div id="faq-5" className="mt-2 text-psi-dark/70 text-sm">
                                Não! A plataforma é dedicada aos eventos locais de Porto Seguro, mas está aberta para turistas comprarem ingressos online antes ou durante sua estadia. Para anunciar, basta comprovar vínculo e passar pela verificação.
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Background>
    )
}

export {
    HomeHero
}