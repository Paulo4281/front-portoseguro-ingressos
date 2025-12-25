"use client"

import Link from "next/link"
import { LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ComponentType } from "react"

type TCTAButtonProps = {
    href: string
    text?: string
    icon?: ComponentType<{ className?: string }>
    className?: string
    size?: "sm" | "md" | "lg" | "xl" | "2xl"
    variant?: "primary" | "secondary" | "tertiary"
}

const CTAButton = (
    {
        href,
        text = "Quero experimentar grátis",
        icon: Icon = LogIn,
        className,
        size = "xl",
        variant = "secondary"
    }: TCTAButtonProps
) => {
    const sizeClasses = {
        sm: "text-sm px-4 py-2",
        md: "text-sm px-4 py-2 sm:text-base sm:px-5 sm:py-2.5",
        lg: "text-base px-5 py-2.5 sm:text-lg sm:px-6 sm:py-3",
        xl: "text-base px-5 py-2.5 sm:text-lg sm:px-6 sm:py-3 md:text-xl md:px-7 md:py-3.5",
        "2xl": "text-lg px-6 py-3 sm:text-xl sm:px-7 sm:py-3.5 md:text-xl md:px-8 md:py-4"
    }

    const iconSizeClasses = {
        sm: "size-4",
        md: "size-4 sm:size-5",
        lg: "size-5",
        xl: "size-5 sm:size-6",
        "2xl": "size-5 sm:size-6"
    }

    const variantClasses = {
        primary: "bg-psi-primary text-white hover:bg-psi-primary/90",
        secondary: "bg-psi-secondary text-white hover:bg-psi-secondary/90",
        tertiary: "bg-psi-tertiary text-psi-dark hover:bg-psi-tertiary/10"
    }

    return (
        <Link
            href={href}
            className={cn(
                "group relative inline-flex items-center justify-center gap-2 sm:gap-3",
                "font-medium rounded-full",
                "transition-all duration-300 ease-out",
                "overflow-hidden",
                "shadow-lg shadow-black/10",
                "hover:shadow-xl hover:shadow-black/20",
                "hover:scale-105",
                "active:scale-100",
                sizeClasses[size],
                variantClasses[variant],
                className
            )}
            aria-label={text}
        >
            <div className="absolute inset-0 bg-linear-to-r from-white/0 via-white/20 to-white/0 
            -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
            
            <div className="absolute inset-0 bg-linear-to-br from-white/0 via-white/10 to-white/0 
            opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
                <Icon className={cn(
                    iconSizeClasses[size],
                    "transition-transform duration-300",
                    "group-hover:-rotate-45 group-hover:scale-110"
                )} />
                <span className="relative">
                    {text}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-white/80 
                    group-hover:w-full transition-all duration-500 ease-out" />
                </span>
            </div>

            <div className="absolute inset-0 rounded-full border-2 border-white/0 
            group-hover:border-white/30 transition-all duration-300" />

            <div className="absolute -inset-1 bg-linear-to-r from-psi-primary via-psi-secondary to-psi-tertiary 
            rounded-full opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10" />
        </Link>
    )
}

export {
    CTAButton
}

