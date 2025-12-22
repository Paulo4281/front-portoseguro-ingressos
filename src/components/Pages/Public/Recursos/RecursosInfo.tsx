"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CTAButton } from "@/components/CTAButton/CTAButton"
import { Background } from "@/components/Background/Background"
import {
    Zap,
    ShieldCheck,
    TrendingUp,
    QrCode,
    Ticket,
    Globe2,
    Lock,
    CheckCircle2,
    Sparkles,
    BarChart3,
    FileCheck,
    Clock,
    DollarSign,
    Users,
    ArrowRight,
    ArrowLeft,
    Cpu,
    Fingerprint,
    Database,
    Cloud,
    Smartphone,
    CreditCard,
    TrendingDown,
    Award,
    Target
} from "lucide-react"

const RecursosInfo = () => {
    const mainFeatures = [
        {
            title: "Tecnologia de Ponta",
            description: "Infraestrutura em nuvem com alta disponibilidade, escalabilidade automática e performance otimizada para picos de demanda.",
            icon: Cpu,
            color: "text-psi-primary"
        },
        {
            title: "Segurança Máxima",
            description: "Criptografia end-to-end, compliance com LGPD, monitoramento 24/7 e proteção contra fraudes em tempo real.",
            icon: ShieldCheck,
            color: "text-psi-secondary"
        },
        {
            title: "Performance Excepcional",
            description: "Sistema otimizado para suportar milhares de transações simultâneas sem lentidão ou travamentos.",
            icon: Zap,
            color: "text-psi-tertiary"
        },
        {
            title: "QR Code Inteligente",
            description: "Geração instantânea de QR Codes únicos e criptografados, com validação em tempo real no dia do evento.",
            icon: QrCode,
            color: "text-psi-primary"
        }
    ]

    const businessAdvantages = [
        {
            title: "Taxas Competitivas",
            description: "1% acima de R$39,90 ou R$1 fixo. As menores taxas do mercado brasileiro, sem surpresas.",
            icon: TrendingDown,
            stat: "Menor taxa do Brasil"
        },
        {
            title: "Alto Potencial de Vendas",
            description: "Plataforma otimizada para conversão, com checkout rápido e experiência fluida que aumenta suas vendas.",
            icon: TrendingUp,
            stat: "+40% conversão"
        },
        {
            title: "Repasse Rápido",
            description: "Receba seus valores em até 48h após o evento, diretamente na sua conta bancária cadastrada.",
            icon: Clock,
            stat: "48h pós-evento"
        },
        {
            title: "Zero Burocracia",
            description: "Cadastro simples, aprovação rápida e dashboard intuitivo. Foque no que importa: seus eventos.",
            icon: FileCheck,
            stat: "Aprovação em 24h"
        }
    ]

    const complianceFeatures = [
        {
            title: "Verificação Manual",
            description: "Todos os organizadores passam por análise detalhada de documentos e compliance antes de publicar eventos.",
            icon: CheckCircle2
        },
        {
            title: "Documentação Completa",
            description: "Validação de CNPJ, documentos pessoais e conta bancária para garantir transparência total.",
            icon: FileCheck
        },
        {
            title: "Monitoramento Contínuo",
            description: "Acompanhamento constante de todas as operações para manter a integridade da plataforma.",
            icon: ShieldCheck
        }
    ]

    const technicalFeatures = [
        {
            title: "Dashboard Inteligente",
            description: "Visualize vendas em tempo real, relatórios detalhados e métricas de performance do seu evento.",
            icon: BarChart3
        },
        {
            title: "Gestão de Lotes",
            description: "Crie lotes com preços e quantidades diferentes, ativação automática e controle total de estoque.",
            icon: Ticket
        },
        {
            title: "Tipos de Ingressos",
            description: "Diferencie ingressos (VIP, Meia, Inteira) com preços e quantidades específicas por lote.",
            icon: Sparkles
        },
        {
            title: "API Integrada",
            description: "Integre nossa API com seus sistemas para sincronização automática de dados e repasses.",
            icon: Database
        }
    ]

    const securityFeatures = [
        {
            title: "Criptografia SSL",
            description: "Todas as transações são protegidas com criptografia de ponta a ponta.",
            icon: Lock
        },
        {
            title: "LGPD Compliant",
            description: "Totalmente em conformidade com a Lei Geral de Proteção de Dados.",
            icon: Fingerprint
        },
        {
            title: "Backup Automático",
            description: "Seus dados são protegidos com backups automáticos e redundância em múltiplos servidores.",
            icon: Cloud
        },
        {
            title: "Pagamento Seguro",
            description: "Integração com gateway de pagamento certificado e PCI-DSS compliant.",
            icon: CreditCard
        }
    ]

    const portoSeguroFocus = [
        {
            title: "Foco Regional",
            description: "Dedicados exclusivamente a Porto Seguro, entendemos profundamente o mercado local.",
            icon: Globe2
        },
        {
            title: "Suporte Local",
            description: "Equipe próxima que conhece a realidade dos produtores e turistas da região.",
            icon: Users
        },
        {
            title: "Cenário Cultural",
            description: "Valorizamos a cultura local e apoiamos eventos que movimentam a cidade.",
            icon: Award
        }
    ]

    return (
        <Background variant="light" className="min-h-screen">
            <div className="pt-32 pb-16 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-7xl mx-auto space-y-20">
                    <div className="text-center space-y-6 max-w-4xl mx-auto">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-psi-primary/10 text-psi-primary text-sm font-semibold uppercase tracking-wide">
                            <Sparkles className="h-4 w-4" />
                            Recursos da Plataforma
                        </div>
                        <h1 className="text-4xl
                        sm:text-5xl
                        lg:text-6xl font-bold text-psi-dark leading-tight">
                            Tecnologia que <span className="text-psi-primary">impulsiona</span> suas vendas
                        </h1>
                        <p className="text-lg
                        sm:text-xl text-psi-dark/70 max-w-2xl mx-auto">
                            A plataforma mais completa e com as menores taxas do mercado para vender ingressos em Porto Seguro. Performance, segurança e simplicidade em um só lugar.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                            <Button asChild size="lg" variant="primary">
                                <Link href="/cadastro?org=true">
                                    Começar agora
                                    <ArrowRight className="h-4 w-4 ml-2" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="ghost">
                                <Link href="/">
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar ao início
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <section className="space-y-12">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl
                            sm:text-4xl font-bold text-psi-dark">
                                Recursos <span className="text-psi-primary">Principais</span>
                            </h2>
                            <p className="text-psi-dark/60 text-base
                            sm:text-lg">
                                Tecnologia de ponta para maximizar suas vendas
                            </p>
                        </div>
                        <div className="grid grid-cols-1
                        md:grid-cols-2 gap-6">
                            {mainFeatures.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={feature.title}
                                        className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6
                                        sm:p-8 space-y-4 hover:shadow-xl hover:shadow-black/10 transition-all duration-300"
                                    >
                                        <div className={`w-14 h-14 rounded-2xl bg-psi-primary/10 flex items-center justify-center ${feature.color}`}>
                                            <Icon className="h-7 w-7" />
                                        </div>
                                        <h3 className="text-xl
                                        sm:text-2xl font-bold text-psi-dark">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm
                                        sm:text-base text-psi-dark/70">
                                            {feature.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-[#E4E6F0] bg-linear-to-br from-psi-primary/5 via-white to-psi-secondary/5 p-8
                    sm:p-12
                    lg:p-16 space-y-12">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl
                            sm:text-4xl font-bold text-psi-dark">
                                Vantagens <span className="text-psi-primary">Competitivas</span>
                            </h2>
                            <p className="text-psi-dark/60 text-base
                            sm:text-lg">
                                O que faz da nossa plataforma a melhor escolha
                            </p>
                        </div>
                        <div className="grid grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-4 gap-6">
                            {businessAdvantages.map((advantage) => {
                                const Icon = advantage.icon
                                return (
                                    <div
                                        key={advantage.title}
                                        className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6 space-y-4 hover:shadow-xl hover:shadow-black/10 transition-all duration-300"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="w-12 h-12 rounded-xl bg-psi-primary/10 flex items-center justify-center text-psi-primary">
                                                <Icon className="h-6 w-6" />
                                            </div>
                                            <span className="text-xs font-semibold text-psi-secondary bg-psi-secondary/10 px-2 py-1 rounded-full">
                                                {advantage.stat}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-psi-dark">
                                            {advantage.title}
                                        </h3>
                                        <p className="text-sm text-psi-dark/70">
                                            {advantage.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    <section className="space-y-12">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-psi-secondary/10 text-psi-secondary text-sm font-semibold uppercase tracking-wide">
                                <ShieldCheck className="h-4 w-4" />
                                Compliance e Segurança
                            </div>
                            <h2 className="text-3xl
                            sm:text-4xl font-bold text-psi-dark">
                                Plataforma <span className="text-psi-primary">Verificada</span>
                            </h2>
                            <p className="text-psi-dark/60 text-base
                            sm:text-lg">
                                Processo rigoroso de verificação garante credibilidade e confiança
                            </p>
                        </div>
                        <div className="grid grid-cols-1
                        md:grid-cols-3 gap-6">
                            {complianceFeatures.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={feature.title}
                                        className="rounded-2xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/10 via-white to-psi-primary/5 p-6 space-y-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-psi-primary/20 flex items-center justify-center text-psi-primary">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-psi-dark">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-psi-dark/70">
                                            {feature.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    <section className="space-y-12">
                        <div className="text-center space-y-3">
                            <h2 className="text-3xl
                            sm:text-4xl font-bold text-psi-dark">
                                Ferramentas <span className="text-psi-primary">Completas</span>
                            </h2>
                            <p className="text-psi-dark/60 text-base
                            sm:text-lg">
                                Tudo que você precisa para gerenciar seus eventos com excelência
                            </p>
                        </div>
                        <div className="grid grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-4 gap-6">
                            {technicalFeatures.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={feature.title}
                                        className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6 space-y-4 hover:shadow-xl hover:shadow-black/10 transition-all duration-300"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-psi-primary/10 flex items-center justify-center text-psi-primary">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-psi-dark">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-psi-dark/70">
                                            {feature.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-[#E4E6F0] bg-linear-to-br from-psi-dark via-psi-dark/95 to-psi-dark text-white p-8
                    sm:p-12
                    lg:p-16 space-y-12">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-sm font-semibold uppercase tracking-wide">
                                <Lock className="h-4 w-4" />
                                Segurança da Informação
                            </div>
                            <h2 className="text-3xl
                            sm:text-4xl font-bold">
                                Seus Dados <span className="text-psi-tertiary">Protegidos</span>
                            </h2>
                            <p className="text-white/80 text-base
                            sm:text-lg">
                                Implementamos as melhores práticas de segurança do mercado
                            </p>
                        </div>
                        <div className="grid grid-cols-1
                        md:grid-cols-2
                        lg:grid-cols-4 gap-6">
                            {securityFeatures.map((feature) => {
                                const Icon = feature.icon
                                return (
                                    <div
                                        key={feature.title}
                                        className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-psi-tertiary/20 flex items-center justify-center text-psi-tertiary">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold">
                                            {feature.title}
                                        </h3>
                                        <p className="text-sm text-white/80">
                                            {feature.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    <section className="space-y-12">
                        <div className="text-center space-y-3">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-psi-secondary/10 text-psi-secondary text-sm font-semibold uppercase tracking-wide">
                                <Globe2 className="h-4 w-4" />
                                Porto Seguro
                            </div>
                            <h2 className="text-3xl
                            sm:text-4xl font-bold text-psi-dark">
                                Feito para <span className="text-psi-primary">Porto Seguro</span>
                            </h2>
                            <p className="text-psi-dark/60 text-base
                            sm:text-lg">
                                Entendemos e valorizamos o mercado local
                            </p>
                        </div>
                        <div className="grid grid-cols-1
                        md:grid-cols-3 gap-6">
                            {portoSeguroFocus.map((item) => {
                                const Icon = item.icon
                                return (
                                    <div
                                        key={item.title}
                                        className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6 space-y-4"
                                    >
                                        <div className="w-12 h-12 rounded-xl bg-psi-secondary/10 flex items-center justify-center text-psi-secondary">
                                            <Icon className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-lg font-bold text-psi-dark">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-psi-dark/70">
                                            {item.description}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </section>

                    <section className="rounded-3xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/10 via-white to-psi-secondary/10 p-8
                    sm:p-12
                    lg:p-16 space-y-8 text-center">
                        <div className="space-y-4 max-w-3xl mx-auto">
                            <h2 className="text-3xl
                            sm:text-4xl
                            lg:text-5xl font-bold text-psi-dark">
                                Pronto para <span className="text-psi-primary">impulsionar</span> suas vendas?
                            </h2>
                            <p className="text-lg
                            sm:text-xl text-psi-dark/70">
                                Junte-se aos organizadores que já estão vendendo mais com as menores taxas do mercado
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <CTAButton
                                href="/cadastro?org=true"
                                text="Criar minha conta"
                                variant="primary"
                                icon={Target}
                            />
                            <Button asChild size="lg" variant="outline">
                                <Link href="/">
                                    Saber mais
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
    RecursosInfo
}
