"use client"

import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Dashboard | Porto Seguro Ingressos",
    description: "Visualize o desempenho da sua plataforma. Acompanhe estatísticas detalhadas de eventos, ingressos vendidos, pagamentos e muito mais.",
}

import DashboardPannel from "@/components/Pages/Private/Dashboard/DashboardPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const DashboardPage = () => {
    return (
        <VerificationStatusGuard>
            <DashboardPannel />
        </VerificationStatusGuard>
    )
}

export default DashboardPage