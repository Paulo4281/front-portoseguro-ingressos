"use client"

import { CuponsPannel } from "@/components/Pages/Private/Cupons/CuponsPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const CuponsPage = () => {
    return (
        <VerificationStatusGuard>
            <CuponsPannel />
        </VerificationStatusGuard>
    )
}

export default CuponsPage