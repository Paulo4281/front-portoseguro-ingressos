"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Ticket } from "lucide-react"
import { useEventFind } from "@/hooks/Event/useEventFind"
import { CardEvent } from "@/components/Card/CardEvent/CardEvent"

const HomeHero = () => {
    const { data: events, isLoading, isError } = useEventFind()

    return (
        <section className="relative w-full min-h-screen flex flex-col py-20
        overflow-hidden">
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{
                    backgroundImage: 'url(https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg)'
                }}
            />
            <div className="absolute inset-0 bg-black/60" />
            
            <div className="relative container mx-auto px-4 flex flex-col flex-1
            sm:px-6
            lg:px-8 z-10 py-16
            sm:py-20
            md:py-24
            lg:py-32">
                <div className="max-w-4xl mx-auto text-center mb-12
                md:mb-16
                lg:mb-20">
                    <h1 className="text-5xl font-bold text-white mb-6
                    md:text-6xl
                    lg:text-7xl">
                        Seus eventos favoritos em
                        <span className="text-psi-secondary block mt-2">Porto Seguro</span>
                    </h1>
                    
                    <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto
                    sm:text-xl
                    md:text-2xl
                    lg:mb-12">
                        Descubra os melhores eventos da cidade. Compre ingressos de forma rápida, segura e com as menores taxas do mercado.
                    </p>

                    <div className="flex flex-col
                    sm:flex-row
                    items-center justify-center">
                        <Button
                        asChild
                        size="2xl"
                        variant="secondary"
                        className="text-xl"
                        >
                            <Link href="/eventos" className="flex items-center">
                                <Ticket className="size-6" />
                                <span>Explorar Eventos</span>
                            </Link>
                        </Button>
                    </div>
                </div>

                {events && events.length > 0 && (
                    <div className="w-full">
                        {isLoading ? (
                            <div className="text-center py-12">
                                <p className="text-white/80">Carregando eventos...</p>
                            </div>
                        ) : isError ? (
                            <div className="text-center py-12">
                                <p className="text-destructive">Erro ao carregar eventos. Tente novamente mais tarde.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-6
                            md:grid-cols-2
                            lg:grid-cols-3
                            3xl:grid-cols-4">
                                {events.map((event) => (
                                    <CardEvent key={event.id} event={event} />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </section>
    )
}

export {
    HomeHero
}