"use client"

import { ShoppingCart, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/contexts/CartContext"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Link from "next/link"
import Image from "next/image"

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
                className="w-96 rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-xl shadow-black/10 p-0 z-[55] overflow-hidden"
            >
                <div className="p-5 pb-4 border-b border-[#E4E6F0] bg-linear-to-br from-psi-primary/5 via-white to-psi-secondary/5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-bold text-psi-dark">
                                Carrinho
                            </h3>
                            <p className="text-xs text-psi-dark/60 mt-0.5">
                                {itemCount} {itemCount === 1 ? "item" : "itens"} no carrinho
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                            <ShoppingCart className="h-5 w-5 text-psi-primary" />
                        </div>
                    </div>
                </div>

                {items.length === 0 ? (
                    <div className="py-12 px-5 text-center">
                        <div className="w-16 h-16 rounded-full bg-psi-dark/5 flex items-center justify-center mx-auto mb-4">
                            <ShoppingCart className="h-8 w-8 text-psi-dark/20" />
                        </div>
                        <p className="text-sm font-medium text-psi-dark/70 mb-1">
                            Seu carrinho está vazio
                        </p>
                        <p className="text-xs text-psi-dark/50">
                            Adicione eventos para começar
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
                            {items.map((item, index) => {
                                const itemTotal = (() => {
                                    if (item.ticketTypes && item.ticketTypes.length > 0) {
                                        const hasDays = item.ticketTypes.some(tt => tt.days && tt.days.length > 0)
                                        
                                        if (hasDays) {
                                            const feeCents = TicketFeeUtils.calculateFeeInCents(item.price, item.isClientTaxed)
                                            const totalWithFees = item.price + (feeCents * item.quantity)
                                            return totalWithFees
                                        }
                                        
                                        const total = item.ticketTypes.reduce((sum, tt) => {
                                            if (tt.price !== null && tt.price !== undefined) {
                                                const feeCents = TicketFeeUtils.calculateFeeInCents(tt.price, item.isClientTaxed)
                                                return sum + (tt.price * tt.quantity) + (feeCents * tt.quantity)
                                            }
                                            return sum
                                        }, 0)
                                        return total
                                    }
                                    const feeCents = TicketFeeUtils.calculateFeeInCents(item.price, item.isClientTaxed)
                                    const totalWithFees = (item.price * item.quantity) + (feeCents * item.quantity)
                                    return totalWithFees
                                })()

                                return (
                                    <div
                                        key={`${item.eventId}-${item.batchId || "no-batch"}-${index}`}
                                        className="group relative flex items-start gap-3 p-3 rounded-xl bg-white border border-[#E4E6F0] hover:border-psi-primary/30 hover:shadow-md transition-all"
                                    >
                                        {item.eventImage && (
                                            <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-psi-dark/5 shrink-0 border border-psi-dark/10">
                                                <img
                                                    src={ImageUtils.getEventImageUrl(item.eventImage)}
                                                    alt={item.eventName}
                                                    className="object-cover h-full w-full"
                                                />
                                            </div>
                                        )}
                                        {!item.eventImage && (
                                            <div className="w-16 h-16 rounded-lg bg-linear-to-br from-psi-primary/10 to-psi-secondary/10 flex items-center justify-center shrink-0 border border-psi-primary/20">
                                                <ShoppingCart className="h-6 w-6 text-psi-primary/40" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-semibold text-psi-dark line-clamp-2 leading-snug mb-1">
                                                {item.eventName}
                                            </p>
                                            {item.batchName && (
                                                <p className="text-xs text-psi-dark/50 mb-2">
                                                    {item.batchName}
                                                </p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <span className="text-xs font-medium text-psi-dark/60">
                                                    {item.quantity} {item.quantity === 1 ? "ingresso" : "ingressos"}
                                                </span>
                                                <span className="text-sm font-bold text-psi-primary">
                                                    {ValueUtils.formatPrice(itemTotal)}
                                                </span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.eventId, item.batchId)}
                                            className="absolute top-2 right-2 p-1.5 rounded-lg text-psi-dark/30 hover:text-destructive hover:bg-destructive/10 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                                            aria-label="Remover item do carrinho"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                )
                            })}
                        </div>

                        <div className="p-5 pt-4 border-t border-[#E4E6F0] bg-linear-to-br from-psi-dark/5 via-white to-psi-dark/5 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-psi-dark">
                                    Total
                                </span>
                                <span className="text-2xl font-bold text-psi-primary">
                                    {ValueUtils.centsToCurrency(total)}
                                </span>
                            </div>
                            <Button
                                asChild
                                variant="primary"
                                className="w-full"
                                size="lg"
                            >
                                <Link href="/checkout" className="flex items-center justify-center gap-2">
                                    Finalizar Compra
                                    <ShoppingCart className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export {
    CartDropdown
}

