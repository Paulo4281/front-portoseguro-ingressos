"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import type { TEvent, TBatch } from "@/types/Event/TEvent"

type TCartItem = {
    eventId: string
    eventName: string
    batchId?: string
    batchName?: string
    price: number
    quantity: number
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
                (i) => i.eventId === item.eventId && i.batchId === item.batchId
            )

            if (existingIndex >= 0) {
                const updated = [...prev]
                updated[existingIndex].quantity = quantity
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
        return items.reduce((total, item) => total + item.price * item.quantity, 0)
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

