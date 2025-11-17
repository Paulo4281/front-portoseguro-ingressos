"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, LogIn, Ticket, Calendar, Settings, LogOut, Users, BarChart3, Menu as MenuIcon, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo/Logo"
import { Avatar } from "@/components/Avatar/Avatar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useAuthLogout } from "@/hooks/Auth/useAuthLogout"
import { useRouter } from "next/navigation"
import { Toast } from "@/components/Toast/Toast"
import type { ComponentType } from "react"

type TMenuLink = {
    href: string
    label: string
    icon: ComponentType<{ className?: string }>
    roles?: ("CUSTOMER" | "ORGANIZER" | "ADMIN")[]
}

const menuLinks: TMenuLink[] = [
    {
        href: "/",
        label: "Home",
        icon: Home,
    },
    {
        href: "/ingressos",
        label: "Meus Ingressos",
        icon: Ticket,
        roles: ["CUSTOMER"]
    },
    {
        href: "/eventos",
        label: "Meus Eventos",
        icon: Calendar,
        roles: ["ORGANIZER"]
    },
    {
        href: "/eventos/criar",
        label: "Criar Evento",
        icon: Calendar,
        roles: ["ORGANIZER"]
    },
    {
        href: "/dashboard",
        label: "Dashboard",
        icon: BarChart3,
        roles: ["ORGANIZER", "ADMIN"]
    },
    {
        href: "/usuarios",
        label: "Usuários",
        icon: Users,
        roles: ["ADMIN"]
    },
    {
        href: "/configuracoes",
        label: "Configurações",
        icon: Settings,
    },
]

const Menu = () => {
    const blockedPages = [
        "/login",
        "/cadastro",
        "/cadastro-confirmar",
        "/recuperar-senha"
    ]
    const pathname = usePathname()

    if (blockedPages.includes(pathname)) return null

    const { user, isAuthenticated, removeUser } = useAuthStore()
    const { mutateAsync: logoutUser, isPending: isLoggingOut } = useAuthLogout()
    const routerService = useRouter()

    const [isOpen, setIsOpen] = useState(false)
    const [isPopoverOpen, setIsPopoverOpen] = useState(false)

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
                setIsPopoverOpen(false)
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

    return (
        <nav className="w-full bg-transparent z-50 absolute">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center" onClick={closeMenu}>
                        <Logo className="h-10 w-auto" variant="white" />
                    </Link>

                    <div className="hidden md:flex items-center gap-4">
                        {!isAuthenticated ? (
                            <>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="text-white"
                                >
                                    <Link href="/">
                                        <Home className="mr-2 h-4 w-4" />
                                        Home
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    variant="ghost"
                                    className="text-white"
                                >
                                    <Link href="/login">
                                        <LogIn className="mr-2 h-4 w-4" />
                                        Login
                                    </Link>
                                </Button>
                            </>
                        ) : (
                            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                <PopoverTrigger asChild>
                                    <button
                                        className="cursor-pointer outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-full transition-opacity hover:opacity-80"
                                        aria-label="Menu do usuário"
                                        onMouseEnter={() => setIsPopoverOpen(true)}
                                        onMouseLeave={() => setIsPopoverOpen(false)}
                                    >
                                        <Avatar
                                            src={null}
                                            name={fullName}
                                            size="md"
                                        />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-64 p-0"
                                    align="end"
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                    onMouseEnter={() => setIsPopoverOpen(true)}
                                    onMouseLeave={() => setIsPopoverOpen(false)}
                                >
                                    <div className="p-4 border-b">
                                        <p className="text-sm font-semibold text-foreground">
                                            {fullName}
                                        </p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            {user?.email}
                                        </p>
                                    </div>
                                    <div className="p-2">
                                        {filteredMenuLinks.map((link) => {
                                            const Icon = link.icon
                                            const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                                            
                                            return (
                                                <Link
                                                    key={link.href}
                                                    href={link.href}
                                                    onClick={() => setIsPopoverOpen(false)}
                                                >
                                                    <div
                                                        className={`flex items-center gap-2 px-2 py-1.5 rounded-sm text-sm cursor-pointer transition-colors ${
                                                            isActive
                                                                ? "bg-accent text-accent-foreground"
                                                                : "hover:bg-accent hover:text-accent-foreground"
                                                        }`}
                                                    >
                                                        <Icon className="size-4" />
                                                        <span>{link.label}</span>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    <div className="p-2 border-t">
                                        <button
                                            onClick={handleLogout}
                                            disabled={isLoggingOut}
                                            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-sm text-sm text-destructive hover:bg-destructive/10 cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoggingOut ? (
                                                <>
                                                    <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    <span>Saindo...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <LogOut className="size-4" />
                                                    <span>Sair</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )}
                    </div>

                    <div className="md:hidden">
                        {isAuthenticated ? (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button
                                        className="cursor-pointer outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-transparent rounded-full"
                                        aria-label="Menu do usuário"
                                    >
                                        <Avatar
                                            src={null}
                                            name={fullName}
                                            size="md"
                                        />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{fullName}</span>
                                            <span className="text-xs text-muted-foreground font-normal truncate">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {filteredMenuLinks.map((link) => {
                                        const Icon = link.icon
                                        return (
                                            <DropdownMenuItem key={link.href} asChild>
                                                <Link href={link.href}>
                                                    <Icon className="size-4" />
                                                    <span>{link.label}</span>
                                                </Link>
                                            </DropdownMenuItem>
                                        )
                                    })}
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem
                                        onClick={handleLogout}
                                        disabled={isLoggingOut}
                                        variant="destructive"
                                    >
                                        {isLoggingOut ? (
                                            <>
                                                <div className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                <span>Saindo...</span>
                                            </>
                                        ) : (
                                            <>
                                                <LogOut className="size-4" />
                                                <span>Sair</span>
                                            </>
                                        )}
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        ) : (
                            <button
                                onClick={toggleMenu}
                                className="p-2 rounded-md text-white hover:text-psi-primary transition-colors duration-200"
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
                    <div className="md:hidden border-t border-border bg-psi-light rounded-lg mt-2">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            <Button
                                asChild
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <Link href="/" onClick={closeMenu}>
                                    <Home className="mr-2 h-4 w-4" />
                                    Home
                                </Link>
                            </Button>
                            <Button
                                asChild
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                <Link href="/login" onClick={closeMenu}>
                                    <LogIn className="mr-2 h-4 w-4" />
                                    Login
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
