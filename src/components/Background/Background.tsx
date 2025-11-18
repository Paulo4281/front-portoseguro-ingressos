"use client"

import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

type TBackgroundVariant = "hero" | "light" | "gradient-light" | "gradient-primary" | "white"

type TBackgroundProps = {
    variant: TBackgroundVariant
    children: ReactNode
    className?: string
}

const Background = (
    {
        variant,
        children,
        className
    }: TBackgroundProps
) => {
    const variantStyles = {
        hero: "bg-[#F4F6FB] text-psi-dark",
        light: "bg-[#F4F6FB] text-psi-dark",
        "gradient-light": "bg-linear-to-b from-[#FFFFFF] via-[#F4F7FF] to-[#E8ECF8] text-psi-dark",
        "gradient-primary": "bg-linear-to-b from-psi-primary/10 via-psi-primary/5 to-white text-psi-dark",
        white: "bg-white text-psi-dark"
    }

    const overlayStyles = {
        hero: (
            <>
                <div className="absolute inset-0 bg-linear-to-b from-[#FFFFFF] via-[#F4F7FF] to-[#E8ECF8]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,75,255,0.15),transparent_60%)]" />
            </>
        ),
        light: (
            <div className="absolute inset-0 bg-[#F4F6FB]" />
        ),
        "gradient-light": (
            <div className="absolute inset-0 bg-linear-to-b from-[#FFFFFF] via-[#F4F7FF] to-[#E8ECF8]" />
        ),
        "gradient-primary": (
            <>
                <div className="absolute inset-0 bg-linear-to-b from-psi-primary/10 via-psi-primary/5 to-white" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(108,75,255,0.1),transparent_50%)]" />
            </>
        ),
        white: (
            <div className="absolute inset-0 bg-white" />
        )
    }

    return (
        <div className={cn("relative isolate w-full overflow-hidden", variantStyles[variant], className)}>
            <div className="absolute inset-0">
                {overlayStyles[variant]}
            </div>
            <div className="relative z-10">
                {children}
            </div>
        </div>
    )
}

export {
    Background
}
export type {
    TBackgroundVariant
}