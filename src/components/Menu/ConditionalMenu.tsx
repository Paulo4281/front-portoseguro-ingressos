"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Menu } from "@/components/Menu/Menu"
import { InternalCampaignTracking } from "@/utils/Helpers/InternalCampaignTracking/InternalCampaignTracking"

export function ConditionalMenu() {
    const searchParams = useSearchParams()
    const hasSeller = searchParams.has("seller")

    useEffect(() => {
        if (!searchParams) return
        InternalCampaignTracking.syncFromSearchParams(searchParams)
    }, [searchParams])

    if (hasSeller) return null
    return <Menu />
}
