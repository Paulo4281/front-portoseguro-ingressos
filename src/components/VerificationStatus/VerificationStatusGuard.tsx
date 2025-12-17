"use client"

import { useMemo } from "react"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { Background } from "@/components/Background/Background"
import { Clock, XCircle, AlertCircle, TrendingDown, Zap, Shield, Users, Star, Sparkles } from "lucide-react"
import { Skeleton } from "../ui/skeleton"

type TVerificationStatusGuardProps = {
    children: React.ReactNode
}

const VerificationStatusGuard = ({ children }: TVerificationStatusGuardProps) => {
    const { user } = useAuthStore()

    const verificationStatus = useMemo(() => {
        return user?.Organizer?.verificationStatus || null
    }, [user])

    if (verificationStatus === "WAITING_DOCUMENTATION") {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-8 mt-[100px]
                sm:py-12">
                    <div className="max-w-6xl mx-auto px-4
                    sm:px-6
                    lg:px-8 space-y-8">
                        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 flex flex-col items-center text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                                <AlertCircle className="h-8 w-8 text-amber-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-amber-900">
                                    Documentação pendente
                                </h2>
                                <p className="text-amber-800">
                                    Você precisa enviar suas informações e documentação para análise. A análise é rápida e logo você poderá utilizar todos os recursos da plataforma.
                                </p>
                                <p className="text-sm text-amber-700">
                                    Acesse seu perfil para enviar os documentos necessários.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-psi-primary flex items-center justify-center gap-2">
                                    <Sparkles className="h-6 w-6" />
                                    Prepare-se para uma experiência incrível!
                                </h3>
                                <p className="text-psi-dark/70">
                                    Quando sua conta for aprovada, você terá acesso a uma plataforma completa e moderna
                                </p>
                            </div>

                            <div className="grid gap-6
                            md:grid-cols-2
                            lg:grid-cols-3">
                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                                        <TrendingDown className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Taxas Altamente Competitivas
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Apenas 1% fixo acima de R$ 39,90 e R$ 1 fixo abaixo disso. Taxas muito mais baixas que concorrentes nacionais, pensadas especialmente para organizadores de <span className="truncate">Porto Seguro</span>.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-psi-primary/10 flex items-center justify-center mb-4">
                                        <Zap className="h-6 w-6 text-psi-primary" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Tecnologia de Ponta
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Plataforma moderna e intuitiva, desenvolvida com as melhores tecnologias do mercado. Interface elegante e fácil de usar, pensada para você focar no que realmente importa: seus eventos.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                                        <Shield className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Segurança e Confiança
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Processamento seguro de pagamentos online com repasse garantido após o evento. Seus clientes e você podem confiar na segurança da plataforma.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Foco Regional
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Plataforma exclusiva para eventos de Porto Seguro. Suporte humanizado e personalizado para produtores locais, entendendo as necessidades da sua região.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                                        <Star className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Gestão Completa
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Controle total sobre seus eventos, vendas em tempo real, gestão de ingressos, cupons de desconto e muito mais. Tudo em um só lugar.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-psi-secondary/10 flex items-center justify-center mb-4">
                                        <Sparkles className="h-6 w-6 text-psi-secondary" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Experiência Excepcional
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Quando sua conta for aprovada, você descobrirá uma plataforma que vai transformar a forma como você gerencia e vende ingressos para seus eventos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    if (verificationStatus === "PENDING") {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-8 mt-[100px]
                sm:py-12">
                    <div className="max-w-6xl mx-auto px-4
                    sm:px-6
                    lg:px-8 space-y-8">
                        <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-8 flex flex-col items-center text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
                                <Clock className="h-8 w-8 text-amber-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-amber-900">
                                    Verificação em andamento
                                </h2>
                                <p className="text-amber-800">
                                    Sua conta está em processo de aprovação. Aguarde enquanto nossa equipe analisa seus dados.
                                </p>
                                <p className="text-sm text-amber-700">
                                    Você receberá uma notificação assim que sua conta for aprovada.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-psi-primary flex items-center justify-center gap-2">
                                    <Sparkles className="h-6 w-6" />
                                    Prepare-se para uma experiência incrível!
                                </h3>
                                <p className="text-psi-dark/70">
                                    Quando sua conta for aprovada, você terá acesso a uma plataforma completa e moderna
                                </p>
                            </div>

                            <div className="grid gap-6
                            md:grid-cols-2
                            lg:grid-cols-3">
                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                                        <TrendingDown className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Taxas Altamente Competitivas
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Apenas 1% fixo acima de R$ 39,90 e R$ 1 fixo abaixo disso. Taxas muito mais baixas que concorrentes nacionais, pensadas especialmente para organizadores de <span className="truncate">Porto Seguro</span>.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-psi-primary/10 flex items-center justify-center mb-4">
                                        <Zap className="h-6 w-6 text-psi-primary" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Tecnologia de Ponta
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Plataforma moderna e intuitiva, desenvolvida com as melhores tecnologias do mercado. Interface elegante e fácil de usar, pensada para você focar no que realmente importa: seus eventos.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                                        <Shield className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Segurança e Confiança
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Processamento seguro de pagamentos online com repasse garantido após o evento. Seus clientes e você podem confiar na segurança da plataforma.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Foco Regional
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Plataforma exclusiva para eventos de Porto Seguro. Suporte humanizado e personalizado para produtores locais, entendendo as necessidades da sua região.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                                        <Star className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Gestão Completa
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Controle total sobre seus eventos, vendas em tempo real, gestão de ingressos, cupons de desconto e muito mais. Tudo em um só lugar.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-psi-secondary/10 flex items-center justify-center mb-4">
                                        <Sparkles className="h-6 w-6 text-psi-secondary" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Experiência Excepcional
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Quando sua conta for aprovada, você descobrirá uma plataforma que vai transformar a forma como você gerencia e vende ingressos para seus eventos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    if (verificationStatus === "REJECTED") {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-8 mt-[100px]
                sm:py-12">
                    <div className="max-w-6xl mx-auto px-4
                    sm:px-6
                    lg:px-8 space-y-8">
                        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-8 flex flex-col items-center text-center space-y-4">
                            <div className="h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
                                <XCircle className="h-8 w-8 text-red-600" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-semibold text-red-900">
                                    Conta rejeitada
                                </h2>
                                <p className="text-red-800">
                                    Sua conta foi rejeitada pela organização da plataforma.<br />Entre em contato para saber mais.
                                </p>
                                <p className="text-sm text-red-700">
                                    Você pode revisar e atualizar suas informações na página de perfil.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="text-center space-y-2">
                                <h3 className="text-2xl font-bold text-psi-primary flex items-center justify-center gap-2">
                                    <Sparkles className="h-6 w-6" />
                                    Não desista! Aproveite o que temos a oferecer
                                </h3>
                                <p className="text-psi-dark/70">
                                    Revise seus dados e descubra todas as vantagens que nossa plataforma oferece
                                </p>
                            </div>

                            <div className="grid gap-6
                            md:grid-cols-2
                            lg:grid-cols-3">
                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
                                        <TrendingDown className="h-6 w-6 text-green-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Taxas Altamente Competitivas
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Apenas 1% fixo acima de R$ 39,90 e R$ 1 fixo abaixo disso. Taxas muito mais baixas que concorrentes nacionais, pensadas especialmente para organizadores de Porto Seguro.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-psi-primary/10 flex items-center justify-center mb-4">
                                        <Zap className="h-6 w-6 text-psi-primary" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Tecnologia de Ponta
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Plataforma moderna e intuitiva, desenvolvida com as melhores tecnologias do mercado. Interface elegante e fácil de usar, pensada para você focar no que realmente importa: seus eventos.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                                        <Shield className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Segurança e Confiança
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Processamento seguro de pagamentos via Asaas, com repasse garantido após o evento. Seus clientes e você podem confiar na segurança da plataforma.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center mb-4">
                                        <Users className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Foco Regional
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Plataforma exclusiva para eventos de Porto Seguro. Suporte humanizado e personalizado para produtores locais, entendendo as necessidades da sua região.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
                                        <Star className="h-6 w-6 text-amber-600" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Gestão Completa
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Controle total sobre seus eventos, vendas em tempo real, gestão de ingressos, cupons de desconto e muito mais. Tudo em um só lugar.
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-psi-dark/10 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                                    <div className="h-12 w-12 rounded-xl bg-psi-secondary/10 flex items-center justify-center mb-4">
                                        <Sparkles className="h-6 w-6 text-psi-secondary" />
                                    </div>
                                    <h4 className="text-lg font-semibold text-psi-dark mb-2">
                                        Experiência Excepcional
                                    </h4>
                                    <p className="text-sm text-psi-dark/70">
                                        Revise seus dados e descubra uma plataforma que vai transformar a forma como você gerencia e vende ingressos para seus eventos.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </Background>
        )
    }

    if (!verificationStatus) {
        return (
            <Background variant="light" className="min-h-screen flex items-center justify-center">
                <div className="w-full flex flex-col items-center justify-center py-24">
                    <div
                        aria-label="Carregando"
                        className="flex flex-col items-center"
                    >
                        <div className="animate-spin rounded-full border-4 border-psi-primary border-t-transparent h-14 w-14 mb-6" />
                        <span className="text-base font-medium text-psi-primary mb-1">
                            Carregando...
                        </span>
                    </div>
                </div>
            </Background>
        )
    }

    return <>{children}</>
}

export {
    VerificationStatusGuard
}

