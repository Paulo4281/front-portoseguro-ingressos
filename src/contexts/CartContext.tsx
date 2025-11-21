"use client"

import { createContext, useContext, useState, useCallback, ReactNode } from "react"
import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"

type TCartItemTicketType = {
    ticketTypeId: string
    ticketTypeName: string
    price: number | null
    quantity: number
    days?: string[]
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
    updateTicketTypeQuantity: (eventId: string, batchId: string | undefined, ticketTypeId: string, quantity: number) => void
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
                            JSON.stringify(tt.days?.sort()) === JSON.stringify(sortedItem[idx].days?.sort())
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
            prev.map((item) => {
                if (item.eventId === eventId && item.batchId === batchId) {
                    if (item.ticketTypes && item.ticketTypes.length > 0) {
                        const hasDays = item.ticketTypes.some(tt => tt.days && tt.days.length > 0)
                        
                        if (hasDays) {
                            const currentTotalQuantity = item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
                            const ratio = quantity / currentTotalQuantity
                            
                            const updatedTicketTypes = item.ticketTypes.map(tt => ({
                                ...tt,
                                quantity: Math.round(tt.quantity * ratio)
                            }))
                            
                            const newTotalQuantity = updatedTicketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
                            if (newTotalQuantity !== quantity) {
                                const diff = quantity - newTotalQuantity
                                if (updatedTicketTypes.length > 0) {
                                    updatedTicketTypes[0].quantity += diff
                                }
                            }
                            
                            return {
                                ...item,
                                quantity,
                                ticketTypes: updatedTicketTypes
                            }
                        } else {
                            const currentTotalQuantity = item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
                            const ratio = quantity / currentTotalQuantity
                            
                            const updatedTicketTypes = item.ticketTypes.map(tt => ({
                                ...tt,
                                quantity: Math.round(tt.quantity * ratio)
                            }))
                            
                            const newTotalQuantity = updatedTicketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
                            if (newTotalQuantity !== quantity) {
                                const diff = quantity - newTotalQuantity
                                if (updatedTicketTypes.length > 0) {
                                    updatedTicketTypes[0].quantity += diff
                                }
                            }
                            
                            const newPrice = updatedTicketTypes.reduce((sum, tt) => {
                                if (tt.price !== null && tt.price !== undefined) {
                                    return sum + (tt.price * tt.quantity)
                                }
                                return sum
                            }, 0)
                            
                            return {
                                ...item,
                                quantity,
                                price: newPrice,
                                ticketTypes: updatedTicketTypes
                            }
                        }
                    }
                    return { ...item, quantity }
                }
                return item
            })
        )
    }, [removeItem])

    const updateTicketTypeQuantity = useCallback((eventId: string, batchId: string | undefined, ticketTypeId: string, quantity: number) => {
        setItems((prev) =>
            prev.map((item) => {
                if (item.eventId === eventId && item.batchId === batchId && item.ticketTypes) {
                    const updatedTicketTypes = item.ticketTypes.map(tt =>
                        tt.ticketTypeId === ticketTypeId ? { ...tt, quantity } : tt
                    )
                    
                    const newTotalQuantity = updatedTicketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
                    
                    const hasDays = updatedTicketTypes.some(tt => tt.days && tt.days.length > 0)
                    
                    if (hasDays) {
                        return {
                            ...item,
                            quantity: newTotalQuantity,
                            ticketTypes: updatedTicketTypes
                        }
                    } else {
                        const newPrice = updatedTicketTypes.reduce((sum, tt) => {
                            if (tt.price !== null && tt.price !== undefined) {
                                return sum + (tt.price * tt.quantity)
                            }
                            return sum
                        }, 0)
                        
                        return {
                            ...item,
                            quantity: newTotalQuantity,
                            price: newPrice,
                            ticketTypes: updatedTicketTypes
                        }
                    }
                }
                return item
            })
        )
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const getTotal = useCallback(() => {
        return items.reduce((total, item) => {
            if (item.ticketTypes && item.ticketTypes.length > 0) {
                const hasDays = item.ticketTypes.some(tt => tt.days && tt.days.length > 0)
                
                if (hasDays) {
                    const feeCents = TicketFeeUtils.calculateFeeInCents(item.price, item.isClientTaxed)
                    return total + item.price + (feeCents * item.quantity)
                }
                
                const ticketTypesTotal = item.ticketTypes.reduce((sum, tt) => {
                    if (tt.price !== null && tt.price !== undefined) {
                        const feeCents = TicketFeeUtils.calculateFeeInCents(tt.price, item.isClientTaxed)
                        return sum + (tt.price * tt.quantity) + (feeCents * tt.quantity)
                    }
                    return sum
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
                updateTicketTypeQuantity,
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

