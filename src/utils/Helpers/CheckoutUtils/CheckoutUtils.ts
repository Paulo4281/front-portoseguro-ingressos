import { TicketFeeUtils } from "../FeeUtils/TicketFeeUtils"
import type { TEvent } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import type { TEventDate } from "@/types/Event/TEventDate"

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

type TEventBatchTicketType = {
    ticketTypeId: string
    price: number | null
    TicketType?: {
        id: string
        name: string
    }
}

type TEventDateTicketTypePrice = {
    ticketTypeId: string
    price: number
}

class CheckoutUtilsClass {
    hasDays(ticketTypes?: TCartItemTicketType[]): boolean {
        if (!ticketTypes || ticketTypes.length === 0) return false
        return ticketTypes.some(tt => tt.days && tt.days.length > 0)
    }

    isMultipleDaysWithTicketTypes(ticketTypes?: TCartItemTicketType[]): boolean {
        if (!ticketTypes || ticketTypes.length === 0) return false
        return ticketTypes.some(tt => tt.days && tt.days.length > 0 && tt.ticketTypeId && tt.ticketTypeId !== "")
    }

    isDayBasedWithoutTicketTypes(ticketTypes?: TCartItemTicketType[]): boolean {
        if (!ticketTypes || ticketTypes.length === 0) return false
        return ticketTypes.some(tt => tt.days && tt.days.length > 0 && (!tt.ticketTypeId || tt.ticketTypeId === ""))
    }

    getPriceForDay(
        eventDateId: string,
        ticketTypeId: string,
        event: TEvent | null | undefined,
        batch: TEventBatch | null | undefined,
        hasEventBatchTicketTypes: boolean | undefined
    ): number {
        if (!event?.EventDates) return 0

        const eventDate = event.EventDates.find(ed => ed.id === eventDateId)
        if (!eventDate) return 0

        if (eventDate.hasSpecificPrice) {
            if (eventDate.EventDateTicketTypePrices && eventDate.EventDateTicketTypePrices.length > 0) {
                const dayPrice = (eventDate.EventDateTicketTypePrices as TEventDateTicketTypePrice[]).find(
                    (ttp) => ttp.ticketTypeId === ticketTypeId
                )
                if (dayPrice) return dayPrice.price
            }
            if (eventDate.price !== null && eventDate.price !== undefined) {
                return eventDate.price
            }
        }

        if (hasEventBatchTicketTypes && batch?.EventBatchTicketTypes && batch.EventBatchTicketTypes.length > 0) {
            const ebt = (batch.EventBatchTicketTypes as TEventBatchTicketType[]).find(
                ebt => ebt.ticketTypeId === ticketTypeId
            )
            return ebt?.price || 0
        }

        return 0
    }

    getPriceForDayWithOptionalTicketType(
        eventDateId: string,
        ticketTypeId: string | undefined,
        fallbackTicketTypeId: string,
        event: TEvent | null | undefined,
        batch: TEventBatch | null | undefined,
        hasEventBatchTicketTypes: boolean | undefined
    ): number {
        const typeIdToMatch = ticketTypeId || fallbackTicketTypeId
        return this.getPriceForDay(eventDateId, typeIdToMatch, event, batch, hasEventBatchTicketTypes)
    }

    calculateTotalWithFees(price: number, quantity: number, isClientTaxed: boolean | undefined): number {
        const feeCents = TicketFeeUtils.calculateFeeInCents(price, isClientTaxed || false)
        return (price + feeCents) * quantity
    }

    calculateItemTotalForMultipleDaysWithTicketTypes(
        item: TCartItem,
        event: TEvent | null | undefined
    ): number {
        if (!item.ticketTypes) return 0

        if (!event) {
            const totalQuantity = item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
            if (totalQuantity > 0 && item.price > 0) {
                const pricePerUnit = item.price / totalQuantity
                const feeCents = TicketFeeUtils.calculateFeeInCents(pricePerUnit, item.isClientTaxed)
                return item.price + (feeCents * totalQuantity)
            }
            return 0
        }

        const batch = event.EventBatches?.find(b => b.id === item.batchId)
        const hasEventBatchTicketTypes = batch?.EventBatchTicketTypes && batch.EventBatchTicketTypes.length > 0

        return item.ticketTypes.reduce((sum, tt) => {
            if (tt.days && tt.days.length > 0 && tt.ticketTypeId) {
                const dayPrice = tt.days.reduce((daySum, eventDateId) => {
                    return daySum + this.getPriceForDay(
                        eventDateId,
                        tt.ticketTypeId,
                        event,
                        batch || null,
                        hasEventBatchTicketTypes
                    )
                }, 0)
                return sum + this.calculateTotalWithFees(dayPrice, tt.quantity, item.isClientTaxed)
            }
            return sum
        }, 0)
    }

    calculateItemTotalForDayBasedWithoutTicketTypes(
        item: TCartItem,
        event: TEvent | null | undefined,
    ): number {
        if (!item.ticketTypes) return 0

        if (event) {
            return item.ticketTypes.reduce((sum, tt) => {
                if (tt.days && tt.days.length > 0 && tt.days[0]) {
                    const dayId = tt.days[0]
                    const eventDate = event.EventDates?.find(ed => ed.id === dayId)
                    if (eventDate?.hasSpecificPrice && eventDate.price !== null && eventDate.price !== undefined) {
                        return sum + this.calculateTotalWithFees(eventDate.price, tt.quantity, item.isClientTaxed)
                    }
                }
                return sum
            }, 0)
        }

        const totalQuantity = item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
        if (totalQuantity > 0 && item.price > 0) {
            const pricePerUnit = item.price / totalQuantity
            const feeCents = TicketFeeUtils.calculateFeeInCents(pricePerUnit, item.isClientTaxed)
            return item.price + (feeCents * totalQuantity)
        }

        return 0
    }

    calculateItemTotalForDaysWithTicketTypes(
        item: TCartItem,
        event: TEvent | null | undefined
    ): number {
        if (!item.ticketTypes) return 0

        if (!event) {
            const totalQuantity = item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
            if (totalQuantity > 0 && item.price > 0) {
                const pricePerUnit = item.price / totalQuantity
                const feeCents = TicketFeeUtils.calculateFeeInCents(pricePerUnit, item.isClientTaxed)
                return item.price + (feeCents * totalQuantity)
            }
            return 0
        }

        const batch = event.EventBatches?.find(b => b.id === item.batchId)
        const hasEventBatchTicketTypes = batch?.EventBatchTicketTypes && batch.EventBatchTicketTypes.length > 0

        return item.ticketTypes.reduce((sum, tt) => {
            if (tt.days && tt.days.length > 0) {
                const dayPrice = tt.days.reduce((daySum, eventDateId) => {
                    return daySum + this.getPriceForDayWithOptionalTicketType(
                        eventDateId,
                        tt.ticketTypeId,
                        tt.ticketTypeId || "",
                        event,
                        batch || null,
                        hasEventBatchTicketTypes
                    )
                }, 0)
                return sum + this.calculateTotalWithFees(dayPrice, tt.quantity, item.isClientTaxed)
            } else if (tt.price !== null && tt.price !== undefined) {
                return sum + this.calculateTotalWithFees(tt.price, tt.quantity, item.isClientTaxed)
            }
            return sum
        }, 0)
    }

    calculateItemTotalForTicketTypesWithPrice(
        item: TCartItem
    ): number {
        if (!item.ticketTypes) return 0

        return item.ticketTypes.reduce((sum, tt) => {
            if (tt.price !== null && tt.price !== undefined) {
                return sum + this.calculateTotalWithFees(tt.price, tt.quantity, item.isClientTaxed)
            }
            return sum
        }, 0)
    }

    calculateItemTotalForSimpleItem(item: TCartItem): number {
        return this.calculateTotalWithFees(item.price, item.quantity, item.isClientTaxed)
    }

    calculateItemTotal(item: TCartItem, event: TEvent | null | undefined): number {
        if (!item.ticketTypes || item.ticketTypes.length === 0) {
            return this.calculateItemTotalForSimpleItem(item)
        }

        const hasDays = this.hasDays(item.ticketTypes)
        const isMultipleDaysWithTicketTypes = this.isMultipleDaysWithTicketTypes(item.ticketTypes)

        if (hasDays && isMultipleDaysWithTicketTypes) {
            if (event) {
                return this.calculateItemTotalForMultipleDaysWithTicketTypes(item, event)
            }
            
            const totalQuantity = item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
            if (totalQuantity > 0 && item.price > 0) {
                const pricePerUnit = item.price / totalQuantity
                const feeCents = TicketFeeUtils.calculateFeeInCents(pricePerUnit, item.isClientTaxed)
                return item.price + (feeCents * totalQuantity)
            }
            return 0
        }

        if (hasDays) {
            const isDayBasedWithoutTicketTypes = this.isDayBasedWithoutTicketTypes(item.ticketTypes)

            if (isDayBasedWithoutTicketTypes) {
                return this.calculateItemTotalForDayBasedWithoutTicketTypes(item, event)
            }

            if (event) {
                return this.calculateItemTotalForDaysWithTicketTypes(item, event)
            }

            const totalQuantity = item.ticketTypes.reduce((sum, tt) => sum + tt.quantity, 0)
            if (totalQuantity > 0 && item.price > 0) {
                const pricePerUnit = item.price / totalQuantity
                const feeCents = TicketFeeUtils.calculateFeeInCents(pricePerUnit, item.isClientTaxed)
                return item.price + (feeCents * totalQuantity)
            }
            return 0
        }

        return this.calculateItemTotalForTicketTypesWithPrice(item)
    }

    calculateBasePriceForTicketTypes(
        ticketTypes: TCartItemTicketType[],
        event: TEvent | null | undefined,
        batch: TEventBatch | null | undefined,
        hasEventBatchTicketTypes: boolean | undefined
    ): number {
        return ticketTypes.reduce((sum, t) => {
            if (t.days && t.days.length > 0) {
                const dayPrice = t.days.reduce((daySum, eventDateId) => {
                    return daySum + this.getPriceForDay(
                        eventDateId,
                        t.ticketTypeId || "",
                        event,
                        batch || null,
                        hasEventBatchTicketTypes
                    )
                }, 0)
                return sum + (dayPrice * t.quantity)
            } else if (t.price !== null && t.price !== undefined) {
                return sum + (t.price * t.quantity)
            }
            return sum
        }, 0)
    }

    getPriceForTicketType(
        ebt: TEventBatchTicketType | any,
        eventDateId: string,
        event: TEvent | null | undefined
    ): number {
        if (!event?.EventDates) return ebt.price || 0

        const eventDate = event.EventDates.find(ed => ed.id === eventDateId)
        if (!eventDate) return ebt.price || 0

        if (eventDate.hasSpecificPrice) {
            if (eventDate.EventDateTicketTypePrices && eventDate.EventDateTicketTypePrices.length > 0) {
                const ticketTypeIdToMatch = ebt.TicketType?.id || ebt.ticketTypeId
                const dayPrice = (eventDate.EventDateTicketTypePrices as TEventDateTicketTypePrice[]).find(
                    (ttp) => ttp.ticketTypeId === ticketTypeIdToMatch
                )
                if (dayPrice) return dayPrice.price
            } else if (eventDate.price) {
                return eventDate.price
            }
        }

        return ebt.price || 0
    }

    getBatchPrice(
        batch: TEventBatch,
        event: TEvent | null | undefined
    ): number {
        if (!event?.EventDates || event.EventDates.length === 0) {
            return batch.price ?? 0
        }

        const eventDateWithSpecificPrice = event.EventDates.find(ed => ed.hasSpecificPrice)
        if (eventDateWithSpecificPrice && eventDateWithSpecificPrice.price !== null && eventDateWithSpecificPrice.price !== undefined) {
            return eventDateWithSpecificPrice.price
        }

        return batch.price ?? 0
    }

    getTicketTypePriceFromEventDates(
        ebt: TEventBatchTicketType | any,
        event: TEvent | null | undefined,
        activeEventDateId?: string | null
    ): number | null {
        if (!event?.EventDates || event.EventDates.length === 0) {
            return null
        }

        let eventDateToCheck: TEventDate | undefined

        if (activeEventDateId) {
            eventDateToCheck = event.EventDates.find(ed => ed.id === activeEventDateId)
        } else {
            eventDateToCheck = event.EventDates.find(ed => ed.hasSpecificPrice)
        }

        if (eventDateToCheck) {
            if (eventDateToCheck.EventDateTicketTypePrices && eventDateToCheck.EventDateTicketTypePrices.length > 0) {
                const ticketTypeIdToMatch = ebt.TicketType?.id || ebt.ticketTypeId
                const dayPrice = (eventDateToCheck.EventDateTicketTypePrices as TEventDateTicketTypePrice[]).find(
                    (ttp) => ttp.ticketTypeId === ticketTypeIdToMatch
                )
                if (dayPrice) return dayPrice.price
            } else if (eventDateToCheck.price !== null && eventDateToCheck.price !== undefined) {
                return eventDateToCheck.price
            }
        }

        return null
    }

    hasMultipleDaysWithSpecificPrices(event: TEvent | null | undefined): boolean {
        if (!event?.EventDates) return false
        const daysWithSpecificPrices = event.EventDates.filter(ed => ed.hasSpecificPrice)
        return daysWithSpecificPrices.length > 1
    }

    hasMultipleDaysWithTicketTypePrices(event: TEvent | null | undefined): boolean {
        if (!event?.EventDates || !event?.TicketTypes || event.TicketTypes.length === 0) return false
        const daysWithTicketTypePrices = event.EventDates.filter(ed => 
            ed.hasSpecificPrice && 
            ed.EventDateTicketTypePrices && 
            ed.EventDateTicketTypePrices.length > 0
        )
        return daysWithTicketTypePrices.length > 1
    }

    getTicketTypeIdentifier(tt: TCartItemTicketType, underlineReturn?: boolean): string {
        const isDayBasedWithoutTicketTypes = this.isDayBasedWithoutTicketTypes([tt])
        const isMultipleDaysWithTicketTypes = this.isMultipleDaysWithTicketTypes([tt])
        
        if (isDayBasedWithoutTicketTypes && tt.days) {
            return tt.days[0]
        }
        if (isMultipleDaysWithTicketTypes && tt.days) {
            if (underlineReturn) {
                return `${tt.ticketTypeId}_${tt.days[0]}`
            }
            return `${tt.ticketTypeId}-${tt.days[0]}`
        }
        return tt.ticketTypeId
    }

    calculateTotalForSelectedDaysAndTypes(
        selectedDaysAndTypes: Record<string, Record<string, number>>,
        event: TEvent | null | undefined,
        isClientTaxed: boolean | undefined
    ): number {
        if (!event?.EventDates) {
            return 0
        }

        let total = 0
        Object.entries(selectedDaysAndTypes).forEach(([eventDateId, types]) => {
            const eventDate = event.EventDates?.find(ed => ed.id === eventDateId)
            if (!eventDate) {
                return
            }
            if (!eventDate.EventDateTicketTypePrices || eventDate.EventDateTicketTypePrices.length === 0) {
                return
            }
            Object.entries(types).forEach(([ticketTypeId, qty]) => {
                if (qty > 0 && eventDate.EventDateTicketTypePrices) {
                    const dayPrice = (eventDate.EventDateTicketTypePrices as TEventDateTicketTypePrice[]).find(
                        (ttp) => ttp.ticketTypeId === ticketTypeId
                    )
                    if (dayPrice) {
                        const itemTotal = this.calculateTotalWithFees(dayPrice.price, qty, isClientTaxed)
                        total += itemTotal
                    } else {
                    }
                }
            })
        })
        return total
    }

    calculateTotalForBatchTicketTypes(
        eventBatchTicketTypes: TEventBatchTicketType[] | any[],
        ticketTypeQuantities: Record<string, number>,
        selectedDays: Record<string, string[]>,
        event: TEvent | null | undefined,
        isClientTaxed: boolean | undefined,
        activeEventDateId?: string | null
    ): number {
        if (!event) return 0

        return eventBatchTicketTypes.reduce((sum, ebt) => {
            const qty = ticketTypeQuantities[ebt.ticketTypeId] || 0
            if (qty === 0) return sum

            const selectedDaysForType = selectedDays[ebt.ticketTypeId] || []

            if (selectedDaysForType.length > 0) {
                const daysTotal = selectedDaysForType.reduce((daySum, eventDateId) => {
                    const price = this.getPriceForTicketType(ebt, eventDateId, event)
                    return daySum + this.calculateTotalWithFees(price, 1, isClientTaxed)
                }, 0)
                return sum + (daysTotal * qty)
            }

            const priceFromEventDate = this.getTicketTypePriceFromEventDates(ebt, event, activeEventDateId)
            if (priceFromEventDate !== null) {
                return sum + this.calculateTotalWithFees(priceFromEventDate, qty, isClientTaxed)
            }

            if (ebt.price !== null && ebt.price !== undefined) {
                return sum + this.calculateTotalWithFees(ebt.price, qty, isClientTaxed)
            }
            return sum
        }, 0)
    }

    calculateTotalForMultipleDaysWithoutTicketTypes(
        selectedDaysWithoutTicketTypes: string[],
        dayQuantities: Record<string, number>,
        event: TEvent | null | undefined,
        isClientTaxed: boolean | undefined
    ): number {
        if (!event?.EventDates) return 0

        return selectedDaysWithoutTicketTypes.reduce((sum, eventDateId) => {
            const eventDate = event.EventDates?.find(ed => ed.id === eventDateId)
            const qty = dayQuantities[eventDateId] || 0
            if (eventDate && eventDate.hasSpecificPrice && eventDate.price !== null && eventDate.price !== undefined) {
                return sum + this.calculateTotalWithFees(eventDate.price, qty, isClientTaxed)
            }
            return sum
        }, 0)
    }

    calculateTotalForSimpleEvent(
        currentPrice: number,
        currentQuantity: number,
        isClientTaxed: boolean | undefined
    ): number {
        return this.calculateTotalWithFees(currentPrice, currentQuantity, isClientTaxed)
    }

    calculateTotalForType(
        ebt: TEventBatchTicketType | any,
        selectedDaysForType: string[],
        qty: number,
        event: TEvent | null | undefined,
        isClientTaxed: boolean | undefined,
        activeEventDateId?: string | null
    ): number {
        if (selectedDaysForType.length > 0) {
            const daysTotal = selectedDaysForType.reduce((sum, eventDateId) => {
                const price = this.getPriceForTicketType(ebt, eventDateId, event)
                return sum + this.calculateTotalWithFees(price, 1, isClientTaxed)
            }, 0)
            return daysTotal * qty
        }

        const priceFromEventDate = this.getTicketTypePriceFromEventDates(ebt, event, activeEventDateId)
        if (priceFromEventDate !== null) {
            return this.calculateTotalWithFees(priceFromEventDate, qty, isClientTaxed)
        }

        if (ebt.price) {
            return this.calculateTotalWithFees(ebt.price, qty, isClientTaxed)
        }
        return 0
    }

    getDisplayPrice(
        ebt: TEventBatchTicketType | any,
        selectedDaysForType: string[],
        event: TEvent | null | undefined,
        activeEventDateId?: string | null
    ): number | { min: number; max: number } {
        if (selectedDaysForType.length > 0) {
            const firstDayPrice = this.getPriceForTicketType(ebt, selectedDaysForType[0], event)
            if (selectedDaysForType.length === 1) {
                return firstDayPrice
            }
            const allPrices = selectedDaysForType.map(id => this.getPriceForTicketType(ebt, id, event))
            const minPrice = Math.min(...allPrices)
            const maxPrice = Math.max(...allPrices)
            if (minPrice === maxPrice) {
                return minPrice
            }
            return { min: minPrice, max: maxPrice }
        }

        const priceFromEventDate = this.getTicketTypePriceFromEventDates(ebt, event, activeEventDateId)
        if (priceFromEventDate !== null) {
            return priceFromEventDate
        }

        return ebt.price || 0
    }

    calculateCurrentPrice(
        hasMultipleDaysWithTicketTypePrices: boolean,
        selectedDaysAndTypes: Record<string, Record<string, number>>,
        batchHasTicketTypes: boolean | undefined,
        eventBatchTicketTypes: TEventBatchTicketType[] | any[] | undefined,
        ticketTypeQuantities: Record<string, number>,
        selectedDays: Record<string, string[]>,
        hasMultipleDaysWithSpecificPrices: boolean,
        selectedDaysWithoutTicketTypes: string[],
        dayQuantities: Record<string, number>,
        selectedBatch: TEventBatch | null | undefined,
        event: TEvent | null | undefined
    ): number {
        if (hasMultipleDaysWithTicketTypePrices && event?.EventDates && event?.TicketTypes) {
            let total = 0
            Object.entries(selectedDaysAndTypes).forEach(([eventDateId, types]) => {
                const eventDate = event.EventDates?.find(ed => ed.id === eventDateId)
                if (eventDate?.EventDateTicketTypePrices && eventDate.EventDateTicketTypePrices.length > 0) {
                    Object.entries(types).forEach(([ticketTypeId, qty]) => {
                        if (qty > 0 && eventDate.EventDateTicketTypePrices) {
                            const dayPrice = (eventDate.EventDateTicketTypePrices as TEventDateTicketTypePrice[]).find(
                                (ttp) => ttp.ticketTypeId === ticketTypeId
                            )
                            if (dayPrice) {
                                total += dayPrice.price * qty
                            }
                        }
                    })
                }
            })
            return total
        }

        if (selectedBatch) {
            if (batchHasTicketTypes && eventBatchTicketTypes) {
                const total = eventBatchTicketTypes.reduce((sum, ebt) => {
                    const qty = ticketTypeQuantities[ebt.ticketTypeId] || 0
                    if (qty === 0) return sum

                    const selectedDaysForType = selectedDays[ebt.ticketTypeId] || []

                    if (selectedDaysForType.length > 0) {
                        const daysTotal = selectedDaysForType.reduce((daySum, eventDateId) => {
                            const price = this.getPriceForTicketType(ebt, eventDateId, event)
                            return daySum + price
                        }, 0)
                        return sum + (daysTotal * qty)
                    }

                    const priceFromEventDate = this.getTicketTypePriceFromEventDates(ebt, event)
                    if (priceFromEventDate !== null) {
                        return sum + (priceFromEventDate * qty)
                    }

                    if (ebt.price !== null && ebt.price !== undefined) {
                        return sum + (ebt.price * qty)
                    }
                    return sum
                }, 0)
                return total
            }

            if (hasMultipleDaysWithSpecificPrices && selectedDaysWithoutTicketTypes.length > 0) {
                const total = selectedDaysWithoutTicketTypes.reduce((sum, eventDateId) => {
                    const eventDate = event?.EventDates?.find(ed => ed.id === eventDateId)
                    const qty = dayQuantities[eventDateId] || 0
                    if (eventDate && eventDate.hasSpecificPrice && eventDate.price !== null && eventDate.price !== undefined) {
                        return sum + (eventDate.price * qty)
                    }
                    return sum
                }, 0)
                return total
            }

            return Math.round(this.getBatchPrice(selectedBatch, event))
        }

        if (event && (!event.EventBatches || event.EventBatches.length === 0)) {
            if (hasMultipleDaysWithSpecificPrices && selectedDaysWithoutTicketTypes.length > 0) {
                const total = selectedDaysWithoutTicketTypes.reduce((sum, eventDateId) => {
                    const eventDate = event.EventDates?.find(ed => ed.id === eventDateId)
                    const qty = dayQuantities[eventDateId] || 0
                    if (eventDate && eventDate.hasSpecificPrice && eventDate.price !== null && eventDate.price !== undefined) {
                        return sum + (eventDate.price * qty)
                    }
                    return sum
                }, 0)
                return total
            }
            const eventDateWithSpecificPrice = event.EventDates?.find(ed => ed.hasSpecificPrice)
            if (eventDateWithSpecificPrice && eventDateWithSpecificPrice.price !== null && eventDateWithSpecificPrice.price !== undefined) {
                return Math.round(eventDateWithSpecificPrice.price)
            }
            return Math.round(event.price ?? 0)
        }

        return 0
    }

    filterTicketTypesByIdentifier(
        ticketTypes: TCartItemTicketType[],
        identifier: string,
        isDayBasedWithoutTicketTypes: boolean,
        isMultipleDaysWithTicketTypes: boolean
    ): TCartItemTicketType[] {
        return ticketTypes.filter(t => {
            const tIsDayBasedWithoutTicketTypes = this.isDayBasedWithoutTicketTypes([t])
            const tIsMultipleDaysWithTicketTypes = this.isMultipleDaysWithTicketTypes([t])

            if (isDayBasedWithoutTicketTypes && tIsDayBasedWithoutTicketTypes && t.days) {
                return t.days[0] !== identifier
            }

            if (isMultipleDaysWithTicketTypes && tIsMultipleDaysWithTicketTypes) {
                const tIdentifier = `${t.ticketTypeId}-${t.days?.[0]}`
                return tIdentifier !== identifier
            }

            return t.ticketTypeId !== identifier
        })
    }

    updateTicketTypeQuantityByIdentifier(
        ticketTypes: TCartItemTicketType[],
        identifier: string,
        qty: number,
        isDayBasedWithoutTicketTypes: boolean,
        isMultipleDaysWithTicketTypes: boolean
    ): TCartItemTicketType[] {
        return ticketTypes.map(t => {
            const tIsDayBasedWithoutTicketTypes = this.isDayBasedWithoutTicketTypes([t])
            const tIsMultipleDaysWithTicketTypes = this.isMultipleDaysWithTicketTypes([t])

            if (isDayBasedWithoutTicketTypes && tIsDayBasedWithoutTicketTypes && t.days) {
                return t.days[0] === identifier ? { ...t, quantity: qty } : t
            }

            if (isMultipleDaysWithTicketTypes && tIsMultipleDaysWithTicketTypes) {
                const tIdentifier = `${t.ticketTypeId}-${t.days?.[0]}`
                return tIdentifier === identifier ? { ...t, quantity: qty } : t
            }

            if (!isDayBasedWithoutTicketTypes && !tIsDayBasedWithoutTicketTypes && !isMultipleDaysWithTicketTypes) {
                return t.ticketTypeId === identifier ? { ...t, quantity: qty } : t
            }

            return t
        }).filter(t => t.quantity > 0)
    }
}

export const CheckoutUtils = new CheckoutUtilsClass()
