import { CheckoutInfo } from "@/components/Pages/Public/Checkout/CheckoutInfo"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Checkout | Porto Seguro Ingressos",
    description: "Finalize sua compra de ingressos para o evento que você deseja.",
}

const CheckoutPage = () => {
    return (
        <>
        <CheckoutInfo />
        </>
    )
}

export default CheckoutPage