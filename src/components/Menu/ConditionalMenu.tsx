"use client"

import { useSearchParams } from "next/navigation"
import { Menu } from "@/components/Menu/Menu"

export function ConditionalMenu() {
    const searchParams = useSearchParams()
    const hasSeller = searchParams.has("seller")
    if (hasSeller) return null
    return <Menu />
}
