import { Metadata } from "next"

export const metadata: Metadata = {
    title: "QR Scanner | Porto Seguro Ingressos",
    description: "Escaneie o QR Code do evento para validar ingressos dos participantes.",
}

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