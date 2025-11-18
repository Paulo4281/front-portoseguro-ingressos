"use client"

import type { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type TCategoryProps = {
    icon: LucideIcon
    title: string
    className?: string
}

const Category = (
    {
        icon: Icon,
        title,
        className
    }: TCategoryProps
) => {
    return (
        <div className={cn("flex items-center cursor-pointer gap-3 rounded-2xl border border-[#E4E6F0] bg-white/85 hover:bg-white/40 transition-all duration-200 px-5 py-4 shadow-sm shadow-black/5 backdrop-blur", className)}>
            <Icon className="h-5 w-5 text-psi-primary" aria-hidden="true" />
            <p className="text-sm font-semibold text-psi-dark">{title}</p>
        </div>
    )
}

export {
    Category
}

