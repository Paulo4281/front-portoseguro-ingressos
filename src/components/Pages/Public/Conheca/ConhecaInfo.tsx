"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import { ArrowLeft, Instagram, Facebook, Sparkles, Lightbulb, Heart, Target } from "lucide-react"

const ConhecaInfo = () => {
    return (
        <Background variant="light" className="min-h-screen">
            <div className="pt-32 pb-24 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-5xl mx-auto space-y-16">
                    <div className="text-center space-y-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-psi-primary/10 text-psi-primary text-sm font-medium uppercase tracking-wide">
                            <Sparkles className="h-4 w-4" />
                            Sobre Nós
                        </div>
                        <h1 className="text-4xl
                        sm:text-5xl
                        lg:text-6xl font-semibold text-psi-dark leading-tight">
                            Conheça a <span className="text-psi-primary">Maion Digital</span>
                        </h1>
                        <p className="text-lg
                        sm:text-xl text-psi-dark/70 max-w-2xl mx-auto">
                            Uma história de transformação digital e inovação no mercado de eventos e entretenimento.
                        </p>
                    </div>

                    <div className="flex flex-col items-center justify-center gap-8 py-2">
                        <div className="relative w-72 h-72
                        sm:w-96 sm:h-96">
                            <div className="relative w-full h-full">
                                <Image
                                    src="https://maionimoveis.com.br/images/logos/maion-logo-blue.svg"
                                    alt="Maion Digital Logo"
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="gap-2 hover:bg-psi-secondary hover:text-white"
                            >
                                <a
                                    href="https://www.instagram.com/maion.digital?igsh=ZWN5dWNheGZ4ZnRm&utm_source=qr"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Instagram className="h-5 w-5" />
                                    Instagram
                                </a>
                            </Button>
                            <Button
                                asChild
                                variant="outline"
                                size="lg"
                                className="gap-2 hover:bg-blue-400 hover:text-white"
                            >
                                <a
                                    href="https://www.facebook.com/profile.php?id=61559369005177"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <Facebook className="h-5 w-5" />
                                    Facebook
                                </a>
                            </Button>
                        </div>
                    </div>

                    <section className="relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-psi-primary/30 to-transparent"></div>
                        <div className="pl-8
                        sm:pl-12 space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-psi-primary to-psi-primary/80 flex items-center justify-center text-white shadow-lg shadow-psi-primary/30">
                                    <Sparkles className="h-7 w-7" />
                                </div>
                                <h2 className="text-3xl
                                sm:text-4xl font-semibold text-psi-dark">
                                    Nossa História
                                </h2>
                            </div>
                            <div className="space-y-6 text-psi-dark/80 leading-relaxed max-w-3xl">
                                <p className="text-lg
                                sm:text-xl">
                                    Fundada em 2024 por dois empresários visionários em Porto Seguro, a <strong className="text-psi-dark font-medium">Maion Digital</strong> nasceu para transformar o mercado de eventos e entretenimento. Especializados em estratégias digitais e desenvolvimento de plataformas, oferecemos soluções abrangentes para destacar seus eventos e impulsionar suas vendas no mercado online.
                                </p>
                                <p className="text-lg
                                sm:text-xl">
                                    Nosso compromisso é com a <strong className="text-psi-dark font-medium">transparência</strong>, a <strong className="text-psi-dark font-medium">inovação</strong> e a <strong className="text-psi-dark font-medium">excelência</strong> em cada projeto. Confie na Maion para transformar a presença online dos seus eventos e impulsionar seus negócios. Juntos, vamos destacar seus eventos no mercado digital e alcançar resultados extraordinários.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="relative">
                        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-psi-secondary/30 to-transparent"></div>
                        <div className="pr-8
                        sm:pr-12 space-y-8 text-right">
                            <div className="flex items-center gap-4 justify-end">
                                <h2 className="text-3xl
                                sm:text-4xl font-semibold text-psi-dark">
                                    Plataforma de Venda de Ingressos
                                </h2>
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-psi-secondary to-psi-secondary/80 flex items-center justify-center text-white shadow-lg shadow-psi-secondary/30">
                                    <Target className="h-7 w-7" />
                                </div>
                            </div>
                            <div className="space-y-6 text-psi-dark/80 leading-relaxed max-w-3xl ml-auto">
                                <p className="text-lg
                                sm:text-xl">
                                    A venda de ingressos online desempenha um papel crucial no sucesso de eventos e organizadores, especialmente em um cenário cada vez mais digital. Nos últimos anos, a transformação digital tem revolucionado a maneira como eventos são divulgados e ingressos são comercializados.
                                </p>
                                <p className="text-lg
                                sm:text-xl">
                                    Somos apaixonados por ajudar organizadores a crescer e se desenvolver no mercado digital. Divulgamos eventos de forma criativa e atrativa, utilizando tecnologias de ponta e campanhas direcionadas que aumentam a visibilidade e atraem compradores qualificados.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="relative py-16">
                        <div className="absolute inset-0 bg-gradient-to-br from-psi-primary/5 via-psi-secondary/5 to-psi-tertiary/5 rounded-3xl"></div>
                        <div className="relative px-8
                        sm:px-12
                        lg:px-16 space-y-10">
                            <div className="flex items-center justify-center gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-psi-primary via-psi-secondary to-psi-tertiary flex items-center justify-center text-white shadow-xl shadow-psi-primary/20">
                                    <Lightbulb className="h-8 w-8" />
                                </div>
                                <h2 className="text-3xl
                                sm:text-4xl
                                lg:text-5xl font-semibold text-psi-dark text-center">
                                    Iluminando Projetos
                                </h2>
                            </div>
                            <div className="space-y-6 text-psi-dark/80 leading-relaxed max-w-4xl mx-auto text-center">
                                <p className="text-lg
                                sm:text-xl">
                                    Na <strong className="text-psi-dark font-medium">Maion Digital</strong>, nosso compromisso com o slogan <strong className="text-psi-primary font-medium">"Iluminando Projetos"</strong> reflete a dedicação em clarear caminhos e concretizar sonhos no setor de eventos e entretenimento. Acreditamos que cada evento é mais do que uma simples ocasião; é um projeto de vida, seja para os organizadores em busca de sucesso, seja para o público que deseja vivenciar experiências únicas.
                                </p>
                                <p className="text-lg
                                sm:text-xl">
                                    Com <strong className="text-psi-dark font-medium">transparência</strong>, <strong className="text-psi-dark font-medium">inovação</strong> e <strong className="text-psi-dark font-medium">excelência</strong>, a Maion Digital ilumina as etapas do processo, conectando pessoas e oportunidades. Estamos aqui para ouvir, entender e agir, transformando aspirações em realizações. Confie em quem ilumina o caminho para que seu projeto se torne uma conquista.
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="space-y-12 text-center">
                        <div className="space-y-6 max-w-3xl mx-auto">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-psi-primary/10 to-psi-secondary/10 text-psi-primary text-sm font-medium uppercase tracking-wide">
                                <Heart className="h-4 w-4" />
                                Nossa Missão
                            </div>
                            <h2 className="text-4xl
                            sm:text-5xl
                            lg:text-6xl font-semibold text-psi-dark leading-tight">
                                Transformando <span className="bg-gradient-to-r from-psi-primary to-psi-secondary bg-clip-text text-transparent">sonhos</span> em realidade
                            </h2>
                            <p className="text-xl
                            sm:text-2xl text-psi-dark/70 leading-relaxed">
                                Estamos comprometidos em oferecer a melhor experiência para organizadores e público, com tecnologia de ponta, suporte dedicado e resultados que superam expectativas.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-8">
                            <Button asChild size="lg" variant="primary">
                                <Link href="/">
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar ao início
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/cadastro">
                                    Criar minha conta
                                </Link>
                            </Button>
                        </div>
                    </section>
                </div>
            </div>
        </Background>
    )
}

export {
    ConhecaInfo
}
