"use client"

import Link from "next/link"
import { Megaphone } from "lucide-react"
import { cn } from "@/lib/utils"

export type TBillboardSlot = {
    id: string
    /** URL da imagem ou GIF (outdoor). Vazio = exibe área reservada. */
    imageUrl?: string
    /** Link de destino ao clicar (opcional). */
    href?: string
    alt: string
}

type BillboardProps = {
    slot: TBillboardSlot
    /** Layout: banner (faixa larga), card (card quadrado), card-wide (card horizontal). */
    variant?: "banner" | "card" | "card-wide"
    className?: string
}

export const FRONTEND_AREA_BILLBOARD_01 = "PSI-BILLB-01"

const Billboard = ({ slot, variant = "banner", className }: BillboardProps) => {
    const { imageUrl, href, alt } = slot

    const content = imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={imageUrl}
            alt={alt}
            className={cn(
                "w-full h-full",
                variant === "banner" && "aspect-[3/1] lg:object-contain h-[200px]! lg:h-[480px]! 3xl:h-[500px]!",
                variant === "card" && "aspect-square lg:object-contain h-[200px]! lg:h-[480px]! 3xl:h-[500px]!",
                variant === "card-wide" && "aspect-[2/1] lg:object-contain h-[200px]! lg:h-[480px]! 3xl:h-[500px]!"
            )}
        />
    ) : (
        <div
            className={cn(
                "w-full h-full flex flex-col items-center justify-center gap-2 bg-psi-primary/5 border-2 border-dashed border-psi-primary/20 rounded-xl text-psi-dark/40",
                variant === "banner" && "aspect-[3/1] lg:object-contain min-h-[160px]",
                variant === "card" && "aspect-square min-h-[140px]",
                variant === "card-wide" && "aspect-[2/1] min-h-[120px]"
            )}
        >
            <Megaphone className="h-8 w-8" />
            <span className="text-xs font-medium">Slot de anúncio</span>
        </div>
    )

    const wrapperClassName = cn(
        "block overflow-hidden",
        variant === "banner" && "w-full",
        variant === "card" && "w-full max-w-[320px]",
        variant === "card-wide" && "w-full",
        className
    )

    if (href) {
        return (
            <Link href={href} className={wrapperClassName} target="_blank" rel="noopener noreferrer">
                {content}
            </Link>
        )
    }

    return <div className={wrapperClassName}>{content}</div>
}

export { Billboard }
