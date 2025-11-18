"use client"

import { useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, Lock, ShieldCheck, Ticket, Music2, SunMedium, Waves, PartyPopper, TrendingDown, Users, CreditCard } from "lucide-react"
import { useEventFind } from "@/hooks/Event/useEventFind"
import { CardEvent } from "@/components/Card/CardEvent/CardEvent"
import { Carousel } from "@/components/Carousel/Carousel"
import { Search } from "@/components/Search/Search"
import { Category } from "@/components/Category/Category"
import { Background } from "@/components/Background/Background"

const heroCategories = [
    { title: "Shows & Festas", icon: Music2 },
    { title: "Beach Clubs", icon: Waves },
    { title: "Experiências diurnas", icon: SunMedium },
    { title: "VIP & Lounge", icon: PartyPopper },
    { title: "Shows & Festas", icon: Music2 },
    { title: "Beach Clubs", icon: Waves },
    { title: "Experiências diurnas", icon: SunMedium },
    { title: "VIP & Lounge", icon: PartyPopper },
    { title: "Shows & Festas", icon: Music2 },
    { title: "Beach Clubs", icon: Waves },
    { title: "Experiências diurnas", icon: SunMedium },
    { title: "VIP & Lounge", icon: PartyPopper },
    { title: "Shows & Festas", icon: Music2 },
    { title: "Beach Clubs", icon: Waves },
    { title: "Experiências diurnas", icon: SunMedium },
    { title: "VIP & Lounge", icon: PartyPopper },
]

const HomeHero = () => {
    const { data: events, isLoading, isError } = useEventFind()

    const featuredEvents = useMemo(() => {
        if (!events || events.length === 0) {
            return []
        }

        return events.slice(0, 8)
    }, [events])

    const featuredSlides = useMemo(() => {
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
            <div key={category.title} className="w-[180px]
            sm:w-[200px]">
                <Category icon={category.icon} title={category.title} />
            </div>
        ))
    }, [])

    return (
        <Background variant="hero" className="flex min-h-screen flex-col overflow-x-hidden">
            <section className="flex flex-col mt-[100px] w-full">
                <div className="">
                    {featuredEvents.length > 0 && (
                        <div>
                            <div className="flex container items-center justify-between text-[0.7rem] uppercase tracking-[0.35em] text-psi-dark/60">
                                <span>Em destaque</span>
                                <span>+{featuredEvents.length} eventos</span>
                            </div>

                            <div className="
                            relative w-screen flex justify-center mx-auto overflow-hidden border border-[#E4E6F0] bg-white/90 shadow-lg shadow-black/3
                            lg:w-[90vw] lg:rounded-2xl
                            ">
                                <Carousel
                                    items={featuredSlides}
                                    className="px-4 py-6
                                    sm:px-6
                                    lg:px-10"
                                    loop
                                    autoplay
                                    speed={1200}
                                    pauseOnHover={true}
                                    slidesPerView={1}
                                    autoplayDelay={3000}
                                    showNavigation
                                    allowTouchMove
                                    breakpoints={{
                                        1200: {
                                            slidesPerView: 2
                                        },
                                        1400: {
                                            slidesPerView: 3
                                        },
                                        1600: {
                                            slidesPerView: 4
                                        }
                                    }}
                                />
                            </div>

                            <div className="flex w-full flex-col items-center gap-8">
                                <hr />
                                <div className="container flex justify-center">
                                    <Search className="w-full max-w-2xl" />
                                </div>

                                <h2 className="text-5xl font-normal text-center text-psi-dark tracking-tight">
                                    <span className="text-psi-primary font-bold">+50 categorias</span> para todos os estilos
                                </h2>

                                <div className="w-full">
                                    <Carousel
                                        items={categorySlides}
                                        className="px-2 py-4"
                                        slidesPerView={2}
                                        spaceBetween={8}
                                        loop
                                        autoplay
                                        continuous
                                        speed={2600}
                                        breakpoints={{
                                            640: {
                                                slidesPerView: 3
                                            },
                                            1024: {
                                                slidesPerView: 7,
                                            },
                                            1600: {
                                                slidesPerView: 10
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid gap-10 w-full container
                    lg:grid-cols-[1.1fr_0.9fr]">
                        <div className="space-y-10 w-full">
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

                            <div className="flex flex-wrap items-center gap-4
                            sm:gap-6">
                                <Button
                                    asChild
                                    size="lg"
                                    variant="tertiary"
                                    className="group"
                                    >
                                    <Link href="/eventos" aria-label="Explorar eventos disponíveis">
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

                        <div className="space-y-6 rounded-[32px] border border-[#E4E6F0] bg-white/80 p-4
                        sm:p-6
                        lg:p-8 shadow-lg shadow-black/5 overflow-hidden">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm uppercase tracking-[0.3em] text-psi-dark/60">Taxas justas</p>
                                    <p className="text-3xl
                                    sm:text-4xl font-semibold text-psi-dark mt-2">A melhor do mercado</p>
                                </div>
                                <TrendingDown className="h-8 w-8
                                sm:h-10 sm:w-10 text-psi-primary shrink-0" />
                            </div>

                            <div
                                className="rounded-3xl border border-psi-primary/15 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/10 p-4
                                sm:p-6
                                lg:p-8
                                shadow-lg shadow-black/5
                                flex flex-col gap-5
                                w-full
                                "
                                aria-label="Tabela de taxas da plataforma"
                            >
                                <div className="flex flex-col
                                sm:flex-row sm:items-center sm:justify-between gap-4
                                sm:gap-4">
                                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0">
                                        <span className="text-xs uppercase tracking-wider text-psi-dark/60">Acima de R$39,90</span>
                                        <div className="flex items-end gap-2 flex-wrap">
                                            <span className="text-4xl
                                            sm:text-5xl
                                            lg:text-6xl font-extrabold text-psi-primary leading-none">1%</span>
                                            <span className="text-sm
                                            sm:text-base
                                            md:text-lg text-psi-dark/60 font-medium pb-1">por ingresso</span>
                                        </div>
                                    </div>
                                    <div className="hidden
                                    sm:block border-l border-psi-primary/10 h-12 mx-4" aria-hidden="true" />
                                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0
                                    sm:items-end">
                                        <span className="text-xs uppercase tracking-wider text-psi-dark/60">Até R$39,90</span>
                                        <div className="flex items-end gap-2 flex-wrap">
                                            <span className="text-4xl
                                            sm:text-5xl
                                            lg:text-6xl font-extrabold text-psi-primary leading-none">R$1</span>
                                            <span className="text-sm
                                            sm:text-base
                                            md:text-lg text-psi-dark/60 font-medium pb-1">por ingresso</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    <TrendingDown className="h-5 w-5 text-psi-primary shrink-0" aria-hidden="true" />
                                    <span className="text-sm text-psi-dark/65">
                                        Taxas 100% transparentes e as menores da região.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading && (
                        <div className="text-center text-psi-dark/60">Carregando eventos...</div>
                    )}

                    {isError && (
                        <div className="text-center text-destructive">Erro ao carregar eventos. Tente novamente mais tarde.</div>
                    )}
                </div>
            </section>
        </Background>
    )
}

export {
    HomeHero
}