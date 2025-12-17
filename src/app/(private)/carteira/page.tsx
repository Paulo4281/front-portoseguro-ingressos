import { CarteiraPannel } from "@/components/Pages/Private/Carteira/CarteiraPannel"
import { VerificationStatusGuard } from "@/components/VerificationStatus/VerificationStatusGuard"

const CarteiraPage = () => {
    return (
        <>
        <VerificationStatusGuard>
            <CarteiraPannel />
        </VerificationStatusGuard>
        </>
    )
}

export default CarteiraPage