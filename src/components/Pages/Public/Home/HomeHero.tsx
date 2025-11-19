"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton/CTAButton"
import { ArrowUpRight, Lock, ShieldCheck, Ticket, Music2, SunMedium, Waves, PartyPopper, TrendingDown, Users, CreditCard, TrendingUp, Megaphone, Tag } from "lucide-react"
import { useEventFind } from "@/hooks/Event/useEventFind"
import { CardEvent } from "@/components/Card/CardEvent/CardEvent"
import { Carousel } from "@/components/Carousel/Carousel"
import { Search } from "@/components/Search/Search"
import { Category } from "@/components/Category/Category"
import { Background } from "@/components/Background/Background"
import Image from "next/image"
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import { EventCategoryIconHandler } from "@/utils/Helpers/EventCategoryIconHandler/EventCategoryIconHandler"
import { TEvent } from "@/types/Event/TEvent"

const HomeHero = () => {
    const { data: eventsData, isLoading, isError } = useEventFind()
    const [featuredEvents, setFeaturedEvents] = useState<TEvent[]>([])

    useEffect(() => {
        if (eventsData?.success) {
            setFeaturedEvents(eventsData.data ?? [])
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
                                lg:w-[260px] lg:left-[365px] lg:bottom-[-30px]
                                3xl:w-[330px] 3xl:left-[490px] 3xl:bottom-[-75px]
                                ">
                                    <Image
                                        src="/images/porto-seguro-ingressos-cabral.png"
                                        alt="Pedro Álvares Cabral apontando"
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
                            </div>
                        </div>

                        <div className="space-y-8 rounded-[32px] border border-[#E4E6F0] bg-white/80 p-4
                        sm:p-6
                        lg:p-8 shadow-lg shadow-black/5 overflow-hidden flex flex-col justify-between">
                            <div className="space-y-3">
                                <span className="inline-flex items-center gap-2 bg-psi-secondary/10 text-psi-secondary font-medium px-3 py-1.5 rounded-full text-xs uppercase tracking-wider">
                                    Experimente sem compromisso
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
                                        <span className="text-xs uppercase tracking-wider text-psi-dark/60">Acima de R$39,90</span>
                                        <div className="flex items-end gap-2 flex-wrap">
                                            <span className="text-4xl
                                            sm:text-5xl
                                            lg:text-6xl font-extrabold text-psi-secondary leading-none">1%</span>
                                            <span className="text-sm
                                            sm:text-base
                                            md:text-lg text-psi-dark/60 font-medium pb-1">por ingresso</span>
                                        </div>
                                    </div>
                                    <div className="hidden
                                    sm:block border-l border-psi-primary/10 h-12 mx-4" aria-hidden="true" />
                                    <div className="flex flex-col items-start gap-1 flex-1 min-w-0
                                    sm:items-start">
                                        <span className="text-xs uppercase tracking-wider text-psi-dark/60">Até R$39,90</span>
                                        <div className="flex items-end gap-2 flex-wrap">
                                            <span className="text-4xl
                                            sm:text-5xl
                                            lg:text-6xl font-extrabold text-psi-secondary leading-none">R$1</span>
                                            <span className="text-sm
                                            sm:text-base
                                            md:text-lg text-psi-dark/60 font-medium pb-1">por ingresso</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-3 flex items-center gap-2 flex-wrap">
                                    <TrendingUp className="h-5 w-5 text-psi-secondary shrink-0" aria-hidden="true" />
                                    <span className="text-sm text-psi-dark/65">
                                        Taxas 100% transparentes e as menores da região.
                                    </span>
                                </div>
                            </div>
                            <div className="flex sm:flex-row gap-4 sm:gap-6 items-center">
                                <CTAButton
                                    href="/organizadores/cadastro"
                                    text="Anuncie seu evento"
                                    variant="secondary"
                                    icon={Megaphone}
                                />
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