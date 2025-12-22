import { HomeHero } from "@/components/Pages/Public/Home/HomeHero"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Home | Porto Seguro Ingressos",
    description: "A forma mais sofisticada de viver os eventos da capital do descobrimento. Conectamos organizadores locais e apaixonados pela cena cultural com uma experiência de compra inteligente, transparente e com taxas justas.",
}

const HomePage = () => {
    return (
        <>
            <HomeHero />
        </>
    )
}

export default HomePage