"use client"

import { LeadsPannel } from "@/components/Pages/Private/Lead/LeadsPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const LeadsPage = () => {
    return (
        <VerificationStatusGuard>
            <LeadsPannel />
        </VerificationStatusGuard>
    )
}

export default LeadsPage