"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton/CTAButton"
import { ArrowUpRight, Lock, ShieldCheck, Ticket, Music2, SunMedium, Waves, PartyPopper, TrendingDown, Users, CreditCard, TrendingUp, Megaphone, Tag, Fingerprint, Cpu, Sparkles, Globe2, CheckCircle2, HeartHandshake, DollarSign, Star, BookOpen, ArrowRight, DollarSignIcon } from "lucide-react"
import { useEventFindFeatured } from "@/hooks/Event/useEventFindFeatured"
import { CardEvent } from "@/components/Card/CardEvent/CardEvent"
import { Carousel } from "@/components/Carousel/Carousel"
import { Search } from "@/components/Search/Search"
import { Category } from "@/components/Category/Category"
import { Background } from "@/components/Background/Background"
import Image from "next/image"
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import { EventCategoryIconHandler } from "@/utils/Helpers/EventCategoryIconHandler/EventCategoryIconHandler"
import { TEvent } from "@/types/Event/TEvent"
import { Toast } from "@/components/Toast/Toast"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"

const HomeHero = () => {
    const { data: eventsData, isLoading, isError } = useEventFindFeatured()
    const [featuredEvents, setFeaturedEvents] = useState<TEvent[]>([])

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
                <Category icon={EventCategoryIconHandler(category.name)} title={category.name} />
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
                                    <h2 className="text-5xl font-bold text-psi-dark
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

                            <div className="flex w-full flex-col items-center">
                                <div className="
                                w-full flex justify-center px-8 mb-4
                                lg:container lg:px-0 lg:mb-8
                                ">
                                    <Search className="w-full max-w-2xl" />
                                </div>

                                <div className="w-full">
                                    <h2 className="text-3xl font-semibold text-center text-psi-dark tracking-tight
                                    sm:text-4xl
                                    lg:text-5xl">
                                        <span className="text-psi-primary font-bold">+50 categorias</span><br className="lg:hidden" /> para todos os estilos
                                    </h2>
                                    <p className="text-sm text-center text-psi-dark/60 container
                                    sm:text-base">
                                        Explore eventos por categoria e encontre o que mais combina com você
                                    </p>
                                </div>

                                <div className="w-full">
                                    <Carousel
                                        items={categorySlides}
                                        className="px-2 py-4"
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

                    <div className="grid gap-10 w-full container
                    lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-10 w-full relative">
                            <div className="space-y-6">
                                <h1 className="text-4xl font-semibold leading-tight text-psi-dark
                                md:text-5xl
                                lg:text-6xl">
                                    A forma mais sofisticada de viver os eventos da capital do descobrimento.
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

                                <div className="absolute left-[40vw] bottom-[-35px] w-[180px] h-auto z-10 pointer-events-none
                                sm:w-[250px] sm:left-[400px] sm:bottom-[-60px]
                                lg:w-[260px] lg:left-[465px] lg:bottom-[-30px]
                                3xl:w-[320px] 3xl:left-[500px] 3xl:bottom-[-75px]
                                ">
                                    <Image
                                        src="/images/porto-seguro-ingressos-cabral.png"
                                        alt="Pedro Álvares Cabral apontando para as taxas da plataforma"
                                        width={350}
                                        height={437}
                                        className="object-contain w-full h-auto -scale-x-100 lg:scale-x-100"
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
                                            <Link href="/organizadores" aria-label="Acessar área do organizador">
                                                Área do produtor
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
                                lg:text-5xl font-semibold text-psi-dark leading-tight">
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
                                            md:text-lg text-psi-dark/60 font-medium pb-1">por ingresso</span>
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
                                            md:text-lg text-psi-dark/60 font-medium pb-1">por ingresso</span>
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

            <section className="w-full bg-white py-12
            sm:py-16
            lg:py-20">
                <div className="container space-y-10">
                    <div className="space-y-3 text-center max-w-3xl mx-auto">
                        <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-psi-primary/10 text-psi-primary text-xs font-semibold uppercase tracking-wide">
                            Confiança em cada etapa
                        </span>
                        <h2 className="text-3xl font-bold text-psi-dark
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
                                        <h3 className={`text-lg font-semibold text-psi-dark ${isFirst ? "text-psi-light" : ""}`}>{highlight.title}</h3>
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
                            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wide">
                                Plataforma para organizadores
                            </span>
                            <h2 className="text-3xl font-bold
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
                        <div className="absolute left-[60vw] bottom-[1365px] w-[130px] h-auto z-10 pointer-events-none
                                xs:left-[57vw] xs:bottom-[2735px] xs:w-[160px]
                                sm:w-[170px] sm:left-[400px] sm:bottom-[1600px]
                                lg:w-[320px] lg:left-[980px] lg:bottom-[770px]
                                3xl:w-[300px] 3xl:left-[1260px] 3xl:bottom-[770px]
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
                                <h3 className="text-2xl font-semibold">Assuma o controle da sua bilheteria</h3>
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
                                    <p className="text-3xl font-bold text-psi-tertiary mt-2">48h</p>
                                </div>
                                <div className="rounded-2xl bg-white/10 p-4">
                                    <div className="flex-col lg:flex items-start gap-2">
                                        <Star className="mb-2 lg:mb-0 size-4 text-white/60" />
                                        <p className="text-xs text-white/60 uppercase tracking-widest">Satisfação dos produtores</p>
                                    </div>
                                    <p className="text-3xl font-bold text-emerald-300 mt-2">5/5</p>
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
                <div className="relative min-h-[600px]
                sm:min-h-[700px]
                lg:min-h-[800px] flex items-center">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/porto-seguro-ingressos-palmeira-praia.jpeg"
                            alt="Porto Seguro e região - Arraial D'Ajuda, Trancoso, Cabrália, Caraíva"
                            fill
                            className="object-cover"
                            priority
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-black/70"
                        />
                        <div className="absolute inset-0 bg-linear-to-br from-psi-primary/90 via-psi-secondary/80 to-psi-primary/90
                        sm:from-psi-primary/85 sm:via-psi-secondary/75 sm:to-psi-primary/85
                        lg:from-psi-primary/80 lg:via-psi-secondary/70 lg:to-psi-primary/80" />
                        <div className="absolute inset-0 bg-linear-to-t from-psi-dark/60 via-transparent to-transparent" />
                    </div>

                    <div className="relative z-10 container py-16
                    sm:py-20
                    lg:py-24">
                        <div className="grid gap-12
                        lg:grid-cols-2 lg:gap-16 items-center">
                            <div className="space-y-6 text-white">
                                <div className="space-y-3">
                                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs font-semibold uppercase tracking-wider border border-white/30">
                                        Capital do Descobrimento
                                    </span>
                                    <h2 className="text-4xl font-bold leading-tight
                                    sm:text-5xl
                                    lg:text-6xl">
                                        O coração pulsante da <span className="text-psi-tertiary">cultura baiana</span>
                                    </h2>
                                    <p className="text-lg text-white/90
                                    sm:text-xl max-w-2xl">
                                        De Porto Seguro a Caraíva, passando por Arraial D'Ajuda, Trancoso e Cabrália. Uma região rica em história, natureza e experiências inesquecíveis.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4
                                sm:grid-cols-4
                                lg:grid-cols-3
                                ">
                                    {["Porto Seguro", "Arraial D'Ajuda", "Trancoso", "Caraíva", "Cabrália", "Coroa Vermelha"].map((city) => (
                                        <div key={city} className="rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 p-3 text-center">
                                            <p className="text-sm font-semibold text-psi-dark">{city}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="flex flex-col gap-4 justify-center pt-4
                                sm:flex-row">
                                    <CTAButton
                                        size="lg"
                                        text="Anuncie seu evento"
                                        variant="tertiary"
                                        icon={Megaphone}
                                        href="/cadastro?org=true"
                                        className="hover:bg-psi-primary! hover:text-white!"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 p-6
                                sm:p-8 shadow-xl">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                <Users className="w-6 h-6 text-psi-primary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-psi-dark">Para Organizadores</h3>
                                                <p className="text-sm text-psi-dark/60">Conecte-se com o público local</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-psi-dark/70 leading-relaxed">
                                            Porto Seguro e região recebem milhões de turistas anualmente. Use nossa plataforma para alcançar esse público qualificado e aumentar suas vendas com taxas justas e suporte local.
                                        </p>
                                        <ul className="space-y-2">
                                            {[
                                                "Público qualificado de turistas e moradores",
                                                "Taxas reduzidas para maximizar seus lucros",
                                                "Suporte dedicado para produtores locais",
                                                "Repasse rápido e transparente"
                                            ].map((item, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-psi-dark/70">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-white/95 backdrop-blur-md border border-white/50 p-6
                                sm:p-8 shadow-xl">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-xl bg-psi-secondary/10 flex items-center justify-center">
                                                <Ticket className="w-6 h-6 text-psi-secondary" />
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-psi-dark">Para Compradores</h3>
                                                <p className="text-sm text-psi-dark/60">Descubra os melhores eventos</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-psi-dark/70 leading-relaxed">
                                            Explore eventos autênticos da região: shows, festivais, experiências culturais e muito mais. Compre com segurança e aproveite ao máximo sua estadia em Porto Seguro.
                                        </p>
                                        <ul className="space-y-2">
                                            {[
                                                "Eventos verificados e seguros",
                                                "Ingressos digitais com QR Code",
                                                "Taxas transparentes e justas",
                                                "Suporte em português"
                                            ].map((item, index) => (
                                                <li key={index} className="flex items-start gap-2 text-sm text-psi-dark/70">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                                    <span>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
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