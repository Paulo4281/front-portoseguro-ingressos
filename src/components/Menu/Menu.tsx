"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogIn, LogOut, Menu as MenuIcon, X, ChevronDown, Ticket, Calendar, Users, BarChart3, Lock, Plus, List, User } from "lucide-react"
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
import type { ComponentType } from "react"

type TSubLink = {
    href: string
    label: string
    icon?: ComponentType<{ className?: string }>
}

type TMenuLink = {
    href?: string
    label: string
    icon: ComponentType<{ className?: string }>
    roles?: ("CUSTOMER" | "ORGANIZER" | "ADMIN")[]
    sublinks?: TSubLink[]
}

const menuLinks: TMenuLink[] = [
    {
        href: "/",
        label: "Home",
        icon: Home,
    },
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: BarChart3,
        roles: ["ORGANIZER", "ADMIN"]
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
                label: "Adicionar",
                icon: Plus
            },
        ]
    },
    {
        href: "/redefinir-senha-log",
        label: "Redefinir Senha",
        icon: Lock,
        roles: ["CUSTOMER", "ORGANIZER", "ADMIN"]
    },
    {
        href: "/usuarios",
        label: "Usuários",
        icon: Users,
        roles: ["ADMIN"]
    },
    {
        href: "/meu-perfil",
        label: "Meu Perfil",
        icon: User,
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
        "/redefinir-senha-log"
    ]
    const pathname = usePathname()

    if (blockedPages.includes(pathname)) return null

    const { user, isAuthenticated, removeUser } = useAuthStore()
    const { mutateAsync: logoutUser, isPending: isLoggingOut } = useAuthLogout()
    const routerService = useRouter()

    const [isOpen, setIsOpen] = useState(false)
    const [scroll, setScroll] = useState<boolean>(false)

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

    useEffect(() => {
        const handleScroll = () => {
            setScroll(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scroll ? "bg-white/95 backdrop-blur-md border-b border-[#E4E6F0] shadow-sm shadow-black/5" : "bg-transparent"}`}>
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
                            className="h-8 w-auto
                            sm:h-10
                            transition-transform duration-300 group-hover:scale-105"
                            variant="primary"
                        />
                        <span className="ms-2 text-[1.4rem]
                            sm:text-2xl
                            font-extrabold
                            tracking-tight
                            text-psi-primary
                            transition-colors duration-300
                            group-hover:text-psi-dark">
                            <span className="bg-gradient-to-r from-psi-primary via-psi-secondary to-psi-tertiary bg-clip-text text-transparent">
                                Porto
                            </span>{" "}
                            <span className="bg-gradient-to-r from-psi-tertiary via-psi-secondary to-psi-primary bg-clip-text text-transparent">
                                Seguro
                            </span>{" "}
                            <span className="inline-block font-bold text-psi-dark">
                                Ingressos
                            </span>
                        </span>
                    </Link>

                    <div className="hidden items-center gap-3
                    md:flex">
                        {!isAuthenticated ? (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    size="sm"
                                    className="text-psi-dark/70 hover:text-psi-dark"
                                >
                                    <Link href="/">
                                        <Home className="mr-2 h-4 w-4" />
                                        Home
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="primary"
                                    size="sm"
                                >
                                    <Link href="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Entrar
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-psi-primary/30 focus:ring-offset-2 rounded-full transition-opacity hover:opacity-90"
                                        aria-label="Menu do usuário"
                                    >
                                        <Avatar
                                            src={null}
                                            name={fullName}
                                            size="md"
                                        />
                                        <ChevronDown className="h-4 w-4 text-psi-dark/60" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 p-2 z-[55] !overflow-visible">
                                    <DropdownMenuLabel className="px-3 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-psi-dark">{fullName}</span>
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
                                                            className="rounded-xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg z-[100] !overflow-visible" 
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
                                            className="rounded-xl text-sm text-destructive hover:bg-destructive/10 cursor-pointer"
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
                        )}
                    </div>

                    <div className="md:hidden">
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="flex items-center gap-2 cursor-pointer outline-none focus:ring-2 focus:ring-psi-primary/30 focus:ring-offset-2 rounded-full"
                                        aria-label="Menu do usuário"
                                    >
                                        <Avatar
                                            src={null}
                                            name={fullName}
                                            size="md"
                                        />
                                        <ChevronDown className="h-4 w-4 text-psi-dark/60" />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-64 rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 p-2 z-[55] !overflow-visible">
                                    <DropdownMenuLabel className="px-3 py-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-psi-dark">{fullName}</span>
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
                                                            className="rounded-xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg z-[100] !overflow-visible" 
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
                                            className="rounded-xl text-sm text-destructive hover:bg-destructive/10 cursor-pointer"
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
                    <div className="md:hidden border-t border-[#E4E6F0] bg-white/95 backdrop-blur-md rounded-2xl mt-2 mb-4 shadow-lg shadow-black/5">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Button
                                asChild
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-xl"
                            >
                                <Link href="/" onClick={closeMenu}>
                                    <Home className="mr-2 h-4 w-4" />
                                    Home
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="primary"
                                size="sm"
                                className="w-full justify-start rounded-xl"
                            >
                                <Link href="/login" onClick={closeMenu}>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Entrar
                                </Link>
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    )
}

export {
    Menu
}
