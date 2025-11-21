"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"

type TCartItemTicketType = {
    ticketTypeId: string
    ticketTypeName: string
    price: number
    quantity: number
}

type TCartItem = {
    eventId: string
    eventName: string
    batchId?: string
    batchName?: string
    price: number
    quantity: number
    ticketTypes?: TCartItemTicketType[]
    isClientTaxed: boolean
}

type TCartContextType = {
    items: TCartItem[]
    addItem: (item: Omit<TCartItem, "quantity">, quantity: number) => void
    removeItem: (eventId: string, batchId?: string) => void
    updateQuantity: (eventId: string, batchId: string | undefined, quantity: number) => void
    clearCart: () => void
    getTotal: () => number
    getItemCount: () => number
}

const CartContext = createContext<TCartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const [items, setItems] = useState<TCartItem[]>([])

    const addItem = useCallback((item: Omit<TCartItem, "quantity">, quantity: number) => {
        setItems((prev) => {
            const existingIndex = prev.findIndex(
                (i) => {
                    if (i.eventId !== item.eventId || i.batchId !== item.batchId) return false
                    if (i.ticketTypes && item.ticketTypes) {
                        if (i.ticketTypes.length !== item.ticketTypes.length) return false
                        const sortedI = [...i.ticketTypes].sort((a, b) => a.ticketTypeId.localeCompare(b.ticketTypeId))
                        const sortedItem = [...item.ticketTypes].sort((a, b) => a.ticketTypeId.localeCompare(b.ticketTypeId))
                        return sortedI.every((tt, idx) => 
                            tt.ticketTypeId === sortedItem[idx].ticketTypeId && 
                            tt.quantity === sortedItem[idx].quantity
                        )
                    }
                    return !i.ticketTypes && !item.ticketTypes
                }
            )

            if (existingIndex >= 0) {
                const updated = [...prev]
                updated[existingIndex].quantity = quantity
                updated[existingIndex].ticketTypes = item.ticketTypes
                updated[existingIndex].price = item.price
                return updated
            }

            return [...prev, { ...item, quantity }]
        })
    }, [])

    const removeItem = useCallback((eventId: string, batchId?: string) => {
        setItems((prev) =>
            prev.filter((item) => !(item.eventId === eventId && item.batchId === batchId))
        )
    }, [])

    const updateQuantity = useCallback((eventId: string, batchId: string | undefined, quantity: number) => {
        if (quantity <= 0) {
            removeItem(eventId, batchId)
            return
        }

        setItems((prev) =>
            prev.map((item) =>
                item.eventId === eventId && item.batchId === batchId
                    ? { ...item, quantity }
                    : item
            )
        )
    }, [removeItem])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const getTotal = useCallback(() => {
        return items.reduce((total, item) => {
            if (item.ticketTypes && item.ticketTypes.length > 0) {
                const ticketTypesTotal = item.ticketTypes.reduce((sum, tt) => {
                    const feeCents = TicketFeeUtils.calculateFeeInCents(tt.price, item.isClientTaxed)
                    return sum + (tt.price * tt.quantity) + (feeCents * tt.quantity)
                }, 0)
                return total + ticketTypesTotal
            }
            const feeCents = TicketFeeUtils.calculateFeeInCents(item.price, item.isClientTaxed)
            return total + (item.price * item.quantity) + (feeCents * item.quantity)
        }, 0)
    }, [items])

    const getItemCount = useCallback(() => {
        return items.reduce((count, item) => count + item.quantity, 0)
    }, [items])

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                getTotal,
                getItemCount
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error("useCart must be used within CartProvider")
    }
    return context
}

