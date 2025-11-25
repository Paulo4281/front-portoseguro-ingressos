import Link from "next/link"
import Logo from "@/components/Logo/Logo"

const navigation = [
    {
        title: "Explore",
        items: [
            { label: "Eventos", href: "/eventos" },
            { label: "Produtores", href: "/organizadores" }
        ]
    },
    {
        title: "Acesso",
        items: [
            { label: "Criar conta", href: "/cadastro" },
            { label: "Entrar", href: "/login" }
        ]
    }
]

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full border-t border-[#E4E6F0] bg-white/95 text-psi-dark mt-auto backdrop-blur" style={{ zIndex: 0! }}>
            <div className="container mx-auto flex flex-col gap-10 px-4 py-12
            sm:px-6
            lg:px-8">
                <div className="grid gap-10
                lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <Logo className="h-9 w-auto" variant="black" /> <span className="text-xl font-extrabold text-psi-dark">Porto Seguro</span> <span className="text-xl font-bold text-psi-dark/90">Ingressos</span>
                        </div>
                        <p className="text-sm text-psi-dark/70 max-w-md">
                            Plataforma oficial para viver os eventos de Porto Seguro com curadoria local, taxas justas e atendimento humano.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        {navigation.map((section) => (
                            <div key={section.title} className="space-y-3">
                                <p className="text-xs uppercase tracking-[0.3em] text-psi-dark/60">
                                    {section.title}
                                </p>
                                <ul className="space-y-2 text-sm text-psi-dark/80">
                                    {section.items.map((item) => (
                                        <li key={item.label}>
                                            <Link
                                                href={item.href}
                                                className="transition-colors hover:text-psi-primary"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex flex-col gap-4 border-t border-[#E4E6F0] pt-6 text-xs text-psi-dark/60
                sm:flex-row
                sm:items-center
                sm:justify-between">
                    <p>© {currentYear} Porto Seguro Ingressos. Todos os direitos reservados.</p>
                    <p>Experiência transparente, pagamentos protegidos e suporte local.</p>
                </div>
            </div>
        </footer>
    )
}

export {
    Footer
}