"use client"

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