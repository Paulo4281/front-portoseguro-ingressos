"use client"

import { ShoppingCart, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"

const CartDropdown = () => {
    const { items, removeItem, getTotal, getItemCount } = useCart()
    const itemCount = getItemCount()
    const total = getTotal()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="relative flex items-center justify-center p-2 rounded-xl text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] transition-colors"
                    aria-label="Carrinho de compras"
                >
                    <ShoppingCart className="h-5 w-5" />
                    {itemCount > 0 && (
                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-psi-primary text-xs font-bold text-white">
                            {itemCount > 9 ? "9+" : itemCount}
                        </span>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
                align="end" 
                className="w-80 rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/10 p-4 z-[55]"
            >
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-psi-dark">
                            Carrinho
                        </h3>
                        <span className="text-sm text-psi-dark/60">
                            {itemCount} {itemCount === 1 ? "item" : "itens"}
                        </span>
                    </div>

                    {items.length === 0 ? (
                        <div className="py-8 text-center">
                            <ShoppingCart className="h-12 w-12 text-psi-dark/20 mx-auto mb-3" />
                            <p className="text-sm text-psi-dark/60">
                                Seu carrinho está vazio
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2">
                                {items.map((item, index) => (
                                    <div
                                        key={`${item.eventId}-${item.batchId || "no-batch"}-${index}`}
                                        className="flex items-start gap-3 p-3 rounded-xl bg-psi-dark/5 border border-psi-dark/10"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-psi-dark line-clamp-1">
                                                {item.eventName}
                                            </p>
                                            {item.batchName && (
                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                    {item.batchName}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs text-psi-dark/60">
                                                    Qtd: {item.quantity}
                                                </span>
                                                <span className="text-sm font-semibold text-psi-primary">
                                                    {(() => {
                                                        if (item.ticketTypes && item.ticketTypes.length > 0) {
                                                            console.log(item)
                                                            const hasDays = item.ticketTypes.some(tt => tt.days && tt.days.length > 0)
                                                            
                                                            if (hasDays) {
                                                                const feeCents = TicketFeeUtils.calculateFeeInCents(item.price, item.isClientTaxed)
                                                                const totalWithFees = item.price + (feeCents * item.quantity)
                                                                return ValueUtils.centsToCurrency(totalWithFees)
                                                            }
                                                            
                                                            const total = item.ticketTypes.reduce((sum, tt) => {
                                                                if (tt.price !== null && tt.price !== undefined) {
                                                                    const feeCents = TicketFeeUtils.calculateFeeInCents(tt.price, item.isClientTaxed)
                                                                    return sum + (tt.price * tt.quantity) + (feeCents * tt.quantity)
                                                                }
                                                                return sum
                                                            }, 0)
                                                            return ValueUtils.centsToCurrency(total)
                                                        }
                                                        const feeCents = TicketFeeUtils.calculateFeeInCents(item.price, item.isClientTaxed)
                                                        const totalWithFees = (item.price * item.quantity) + (feeCents * item.quantity)
                                                        return ValueUtils.centsToCurrency(totalWithFees)
                                                    })()}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.eventId, item.batchId)}
                                            className="p-1.5 rounded-lg text-psi-dark/40 hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0"
                                            aria-label="Remover item do carrinho"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-psi-dark/10 space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-base font-semibold text-psi-dark">
                                        Total
                                    </span>
                                    <span className="text-xl font-bold text-psi-primary">
                                        {ValueUtils.centsToCurrency(total)}
                                    </span>
                                </div>
                                <Button
                                    asChild
                                    variant="primary"
                                    className="w-full"
                                    size="lg"
                                >
                                    <Link href="/checkout">
                                        Finalizar Compra
                                    </Link>
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export {
    CartDropdown
}

