import { QrScannerPannel } from "@/components/Pages/Private/QrScanner/QrScannerPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const QrScannerPage = () => {
    return (
        <VerificationStatusGuard>
            <QrScannerPannel />
        </VerificationStatusGuard>
    )
}

export default QrScannerPage