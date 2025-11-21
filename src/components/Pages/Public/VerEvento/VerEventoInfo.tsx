"use client"

import { useMemo, useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Repeat, Tag, ShieldCheck, Lock, CreditCard, ArrowRight, TrendingDown, Users, QrCode, Headphones, Zap, CheckCircle2, Share2, MessageCircle, Star, TrendingUp, Gift } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventFindById } from "@/hooks/Event/useEventFindById"
import { useEventFind } from "@/hooks/Event/useEventFind"
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { QuantitySelector } from "@/components/QuantitySelector/QuantitySelector"
import { useCart } from "@/contexts/CartContext"
import { Carousel } from "@/components/Carousel/Carousel"
import { CardEvent } from "@/components/Card/CardEvent/CardEvent"
import ReactMarkdown from "react-markdown"
import type { TEvent, TRecurrenceDay } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import { EventCategoryIconHandler } from "@/utils/Helpers/EventCategoryIconHandler/EventCategoryIconHandler"

type TVerEventoInfoProps = {
    eventId: string
}

const VerEventoInfo = (
    {
        eventId
    }: TVerEventoInfoProps
) => {
    const { data: eventData, isLoading, isError } = useEventFindById(eventId)
    const { data: allEventsData } = useEventFind()
    const { data: eventCategoriesData } = useEventCategoryFind()
    
    const event = useMemo(() => {
        return eventData?.data
    }, [eventData])
    
    const allEvents = useMemo(() => {
        if (!allEventsData?.data || !Array.isArray(allEventsData.data)) return []
        return allEventsData.data
    }, [allEventsData])
    const { addItem, items } = useCart()
    const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(undefined)
    const [quantity, setQuantity] = useState(1)
    const [ticketTypeQuantities, setTicketTypeQuantities] = useState<Record<string, number>>({})
    const [selectedDays, setSelectedDays] = useState<Record<string, string[]>>({})

    const formatDate = (dateString?: string | null) => {
        return formatEventDate(dateString, "DD [de] MMMM [de] YYYY")
    }

    const formatTimeRange = (hourStart?: string | null, hourEnd?: string | null) => {
        return formatEventTime(hourStart, hourEnd)
    }

    const formatRecurrenceInfo = (recurrence: TEvent["Recurrence"]) => {
        if (!recurrence || recurrence.type === "NONE") return null

        const dayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

        if (recurrence.type === "DAILY") {
            if (recurrence.hourStart) {
                return {
                    type: "DAILY",
                    text: recurrence.hourEnd 
                        ? `${recurrence.hourStart} - ${recurrence.hourEnd}`
                        : recurrence.hourStart
                }
            }
            return { type: "DAILY", text: "Diário" }
        }

        if (recurrence.type === "WEEKLY") {
            if (recurrence.RecurrenceDays && recurrence.RecurrenceDays?.length > 0) {
                const timesText = recurrence.RecurrenceDays
                    .map((dayData: TRecurrenceDay) => {
                        if (dayData.hourStart) {
                            return dayData.hourEnd 
                                ? `${dayLabels[dayData.day]}: ${dayData.hourStart} - ${dayData.hourEnd}`
                                : `${dayLabels[dayData.day]}: ${dayData.hourStart}`
                        }
                        return dayLabels[dayData.day]
                    })
                    .join(" | ")

                return {
                    type: "WEEKLY",
                    text: timesText
                }
            }
            return { type: "WEEKLY", text: "Semanal" }
        }

        if (recurrence.type === "MONTHLY") {
            if (recurrence.RecurrenceDays && recurrence.RecurrenceDays?.length > 0) {
                const daysText = recurrence.RecurrenceDays
                    .map((dayData: TRecurrenceDay) => {
                        const dayLabel = `Dia ${dayData.day}`
                        if (dayData.hourStart) {
                            return dayData.hourEnd
                                ? `${dayLabel}: ${dayData.hourStart} - ${dayData.hourEnd}`
                                : `${dayLabel}: ${dayData.hourStart}`
                        }
                        return dayLabel
                    })
                    .join(" | ")

                return {
                    type: "MONTHLY",
                    text: daysText
                }
            }
            return { type: "MONTHLY", text: "Mensal" }
        }

        return null
    }

    const getBatchStatus = (batch: TEventBatch) => {
        if (batch.isActive) {
            return "active"
        }

        const now = new Date()
        const endDate = batch.endDate ? new Date(batch.endDate) : null

        if (!batch.isActive && endDate && now > endDate) {
            return "ended"
        }

        return "inactive"
    }

    const sortedBatches = useMemo(() => {
        if (!event?.EventBatches) return []

        return [...event.EventBatches].sort((a, b) => {
            const dateA = new Date(a.startDate).getTime()
            const dateB = new Date(b.startDate).getTime()
            return dateA - dateB
        })
    }, [event?.EventBatches])

    const activeBatches = useMemo(() => {
        return sortedBatches.filter(batch => getBatchStatus(batch) === "active")
    }, [sortedBatches])

    useEffect(() => {
        if (activeBatches?.length > 0 && !selectedBatchId) {
            setSelectedBatchId(activeBatches[0].id)
        }
    }, [activeBatches, selectedBatchId])

    const endedBatches = useMemo(() => {
        return sortedBatches.filter(batch => getBatchStatus(batch) === "ended")
    }, [sortedBatches])

    const eventCategoryBadges = useMemo(() => {
        if (!event?.EventCategoryEvents?.length) return []
        const categories = eventCategoriesData?.data
        if (!categories?.length) {
            return event.EventCategoryEvents.map(categoryEvent => ({
                id: categoryEvent.categoryId,
                label: categoryEvent.categoryId
            }))
        }
        const cache = categories.reduce<Record<string, string>>((acc, category) => {
            acc[category.id] = category.name
            return acc
        }, {})
        return event.EventCategoryEvents.map(categoryEvent => {
            const label = cache[categoryEvent.categoryId]
            if (!label) return null
            return {
                id: categoryEvent.categoryId,
                label
            }
        }).filter(Boolean) as { id: string; label: string }[]
    }, [event, eventCategoriesData])

    const similarEvents = useMemo(() => {
        if (!allEvents || !event) return []
        return allEvents.filter(e => e.id !== event.id).slice(0, 8)
    }, [allEvents, event])

    const similarEventSlides = useMemo(() => {
        return similarEvents.map((event) => (
            <div key={event.id} className="w-full max-w-[280px]
            sm:max-w-[320px]
            lg:max-w-[300px]">
                <CardEvent event={event} />
            </div>
        ))
    }, [similarEvents])

    const selectedBatch = useMemo(() => {
        if (!event?.EventBatches) return null
        if (selectedBatchId) {
            return event.EventBatches.find(b => b.id === selectedBatchId)
        }
        return activeBatches[0] || null
    }, [event?.EventBatches, selectedBatchId, activeBatches])

    const batchHasTicketTypes = useMemo(() => {
        return selectedBatch?.EventBatchTicketTypes && selectedBatch.EventBatchTicketTypes.length > 0
    }, [selectedBatch])

    const getPriceForTicketType = useCallback((ebt: any, eventDateId: string) => {
        const eventDate = event?.EventDates?.find(ed => ed.id === eventDateId)
        
        if (eventDate?.hasSpecificPrice) {
            if (eventDate.EventDateTicketTypePrices && eventDate.EventDateTicketTypePrices.length > 0) {
                const ticketTypeIdToMatch = ebt.TicketType?.id || ebt.ticketTypeId
                const dayPrice = eventDate.EventDateTicketTypePrices.find((ttp: any) => {
                    return ttp.ticketTypeId === ticketTypeIdToMatch
                })
                if (dayPrice) {
                    return dayPrice.price
                }
            } else if (eventDate.price) {
                return eventDate.price
            }
        }
        
        return ebt.price || 0
    }, [event?.EventDates, event?.TicketTypes])

    const getBatchPrice = useCallback((batch: TEventBatch) => {
        if (!event?.EventDates || event.EventDates.length === 0) {
            return batch.price ?? 0
        }

        const eventDateWithSpecificPrice = event.EventDates.find(ed => ed.hasSpecificPrice)
        if (eventDateWithSpecificPrice && eventDateWithSpecificPrice.price !== null && eventDateWithSpecificPrice.price !== undefined) {
            return eventDateWithSpecificPrice.price
        }

        return batch.price ?? 0
    }, [event?.EventDates])

    const getTicketTypePriceFromEventDates = useCallback((ebt: any) => {
        if (!event?.EventDates || event.EventDates.length === 0) {
            return null
        }

        const eventDateWithSpecificPrice = event.EventDates.find(ed => ed.hasSpecificPrice)
        if (eventDateWithSpecificPrice) {
            if (eventDateWithSpecificPrice.EventDateTicketTypePrices && eventDateWithSpecificPrice.EventDateTicketTypePrices.length > 0) {
                const ticketTypeIdToMatch = ebt.TicketType?.id || ebt.ticketTypeId
                const dayPrice = eventDateWithSpecificPrice.EventDateTicketTypePrices.find((ttp: any) => {
                    return ttp.ticketTypeId === ticketTypeIdToMatch
                })
                if (dayPrice) {
                    return dayPrice.price
                }
            } else if (eventDateWithSpecificPrice.price !== null && eventDateWithSpecificPrice.price !== undefined) {
                return eventDateWithSpecificPrice.price
            }
        }

        return null
    }, [event?.EventDates])

    const currentPrice = useMemo(() => {
        if (selectedBatch) {
            if (batchHasTicketTypes && selectedBatch.EventBatchTicketTypes) {
                const total = selectedBatch.EventBatchTicketTypes.reduce((sum, ebt) => {
                    const qty = ticketTypeQuantities[ebt.ticketTypeId] || 0
                    if (qty === 0) return sum
                    
                    const selectedDaysForType = selectedDays[ebt.ticketTypeId] || []
                    
                    if (selectedDaysForType.length > 0) {
                        const daysTotal = selectedDaysForType.reduce((daySum, eventDateId) => {
                            const price = getPriceForTicketType(ebt, eventDateId)
                            return daySum + price
                        }, 0)
                        return sum + (daysTotal * qty)
                    }
                    
                    const priceFromEventDate = getTicketTypePriceFromEventDates(ebt)
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
            return Math.round(getBatchPrice(selectedBatch))
        }
        if (event && (!event.EventBatches || event.EventBatches.length === 0)) {
            const eventDateWithSpecificPrice = event.EventDates?.find(ed => ed.hasSpecificPrice)
            if (eventDateWithSpecificPrice && eventDateWithSpecificPrice.price !== null && eventDateWithSpecificPrice.price !== undefined) {
                return Math.round(eventDateWithSpecificPrice.price)
            }
            return Math.round(event.price ?? 0)
        }
        return 0
    }, [selectedBatch, event, batchHasTicketTypes, ticketTypeQuantities, selectedDays, getPriceForTicketType, getBatchPrice, getTicketTypePriceFromEventDates])

    const totalQuantity = useMemo(() => {
        if (batchHasTicketTypes && selectedBatch?.EventBatchTicketTypes) {
            return selectedBatch.EventBatchTicketTypes.reduce((total, ebt) => {
                return total + (ticketTypeQuantities[ebt.ticketTypeId] || 0)
            }, 0)
        }
        return quantity
    }, [batchHasTicketTypes, selectedBatch, ticketTypeQuantities, quantity])

    const singleTicketFee = useMemo(() => {
        if (!event?.price) {
            return TicketFeeUtils.calculateFeeInCents(0, event?.isClientTaxed)
        }
        return TicketFeeUtils.calculateFeeInCents(Math.round(event.price), event.isClientTaxed)
    }, [event])

    const handleAddToCart = () => {
        if (!event) return

        const batchId = selectedBatch?.id
        const batchName = selectedBatch?.name
        const hasMultipleDates = event.EventDates && event.EventDates.length > 1

        if (batchHasTicketTypes && selectedBatch?.EventBatchTicketTypes) {
            const ticketTypes = selectedBatch.EventBatchTicketTypes
                .filter(ebt => (ticketTypeQuantities[ebt.ticketTypeId] || 0) > 0)
                .map(ebt => {
                    const selectedDaysForType = selectedDays[ebt.ticketTypeId] || []
                    const hasSelectedDays = selectedDaysForType.length > 0
                    
                    return {
                        ticketTypeId: ebt.ticketTypeId,
                        ticketTypeName: ebt.TicketType?.name || "Tipo desconhecido",
                        price: hasSelectedDays ? null : (ebt.price || 0),
                        quantity: ticketTypeQuantities[ebt.ticketTypeId] || 0,
                        days: hasSelectedDays ? selectedDaysForType : undefined
                    }
                })

            if (ticketTypes.length === 0) {
                return
            }

            addItem({
                eventId: event.id,
                eventName: event.name,
                batchId,
                batchName,
                price: currentPrice,
                ticketTypes,
                isClientTaxed: event.isClientTaxed
            }, totalQuantity)
        } else {
            addItem({
                eventId: event.id,
                eventName: event.name,
                batchId,
                batchName,
                price: currentPrice,
                isClientTaxed: event.isClientTaxed
            }, quantity)
        }
    }

    useEffect(() => {
        if (selectedBatch?.EventBatchTicketTypes && selectedBatch.EventBatchTicketTypes.length > 0) {
            const initialQuantities: Record<string, number> = {}
            const initialDays: Record<string, string[]> = {}
            
            const hasOnlyOneDate = event?.EventDates && event.EventDates.length === 1
            const singleDate = hasOnlyOneDate ? event.EventDates[0] : null
            const singleDateId = singleDate?.id || null
            
            selectedBatch.EventBatchTicketTypes.forEach(ebt => {
                initialQuantities[ebt.ticketTypeId] = 0
                if (singleDate && singleDate.hasSpecificPrice) {
                    initialDays[ebt.ticketTypeId] = singleDateId ? [singleDateId] : []
                } else {
                    const eventDateWithSpecificPrice = event?.EventDates?.find(ed => ed.hasSpecificPrice)
                    if (eventDateWithSpecificPrice) {
                        if (eventDateWithSpecificPrice.EventDateTicketTypePrices && eventDateWithSpecificPrice.EventDateTicketTypePrices.length > 0) {
                            const ticketTypeIdToMatch = ebt.TicketType?.id || ebt.ticketTypeId
                            const hasPriceForThisType = eventDateWithSpecificPrice.EventDateTicketTypePrices.some((ttp: any) => ttp.ticketTypeId === ticketTypeIdToMatch)
                            if (hasPriceForThisType) {
                                initialDays[ebt.ticketTypeId] = eventDateWithSpecificPrice.id ? [eventDateWithSpecificPrice.id] : []
                            } else {
                                initialDays[ebt.ticketTypeId] = []
                            }
                        } else if (eventDateWithSpecificPrice.price !== null && eventDateWithSpecificPrice.price !== undefined) {
                            initialDays[ebt.ticketTypeId] = eventDateWithSpecificPrice.id ? [eventDateWithSpecificPrice.id] : []
                        } else {
                            initialDays[ebt.ticketTypeId] = []
                        }
                    } else {
                        initialDays[ebt.ticketTypeId] = []
                    }
                }
            })
            setTicketTypeQuantities(initialQuantities)
            setSelectedDays(initialDays)
        } else {
            setTicketTypeQuantities({})
            setSelectedDays({})
        }
    }, [selectedBatch, event?.EventDates])

    const cartItem = useMemo(() => {
        return items.find(item => 
            item.eventId === eventId && 
            item.batchId === selectedBatchId
        )
    }, [items, eventId, selectedBatchId])

    const currentQuantity = cartItem?.quantity || quantity

    useEffect(() => {
        if (cartItem?.ticketTypes && cartItem.ticketTypes.length > 0 && selectedBatch?.EventBatchTicketTypes) {
            const quantities: Record<string, number> = {}
            cartItem.ticketTypes.forEach(tt => {
                quantities[tt.ticketTypeId] = tt.quantity
            })
            setTicketTypeQuantities(quantities)
        }
    }, [cartItem, selectedBatch])

    if (isLoading) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-12 space-y-8">
                    <Skeleton className="w-full h-96 rounded-2xl" />
                    <Skeleton className="w-2/3 h-12" />
                    <Skeleton className="w-full h-64" />
                </div>
            </Background>
        )
    }

    if (isError || !event) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-12 mt-[80px]">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-semibold text-psi-dark">Evento não encontrado</h1>
                        <p className="text-psi-dark/60">O evento que você está procurando não existe ou foi removido.</p>
                    </div>
                </div>
            </Background>
        )
    }

    const recurrenceInfo = formatRecurrenceInfo(event.Recurrence)
    const isRecurrent = event.Recurrence && event.Recurrence.type !== "NONE"

    const descriptionContent = event.description ? (
        <div className="prose prose-sm max-w-none
        sm:prose-base">
            <div className="text-psi-dark [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mb-4 [&>h1]:mt-6 [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mb-3 [&>h2]:mt-5 [&>h3]:text-lg [&>h3]:font-semibold [&>h3]:mb-2 [&>h3]:mt-4 [&>p]:mb-4 [&>p]:leading-relaxed [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-4 [&>ol]:list-decimal [&>ol]:ml-6 [&>ol]:mb-4 [&>li]:mb-2 [&>strong]:font-bold [&>em]:italic [&>code]:bg-psi-primary/10 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-sm [&>pre]:bg-psi-dark/5 [&>pre]:p-4 [&>pre]:rounded-lg [&>pre]:overflow-x-auto [&>pre]:mb-4 [&>blockquote]:border-l-4 [&>blockquote]:border-psi-primary/30 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-4 [&>a]:text-psi-primary [&>a]:underline [&>a:hover]:text-psi-primary/80">
                <ReactMarkdown>{event.description}</ReactMarkdown>
            </div>
        </div>
    ) : null

    return (
        <Background variant="light" className="min-h-screen">
            <div className="max-w-[88vw] mx-auto py-8 mt-[80px]
            sm:py-12
            lg:max-w-[80vw] lg:container
            ">
                <div className="grid gap-8
                lg:grid-cols-[1fr_400px]
                lg:gap-12">
                    <div className="space-y-8">
                        <div className="relative w-full h-[400px]
                        sm:h-[500px]
                        lg:h-[600px] rounded-2xl overflow-hidden bg-psi-dark/5">
                            <img
                                src={ImageUtils.getEventImageUrl(event.image)}
                                alt={event.name}
                                className="object-cover h-full w-full"
                            />
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h1 className="text-3xl font-bold text-psi-dark mb-4
                                sm:text-4xl
                                lg:text-5xl leading-tight">
                                    {event.name}
                                </h1>

                                {eventCategoryBadges.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {eventCategoryBadges.map((category) => {
                                            const Icon = EventCategoryIconHandler(category.label)
                                            return (
                                                <div key={category.id} className="flex items-center gap-1">
                                                    <span
                                                        className="px-3 py-1 flex items-center gap-2 rounded-full bg-psi-primary/10 text-psi-primary text-xs font-semibold uppercase tracking-wide"
                                                    >
                                                        <Icon
                                                            className="h-4 w-4 text-psi-primary"
                                                            aria-label={`Categoria ${category.label}`}
                                                        />
                                                        {category.label}
                                                    </span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                )}

                                <div className="flex flex-col gap-4 text-sm text-psi-dark/70">
                                    {!isRecurrent && event.EventDates?.length > 0 && (() => {
                                        const sortedDates = [...event.EventDates].sort((a, b) => getDateOrderValue(a?.date) - getDateOrderValue(b?.date))
                                        const firstDate = sortedDates[0]
                                        const lastDate = sortedDates[sortedDates.length - 1]
                                        const hasMultipleDates = sortedDates.length > 1

                                        return (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Calendar className="h-4 w-4 text-psi-primary shrink-0" />
                                                    <span className="font-medium">
                                                        {hasMultipleDates
                                                            ? `${formatDate(firstDate?.date)} - ${formatDate(lastDate?.date)}`
                                                            : formatDate(firstDate?.date)
                                                        }
                                                    </span>
                                                </div>

                                                {hasMultipleDates ? (
                                                    <div className="space-y-2 text-xs text-psi-dark/70">
                                                        {sortedDates.map((eventDate) => (
                                                            <div key={eventDate.id || eventDate.date} className="flex flex-wrap items-center gap-2">
                                                                <span className="font-semibold text-psi-dark">{formatEventDate(eventDate.date, "DD[/]MMM")}</span>
                                                                <span className="text-psi-dark/40">•</span>
                                                                <span>{formatTimeRange(eventDate.hourStart, eventDate.hourEnd)}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="h-4 w-4 text-psi-primary shrink-0" />
                                                        <span>{formatTimeRange(firstDate?.hourStart, firstDate?.hourEnd)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })()}

                                    {isRecurrent && recurrenceInfo && (
                                        <div className="flex items-center gap-2">
                                            <Repeat className="h-4 w-4 text-psi-primary shrink-0" />
                                            <span className="font-semibold text-psi-primary">
                                                {recurrenceInfo.type === "DAILY" && "Diário"}
                                                {recurrenceInfo.type === "WEEKLY" && "Semanal"}
                                                {recurrenceInfo.type === "MONTHLY" && "Mensal"}
                                            </span>
                                            <span className="text-psi-dark/50">•</span>
                                            <span>{recurrenceInfo.text}</span>
                                        </div>
                                    )}

                                    {event.location && (
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-psi-primary shrink-0" />
                                            <span>{event.location}</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {descriptionContent && (
                                <div className="hidden lg:block">
                                    {descriptionContent}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        {event.EventBatches && event.EventBatches?.length > 0 ? (
                            <div className="space-y-6">
                                {activeBatches?.length > 0 && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-psi-dark">Lotes Disponíveis</h2>
                                        <div className="space-y-3">
                                            {activeBatches.map((batch) => {
                                                const hasTicketTypes = batch.EventBatchTicketTypes && batch.EventBatchTicketTypes.length > 0
                                                const feeCents = TicketFeeUtils.calculateFeeInCents(Math.round(batch.price ?? 0), event.isClientTaxed)
                                                return (
                                                <div
                                                    key={batch.id}
                                                    onClick={() => setSelectedBatchId(batch.id)}
                                                    className={`rounded-xl border-2 p-4 shadow-sm cursor-pointer transition-all ${
                                                        selectedBatchId === batch.id
                                                            ? "border-psi-primary/50 bg-linear-to-tl from-psi-primary/20 via-white to-psi-light"
                                                            : "border-psi-primary/30 bg-linear-to-br from-psi-primary/10 via-white to-psi-primary/5 hover:border-psi-primary/50"
                                                    }`}
                                                >
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Tag className="h-4 w-4 text-psi-primary" />
                                                                <span className="font-semibold text-psi-dark">{batch.name}</span>
                                                                <span className="px-2 py-0.5 bg-psi-primary/80 text-psi-light text-xs font-medium rounded-full">
                                                                    Disponível
                                                                </span>
                                                            </div>
                                                            {hasTicketTypes ? (
                                                                <div className="mt-2 space-y-2">
                                                                    {batch.EventBatchTicketTypes?.map((ebt) => {
                                                                        const ticketTypeName = ebt.TicketType?.name || "Tipo desconhecido"
                                                                        const hasPricePerDay = ebt.days && Array.isArray(ebt.days) && ebt.days.length > 0
                                                                        
                                                                        const getPriceForDisplay = () => {
                                                                            const priceFromEventDate = getTicketTypePriceFromEventDates(ebt)
                                                                            if (priceFromEventDate !== null) {
                                                                                return priceFromEventDate
                                                                            }
                                                                            return ebt.price
                                                                        }
                                                                        
                                                                        const displayPrice = getPriceForDisplay()
                                                                        const typeFeeCents = displayPrice ? TicketFeeUtils.calculateFeeInCents(displayPrice, event.isClientTaxed) : 0
                                                                        
                                                                        return (
                                                                            <div key={ebt.ticketTypeId} className="text-sm">
                                                                                <p className="font-medium text-psi-dark">{ticketTypeName}</p>
                                                                                <p className="text-psi-primary font-semibold">
                                                                                    {hasPricePerDay ? "Preço por dia" : (displayPrice ? ValueUtils.centsToCurrency(displayPrice) : "Preço não definido")}
                                                                                </p>
                                                                                {!hasPricePerDay && displayPrice && (
                                                                                    <p className="text-xs text-psi-dark/60">
                                                                                        + Taxa: {ValueUtils.centsToCurrency(typeFeeCents)}
                                                                                    </p>
                                                                                )}
                                                                            </div>
                                                                        )
                                                                    })}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <p className="text-3xl font-bold text-psi-primary mt-2">
                                                                        {ValueUtils.centsToCurrency(Math.round(getBatchPrice(batch)))}
                                                                    </p>
                                                                    <p className="text-xs text-psi-dark/60 mt-1">
                                                                        + Taxa de serviço: {ValueUtils.centsToCurrency(TicketFeeUtils.calculateFeeInCents(Math.round(getBatchPrice(batch)), event.isClientTaxed))}
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {endedBatches?.length > 0 && (
                                    <div className="space-y-4">
                                        <h2 className="text-xl font-semibold text-psi-dark/60">Lotes Encerrados</h2>
                                        <div className="space-y-3">
                                            {endedBatches.map((batch) => {
                                                const batchPrice = getBatchPrice(batch)
                                                const feeCents = TicketFeeUtils.calculateFeeInCents(Math.round(batchPrice), event.isClientTaxed)
                                                return (
                                                <div
                                                    key={batch.id}
                                                    className="rounded-xl border border-psi-dark/5 bg-psi-dark/5 p-4 opacity-50"
                                                >
                                                    <div className="flex items-start justify-between gap-4 mb-3">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <Tag className="h-4 w-4 text-psi-dark/30" />
                                                                <span className="font-semibold text-psi-dark/40">{batch.name}</span>
                                                                <span className="px-2 py-0.5 bg-psi-dark/5 text-psi-dark/40 text-xs font-medium rounded-full">
                                                                    Encerrado
                                                                </span>
                                                            </div>
                                                            <p className="text-2xl font-bold text-psi-dark/40 mt-2">
                                                                {ValueUtils.centsToCurrency(Math.round(batchPrice))}
                                                            </p>
                                                            <p className="text-xs text-psi-dark/50">
                                                                Taxa de serviço: {ValueUtils.centsToCurrency(feeCents)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-xs text-psi-dark/40 space-y-1">
                                                        <p>
                                                            Encerrado em: {batch.endDate ? formatDate(batch.endDate) : "Data indefinida"}
                                                        </p>
                                                    </div>
                                                </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="rounded-xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/10 p-6">
                                <div className="text-left space-y-2">
                                    {(() => {
                                        const eventDateWithSpecificPrice = event.EventDates?.find(ed => ed.hasSpecificPrice)
                                        const displayPrice = eventDateWithSpecificPrice && eventDateWithSpecificPrice.price !== null && eventDateWithSpecificPrice.price !== undefined
                                            ? eventDateWithSpecificPrice.price
                                            : event.price
                                        const feeCents = displayPrice ? TicketFeeUtils.calculateFeeInCents(Math.round(displayPrice), event.isClientTaxed) : 0
                                        return (
                                            <>
                                                <p className="text-3xl font-bold text-psi-primary">
                                                    {displayPrice ? ValueUtils.centsToCurrency(Math.round(displayPrice)) : "Preço não definido"}
                                                </p>
                                                <p className="text-sm text-psi-dark/60">Ingresso único</p>
                                                {displayPrice && (
                                                    <p className="text-xs text-psi-dark/60">
                                                        + Taxa de serviço: {ValueUtils.centsToCurrency(feeCents)}
                                                    </p>
                                                )}
                                            </>
                                        )
                                    })()}
                                </div>
                            </div>
                        )}

                        {(activeBatches?.length > 0 || !event.EventBatches || event.EventBatches.length === 0) && (
                            <div className="space-y-4 rounded-xl border border-psi-primary/20 bg-white p-6">
                                {batchHasTicketTypes && selectedBatch?.EventBatchTicketTypes ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-psi-dark">Selecione a quantidade por tipo</span>
                                            <span className="text-xs text-psi-dark/60">Máximo 10 por pessoa</span>
                                        </div>
                                        <div className="space-y-4">
                                            {selectedBatch.EventBatchTicketTypes.map((ebt) => {
                                                const ticketTypeName = ebt.TicketType?.name || "Tipo desconhecido"
                                                const ticketTypeDescription = ebt.TicketType?.description
                                                const qty = ticketTypeQuantities[ebt.ticketTypeId] || 0
                                                const selectedDaysForType = selectedDays[ebt.ticketTypeId] || []
                                                
                                                const getPriceForTicketTypeLocal = (eventDateId: string) => {
                                                    const eventDate = event.EventDates?.find(ed => ed.id === eventDateId)
                                                    
                                                    if (eventDate?.hasSpecificPrice) {
                                                        if (eventDate.EventDateTicketTypePrices && eventDate.EventDateTicketTypePrices.length > 0) {
                                                            const ticketTypeIdToMatch = ebt.TicketType?.id || ebt.ticketTypeId
                                                            const dayPrice = eventDate.EventDateTicketTypePrices.find((ttp: any) => {
                                                                return ttp.ticketTypeId === ticketTypeIdToMatch
                                                            })
                                                            if (dayPrice) {
                                                                return dayPrice.price
                                                            }
                                                        } else if (eventDate.price) {
                                                            return eventDate.price
                                                        }
                                                    }
                                                    
                                                    return ebt.price || 0
                                                }
                                                
                                                const getTotalForType = () => {
                                                    if (selectedDaysForType.length > 0) {
                                                        const daysTotal = selectedDaysForType.reduce((sum, eventDateId) => {
                                                            const price = getPriceForTicketTypeLocal(eventDateId)
                                                            const feeCents = TicketFeeUtils.calculateFeeInCents(price, event.isClientTaxed)
                                                            return sum + price + feeCents
                                                        }, 0)
                                                        return daysTotal * qty
                                                    }
                                                    
                                                    const priceFromEventDate = getTicketTypePriceFromEventDates(ebt)
                                                    if (priceFromEventDate !== null) {
                                                        const feeCents = TicketFeeUtils.calculateFeeInCents(priceFromEventDate, event.isClientTaxed)
                                                        return (priceFromEventDate * qty) + (feeCents * qty)
                                                    }
                                                    
                                                    if (ebt.price) {
                                                        const feeCents = TicketFeeUtils.calculateFeeInCents(ebt.price, event.isClientTaxed)
                                                        return (ebt.price * qty) + (feeCents * qty)
                                                    }
                                                    return 0
                                                }
                                                
                                                const getDisplayPrice = () => {
                                                    if (selectedDaysForType.length > 0) {
                                                        const firstDayPrice = getPriceForTicketTypeLocal(selectedDaysForType[0])
                                                        if (selectedDaysForType.length === 1) {
                                                            return firstDayPrice
                                                        }
                                                        const allPrices = selectedDaysForType.map(id => getPriceForTicketTypeLocal(id))
                                                        const minPrice = Math.min(...allPrices)
                                                        const maxPrice = Math.max(...allPrices)
                                                        if (minPrice === maxPrice) {
                                                            return minPrice
                                                        }
                                                        return { min: minPrice, max: maxPrice }
                                                    }
                                                    
                                                    const priceFromEventDate = getTicketTypePriceFromEventDates(ebt)
                                                    if (priceFromEventDate !== null) {
                                                        return priceFromEventDate
                                                    }
                                                    
                                                    return ebt.price || 0
                                                }
                                                
                                                const displayPrice = getDisplayPrice()
                                                
                                                return (
                                                    <div key={ebt.ticketTypeId} className="rounded-lg border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <h4 className="font-semibold text-psi-dark">{ticketTypeName}</h4>
                                                                {ticketTypeDescription && (
                                                                    <p className="text-xs text-psi-dark/60 mt-1">{ticketTypeDescription}</p>
                                                                )}
                                                                <div className="mt-2 space-y-1">
                                                                    {typeof displayPrice === "object" ? (
                                                                        <p className="text-sm font-medium text-psi-primary">
                                                                            {ValueUtils.centsToCurrency(displayPrice.min)} - {ValueUtils.centsToCurrency(displayPrice.max)} por ingresso
                                                                        </p>
                                                                    ) : (
                                                                        <p className="text-sm font-medium text-psi-primary">
                                                                            {ValueUtils.centsToCurrency(displayPrice)} por ingresso
                                                                        </p>
                                                                    )}
                                                                    {typeof displayPrice === "number" && (
                                                                        <p className="text-xs text-psi-dark/60">
                                                                            + Taxa: {ValueUtils.centsToCurrency(TicketFeeUtils.calculateFeeInCents(displayPrice, event.isClientTaxed))} por ingresso
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                {event.EventDates && event.EventDates.length > 1 && (
                                                                    <div className="mt-3 space-y-2">
                                                                        <p className="text-xs font-medium text-psi-dark/70">Selecione os dias:</p>
                                                                        {event.EventDates.map((eventDate) => {
                                                                            const isSelected = selectedDaysForType.includes(eventDate.id)
                                                                            const priceForThisDay = getPriceForTicketTypeLocal(eventDate.id)
                                                                            const feeCents = TicketFeeUtils.calculateFeeInCents(priceForThisDay, event.isClientTaxed)
                                                                            
                                                                            return (
                                                                                <div key={eventDate.id} className="flex items-center gap-3 rounded-lg border border-psi-primary/20 bg-white p-2">
                                                                                    <Checkbox
                                                                                        checked={isSelected}
                                                                                        onCheckedChange={(checked) => {
                                                                                            setSelectedDays(prev => {
                                                                                                const current = prev[ebt.ticketTypeId] || []
                                                                                                if (checked === true) {
                                                                                                    return {
                                                                                                        ...prev,
                                                                                                        [ebt.ticketTypeId]: [...current, eventDate.id]
                                                                                                    }
                                                                                                } else {
                                                                                                    return {
                                                                                                        ...prev,
                                                                                                        [ebt.ticketTypeId]: current.filter(id => id !== eventDate.id)
                                                                                                    }
                                                                                                }
                                                                                            })
                                                                                        }}
                                                                                    />
                                                                                    <div className="flex-1">
                                                                                        <div className="text-sm font-medium text-psi-dark">
                                                                                            {formatDate(eventDate.date)}
                                                                                        </div>
                                                                                        {eventDate.hourStart && (
                                                                                            <div className="text-xs text-psi-dark/60">
                                                                                                {formatTimeRange(eventDate.hourStart, eventDate.hourEnd)}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <div className="text-sm font-semibold text-psi-primary">
                                                                                            {ValueUtils.centsToCurrency(priceForThisDay)}
                                                                                        </div>
                                                                                        <div className="text-xs text-psi-dark/60">
                                                                                            + {ValueUtils.centsToCurrency(feeCents)} taxa
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            )
                                                                        })}
                                                                    </div>
                                                                )}
                                                                {qty > 0 && (
                                                                    <p className="text-sm font-semibold text-psi-dark mt-2">
                                                                        Subtotal: {ValueUtils.centsToCurrency(getTotalForType())}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <QuantitySelector
                                                            value={qty}
                                                            onChange={(newQuantity) => {
                                                                setTicketTypeQuantities(prev => ({
                                                                    ...prev,
                                                                    [ebt.ticketTypeId]: newQuantity
                                                                }))
                                                            }}
                                                            max={10}
                                                            min={0}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-psi-dark">Quantidade</span>
                                            <span className="text-xs text-psi-dark/60">Máximo 10 por pessoa</span>
                                        </div>
                                        <QuantitySelector
                                            value={currentQuantity}
                                            onChange={(newQuantity) => {
                                                setQuantity(newQuantity)
                                                if (cartItem) {
                                                    addItem({
                                                        eventId: event.id,
                                                        eventName: event.name,
                                                        batchId: selectedBatchId,
                                                        batchName: selectedBatch?.name,
                                                        price: currentPrice,
                                                        isClientTaxed: event.isClientTaxed
                                                    }, newQuantity)
                                                }
                                            }}
                                            max={10}
                                            min={1}
                                        />
                                    </div>
                                )}

                                <div className="pt-4 border-t border-psi-dark/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-psi-dark/70">Total</span>
                                        <span className="text-2xl font-bold text-psi-primary">
                                            {batchHasTicketTypes && selectedBatch?.EventBatchTicketTypes ? (
                                                (() => {
                                                    const ticketsTotal = selectedBatch.EventBatchTicketTypes.reduce((sum, ebt) => {
                                                        const qty = ticketTypeQuantities[ebt.ticketTypeId] || 0
                                                        const selectedDaysForType = selectedDays[ebt.ticketTypeId] || []
                                                        
                                                        if (selectedDaysForType.length > 0) {
                                                            const daysTotal = selectedDaysForType.reduce((daySum, eventDateId) => {
                                                                const price = getPriceForTicketType(ebt, eventDateId)
                                                                const feeCents = TicketFeeUtils.calculateFeeInCents(price, event.isClientTaxed)
                                                                return daySum + price + feeCents
                                                            }, 0)
                                                            return sum + (daysTotal * qty)
                                                        }
                                                        
                                                        const priceFromEventDate = getTicketTypePriceFromEventDates(ebt)
                                                        if (priceFromEventDate !== null) {
                                                            const feeCents = TicketFeeUtils.calculateFeeInCents(priceFromEventDate, event.isClientTaxed)
                                                            return sum + (priceFromEventDate * qty) + (feeCents * qty)
                                                        }
                                                        
                                                        if (ebt.price) {
                                                            const feeCents = TicketFeeUtils.calculateFeeInCents(ebt.price, event.isClientTaxed)
                                                            return sum + (ebt.price * qty) + (feeCents * qty)
                                                        }
                                                        return sum
                                                    }, 0)
                                                    return ValueUtils.centsToCurrency(ticketsTotal)
                                                })()
                                            ) : (
                                                (() => {
                                                    const feeCents = TicketFeeUtils.calculateFeeInCents(currentPrice, event.isClientTaxed)
                                                    const totalWithFees = (currentPrice * currentQuantity) + (feeCents * currentQuantity)
                                                    return ValueUtils.centsToCurrency(totalWithFees)
                                                })()
                                            )}
                                        </span>
                                    </div>
                                    <Button
                                        size="lg"
                                        variant="primary"
                                        className="w-full"
                                        onClick={handleAddToCart}
                                        disabled={batchHasTicketTypes && totalQuantity === 0}
                                    >
                                        {cartItem ? "Atualizar Carrinho" : "Adicionar ao Carrinho"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {descriptionContent && (
                            <div className="lg:hidden">
                                {descriptionContent}
                            </div>
                        )}

                        <div className="space-y-6 rounded-xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/10 p-6">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-psi-primary/10 p-2">
                                        <ShieldCheck className="h-5 w-5 text-psi-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-psi-dark">Compra 100% Segura</h3>
                                        <p className="text-xs text-psi-dark/60">Plataforma confiável e protegida</p>
                                    </div>
                                </div>

                                <div className="space-y-3 pt-2 border-t border-psi-primary/10">
                                    <div className="flex items-start gap-3">
                                        <Lock className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">Pagamento Seguro</p>
                                            <p className="text-xs text-psi-dark/60">Processamento seguro com criptografia SSL</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <CreditCard className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">Múltiplas Formas de Pagamento</p>
                                            <p className="text-xs text-psi-dark/60">PIX, cartão de crédito ou boleto bancário</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <TrendingDown className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">Taxas Reduzidas</p>
                                            <p className="text-xs text-psi-dark/60">Apenas 1% acima de R$ 39,90 ou R$ 1 fixo</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <QrCode className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">QR Code Digital</p>
                                            <p className="text-xs text-psi-dark/60">Ingressos enviados por email com QR Code</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Zap className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">Compra Rápida</p>
                                            <p className="text-xs text-psi-dark/60">Processo simples e eficiente</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <ShieldCheck className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">Garantia de Repasse</p>
                                            <p className="text-xs text-psi-dark/60">Valores retidos até a data do evento</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-3">
                                        <Headphones className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-psi-dark">Suporte Dedicado</p>
                                            <p className="text-xs text-psi-dark/60">Atendimento personalizado para produtores locais</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-psi-primary/10">
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-psi-dark mb-2">Por que escolher nossa plataforma?</h4>
                                        <div className="space-y-2">
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0 mt-0.5" />
                                                <p className="text-xs text-psi-dark/70">Foco regional em Porto Seguro - Bahia</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0 mt-0.5" />
                                                <p className="text-xs text-psi-dark/70">Taxas muito mais baixas que concorrentes</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0 mt-0.5" />
                                                <p className="text-xs text-psi-dark/70">Repasse rápido e transparente</p>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0 mt-0.5" />
                                                <p className="text-xs text-psi-dark/70">Histórico de compras sempre disponível</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-psi-primary/10">
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-psi-dark mb-1">Ainda não tem conta?</h4>
                                        <p className="text-xs text-psi-dark/60">
                                            Cadastre-se gratuitamente e agilize suas compras futuras. Perfil completo acelera o checkout.
                                        </p>
                                    </div>
                                    <Link href="/cadastro">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="w-full group"
                                        >
                                            Criar Conta Grátis
                                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-psi-primary/10">
                                <div className="space-y-3">
                                    <div>
                                        <h4 className="font-semibold text-psi-dark mb-1">É organizador de eventos?</h4>
                                        <p className="text-xs text-psi-dark/60 mb-3">
                                            Cadastre seus eventos e venda ingressos com taxas reduzidas. Suporte personalizado para produtores locais.
                                        </p>
                                        <Link href="/cadastro">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full group border-psi-primary/30 text-psi-primary hover:bg-psi-primary/5"
                                            >
                                                <Users className="h-4 w-4 mr-2" />
                                                Área do Produtor
                                                <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6 rounded-xl border border-psi-primary/20 bg-white p-6 shadow-sm">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="rounded-lg bg-psi-primary/10 p-2">
                                        <Share2 className="h-5 w-5 text-psi-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-psi-dark">Compartilhe este evento</h3>
                                        <p className="text-xs text-psi-dark/60">Ajude a divulgar para seus amigos</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-psi-primary/20 hover:bg-psi-primary/5"
                                        onClick={() => {
                                            if (navigator.share) {
                                                navigator.share({
                                                    title: event.name,
                                                    text: `Confira este evento: ${event.name}`,
                                                    url: window.location.href
                                                }).catch(() => {})
                                            } else {
                                                navigator.clipboard.writeText(window.location.href)
                                            }
                                        }}
                                    >
                                        <Share2 className="h-4 w-4 mr-2" />
                                        Compartilhar
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="w-full border-psi-primary/20 hover:bg-psi-primary/5"
                                        onClick={() => {
                                            navigator.clipboard.writeText(window.location.href)
                                        }}
                                    >
                                        Copiar Link
                                    </Button>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-psi-dark/10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <TrendingUp className="h-4 w-4 text-psi-primary" />
                                        <h4 className="font-semibold text-psi-dark text-sm">Se tornando a referência</h4>
                                    </div>
                                    <p className="text-xs text-psi-dark/70 leading-relaxed">
                                        Estamos construindo a principal plataforma de ingressos de Porto Seguro, com foco em:
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0 mt-0.5" />
                                            <span className="text-xs text-psi-dark/70">A melhor experiência para compradores</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0 mt-0.5" />
                                            <span className="text-xs text-psi-dark/70">Suporte dedicado para organizadores locais</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0 mt-0.5" />
                                            <span className="text-xs text-psi-dark/70">Taxas justas e transparentes</span>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <CheckCircle2 className="h-3.5 w-3.5 text-psi-primary shrink-0 mt-0.5" />
                                            <span className="text-xs text-psi-dark/70">Tecnologia moderna e segura</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-psi-dark/10">
                                <div className="rounded-lg bg-linear-to-br from-psi-primary/10 via-psi-primary/5 to-psi-primary/10 p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Gift className="h-4 w-4 text-psi-primary" />
                                        <h4 className="font-semibold text-psi-dark text-sm">Dica especial</h4>
                                    </div>
                                    <p className="text-xs text-psi-dark/70 leading-relaxed">
                                        Complete seu cadastro e ganhe acesso a ofertas exclusivas, descontos em eventos futuros e muito mais!
                                    </p>
                                    <Link href="/cadastro">
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            className="w-full group"
                                        >
                                            <Star className="h-4 w-4 mr-2" />
                                            Criar Conta e Ganhar Benefícios
                                        </Button>
                                    </Link>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-psi-dark/10">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <MessageCircle className="h-4 w-4 text-psi-primary" />
                                        <h4 className="font-semibold text-psi-dark text-sm">Dúvidas sobre o evento?</h4>
                                    </div>
                                    <p className="text-xs text-psi-dark/70 leading-relaxed">
                                        Entre em contato com o organizador através da plataforma ou consulte nossa central de ajuda.
                                    </p>
                                    <div className="flex gap-2">
                                        <Link href="/ajuda" className="flex-1">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full border-psi-primary/20 hover:bg-psi-primary/5"
                                            >
                                                Central de Ajuda
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="flex-1 border-psi-primary/20 hover:bg-psi-primary/5"
                                            onClick={() => {
                                                window.open(`mailto:contato@portoseguroingressos.com.br?subject=Dúvida sobre: ${event.name}`, '_blank')
                                            }}
                                        >
                                            Contatar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
                {similarEvents?.length > 0 && (
                    <div className="mt-16 space-y-6">
                        <div className="space-y-2 container">
                            <h2 className="text-2xl font-semibold text-psi-dark
                            sm:text-3xl
                            lg:text-4xl tracking-tight">
                                Eventos <span className="text-psi-primary">semelhantes</span>
                            </h2>
                            <p className="text-sm text-psi-dark/60
                            sm:text-base">
                                Explore outros eventos que podem te interessar
                            </p>
                        </div>

                        <div className="w-full">
                            <Carousel
                                items={similarEventSlides}
                                className="px-2 py-4"
                                slidesPerView={1}
                                spaceBetween={20}
                                loop
                                autoplay
                                speed={1200}
                                pauseOnHover={true}
                                autoplayDelay={2600}
                                showNavigation
                                allowTouchMove
                                breakpoints={{
                                    640: {
                                        slidesPerView: 2,
                                        spaceBetween: 24
                                    },
                                    1024: {
                                        slidesPerView: 3,
                                        spaceBetween: 28
                                    },
                                    1400: {
                                        slidesPerView: 4,
                                        spaceBetween: 32
                                    },
                                    1600: {
                                        slidesPerView: 5,
                                        spaceBetween: 36
                                    }
                                }}
                            />
                        </div>
                    </div>
                )}
        </Background>
    )
}

export {
    VerEventoInfo
}
