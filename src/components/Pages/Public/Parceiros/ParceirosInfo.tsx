"use client"

import { useMemo } from "react"
import { Shield, ExternalLink } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { usePartnerFind } from "@/hooks/Partner/usePartnerFind"
import { usePartnerIncrementClickCount } from "@/hooks/Partner/usePartnerIncrementClickCount"
import type { TPartner } from "@/types/Partner/TPartner"

const ParceirosInfo = () => {
    const { data, isLoading } = usePartnerFind()
    const { mutateAsync: incrementClickCount } = usePartnerIncrementClickCount()

    const partners = useMemo(() => {
        if (data?.data && Array.isArray(data.data)) {
            return data.data
        }

        return []
    }, [data])

    const handleOpenPartnerLink = async (partner: TPartner) => {
        if (!partner.link) return

        try {
            await incrementClickCount({ id: partner.id })
        } catch (error) {
            // Não bloqueia a navegação caso a contagem falhe.
        }

        window.open(partner.link, "_blank", "noopener,noreferrer")
    }

    return (
        <Background variant="light">
            <div className="min-h-screen pt-32 pb-16 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto space-y-12">
                    {/* Intro */}
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="h-20 w-20 rounded-full bg-psi-primary/10 flex items-center justify-center">
                                <Shield className="h-10 w-10 text-psi-primary" />
                            </div>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-semibold text-psi-primary">
                            Nossos Parceiros
                        </h1>
                        <p className="text-lg sm:text-xl text-psi-dark/70 max-w-2xl mx-auto leading-relaxed">
                            Acreditamos em usar as melhores ferramentas do mercado: infraestrutura confiável, segurança cibernética e proteção de dados são a base para entregar uma experiência segura aos seus clientes e eventos.
                        </p>
                    </div>

                    {/* Partners grid */}
                    <div className="space-y-6">
                        <div className="text-center">
                            <h2 className="text-2xl sm:text-3xl font-semibold text-psi-dark mb-2">
                                Conheça as soluções que recomendamos
                            </h2>
                            <p className="text-psi-dark/60">
                                Cada parceiro abaixo oferece serviços que reforçam nossa stack e a sua tranquilidade.
                            </p>
                        </div>

                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Array.from({ length: 4 }).map((_, index) => (
                                    <div key={index} className="rounded-2xl border border-psi-primary/20 bg-white h-72 animate-pulse" />
                                ))}
                            </div>
                        ) : partners.length === 0 ? (
                            <div className="rounded-2xl border border-psi-primary/20 bg-white p-8 text-center text-psi-dark/60">
                                Nenhum parceiro disponível no momento.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {partners.map((partner) => (
                                    <article
                                        key={partner.id}
                                        className="rounded-2xl border border-psi-primary/20 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                                    >
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="relative h-40 w-32 shrink-0 flex items-center justify-center bg-white rounded-lg border border-psi-dark/10 overflow-hidden">
                                                    {partner.logo && (
                                                        <Image
                                                            src={partner.logo}
                                                            alt={`Logo ${partner.name}`}
                                                            width={128}
                                                            height={128}
                                                            className="object-contain object-center"
                                                            unoptimized
                                                            onError={(e) => {
                                                                const wrapper = e.currentTarget.closest(".relative")
                                                                const fallback = wrapper?.querySelector("[data-logo-fallback]") as HTMLElement
                                                                if (wrapper && fallback) {
                                                                    e.currentTarget.style.setProperty("display", "none")
                                                                    fallback.classList.remove("hidden")
                                                                    fallback.classList.add("flex")
                                                                }
                                                            }}
                                                        />
                                                    )}
                                                </div>
                                                <h3 className="text-xl font-semibold text-psi-dark">
                                                    {partner.name}
                                                </h3>
                                            </div>
                                            <p className="text-psi-dark/70 text-sm leading-relaxed flex-1 mb-4">
                                                {partner.description || "Parceiro sem descrição cadastrada."}
                                            </p>
                                            <Button
                                                variant="outline"
                                                className="w-full sm:w-auto border-psi-primary/30 hover:border-psi-primary/50 hover:bg-psi-primary/5"
                                                onClick={() => handleOpenPartnerLink(partner)}
                                                disabled={!partner.link}
                                            >
                                                <span className="inline-flex items-center gap-2">
                                                    {partner.link ? `Conhecer ${partner.name}` : "Link não disponível"}
                                                    <ExternalLink className="h-4 w-4" />
                                                </span>
                                            </Button>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Background>
    )
}

export { ParceirosInfo }
