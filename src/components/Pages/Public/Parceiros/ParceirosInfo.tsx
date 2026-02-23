"use client"

import { Shield, Server, Cloud, CreditCard, ExternalLink } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import Image from "next/image"

type TPartner = {
    id: string
    name: string
    description: string
    signupUrl: string
    signupLabel: string
    logoSrc: string
    logoAlt: string
}

const partners: TPartner[] = [
    {
        id: "hostinger",
        name: "Hostinger",
        description: "Hospedagem de sites de alta performance com suporte 24/7, SSL gratuito e painel intuitivo. Ideal para quem busca custo-benefício e infraestrutura confiável para manter seus projetos no ar.",
        signupUrl: "https://www.hostinger.com.br",
        signupLabel: "Conhecer Hostinger",
        logoSrc: "https://treelancer.com.br/wp-content/uploads/2023/04/logo-hostinger.webp",
        logoAlt: "Logo Hostinger",
    },
    {
        id: "digitalocean",
        name: "DigitalOcean",
        description: "Infraestrutura em nuvem simplificada para desenvolvedores. Droplets, Kubernetes e banco de dados gerenciados com preços transparentes e documentação completa para escalar suas aplicações.",
        signupUrl: "https://www.digitalocean.com",
        signupLabel: "Conhecer DigitalOcean",
        logoSrc: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXml5H7LDVwh620USkOzUtIL2LDE1bzpZRqw&s",
        logoAlt: "Logo DigitalOcean",
    },
    {
        id: "google-cloud",
        name: "Google Cloud Platform",
        description: "Plataforma de nuvem do Google com IA, análise de dados e infraestrutura global. Soluções enterprise para inovação, segurança e conformidade em escala.",
        signupUrl: "https://cloud.google.com",
        signupLabel: "Conhecer Google Cloud",
        logoSrc: "https://tiinside.com.br/wp-content/uploads/2022/07/google-cloud-696x696.png",
        logoAlt: "Logo Google Cloud Platform",
    },
    {
        id: "asaas",
        name: "Asaas Gestão de Pagamentos",
        description: "Plataforma brasileira de cobrança e gestão financeira. Boletos, PIX, cartão e conciliação em um só lugar, com API para integrar pagamentos ao seu negócio.",
        signupUrl: "https://www.asaas.com",
        signupLabel: "Conhecer Asaas",
        logoSrc: "https://d2r9epyceweg5n.cloudfront.net/apps/4035-pt_BR-small-2.png",
        logoAlt: "Logo Asaas",
    },
]

const ParceirosInfo = () => {
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {partners.map((partner) => (
                                <article
                                    key={partner.id}
                                    className="rounded-2xl border border-psi-primary/20 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col"
                                >
                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="relative h-40 w-32 shrink-0 flex items-center justify-center bg-white rounded-lg border border-psi-dark/10 overflow-hidden">
                                                {/* Coloque as logos em public/images/parceiros/ (hostinger.png, digitalocean.png, google-cloud.png, asaas.png) */}
                                                <Image
                                                    src={partner.logoSrc}
                                                    alt={partner.logoAlt}
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
                                                <span
                                                    data-logo-fallback
                                                    className="hidden absolute inset-0 items-center justify-center text-sm font-semibold text-psi-dark/70 px-2 text-center"
                                                >
                                                    {partner.name}
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-semibold text-psi-dark">
                                                {partner.name}
                                            </h3>
                                        </div>
                                        <p className="text-psi-dark/70 text-sm leading-relaxed flex-1 mb-4">
                                            {partner.description}
                                        </p>
                                        <Button
                                            asChild
                                            variant="outline"
                                            className="w-full sm:w-auto border-psi-primary/30 hover:border-psi-primary/50 hover:bg-psi-primary/5"
                                        >
                                            <a
                                                href={partner.signupUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-2"
                                            >
                                                {partner.signupLabel}
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export { ParceirosInfo }
