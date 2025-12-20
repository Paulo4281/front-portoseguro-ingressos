"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Background } from "@/components/Background/Background"
import { cn } from "@/lib/utils"
import { 
    Car, 
    Building2, 
    Trophy, 
    UtensilsCrossed, 
    Heart, 
    Home, 
    Baby, 
    Music, 
    Presentation, 
    Church, 
    Cpu, 
    Sparkles,
    TrendingDown,
    Users,
    FileText,
    QrCode,
    Shield,
    Headphones,
    ArrowRight,
    CheckCircle2
} from "lucide-react"

const useCases = [
    {
        id: 1,
        order: 10,
        image: "porto-seguro-ingressos-eventos-automotivos-carros-motos",
        icon: Car,
        title: "Eventos Automotivos",
        description: "Carros, motos e toda a paixão automotiva em um só lugar. Nossa plataforma oferece transparência total nas vendas e taxas reduzidas, permitindo que organizadores de eventos automotivos maximizem seus lucros enquanto oferecem ingressos acessíveis aos entusiastas.",
        features: ["Taxas reduzidas", "Gestão de lotes", "QR Code para validação rápida"]
    },
    {
        id: 2,
        order: 5,
        image: "porto-seguro-ingressos-eventos-empresariais",
        icon: Building2,
        title: "Eventos Empresariais",
        description: "Conferências, workshops e networking para empresários de todo o país. Administre todos os participantes, envie comunicações personalizadas e acompanhe o engajamento em tempo real.",
        features: ["Formulários personalizados", "Relatórios detalhados"]
    },
    {
        id: 3,
        order: 1,
        image: "porto-seguro-ingressos-eventos-esportivos",
        icon: Trophy,
        title: "Eventos Esportivos",
        description: "Maratonas, campeonatos e competições esportivas com a qualidade que você precisa. Nossos formulários personalizados ajudam a coletar informações essenciais como tamanho de camisa, categoria de participação e necessidades especiais, garantindo uma experiência perfeita para todos.",
        features: ["Formulários personalizados", "Gestão de categorias", "Validação em tempo real"]
    },
    {
        id: 4,
        order: 4,
        image: "porto-seguro-ingressos-eventos-gastronomia",
        icon: UtensilsCrossed,
        title: "Eventos Gastronômicos",
        description: "Festivais de comida, degustações e experiências culinárias únicas. A plataforma facilita a venda de ingressos com diferentes tipos e preços, permitindo que organizadores criem pacotes especiais e ofereçam experiências gastronômicas memoráveis.",
        features: ["Tipos de ingressos flexíveis", "Preços por data", "Gestão de capacidade"]
    },
    {
        id: 5,
        order: 8,
        image: "porto-seguro-ingressos-eventos-gratuitos-beneficentes",
        icon: Heart,
        title: "Eventos Gratuitos e Beneficentes",
        description: "Eventos que transformam vidas sem custos para ninguém. Nossa plataforma oferece eventos 100% gratuitos, sem taxas para organizadores ou participantes. Ideal para ações sociais, eventos beneficentes e iniciativas comunitárias que fazem a diferença.",
        features: ["100% gratuito", "Sem taxas", "Suporte humanizado"]
    },
    {
        id: 6,
        order: 6,
        image: "porto-seguro-ingressos-eventos-imobiliarios",
        icon: Home,
        title: "Eventos Imobiliários",
        description: "Um dos setores que mais vêm crescendo nos últimos anos. Nossa plataforma oferece ferramentas poderosas para lançamentos imobiliários e eventos de networking do setor. Com relatórios detalhados, você acompanha corretores qualificados e maximiza conversões.",
        features: ["Lista de corretores", "Relatórios avançados"]
    },
    {
        id: 7,
        order: 7,
        image: "porto-seguro-ingressos-eventos-kids-criancas-infantil",
        icon: Baby,
        title: "Eventos Infantis",
        description: "Festas, shows e atividades para crianças com toda a segurança e praticidade que você precisa. Nossa plataforma facilita a gestão de eventos infantis, permitindo que pais comprem ingressos com facilidade e organizadores controlem a capacidade e segurança dos pequenos.",
        features: ["Interface intuitiva", "Controle de capacidade", "Validação segura"]
    },
    {
        id: 8,
        order: 2,
        image: "porto-seguro-ingressos-eventos-musica",
        icon: Music,
        title: "Eventos Musicais",
        description: "Porto Seguro é uma das cidades mais badaladas da Bahia, e nossa plataforma está pronta para administrar shows, festivais e eventos musicais de todos os tamanhos. Com lotes inteligentes, recorrência automática e gestão de ingressos em tempo real, você foca no que realmente importa: a música.",
        features: ["Lotes automáticos", "Eventos recorrentes", "Validação rápida"]
    },
    {
        id: 9,
        order: 9,
        image: "porto-seguro-ingressos-eventos-palestras",
        icon: Presentation,
        title: "Palestras e Workshops",
        description: "Seja gratuito, beneficente ou pago, nossa plataforma oferece a flexibilidade que você precisa. Com formulários personalizados, você coleta informações dos participantes, envia materiais pré-evento e mantém um histórico completo de todos os eventos realizados.",
        features: ["Formulários personalizados", "Gestão de materiais", "Histórico completo"]
    },
    {
        id: 10,
        order: 3,
        image: "porto-seguro-ingressos-eventos-religiosos",
        icon: Church,
        title: "Eventos Religiosos",
        description: "Celebrações, retiros e encontros espirituais que enchem nossa alma de paz e conexão com o divino. Nossa plataforma respeita a natureza espiritual dos eventos, oferecendo uma experiência tranquila e organizada para que todos possam focar no que realmente importa: a conexão espiritual.",
        features: ["Experiência respeitosa", "Lista de participantes", "Eventos gratuitos"]
    },
    {
        id: 11,
        order: 11,
        image: "porto-seguro-ingressos-eventos-tecnologia-robotica-ia",
        icon: Cpu,
        title: "Eventos Tecnológicos",
        description: "Conferências de tecnologia, robótica e inteligência artificial com a inovação que o setor merece. Nossa plataforma utiliza tecnologia de ponta para oferecer uma experiência moderna, com validação por QR Code, relatórios em tempo real e integrações que facilitam a gestão de eventos tech.",
        features: ["Tecnologia moderna", "QR Code avançado", "Integrações modernas"]
    },
    {
        id: 12,
        order: 12,
        image: "porto-seguro-ingressos-eventos-diversos",
        icon: Sparkles,
        title: "E Muito Mais",
        description: "E mais dezenas de outros casos de uso. Nossa plataforma foi desenvolvida para atender qualquer tipo de evento, dos mais simples aos mais complexos. Com qualidade, tecnologia e praticidade, você tem tudo que precisa para realizar seu evento com sucesso.",
        features: ["Versatilidade total", "Suporte completo", "Soluções personalizadas"]
    }
]

const platformFeatures = [
    {
        icon: TrendingDown,
        title: "Taxas Reduzidas",
        description: "As menores taxas do mercado, permitindo que você maximize seus lucros"
    },
    {
        icon: Users,
        title: "Gestão de Clientes",
        description: "Administre todos os seus clientes, histórico de compras e comunicações"
    },
    {
        icon: FileText,
        title: "Formulários Personalizados",
        description: "Colete informações específicas dos participantes de forma organizada"
    },
    {
        icon: QrCode,
        title: "Validação Rápida",
        description: "Sistema de QR Code para validação instantânea na entrada dos eventos"
    },
    {
        icon: Shield,
        title: "Transparência Total",
        description: "Relatórios detalhados e transparência em todas as transações"
    },
    {
        icon: Headphones,
        title: "Suporte Humanizado",
        description: "Atendimento dedicado para organizadores e compradores"
    }
]

const CasosDeUsoInfo = () => {
    return (
        <Background variant="light" className="min-h-screen">
            <div className="pt-32 pb-24 px-4
            sm:px-6
            lg:px-8">
                <div className="max-w-7xl mx-auto space-y-16">
                    <div className="text-center space-y-6">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-psi-primary/10 text-psi-primary text-sm font-semibold uppercase tracking-wide">
                            <Sparkles className="h-4 w-4" />
                            Casos de Uso
                        </div>
                        <h1 className="text-4xl
                        sm:text-5xl
                        lg:text-6xl font-bold text-psi-dark leading-tight">
                            Uma Plataforma para <span className="text-psi-primary">Todos os Eventos</span>
                        </h1>
                        <p className="text-lg
                        sm:text-xl text-psi-dark/70 max-w-3xl mx-auto">
                            Dos eventos mais simples aos mais complexos, nossa plataforma oferece tecnologia de ponta, 
                            transparência e suporte humanizado para impulsionar suas vendas e alcançar novos clientes.
                        </p>
                    </div>

                    <div className="space-y-6">
                        {[...useCases].sort((a, b) => (a.order || 0) - (b.order || 0)).map((useCase, index) => {
                            const IconComponent = useCase.icon
                            const isEven = index % 2 === 1
                            return (
                                <div
                                    key={useCase.id}
                                    className={cn(
                                        "group relative overflow-hidden rounded-2xl border border-psi-primary/20 bg-white shadow-lg shadow-psi-primary/5 hover:shadow-xl hover:shadow-psi-primary/20 transition-all duration-500 flex flex-col",
                                        "sm:flex-row",
                                        isEven && "sm:flex-row-reverse"
                                    )}
                                >
                                    <div className="relative w-full h-64 overflow-hidden bg-linear-to-br from-psi-primary/10 to-psi-secondary/10
                                    sm:w-80 sm:h-auto sm:shrink-0">
                                        <Image
                                            src={`/images/casos-de-uso/${useCase.image}.jpg`}
                                            alt={useCase.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className={cn(
                                            "absolute inset-0 bg-linear-to-t from-psi-dark/60 via-psi-dark/20 to-transparent",
                                            "sm:bg-linear-to-r sm:from-psi-dark/60 sm:via-psi-dark/20 sm:to-transparent",
                                            isEven && "sm:bg-linear-to-l"
                                        )} />
                                        <div className={cn(
                                            "absolute top-4 w-12 h-12 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg",
                                            isEven ? "sm:right-4 sm:left-auto" : "left-4"
                                        )}>
                                            <IconComponent className="h-6 w-6 text-psi-primary" />
                                        </div>
                                    </div>
                                    
                                    <div className="p-6 space-y-4 flex-1">
                                        <h3 className="text-xl font-bold text-psi-dark">
                                            {useCase.title}
                                        </h3>
                                        <p className="text-sm text-psi-dark/70 leading-relaxed">
                                            {useCase.description}
                                        </p>
                                        
                                        <div className="pt-2 border-t border-psi-primary/10 space-y-2">
                                            <p className="text-xs font-semibold text-psi-primary uppercase tracking-wide">
                                                Funcionalidades
                                            </p>
                                            <ul className="space-y-1.5">
                                                {useCase.features.map((feature, featureIndex) => (
                                                    <li key={featureIndex} className="flex items-center gap-2 text-xs text-psi-dark/60">
                                                        <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0" />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <div className="relative py-16">
                        <div className="absolute inset-0 bg-linear-to-br from-psi-primary/5 via-psi-secondary/5 to-psi-tertiary/5 rounded-3xl"></div>
                        <div className="relative px-8
                        sm:px-12
                        lg:px-16 py-12 space-y-10">
                            <div className="text-center space-y-4">
                                <h2 className="text-3xl
                                sm:text-4xl
                                lg:text-5xl font-bold text-psi-dark">
                                    Funcionalidades que <span className="text-psi-primary">Impulsionam</span> seus Eventos
                                </h2>
                                <p className="text-lg text-psi-dark/70 max-w-2xl mx-auto">
                                    Tecnologia, transparência total e suporte dedicado para transformar seus eventos em sucessos!
                                </p>
                            </div>

                            <div className="grid gap-6
                            sm:grid-cols-2
                            lg:grid-cols-3">
                                {platformFeatures.map((feature, index) => {
                                    const IconComponent = feature.icon
                                    return (
                                        <div
                                            key={index}
                                            className="rounded-xl border border-psi-primary/20 bg-white/80 p-6 space-y-3 hover:shadow-lg transition-shadow"
                                        >
                                            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-psi-primary to-psi-primary/80 flex items-center justify-center text-white shadow-lg shadow-psi-primary/20">
                                                <IconComponent className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-lg font-bold text-psi-dark">
                                                {feature.title}
                                            </h3>
                                            <p className="text-sm text-psi-dark/70 leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-3xl
                            sm:text-4xl font-bold text-psi-dark">
                                Pronto para <span className="text-psi-primary">Começar</span>?
                            </h2>
                            <p className="text-lg text-psi-dark/70 max-w-2xl mx-auto">
                                Crie sua conta gratuitamente e descubra como nossa plataforma pode transformar seus eventos
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <Button asChild size="lg" variant="primary">
                                <Link href="/cadastro?org=true">
                                    Criar minha conta
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                            <Button asChild size="lg" variant="outline">
                                <Link href="/ver-eventos">
                                    Explorar eventos
                                </Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    CasosDeUsoInfo
}
