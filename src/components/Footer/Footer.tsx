import Logo from "@/components/Logo/Logo"

const Footer = () => {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="w-full bg-black mt-auto">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Logo className="h-8 w-auto" variant="primary" />
                    </div>

                    {/* Copyright */}
                    <div className="text-sm text-white text-center md:text-right">
                        <p>© {currentYear} <span className="text-psi-primary">Porto Seguro Ingressos</span>. Todos os direitos reservados.</p>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export {
    Footer
}