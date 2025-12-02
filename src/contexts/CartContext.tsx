"use client"

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react"
import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"
import { CheckoutUtils } from "@/utils/Helpers/CheckoutUtils/CheckoutUtils"
import { StoreManager } from "@/stores"
import { useRouter } from "next/navigation"

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
    eventImage?: string
    batchId?: string
    batchName?: string
    price: number
    quantity: number
    ticketTypes?: TCartItemTicketType[]
    isClientTaxed: boolean
    isFree: boolean
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

const CART_STORE_KEY = "cart-items"

const loadCartItemsFromCache = (): TCartItem[] | null => {
    return StoreManager.get<TCartItem[]>(CART_STORE_KEY) ?? null
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const cachedItems = loadCartItemsFromCache()
    const [items, setItems] = useState<TCartItem[]>(cachedItems || [])

    const addItem = useCallback((item: Omit<TCartItem, "quantity">, quantity: number) => {
        setItems((prev) => {
            // Se há itens de um evento diferente, limpar o carrinho
            const hasItemsFromDifferentEvent = prev.some(i => i.eventId !== item.eventId)
            if (hasItemsFromDifferentEvent) {
                return [{ ...item, quantity }]
            }

            const existingIndex = prev.findIndex(
                (i) => {
                    return i.eventId === item.eventId && i.batchId === item.batchId
                }
            )

            if (existingIndex >= 0) {
                const existingItem = prev[existingIndex]
                const updated = [...prev]
                
                if (item.ticketTypes && item.ticketTypes.length > 0) {
                    if (existingItem.ticketTypes && existingItem.ticketTypes.length > 0) {
                        const mergedTicketTypes: TCartItemTicketType[] = [...existingItem.ticketTypes]
                        
                        item.ticketTypes.forEach(newTicketType => {
                            const existingTicketTypeIndex = mergedTicketTypes.findIndex(existingTT => {
                                if (newTicketType.days && newTicketType.days.length > 0 && existingTT.days && existingTT.days.length > 0) {
                                    return newTicketType.ticketTypeId === existingTT.ticketTypeId &&
                                           JSON.stringify(newTicketType.days?.sort()) === JSON.stringify(existingTT.days?.sort())
                                }
                                if (!newTicketType.days && !existingTT.days) {
                                    return newTicketType.ticketTypeId === existingTT.ticketTypeId
                                }
                                return false
                            })
                            
                            if (existingTicketTypeIndex >= 0) {
                                mergedTicketTypes[existingTicketTypeIndex] = {
                                    ...mergedTicketTypes[existingTicketTypeIndex],
                                    quantity: newTicketType.quantity
                                }
                            } else {
                                mergedTicketTypes.push(newTicketType)
                            }
                        })
                        
                        const newTotalQuantity = mergedTicketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
                        
                        updated[existingIndex] = {
                            ...existingItem,
                            quantity: newTotalQuantity,
                            ticketTypes: mergedTicketTypes,
                            price: item.price
                        }
                    } else {
                        updated[existingIndex] = {
                            ...existingItem,
                            quantity,
                            ticketTypes: item.ticketTypes,
                            price: item.price
                        }
                    }
                } else {
                    updated[existingIndex] = {
                        ...existingItem,
                        quantity,
                        price: item.price
                    }
                }
                
                return updated
            }

            return [...prev, { ...item, quantity }]
        })
        if (location.pathname !== "/checkout") {
            window.location.href = "/checkout"
        }
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
            return total + CheckoutUtils.calculateItemTotal(item, null)
        }, 0)
    }, [items])

    const getItemCount = useCallback(() => {
        return items.reduce((count, item) => count + item.quantity, 0)
    }, [items])

    useEffect(() => {
        if (items.length > 0) {
            StoreManager.add(CART_STORE_KEY, items)
        } else {
            StoreManager.remove(CART_STORE_KEY)
        }
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

