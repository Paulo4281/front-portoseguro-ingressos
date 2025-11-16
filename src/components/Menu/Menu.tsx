"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu as MenuIcon, X, Home, LogIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import Logo from "@/components/Logo/Logo"

type MenuLink = {
    href: string
    label: string
    icon: React.ComponentType<{ className?: string }>
}

const menuLinks: MenuLink[] = [
    {
        href: "/",
        label: "Home",
        icon: Home
    },
    {
        href: "/login",
        label: "Login",
        icon: LogIn
    }
]

const Menu = () => {
    const [isOpen, setIsOpen] = useState(false)

    const toggleMenu = () => {
        setIsOpen(!isOpen)
    }

    const closeMenu = () => {
        setIsOpen(false)
    }

    return (
        <nav className="w-full bg-transparent z-50 absolute">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center" onClick={closeMenu}>
                        <Logo className="h-10 w-auto" variant="white" />
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-6">
                        {menuLinks.map((link) => {
                            const Icon = link.icon
                            return (
                                <Button
                                    key={link.href}
                                    asChild
                                    variant="ghost"
                                    className="text-white"
                                >
                                    <Link href={link.href}>
                                        <Icon className="mr-2 h-4 w-4" />
                                        {link.label}
                                    </Link>
                                </Button>
                            )
                        })}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-md text-white hover:text-psi-primary transition-colors duration-200"
                        aria-label="Toggle menu"
                    >
                        {isOpen ? (
                            <X className="h-6 w-6" />
                        ) : (
                            <MenuIcon className="h-6 w-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-border bg-psi-light rounded-lg">
                        <div className="px-2 pt-2 pb-3 space-y-1">
                            {menuLinks.map((link) => {
                                const Icon = link.icon
                                return (
                                    <Button
                                        key={link.href}
                                        asChild
                                        variant="ghost"
                                        className="w-full justify-start"
                                    >
                                        <Link href={link.href} onClick={closeMenu}>
                                            <Icon className="mr-2 h-4 w-4" />
                                            {link.label}
                                        </Link>
                                    </Button>
                                )
                            })}
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