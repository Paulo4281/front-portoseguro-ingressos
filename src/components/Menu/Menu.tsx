"use client"

import { useEffect, useState, useMemo } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogIn, LogOut, Menu as MenuIcon, X, ChevronDown, Ticket, Calendar, Users, BarChart3, Lock, Plus, List, User, Settings, Bell, Loader2, TicketPercent, Wallet, QrCode, HeartPlus, Info, HouseHeart, CreditCard, Book, Download, SquareArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo/Logo"
import { Avatar } from "@/components/Avatar/Avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useAuthLogout } from "@/hooks/Auth/useAuthLogout"
import { useRouter } from "next/navigation"
import { Toast } from "@/components/Toast/Toast"
import { CartDropdown } from "@/components/Cart/CartDropdown"
import type { ComponentType } from "react"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { useNotificationFind } from "@/hooks/Notification/useNotificationFind"
import { useNotificationRead } from "@/hooks/Notification/useNotificationRead"
import { useNotificationDelete } from "@/hooks/Notification/useNotificationDelete"
import { useNotificationDeleteAll } from "@/hooks/Notification/useNotificationDeleteAll"
import { Badge } from "@/components/ui/badge"
import { TNotification } from "@/types/Notification/TNotification"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { SearchEvent } from "../Search/SearchEvent/SearchEvent"
import webpush from "web-push"

type TSubLink = {
    href: string
    label: string
    icon?: ComponentType<{ className?: string }>
}

type TMenuLink = {
    href?: string
    label: string
    icon: ComponentType<{ className?: string }>
    roles?: ("CUSTOMER" | "ORGANIZER" | "ADMIN" | "NOT_DEFINED")[]
    sublinks?: TSubLink[]
}

const menuLinks: TMenuLink[] = [
    {
        href: "/",
        label: "Home",
        icon: Home,
    },
    {
        href: "/confirmar-social",
        label: "Confirmar Cadastro",
        icon: User,
        roles: ["NOT_DEFINED"]
    },
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: BarChart3,
        roles: ["ORGANIZER"]
    },
    {
        href: "/meus-ingressos",
        label: "Meus Ingressos",
        icon: Ticket,
        roles: ["CUSTOMER"]
    },
    {
        label: "Eventos",
        icon: Calendar,
        roles: ["ORGANIZER"],
        sublinks: [
            {
                href: "/meus-eventos",
                label: "Ver todos",
                icon: List
            },
            {
                href: "/eventos/criar",
                label: "Publicar",
                icon: Plus
            },
        ]
    },
    {
        label: "Carteira",
        href: "/carteira",
        icon: Wallet,
        roles: ["ORGANIZER"]
    },
    {
        label: "Clientes",
        href: "/clientes",
        icon: Users,
        roles: ["ORGANIZER"]
    },
    {
        label: "Cupons",
        href: "/cupons",
        icon: TicketPercent,
        roles: ["ORGANIZER"]
    },
    {
        label: "QR Scanner",
        href: "/qr-scanner",
        icon: QrCode,
        roles: ["ORGANIZER"]
    },
    {
        href: "/meu-perfil",
        label: "Meu Perfil",
        icon: User,
        roles: ["CUSTOMER", "ORGANIZER"]
    },
    {
        href: "/suporte",
        label: "Suporte",
        icon: HeartPlus,
        roles: ["ORGANIZER"]
    },
    {
        href: "/adm-eventos",
        label: "Eventos",
        icon: Calendar,
        roles: ["ADMIN"]
    },
    {
        href: "/adm-organizadores",
        label: "Organizadores",
        icon: Users,
        roles: ["ADMIN"]
    },
    {
        href: "/adm-pagamentos",
        label: "Pagamentos",
        icon: CreditCard,
        roles: ["ADMIN"]
    },
    {
        href: "/adm-transferencias",
        label: "Transferencias",
        icon: SquareArrowRight,
        roles: ["ADMIN"]
    },
    {
        href: "/adm-suporte",
        label: "Suporte",
        icon: HeartPlus,
        roles: ["ADMIN"]
    },
    {
        href: "/configuracoes",
        label: "Configurações",
        icon: Settings,
        roles: ["ORGANIZER"]
    },
    {
        href: "/redefinir-senha-log",
        label: "Redefinir Senha",
        icon: Lock,
        roles: ["CUSTOMER", "ORGANIZER", "ADMIN"]
    },
]

const Menu = () => {
    const blockedPages = [
        "/login",
        "/cadastro",
        "/cadastro-confirmar",
        "/senha-redefinir",
        "/senha-redefinir-confirmar",
        "/redefinir-senha-log",
        "/confirmar-social"
    ]

    const searchEventBlockedPages = [
        "/"
    ]
    
    const pathname = usePathname()

    if (blockedPages.includes(pathname)) return null

    const { user, isAuthenticated, removeUser } = useAuthStore()
    const { mutateAsync: logoutUser, isPending: isLoggingOut } = useAuthLogout()
    const routerService = useRouter()

    const [isOpen, setIsOpen] = useState(false)
    const [scroll, setScroll] = useState<boolean>(false)

    const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
    const [showInstallButton, setShowInstallButton] = useState(false)
    const [isInstalled, setIsInstalled] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const closeMenu = () => {
        setIsOpen(false)
    }

    const handleLogout = async () => {
        try {
            const response = await logoutUser()
            if (response && response.success) {
                removeUser()
                routerService.push("/")
            }
        } catch (error) {
            Toast.error("Erro ao fazer logout")
        }
    }

    const filteredMenuLinks = isAuthenticated && user
        ? menuLinks.filter((link) => {
            if (!link.roles) return true
            return link.roles.includes(user.role)
        })
        : []

    const fullName = user ? `${user.firstName} ${user.lastName}` : ""
    
    const avatarSrc = useMemo(() => {
        if (!user) return null
        
        if (user.role === "ORGANIZER" && user.Organizer?.logo) {
            return ImageUtils.getOrganizerLogoUrl(user.Organizer.logo)
        }
        
        if (user.image) {
            return ImageUtils.getUserImageUrl(user.image)
        }
        
        return null
    }, [user])

    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') return

        if ('serviceWorker' in navigator) {
            const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
            const isSecure = window.location.protocol === 'https:' || isLocalhost

            if (isSecure) {
                navigator.serviceWorker.register('/sw.js', { scope: '/' })
                    .then((registration) => {
                        console.log('Service Worker registered', registration)
                    })
                    .catch((error) => {
                        console.error(error)
                    })
            }
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') {
            console.log('window undefined no useEffect de instalação');
            return;
        }

        const isStandalone = window.matchMedia('(display-mode: standalone)').matches
        const isIOSStandalone = (window.navigator as any).standalone === true
        const installed = isStandalone || isIOSStandalone

        console.log('Verificação de instalação do app:', { isStandalone, isIOSStandalone, installed })
        setIsInstalled(installed)
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') {
            console.log('window undefined no useEffect de beforeinstallprompt')
            return
        }

        const handler = (e: any) => {
            e.preventDefault()
            console.log('Evento beforeinstallprompt capturado', e)
            setDeferredPrompt(e)
            setShowInstallButton(true)
        }

        window.addEventListener('beforeinstallprompt', handler)
        console.log('Adicionado listener para beforeinstallprompt')

        return () => {
            console.log('Removendo listener para beforeinstallprompt')
            window.removeEventListener('beforeinstallprompt', handler)
        }
    }, [])

    useEffect(() => {
        if (typeof window === 'undefined') {
            console.log('window undefined no useEffect de appinstalled')
            return
        }

        const onInstalled = () => {
            console.log('Evento appinstalled disparado')
            setIsInstalled(true)
            setShowInstallButton(false)
            setDeferredPrompt(null)
            Toast.success("App instalado com sucesso!")
        }

        window.addEventListener('appinstalled', onInstalled)
        console.log('Adicionado listener para appinstalled')
        return () => {
            console.log('Removendo listener para appinstalled')
            window.removeEventListener('appinstalled', onInstalled)
        }
    }, [])

    useEffect(() => {
        console.log('isInstalled', isInstalled)
        console.log("showInstallButton", showInstallButton)
    }, [isInstalled, showInstallButton])

    const handleInstallClick = async () => {
        console.log('Clicou para instalar o app', { deferredPrompt })

        if (!deferredPrompt) {
            console.log('deferredPrompt não existe')
            Toast.info("Para instalar o app, use o menu do navegador e selecione 'Adicionar à tela inicial'")
            return
        }

        if (typeof deferredPrompt.prompt !== 'function') {
            console.log('prompt do deferredPrompt não é função', { deferredPrompt })
            Toast.error("Erro: prompt não disponível")
            return
        }

        try {
            await deferredPrompt.prompt()
            console.log('Prompt de instalação exibido')
            const { outcome } = await deferredPrompt.userChoice
            console.log('Resultado do userChoice:', outcome)

            if (outcome === 'accepted') {
                console.log('Usuário aceitou instalar')
                Toast.success("App instalado com sucesso!")
            } else {
                console.log('Usuário cancelou a instalação')
                Toast.info("Instalação cancelada")
            }
        } catch (error) {
            console.log('Erro ao exibir prompt de instalação', error)
            Toast.error("Erro ao mostrar prompt de instalação")
        } finally {
            setDeferredPrompt(null)
            setShowInstallButton(false)
            console.log('Resetou states de instalação')
        }
    }

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scroll ? "bg-white/75 backdrop-blur-md border-b border-[#E4E6F0] shadow-sm shadow-black/5" : "bg-transparent"}`}>
            <div className=" mx-auto px-4
            sm:px-6
            lg:px-8">
                <div className="flex h-20 items-center justify-between">
                    <Link
                        href="/"
                        className="flex items-center select-none group transition-all duration-300"
                        onClick={closeMenu}
                        aria-label="Ir para a página inicial"
                    >
                        <Logo
                            className="h-12 w-auto
                            sm:h-14 sm:me-[-6px]
                            transition-transform duration-300 group-hover:scale-105"
                            variant="primary"
                        />
                        <span className="
                            ms-2 text-[0.85rem]
                            xs:text-[1.12rem]
                            sm:text-2xl
                            font-extrabold
                            tracking-tight
                            text-psi-primary
                            transition-colors duration-300
                            group-hover:text-psi-dark">
                            <span className="bg-linear-to-r from-psi-primary via-psi-secondary to-psi-tertiary bg-clip-text text-transparent">
                                Porto
                            </span>{" "}
                            <span className="bg-linear-to-r from-psi-tertiary via-psi-secondary to-psi-primary bg-clip-text text-transparent">
                                Seguro
                            </span>{" "}
                            <span className="inline-block font-semibold text-psi-dark">
                                Ingressos
                            </span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-3
                    min-[821px]:flex">
                        {
                            !searchEventBlockedPages.includes(pathname) && (
                                <>
                                <div className="hidden min-[1300px]:block">
                                    <SearchEvent
                                        menuMode={true}
                                        className="w-[300px]"
                                    />
                                </div>
                                </>
                            )
                        }
                        <CartDropdown />
                        |
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-psi-dark/70 hover:text-psi-dark"
                                >
                                    <Link href="/">
                                        <Home className="h-4 w-4" />
                                        Home
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-psi-dark/70 hover:text-psi-dark"
                                >
                                    <Link href="/casos-de-uso">
                                        <Book className="h-4 w-4" />
                                        Casos de Uso
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-psi-dark/70 hover:text-psi-dark"
                                >
                                    <Link href="/ver-eventos">
                                        <Calendar className="h-4 w-4" />
                                        Eventos
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-psi-dark/70 hover:text-psi-dark"
                                >
                                    <Link href="/conheca">
                                        <HouseHeart className="h-4 w-4" />
                                        Conheça
                                    </Link>
                                </Button>
                                {
                                    isAuthenticated && <NotificationBell />
                                }
                                {
                                    (!isInstalled && showInstallButton) && (
                                        <Button
                                            onClick={handleInstallClick}
                                            variant="secondary"
                                            size="sm"
                                            className="bg-linear-to-r from-psi-primary to-psi-secondary hover:from-psi-primary/90 hover:to-psi-secondary/90 text-white border-0"
                                        >
                                            <Download className="h-4 w-4" />
                                            Baixar App
                                        </Button>
                                    )
                                }
                                {
                                    !isAuthenticated && (
                                        <Button
                                            asChild
                                            variant="primary"
                                            size="sm"
                                        >
                                            <Link href="/login">
                                                <LogIn className="h-4 w-4" />
                                                Entrar
                                            </Link>
                                        </Button>
                                    )
                                }
                            </>
                            {
                                isAuthenticated && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button
                                            className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-psi-primary/30 focus:ring-offset-2 rounded-full transition-opacity hover:opacity-90"
                                            aria-label="Menu do usuário"
                                        >
                                            <Avatar
                                                src={avatarSrc}
                                                name={fullName}
                                                size="md"
                                            />
                                            <ChevronDown className="h-4 w-4 text-psi-dark/60" />
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 p-2 z-55 overflow-visible!">
                                        <DropdownMenuLabel className="px-3 py-2">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-psi-dark">{fullName}</span>
                                                <span className="text-xs text-psi-dark/60 font-normal truncate">
                                                    {user?.email}
                                                </span>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                                        <div className="p-1 overflow-visible">
                                            {filteredMenuLinks.map((link) => {
                                                const Icon = link.icon
                                                
                                                if (link.sublinks && link.sublinks.length > 0) {
                                                    return (
                                                        <DropdownMenuSub key={link.label}>
                                                            <DropdownMenuSubTrigger className="rounded-xl cursor-pointer text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB]">
                                                                <Icon className="h-4 w-4" />
                                                                <span>{link.label}</span>
                                                            </DropdownMenuSubTrigger>
                                                            <DropdownMenuSubContent 
                                                            className="rounded-xl border border-[#E4E6F0] cursor-pointer bg-white/95 backdrop-blur-md shadow-lg z-100 overflow-visible!" 
                                                                sideOffset={8}
                                                                alignOffset={0}
                                                            >
                                                                {link.sublinks.map((sublink) => {
                                                                    const SubIcon = sublink.icon
                                                                    const isActive = pathname === sublink.href || (sublink.href !== "/" && pathname.startsWith(sublink.href))
                                                                    return (
                                                                        <DropdownMenuItem key={sublink.href} asChild className={isActive ? "bg-[#F3F4FB] text-psi-primary" : ""}>
                                                                            <Link href={sublink.href}>
                                                                                {SubIcon && <SubIcon className="h-4 w-4" />}
                                                                                <span>{sublink.label}</span>
                                                                            </Link>
                                                                        </DropdownMenuItem>
                                                                    )
                                                                })}
                                                            </DropdownMenuSubContent>
                                                        </DropdownMenuSub>
                                                    )
                                                }
                                                
                                                const isActive = link.href && (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)))
                                                
                                                return (
                                                    <DropdownMenuItem key={link.href || link.label} asChild className={`rounded-xl text-sm ${isActive ? "bg-[#F3F4FB] text-psi-primary cursor-pointer" : "text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB] cursor-pointer"}`}>
                                                        <Link href={link.href || "#"}>
                                                            <Icon className="h-4 w-4" />
                                                            <span>{link.label}</span>
                                                        </Link>
                                                    </DropdownMenuItem>
                                                )
                                            })}
                                        </div>
                                        <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                                        <div className="p-1">
                                            <DropdownMenuItem
                                                onClick={handleLogout}
                                                disabled={isLoggingOut}
                                                className="rounded-xl text-sm hover:bg-destructive/10 cursor-pointer"
                                            >
                                                {isLoggingOut ? (
                                                    <>
                                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                        <span>Saindo...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <LogOut className="h-4 w-4" />
                                                        <span>Sair</span>
                                                    </>
                                                )}
                                            </DropdownMenuItem>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                )
                            }
                    </div>

                    <div className="flex items-center gap-2
                    min-[821px]:hidden">
                        <CartDropdown />
                        {isAuthenticated && (
                            <div className="block
                            min-[821px]:hidden">
                                <NotificationBell />
                            </div>
                        )}
                        {
                            (!isInstalled && showInstallButton && !isAuthenticated) || 1 == 1 && (
                                <Button
                                    onClick={handleInstallClick}
                                    variant="secondary"
                                    size="sm"
                                    className="bg-linear-to-r from-psi-primary to-psi-secondary hover:from-psi-primary/90 hover:to-psi-secondary/90 text-white border-0"
                                >
                                    <Download className="h-4 w-4" />
                                    <span className="hidden xs:inline">Baixar App</span>
                                </Button>
                            )
                        }
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-psi-primary/30 focus:ring-offset-2 rounded-full"
                                        aria-label="Menu do usuário"
                                    >
                                        <Avatar
                                            src={avatarSrc}
                                            name={fullName}
                                            size="md"
                                        />
                                        <ChevronDown className="h-4 w-4 text-psi-dark/60" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 p-2 z-55 overflow-visible!">
                                    <DropdownMenuLabel className="px-3 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-psi-dark">{fullName}</span>
                                            <span className="text-xs text-psi-dark/60 font-normal truncate">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                                    <div className="p-1 overflow-visible">
                                        {filteredMenuLinks.map((link) => {
                                            const Icon = link.icon
                                            
                                            if (link.sublinks && link.sublinks.length > 0) {
                                                return (
                                                    <DropdownMenuSub key={link.label}>
                                                        <DropdownMenuSubTrigger className="rounded-xl text-sm text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB]">
                                                            <Icon className="h-4 w-4" />
                                                            <span>{link.label}</span>
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent 
                                                            className="rounded-xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg z-100 overflow-visible!" 
                                                            sideOffset={8}
                                                            alignOffset={0}
                                                        >
                                                            {link.sublinks.map((sublink) => {
                                                                const SubIcon = sublink.icon
                                                                const isActive = pathname === sublink.href || (sublink.href !== "/" && pathname.startsWith(sublink.href))
                                                                return (
                                                                    <DropdownMenuItem key={sublink.href} asChild className={isActive ? "bg-[#F3F4FB] text-psi-primary" : ""}>
                                                                        <Link href={sublink.href}>
                                                                            {SubIcon && <SubIcon className="h-4 w-4" />}
                                                                            <span>{sublink.label}</span>
                                                                        </Link>
                                                                    </DropdownMenuItem>
                                                                )
                                                            })}
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                )
                                            }
                                            
                                            const isActive = link.href && (pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)))
                                            
                                            return (
                                                <DropdownMenuItem key={link.href || link.label} asChild className={`rounded-xl text-sm ${isActive ? "bg-[#F3F4FB] text-psi-primary" : "text-psi-dark/80 hover:text-psi-dark hover:bg-[#F3F4FB]"}`}>
                                                    <Link href={link.href || "#"}>
                                                        <Icon className="h-4 w-4" />
                                                        <span>{link.label}</span>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )
                                        })}
                                    </div>
                                    <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                                    <div className="p-1">
                                        <DropdownMenuItem
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="rounded-xl text-sm hover:bg-destructive/10 cursor-pointer"
                                        >
                                            {isLoggingOut ? (
                                                <>
                                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    <span>Saindo...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <LogOut className="h-4 w-4" />
                                                    <span>Sair</span>
                                                </>
                                            )}
                                        </DropdownMenuItem>
                                    </div>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-xl text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] transition-colors"
                                aria-label="Toggle menu"
                            >
                                {isOpen ? (
                                    <X className="h-6 w-6" />
                                ) : (
                                    <MenuIcon className="h-6 w-6" />
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {!isAuthenticated && isOpen && (
                    <div className="block border-t border-[#E4E6F0] bg-white/95 backdrop-blur-md rounded-2xl mt-2 mb-4 shadow-lg shadow-black/5
                    min-[821px]:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-xl"
                            >
                                <Link href="/" onClick={closeMenu}>
                                    <Home className="h-4 w-4" />
                                    Home
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-xl"
                            >
                                <Link href="/casos-de-uso" onClick={closeMenu}>
                                    <Book className="h-4 w-4" />
                                    Casos de Uso
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-xl"
                            >
                                <Link href="/ver-eventos" onClick={closeMenu}>
                                    <Calendar className="h-4 w-4" />
                                    Eventos
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-xl"
                            >
                                <Link href="/conheca" onClick={closeMenu}>
                                    <HouseHeart className="h-4 w-4" />
                                    Conheça
                                </Link>
                            </Button>
                            <div className="flex gap-1">
                                {
                                    (!isInstalled && showInstallButton) && (
                                        <Button
                                            onClick={() => {
                                                handleInstallClick()
                                                closeMenu()
                                            }}
                                            variant="secondary"
                                            size="sm"
                                            className="w-1/2 justify-start rounded-xl bg-linear-to-r from-psi-primary to-psi-secondary hover:from-psi-primary/90 hover:to-psi-secondary/90 text-white border-0"
                                        >
                                            <Download className="h-4 w-4" />
                                            Baixar App
                                        </Button>
                                    )
                                }
                                <Button
                                    asChild
                                    variant="primary"
                                    size="sm"
                                    className="w-1/2 justify-start rounded-xl"
                                >
                                    <Link href="/login" onClick={closeMenu}>
                                        <LogIn className="h-4 w-4" />
                                        Entrar
                                    </Link>
                                </Button>
                            </div>
                            </div>
                        </div>
                )}
            </div>
        </nav>
    )
}

const NotificationBell = () => {
    const { data: notificationsData, isLoading } = useNotificationFind()
    const { mutate: markNotificationsAsRead, isPending: isMarkingRead } = useNotificationRead()
    const { mutate: deleteNotification } = useNotificationDelete()
    const { mutate: deleteAllNotifications, isPending: isDeletingAll } = useNotificationDeleteAll()
    const [notifications, setNotifications] = useState<TNotification[]>([])
    const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        if (!notificationsData) return

        const payload = notificationsData.data as unknown
        if (Array.isArray(payload)) {
            setNotifications(payload)
            return
        }

        const nestedData = (payload as { data?: unknown })?.data
        if (Array.isArray(nestedData)) {
            setNotifications(nestedData)
            return
        }

        setNotifications([])
    }, [notificationsData])

    const unreadCount = notifications.filter((n) => !n.isRead).length

    const handleDeleteNotification = (notificationId: string) => {
        if (!notificationId) return
        setDeletingIds((prev) => {
            const next = new Set(prev)
            next.add(notificationId)
            return next
        })
        deleteNotification(notificationId, {
            onSuccess: () => {
                setNotifications((prev) => prev.filter((notification) => notification.id !== notificationId))
            },
            onSettled: () => {
                setDeletingIds((prev) => {
                    const next = new Set(prev)
                    next.delete(notificationId)
                    return next
                })
            }
        })
    }

    const handleDeleteAllNotifications = () => {
        if (!notifications.length || isDeletingAll) return
        deleteAllNotifications(undefined, {
            onSuccess: () => {
                setNotifications([])
                setDeletingIds(new Set())
            }
        })
    }

    const handleDropdownOpenChange = (open: boolean) => {
        if (open && unreadCount > 0 && !isMarkingRead) {
            markNotificationsAsRead()
            setNotifications((prev) => prev.map((notification) => ({
                ...notification,
                isRead: true
            })))
        }
    }

    const getImportanceColors = (importance: TNotification["importance"]) => {
        switch (importance) {
            case "HIGH":
                return {
                    border: "border-psi-primary",
                    bg: "bg-psi-primary/10",
                    text: "text-psi-primary",
                    badge: "bg-psi-primary"
                }
            case "MEDIUM":
                return {
                    border: "border-amber-200",
                    bg: "bg-amber-50/70",
                    text: "text-amber-900",
                    badge: "bg-amber-600"
                }
            default:
                return {
                    border: "border-blue-200",
                    bg: "bg-blue-50",
                    text: "text-blue-900",
                    badge: "bg-blue-600"
                }
        }
    }

    const getSubjectLabel = (subject: TNotification["subject"]) => {
        switch (subject) {
            case "PAYMENT_SUCCESS":
                return "Pagamento"
            case "EVENT_DAYS15_WARNING":
            case "EVENT_DAYS7_WARNING":
            case "EVENT_DAYS3_WARNING":
                return "Falta poucos dias para o evento"
            case "EVENT_AFTER_CUSTOMER":
            case "EVENT_AFTER_ORGANIZER":
                return "Pós-evento"
            case "EVENT_CANCELLED_CLIENT":
                return "Evento cancelado"
            case "EVENT_POSTPONED_CLIENT":
                return "Evento adiado"
            case "EVENT_CANCELLED_SUPPORT_ORGANIZER":
                return "Evento cancelado"
            case "EVENT_POSTPONED_SUPPORT_ORGANIZER":
                return "Evento adiado"
            case "PAYMENT_REFUNDED_BY_CUSTOMER":
            case "PAYMENT_REFUNDED_BY_ORGANIZER":
            case "PAYMENT_REFUNDED_BY_ADMIN_TO_CUSTOMER":
            case "PAYMENT_REFUNDED_BY_ADMIN_TO_ORGANIZER":
                return "Reembolso de ingresso"
            case "EVENT_BALANCE_RELEASED_TO_ORGANIZER":
                return "Saldo liberado"
            case "PAYMENT_FIRST_SOLD_TICKET":
                return "Primeiro ingresso vendido"
            default:
                return "Notificação"
        }
    }

    const formatCurrencyFromTemplate = (value?: string) => {
        if (!value) return ""
        const numericValue = Number(value)
        if (Number.isNaN(numericValue)) {
            return value
        }
        return ValueUtils.centsToCurrency(numericValue)
    }

    const getNotificationMessage = (notification: TNotification) => {
        const data = notification.templateData || {}

        switch (notification.subject) {
            case "PAYMENT_SUCCESS": {
                const eventName = data.eventName || "seu evento"

                return `O pagamento do ingresso para o evento ${eventName} foi confirmado com sucesso!`
            }
            case "EVENT_DAYS15_WARNING":
            case "EVENT_DAYS7_WARNING":
            case "EVENT_DAYS3_WARNING": {
                const eventName = data.eventName || "seu evento"
                const days = data.daysLeft

                return `Faltam ${days} dias para o evento ${eventName} começar! Revise ingressos, lotes e comunicações.`
            }
            case "EVENT_AFTER_CUSTOMER": {
                const eventName = data.eventName || "seu evento"
                const feedbackLink = data.feedbackLink

                return `O evento ${eventName} foi finalizado. Esperamos que tenha sido uma experiência incrível!`
            }
            case "EVENT_AFTER_ORGANIZER": {
                const eventName = data.eventName || "seu evento"

                return `O evento ${eventName} foi finalizado.`
            }
            case "PAYMENT_REFUNDED_BY_CUSTOMER": {
                const firstName = data.firstName
                const eventName = data.eventName

                return `O cliente ${firstName} solicitou reembolso para o ingresso do evento ${eventName}.`
            }
            case "PAYMENT_REFUNDED_BY_ORGANIZER": {
                const eventName = data.eventName

                return `O organizador do evento ${eventName} solicitou reembolso para o seu ingresso.`
            }
            case "PAYMENT_REFUNDED_BY_ADMIN_TO_CUSTOMER": {
                const eventName = data.eventName

                return `O administrador solicitou reembolso para o ingresso do evento ${eventName}.`
            }
            case "PAYMENT_REFUNDED_BY_ADMIN_TO_ORGANIZER": {
                const eventName = data.eventName
                const customerName = data.customerName

                return `O administrador solicitou reembolso para o ingresso do evento ${eventName} para o cliente ${customerName}.`
            }
            case "EVENT_CANCELLED_CLIENT": {
                const eventName = data.eventName

                return `O evento ${eventName} foi cancelado pelo organizador. O valor do ingresso foi reembolsado. Verifique o status do seu ingresso em 'Meus Ingressos'.`
            }
            case "EVENT_CANCELLED_SUPPORT_ORGANIZER": {
                const eventName = data.eventName

                return `O evento ${eventName} foi cancelado com sucesso pelo administrador. O valor dos ingressos foram reembolsados aos clientes.`
            }
            case "EVENT_POSTPONED_CLIENT": {
                const eventName = data.eventName

                return `O evento ${eventName} foi adiado pelo organizador. Você pode solicitar o reembolso do seu ingresso caso não consiga comparecer na nova data.`
            }
            case "EVENT_POSTPONED_SUPPORT_ORGANIZER": {
                const eventName = data.eventName

                return `O evento ${eventName} foi adiado com sucesso pelo administrador. Os clientes podem solicitar o reembolso do seu ingresso caso não consiga comparecer na nova data.`
            }
            case "EVENT_BALANCE_RELEASED_TO_ORGANIZER": {
                const eventName = data.eventName

                return `O saldo do evento ${eventName} foi liberado. O valor está disponível para saque.`
            }
            case "PAYMENT_FIRST_SOLD_TICKET": {
                const eventName = data.eventName

                return `O evento ${eventName} teve seu primeiro ingresso vendido com sucesso!`
            }
            default:
                return notification.message || "Você possui uma atualização importante."
        }
    }

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString)
        const now = new Date()
        const diffMs = now.getTime() - date.getTime()
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return "Agora"
        if (diffMins < 60) return `Há ${diffMins} min`
        if (diffHours < 24) return `Há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
        if (diffDays < 7) return `Há ${diffDays} ${diffDays === 1 ? "dia" : "dias"}`
        
        return date.toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        })
    }

    return (
        <DropdownMenu onOpenChange={handleDropdownOpenChange}>
            <DropdownMenuTrigger asChild>
                <button
                    className="relative p-2 rounded-xl text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] transition-colors outline-none focus:ring-2 focus:ring-psi-primary/30 focus:ring-offset-2"
                    aria-label="Notificações"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-psi-secondary text-xs font-semibold text-white">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 p-2 z-55 max-h-[600px] overflow-y-auto">
                <DropdownMenuLabel className="px-3 py-2 sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                    <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium text-psi-dark">Notificações</span>
                        <div className="flex items-center gap-2">
                            {unreadCount > 0 && (
                                <Badge variant="secondary" className="bg-psi-secondary text-white">
                                    {unreadCount} não lida{unreadCount > 1 ? "s" : ""}
                                </Badge>
                            )}
                            {notifications.length > 0 && (
                                <Button
                                    type="button"
                                    variant="destructive"
                                    size="sm"
                                    onClick={handleDeleteAllNotifications}
                                    disabled={isDeletingAll}
                                >
                                    {isDeletingAll && (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    )}
                                    {isDeletingAll ? "Excluindo..." : "Excluir tudo"}
                                </Button>
                            )}
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-[#E4E6F0]" />
                <div className="p-1 space-y-2">
                    {isLoading ? (
                        <div className="px-3 py-4 text-center text-sm text-psi-dark/60">
                            Carregando notificações...
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="px-3 py-8 text-center">
                            <Bell className="h-12 w-12 text-psi-dark/20 mx-auto mb-3" />
                            <p className="text-sm text-psi-dark/60">Nenhuma notificação</p>
                        </div>
                    ) : (
                        notifications.map((notification) => {
                            const colors = getImportanceColors(notification.importance)
                            const isUnread = !notification.isRead
                            const isNotificationDeleting = deletingIds.has(notification.id)
                            
                            return (
                                <div
                                    key={notification.id}
                                    className={`rounded-xl border p-3 transition-all hover:shadow-md ${
                                        isUnread
                                            ? `${colors.border} ${colors.bg} border-2`
                                            : "border-[#E4E6F0] bg-white"
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${colors.badge}`} />
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full`}>
                                                        {getSubjectLabel(notification.subject)}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-psi-dark/50 shrink-0">
                                                    {formatDateTime(notification.createdAt)}
                                                </span>
                                            </div>
                                            <p className={`text-sm leading-relaxed ${colors.text}`}>
                                                {getNotificationMessage(notification)}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            onClick={(event) => {
                                                event.preventDefault()
                                                event.stopPropagation()
                                                handleDeleteNotification(notification.id)
                                            }}
                                            disabled={isNotificationDeleting || isDeletingAll}
                                            aria-label={`Excluir notificação ${getSubjectLabel(notification.subject)}`}
                                        >
                                            {isNotificationDeleting ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <X className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )
                        })
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export {
    Menu
}
