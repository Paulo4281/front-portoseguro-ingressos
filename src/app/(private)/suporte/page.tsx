import { SuportePannel } from "@/components/Pages/Private/Suporte/SuportePannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const SuportePage = () => {
    return (
        <>
        <VerificationStatusGuard>
            <SuportePannel />
        </VerificationStatusGuard>
        </>
    )
}

export default SuportePage