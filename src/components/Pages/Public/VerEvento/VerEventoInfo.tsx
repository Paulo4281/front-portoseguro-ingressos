"use client"

import { useMemo, useState, useEffect, useCallback, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, MapPin, Repeat, Tag, ShieldCheck, Lock, CreditCard, ArrowRight, TrendingDown, Users, QrCode, Headphones, Zap, CheckCircle2, Share2, MessageCircle, Star, TrendingUp, Gift, Instagram, Facebook, Mail, Phone, Building2, ExternalLink, Laptop } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useEventFindById } from "@/hooks/Event/useEventFindById"
import { useEventFindSimilar } from "@/hooks/Event/useEventFindSimilar"
import { useEventCategoryFind } from "@/hooks/EventCategory/useEventCategoryFind"
import { useEventClickCreate } from "@/hooks/EventClick/useEventClickCreate"
import { formatEventDate, formatEventTime, getDateOrderValue } from "@/utils/Helpers/EventSchedule/EventScheduleUtils"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"
import { CheckoutUtils } from "@/utils/Helpers/CheckoutUtils/CheckoutUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { QuantitySelector } from "@/components/QuantitySelector/QuantitySelector"
import { useCart } from "@/contexts/CartContext"
import { Carousel } from "@/components/Carousel/Carousel"
import { CardEvent } from "@/components/Card/CardEvent/CardEvent"
import ReactMarkdown from "react-markdown"
import { TEventVerifyLastTicketsResponse, type TEvent, type TRecurrenceDay } from "@/types/Event/TEvent"
import type { TEventBatch } from "@/types/Event/TEventBatch"
import type { TEventClickCreate } from "@/types/Event/TEventClick"
import { EventCategoryIconHandler } from "@/utils/Helpers/EventCategoryIconHandler/EventCategoryIconHandler"
import { DialogTaxes } from "@/components/Dialog/DialogTaxes/DialogTaxes"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useEventVerifyLastTicket } from "@/hooks/Event/useEventVerifyLastTicket"
import { Toast } from "@/components/Toast/Toast"

type TVerEventoInfoProps = {
    eventId: string
}

const VerEventoInfo = (
    {
        eventId
    }: TVerEventoInfoProps
) => {
    const { data: eventData, isLoading, isError } = useEventFindById(eventId)
    const { data: eventCategoriesData } = useEventCategoryFind()
    const { mutateAsync: registerEventClick } = useEventClickCreate()
    const { user } = useAuthStore()

    const { data: eventVerifyLastTicketsData, isLoading: isLoadingEventVerifyLastTickets, isFetching: isFetchingEventVerifyLastTickets } = useEventVerifyLastTicket(eventId)

    const [isLastTicketsData, setIsLastTicketsData] = useState<TEventVerifyLastTicketsResponse[]>([])

    useEffect(() => {
        if (eventVerifyLastTicketsData?.data && Array.isArray(eventVerifyLastTicketsData.data)) {
            console.log(eventVerifyLastTicketsData.data)
            setIsLastTicketsData(eventVerifyLastTicketsData.data)
        }
    }, [eventVerifyLastTicketsData])

    const isLastTicketsForDayAndType = useCallback((eventDateId: string | null, ticketTypeId: string | null) => {
        return isLastTicketsData.some(
            item => {
                const eventDateMatch = eventDateId === null ? item.eventDateId === null : item.eventDateId === eventDateId
                const ticketTypeMatch = ticketTypeId === null ? item.ticketTypeId === null : item.ticketTypeId === ticketTypeId
                return eventDateMatch && ticketTypeMatch && item.isLastTickets
            }
        )
    }, [isLastTicketsData])

    const isLastTicketsForDay = useCallback((eventDateId: string) => {
        return isLastTicketsData.some(
            item => item.eventDateId === eventDateId && 
            item.ticketTypeId === null && 
            item.isLastTickets
        )
    }, [isLastTicketsData])

    const isLastTicketsForTicketType = useCallback((ticketTypeId: string) => {
        return isLastTicketsData.some(
            item => item.ticketTypeId === ticketTypeId && 
            item.isLastTickets
        )
    }, [isLastTicketsData])

    const isLastTicketsForEvent = useCallback(() => {
        return isLastTicketsData.some(
            item => item.ticketTypeId === null && 
            item.eventDateId === null &&
            item.isLastTickets
        )
    }, [isLastTicketsData])

    const getTicketsAmount = useCallback((eventDateId: string | null, ticketTypeId: string | null) => {
        const item = isLastTicketsData.find(
            item => {
                const eventDateMatch = eventDateId === null ? item.eventDateId === null : item.eventDateId === eventDateId
                const ticketTypeMatch = ticketTypeId === null ? item.ticketTypeId === null : item.ticketTypeId === ticketTypeId
                return eventDateMatch && ticketTypeMatch
            }
        )
        return item?.ticketsAmount ?? null
    }, [isLastTicketsData])

    const getMaxQuantity = useCallback((eventDateId: string | null, ticketTypeId: string | null, defaultLimit: number) => {
        const ticketsAmount = getTicketsAmount(eventDateId, ticketTypeId)
        if (ticketsAmount !== null && ticketsAmount !== undefined) {
            return ticketsAmount
        }
        return defaultLimit
    }, [getTicketsAmount])

    const validateAndSetQuantity = useCallback((
        newQuantity: number,
        maxQuantity: number,
        setter: (value: number) => void
    ) => {
        if (newQuantity > maxQuantity) {
            Toast.info("Não há mais ingressos disponíveis além dessa quantidade.")
            setter(maxQuantity)
        } else {
            setter(newQuantity)
        }
    }, [])
    
    const event = useMemo(() => {
        return eventData?.data
    }, [eventData])

    const buyTicketsLimit = useMemo(() => {
        return event?.buyTicketsLimit || 10
    }, [event])

    const eventCategoriesString = useMemo(() => {
        if (!event?.EventCategoryEvents || event.EventCategoryEvents.length === 0) return ""
        return event.EventCategoryEvents.map(ce => ce.categoryId).join(",")
    }, [event])

    const shouldFetchSimilar = useMemo(() => {
        return !!event && eventCategoriesString.length > 0
    }, [event, eventCategoriesString])

    const { data: similarEventsData } = useEventFindSimilar({
        categories: eventCategoriesString,
        excludeEventId: event?.id,
        enabled: shouldFetchSimilar
    })

    const similarEvents = useMemo(() => {
        if (!similarEventsData?.data || !Array.isArray(similarEventsData.data)) return []
        return similarEventsData.data.slice(0, 8)
    }, [similarEventsData])
    
    const { addItem, items } = useCart()
    const [selectedBatchId, setSelectedBatchId] = useState<string | undefined>(undefined)
    const [quantity, setQuantity] = useState(0)
    const [ticketTypeQuantities, setTicketTypeQuantities] = useState<Record<string, number>>({})
    const [selectedDays, setSelectedDays] = useState<Record<string, string[]>>({})
    const [selectedDaysWithoutTicketTypes, setSelectedDaysWithoutTicketTypes] = useState<string[]>([])
    const [dayQuantities, setDayQuantities] = useState<Record<string, number>>({})
    const [selectedDaysAndTypes, setSelectedDaysAndTypes] = useState<Record<string, Record<string, number>>>({})
    const [totalAnimationKey, setTotalAnimationKey] = useState(0)
    const previousTotalRef = useRef<number>(0)
    const eventClickRegisteredRef = useRef<string | null>(null)
    const [isLoadingCheckoutPage, setIsLoadingCheckoutPage] = useState<boolean>(false)

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

    useEffect(() => {
        if (!event?.id) return
        if (eventClickRegisteredRef.current === event.id) return

        const payload: TEventClickCreate = {
            eventId: event.id
        }

        if (user?.id) {
            payload.userId = user.id
        }

        if (typeof window !== "undefined") {
            const searchParams = new URLSearchParams(window.location.search)
            const utmMappings: Record<string, keyof TEventClickCreate> = {
                utm_id: "utmId",
                utm_source: "utmSource",
                utm_medium: "utmMedium",
                utm_campaign: "utmCampaign",
                utm_content: "utmContent",
                utm_term: "utmTerm"
            }

            Object.entries(utmMappings).forEach(([paramKey, payloadKey]) => {
                const value = searchParams.get(paramKey)
                if (value) {
                    payload[payloadKey] = value
                }
            })
        }

        if (typeof document !== "undefined" && document.referrer) {
            payload.referer = document.referrer
        }

        eventClickRegisteredRef.current = event.id

        registerEventClick(payload).catch(() => {
            eventClickRegisteredRef.current = null
        })
    }, [event?.id, registerEventClick, user?.id])

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
        return CheckoutUtils.getPriceForTicketType(ebt, eventDateId, event)
    }, [event])

    const getBatchPrice = useCallback((batch: TEventBatch) => {
        return CheckoutUtils.getBatchPrice(batch, event)
    }, [event])

    const getTicketTypePriceFromEventDates = useCallback((ebt: any) => {
        return CheckoutUtils.getTicketTypePriceFromEventDates(ebt, event)
    }, [event])

    const hasMultipleDaysWithSpecificPrices = useMemo(() => {
        return CheckoutUtils.hasMultipleDaysWithSpecificPrices(event)
    }, [event])

    const hasMultipleDaysWithTicketTypePrices = useMemo(() => {
        return CheckoutUtils.hasMultipleDaysWithTicketTypePrices(event)
    }, [event])

    const currentPrice = useMemo(() => {
        return CheckoutUtils.calculateCurrentPrice(
            hasMultipleDaysWithTicketTypePrices,
            selectedDaysAndTypes,
            batchHasTicketTypes,
            selectedBatch?.EventBatchTicketTypes,
            ticketTypeQuantities,
            selectedDays,
            hasMultipleDaysWithSpecificPrices,
            selectedDaysWithoutTicketTypes,
            dayQuantities,
            selectedBatch,
            event
        )
    }, [selectedBatch, event, batchHasTicketTypes, ticketTypeQuantities, selectedDays, selectedDaysWithoutTicketTypes, dayQuantities, hasMultipleDaysWithSpecificPrices, hasMultipleDaysWithTicketTypePrices, selectedDaysAndTypes])

    const totalQuantity = useMemo(() => {
        if (hasMultipleDaysWithTicketTypePrices) {
            let total = 0
            Object.values(selectedDaysAndTypes).forEach((types) => {
                Object.values(types).forEach((qty) => {
                    total += qty
                })
            })
            return total
        }
        if (batchHasTicketTypes && selectedBatch?.EventBatchTicketTypes) {
            return selectedBatch.EventBatchTicketTypes.reduce((total, ebt) => {
                return total + (ticketTypeQuantities[ebt.ticketTypeId] || 0)
            }, 0)
        }
        if (hasMultipleDaysWithSpecificPrices && selectedDaysWithoutTicketTypes.length > 0) {
            return selectedDaysWithoutTicketTypes.reduce((sum, eventDateId) => {
                return sum + (dayQuantities[eventDateId] || 0)
            }, 0)
        }
        return quantity
    }, [batchHasTicketTypes, selectedBatch, ticketTypeQuantities, quantity, hasMultipleDaysWithSpecificPrices, hasMultipleDaysWithTicketTypePrices, selectedDaysAndTypes, selectedDaysWithoutTicketTypes, dayQuantities])

    const totalValue = useMemo(() => {
        if (!event) return 0
        
        if (hasMultipleDaysWithTicketTypePrices && event?.EventDates) {
            return CheckoutUtils.calculateTotalForSelectedDaysAndTypes(
                selectedDaysAndTypes,
                event,
                event.isClientTaxed
            )
        }
        if (batchHasTicketTypes && selectedBatch?.EventBatchTicketTypes) {
            return CheckoutUtils.calculateTotalForBatchTicketTypes(
                selectedBatch.EventBatchTicketTypes,
                ticketTypeQuantities,
                selectedDays,
                event,
                event.isClientTaxed
            )
        }
        if (hasMultipleDaysWithSpecificPrices && selectedDaysWithoutTicketTypes.length > 0) {
            return CheckoutUtils.calculateTotalForMultipleDaysWithoutTicketTypes(
                selectedDaysWithoutTicketTypes,
                dayQuantities,
                event,
                event.isClientTaxed
            )
        }
        const cartItem = items.find(item => 
            item.eventId === eventId && 
            item.batchId === selectedBatchId
        )
        const currentQuantity = cartItem?.quantity || quantity
        return CheckoutUtils.calculateTotalForSimpleEvent(
            currentPrice,
            currentQuantity,
            event.isClientTaxed
        )
    }, [hasMultipleDaysWithTicketTypePrices, event, selectedDaysAndTypes, batchHasTicketTypes, selectedBatch, ticketTypeQuantities, selectedDays, hasMultipleDaysWithSpecificPrices, selectedDaysWithoutTicketTypes, dayQuantities, currentPrice, items, eventId, selectedBatchId, quantity])

    useEffect(() => {
        if (previousTotalRef.current !== totalValue && previousTotalRef.current > 0) {
            setTotalAnimationKey(prev => prev + 1)
        }
        previousTotalRef.current = totalValue
    }, [totalValue])

    const singleTicketFee = useMemo(() => {
        if (!event?.price) {
            return TicketFeeUtils.calculateFeeInCents(0, event?.isClientTaxed)
        }
        return TicketFeeUtils.calculateFeeInCents(Math.round(event.price), event.isClientTaxed)
    }, [event])

    const handleAddToCart = () => {
        if (!event) return

        setIsLoadingCheckoutPage(true)

        const batchId = selectedBatch?.id
        const batchName = selectedBatch?.name

        if (hasMultipleDaysWithTicketTypePrices && event?.EventDates && event?.TicketTypes) {
            const ticketTypes: any[] = []
            
            Object.entries(selectedDaysAndTypes).forEach(([eventDateId, types]) => {
                const eventDate = event.EventDates?.find(ed => ed.id === eventDateId)
                if (!eventDate) return
                
                Object.entries(types).forEach(([ticketTypeId, qty]) => {
                    if (qty > 0) {
                        const ticketType = event.TicketTypes?.find(tt => tt.id === ticketTypeId)
                        const dayPrice = eventDate.EventDateTicketTypePrices?.find((ttp: any) => 
                            ttp.ticketTypeId === ticketTypeId
                        )
                        
                        ticketTypes.push({
                            ticketTypeId: ticketTypeId,
                            ticketTypeName: ticketType?.name || "Tipo desconhecido",
                            price: null,
                            quantity: qty,
                            days: [eventDateId]
                        })
                    }
                })
            })

            if (ticketTypes.length === 0) {
                return
            }

            addItem({
                eventId: event.id,
                eventName: event.name,
                eventImage: event.image,
                batchId,
                batchName,
                price: currentPrice,
                ticketTypes,
                isClientTaxed: event.isClientTaxed,
                isFree: event.isFree
            }, totalQuantity || 0)
        } else if (batchHasTicketTypes && selectedBatch?.EventBatchTicketTypes) {
            const ticketTypes: any[] = []

            selectedBatch.EventBatchTicketTypes.forEach(ebt => {
                const qty = ticketTypeQuantities[ebt.ticketTypeId] || 0
                if (qty === 0) return
                
                const selectedDaysForType = selectedDays[ebt.ticketTypeId] || []
                const hasSelectedDays = selectedDaysForType.length > 0
                
                if (hasSelectedDays) {
                    selectedDaysForType.forEach(dayId => {
                        ticketTypes.push({
                            ticketTypeId: ebt.ticketTypeId,
                            ticketTypeName: ebt.TicketType?.name || "Tipo desconhecido",
                            price: null,
                            quantity: qty,
                            days: [dayId]
                        })
                    })
                } else {
                    let ticketTypePrice: number = 0

                    if (event?.EventDates && event?.EventDates?.length > 0 && event?.EventDates?.find(ed => ed.hasSpecificPrice)) {
                        const eventDate = event?.EventDates?.find(ed => ed.hasSpecificPrice)
                        if (eventDate) {
                            ticketTypePrice = eventDate.EventDateTicketTypePrices?.find((ttp: any) => ttp.ticketTypeId === ebt.ticketTypeId)?.price || 0
                        }
                    }

                    ticketTypes.push({
                        ticketTypeId: ebt.ticketTypeId,
                        ticketTypeName: ebt.TicketType?.name || "Tipo desconhecido",
                        price: ticketTypePrice || ebt.price || 0,
                        quantity: qty,
                        days: undefined
                    })
                }
            })

            if (ticketTypes.length === 0) {
                return
            }

            addItem({
                eventId: event.id,
                eventName: event.name,
                eventImage: event.image,
                batchId,
                batchName,
                price: currentPrice,
                ticketTypes,
                isClientTaxed: event.isClientTaxed,
                isFree: event.isFree
            }, totalQuantity || 0)
        } else if (hasMultipleDaysWithSpecificPrices && selectedDaysWithoutTicketTypes.length > 0) {
            const ticketTypes = selectedDaysWithoutTicketTypes.map(eventDateId => {
                const eventDate = event.EventDates?.find(ed => ed.id === eventDateId)
                const qty = dayQuantities[eventDateId] || 0
                return {
                    ticketTypeId: "",
                    ticketTypeName: `Ingresso - ${eventDate ? formatDate(eventDate.date) : ""}`,
                    price: null,
                    quantity: qty,
                    days: [eventDateId]
                }
            }).filter(tt => tt.quantity > 0)

            if (ticketTypes.length === 0) {
                return
            }

            addItem({
                eventId: event.id,
                eventName: event.name,
                eventImage: event.image,
                batchId,
                batchName,
                price: currentPrice,
                ticketTypes,
                isClientTaxed: event.isClientTaxed,
                isFree: event.isFree
            }, totalQuantity || 0)
        } else {
            addItem({
                eventId: event.id,
                eventName: event.name,
                eventImage: event.image,
                batchId,
                batchName,
                price: currentPrice,
                isClientTaxed: event.isClientTaxed,
                isFree: event.isFree
            }, quantity)
        }

        setIsLoadingCheckoutPage(false)
    }

    useEffect(() => {
        if (selectedBatch?.EventBatchTicketTypes && selectedBatch.EventBatchTicketTypes.length > 0) {
            const initialQuantities: Record<string, number> = {}
            const initialDays: Record<string, string[]> = {}
            
            selectedBatch.EventBatchTicketTypes.forEach(ebt => {
                initialQuantities[ebt.ticketTypeId] = 0
                initialDays[ebt.ticketTypeId] = []
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

    useEffect(() => {
        if (!batchHasTicketTypes && hasMultipleDaysWithSpecificPrices && event?.EventDates) {
            setSelectedDaysWithoutTicketTypes([])
            setDayQuantities({})
        } else if (!batchHasTicketTypes && !hasMultipleDaysWithSpecificPrices) {
            setSelectedDaysWithoutTicketTypes([])
            setDayQuantities({})
        }
    }, [batchHasTicketTypes, hasMultipleDaysWithSpecificPrices, event?.EventDates, selectedBatch])

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
        <>
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes totalUpdate {
                    0% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.05);
                        opacity: 0.9;
                    }
                    100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                }
                .total-animate {
                    animation: totalUpdate 0.4s ease-in-out;
                }
            `}} />
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
                                        {
                                            event.isOnline && (
                                                <div className="flex items-center gap-2">
                                                    <Laptop className="h-4 w-4 text-psi-primary shrink-0" />
                                                    <span className="font-medium">Online</span>
                                                </div>
                                            )
                                        }
                                        {
                                            event.isFree && (
                                                <div className="flex items-center gap-2">
                                                    <Gift className="h-4 w-4 text-psi-primary shrink-0" />
                                                    <span className="font-medium">Gratuito</span>
                                                </div>
                                            )
                                        }
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

                                    {isRecurrent && (() => {
                                        const nextEventDate = event.EventDates?.[0]
                                        return (
                                            <div className="space-y-3">
                                                {recurrenceInfo && (
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
                                                {nextEventDate && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Calendar className="h-4 w-4 text-psi-primary shrink-0" />
                                                            <span className="font-medium">
                                                                Próxima data: {formatDate(nextEventDate.date)}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="h-4 w-4 text-psi-primary shrink-0" />
                                                            <span>{formatTimeRange(nextEventDate.hourStart, nextEventDate.hourEnd)}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })()}

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

                            {event.Organizer && (() => {
                                const hasCompanyInfo = event.Organizer.companyName || event.Organizer.companyAddress
                                const hasSocialMedia = event.Organizer.instagramUrl || event.Organizer.facebookUrl
                                const hasLogo = event.Organizer.logo
                                const hasDescription = event.Organizer.description
                                
                                if (!hasCompanyInfo && !hasSocialMedia && !hasLogo && !hasDescription) {
                                    return null
                                }
                                
                                return (
                                    <div className="rounded-2xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/10 p-6 space-y-4">
                                        <div className="flex items-center gap-3 pb-4 border-b border-psi-primary/10">
                                            {hasLogo ? (
                                                <div className="h-25 w-25 rounded-xl overflow-hidden bg-white border border-psi-primary/20 shrink-0">
                                                    <img
                                                        src={ImageUtils.getOrganizerLogoUrl(event.Organizer.logo)}
                                                        alt={event.Organizer.companyName || "Logo do organizador"}
                                                        className="h-full w-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <Users className="h-5 w-5 text-psi-primary" />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <h3 className="font-semibold text-psi-dark">Organizador do Evento</h3>
                                                <p className="text-xs text-psi-dark/60">Informações de contato e redes sociais</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {hasDescription && (
                                                <div className="rounded-lg bg-white/80 p-4 border border-psi-primary/10">
                                                    <p className="text-sm text-psi-dark leading-relaxed">
                                                        {event.Organizer.description}
                                                    </p>
                                                </div>
                                            )}

                                            {hasCompanyInfo && (
                                                <div className="flex items-start gap-3">
                                                    <Building2 className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                                    <div className="flex-1">
                                                        {event.Organizer.companyName && (
                                                            <p className="text-sm font-medium text-psi-dark">{event.Organizer.companyName}</p>
                                                        )}
                                                        {event.Organizer.companyAddress && (
                                                            <p className="text-xs text-psi-dark/60 mt-1">{event.Organizer.companyAddress}</p>
                                                        )}
                                                    </div>
                                                </div>
                                            )}

                                            {hasSocialMedia && (
                                                <div className="space-y-2 pt-2 border-t border-psi-primary/10">
                                                    <p className="text-xs font-medium text-psi-dark/70 mb-2">Redes Sociais</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {event.Organizer.instagramUrl && (
                                                            <a
                                                                href={event.Organizer.instagramUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 text-psi-dark hover:from-purple-500/20 hover:to-pink-500/20 transition-all group"
                                                            >
                                                                <Instagram className="h-4 w-4 text-purple-600" />
                                                                <span className="text-sm font-medium">Instagram</span>
                                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </a>
                                                        )}
                                                        {event.Organizer.facebookUrl && (
                                                            <a
                                                                href={event.Organizer.facebookUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20 text-psi-dark hover:from-blue-500/20 hover:to-blue-600/20 transition-all group"
                                                            >
                                                                <Facebook className="h-4 w-4 text-blue-600" />
                                                                <span className="text-sm font-medium">Facebook</span>
                                                                <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )
                            })()}
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
                                                    className={`rounded-xl border-2 p-4 shadow-sm transition-all ${
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
                                                                    {hasMultipleDaysWithTicketTypePrices && event?.EventDates && event?.TicketTypes ? (
                                                                        <div className="text-sm">
                                                                            <p className="font-medium text-psi-dark">Tipos de ingressos disponíveis</p>
                                                                            {(() => {
                                                                                const allPrices: number[] = []
                                                                                event.EventDates.forEach(eventDate => {
                                                                                    if (eventDate.hasSpecificPrice && eventDate.EventDateTicketTypePrices) {
                                                                                        eventDate.EventDateTicketTypePrices.forEach((edttp: any) => {
                                                                                            allPrices.push(edttp.price)
                                                                                        })
                                                                                    }
                                                                                })
                                                                                if (allPrices.length > 0) {
                                                                                    const minPrice = Math.min(...allPrices)
                                                                                    const minFeeCents = TicketFeeUtils.calculateFeeInCents(minPrice, event.isClientTaxed)
                                                                                    return (
                                                                                        <>
                                                                                            <p className="text-psi-primary font-semibold mt-1">
                                                                                                {event.isFree ? "Gratuito" : `A partir de ${ValueUtils.centsToCurrency(minPrice)}`}
                                                                                            </p>
                                                                                            {!event.isFree && (
                                                                                                <p className="text-xs text-psi-dark/60">
                                                                                                    + Taxa: {ValueUtils.centsToCurrency(minFeeCents)} por ingresso
                                                                                                </p>
                                                                                            )}
                                                                                        </>
                                                                                    )
                                                                                }
                                                                                return null
                                                                            })()}
                                                                        </div>
                                                                    ) : (
                                                                        batch.EventBatchTicketTypes?.map((ebt) => {
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
                                                                            
                                                                            const isLastTickets = isLastTicketsForTicketType(ebt.ticketTypeId) || 
                                                                                (event?.EventDates?.some(eventDate => 
                                                                                    isLastTicketsForDayAndType(eventDate.id, ebt.ticketTypeId)
                                                                                ) || false)
                                                                            
                                                                            return (
                                                                                <div key={ebt.ticketTypeId} className="text-sm">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <p className="font-medium text-psi-dark">{ticketTypeName}</p>
                                                                                    </div>
                                                                                    <p className="text-psi-primary font-semibold">
                                                                                        {hasPricePerDay ? "Preço por dia" : (displayPrice !== null && displayPrice !== undefined ? ValueUtils.formatPrice(displayPrice) : "Preço não definido")}
                                                                                    </p>
                                                                                    {!hasPricePerDay && displayPrice && displayPrice > 0 && (
                                                                                        <p className="text-xs text-psi-dark/60">
                                                                                            + Taxa: {ValueUtils.centsToCurrency(typeFeeCents)}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        })
                                                                    )}
                                                                </div>
                                                            ) : (
                                                                <>
                                                                    <div className="flex items-center gap-2 mt-2">
                                                                        <p className="text-3xl font-bold text-psi-primary">
                                                                            {(() => {
                                                                                if (hasMultipleDaysWithSpecificPrices && event.EventDates) {
                                                                                    const daysWithTicketTypePrices = event.EventDates.filter(
                                                                                        ed => ed.hasSpecificPrice && Array.isArray(ed.EventDateTicketTypePrices) && ed.EventDateTicketTypePrices.length > 0
                                                                                    )

                                                                                    if (daysWithTicketTypePrices.length > 0) {
                                                                                        let min = Infinity
                                                                                        daysWithTicketTypePrices.forEach((ed) => {
                                                                                            ed.EventDateTicketTypePrices?.forEach((edttp) => {
                                                                                                if (typeof edttp.price === 'number' && edttp.price < min) min = edttp.price
                                                                                            })
                                                                                        })
                                                                                        if (isFinite(min)) {
                                                                                            const roundedMin = Math.round(min)
                                                                                            return event.isFree ? "Gratuito" : `A partir de ${ValueUtils.centsToCurrency(roundedMin)}`
                                                                                        }
                                                                                    }

                                                                                    const daysWithSpecificOnly = event.EventDates.filter(
                                                                                        ed => ed.hasSpecificPrice && typeof ed.price === 'number'
                                                                                    )
                                                                                    if (daysWithSpecificOnly.length > 0) {
                                                                                        const minPrice = Math.round(Math.min(...daysWithSpecificOnly.map(ed => ed.price!)))
                                                                                        return event.isFree ? "Gratuito" : `A partir de ${ValueUtils.centsToCurrency(minPrice)}`
                                                                                    }
                                                                                }
                                                                                const batchPrice = Math.round(getBatchPrice(batch))
                                                                                return ValueUtils.formatPrice(batchPrice)
                                                                            })()}
                                                                        </p>
                                                                    </div>
                                                                    {(() => {
                                                                        if (event.isFree) {
                                                                            return null
                                                                        }
                                                                        if (hasMultipleDaysWithSpecificPrices && event.EventDates) {
                                                                            const daysWithSpecificPrices = event.EventDates.filter(ed => ed.hasSpecificPrice && ed.price !== null && ed.price !== undefined)
                                                                            if (daysWithSpecificPrices.length > 0) {
                                                                                const minPrice = Math.min(...daysWithSpecificPrices.map(ed => ed.price!))
                                                                                if (minPrice > 0) {
                                                                                    const minFeeCents = TicketFeeUtils.calculateFeeInCents(minPrice, event.isClientTaxed)
                                                                                    return (
                                                                                        <p className="text-xs text-psi-dark/60 mt-1">
                                                                                            + Taxa de serviço: {ValueUtils.centsToCurrency(minFeeCents)}
                                                                                        </p>
                                                                                    )
                                                                                }
                                                                                return null
                                                                            }
                                                                        }
                                                                        const batchPrice = Math.round(getBatchPrice(batch))
                                                                        if (batchPrice > 0) {
                                                                            return (
                                                                                <p className="text-xs text-psi-dark/60 mt-1">
                                                                                    + Taxa de serviço: {ValueUtils.centsToCurrency(TicketFeeUtils.calculateFeeInCents(batchPrice, event.isClientTaxed))}
                                                                                </p>
                                                                            )
                                                                        }
                                                                        return null
                                                                    })()}
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
                                                                {event.isFree ? "Gratuito" : ValueUtils.formatPrice(Math.round(batchPrice))}
                                                            </p>
                                                            {!event.isFree && Math.round(batchPrice) > 0 && (
                                                                <p className="text-xs text-psi-dark/50">
                                                                    Taxa de serviço: {ValueUtils.centsToCurrency(feeCents)}
                                                                </p>
                                                            )}
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
                                        const hasLastTickets = eventDateWithSpecificPrice 
                                            ? isLastTicketsForDay(eventDateWithSpecificPrice.id)
                                            : isLastTicketsForEvent()
                                        return (
                                            <>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-3xl font-bold text-psi-primary">
                                                        {event.isFree ? "Gratuito" : (displayPrice !== null && displayPrice !== undefined ? ValueUtils.formatPrice(Math.round(displayPrice)) : "Preço não definido")}
                                                    </p>
                                                    {hasLastTickets && (
                                                        <span className="px-2 py-0.5 animate-pulse bg-psi-dark/90 text-psi-light text-xs font-semibold rounded-full">
                                                            Últimos ingressos
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-psi-dark/60">Ingresso único</p>
                                                {!event.isFree && displayPrice && displayPrice > 0 && (
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
                                {hasMultipleDaysWithTicketTypePrices && event?.EventDates && event?.TicketTypes ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-psi-dark">Selecione os dias e tipos de ingressos</span>
                                            <span className="text-xs text-psi-dark/60">Máximo {buyTicketsLimit} por pessoa</span>
                                        </div>
                                        {event.EventDates.filter(ed => ed.hasSpecificPrice && ed.EventDateTicketTypePrices && ed.EventDateTicketTypePrices.length > 0).map((eventDate) => {
                                            const dayTypes = selectedDaysAndTypes[eventDate.id] || {}
                                            
                                            return (
                                                <div key={eventDate.id} className="rounded-lg border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-3">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <div className="text-sm font-semibold text-psi-dark">
                                                                    {formatDate(eventDate.date)}
                                                                </div>
                                                                {eventDate.EventDateTicketTypePrices?.some((edttp: any) => 
                                                                    isLastTicketsForDayAndType(eventDate.id, edttp.ticketTypeId)
                                                                ) && (
                                                                    <span className="px-2 py-0.5 animate-pulse bg-psi-dark/90 text-psi-light text-xs font-semibold rounded-full">
                                                                        Últimos ingressos
                                                                    </span>
                                                                )}
                                                            </div>
                                                            {eventDate.hourStart && (
                                                                <div className="text-xs text-psi-dark/60 mb-3">
                                                                    {formatTimeRange(eventDate.hourStart, eventDate.hourEnd)}
                                                                </div>
                                                            )}
                                                            <div className="space-y-2">
                                                                {eventDate.EventDateTicketTypePrices?.map((edttp: any) => {
                                                                    const ticketType = event.TicketTypes?.find(tt => tt.id === edttp.ticketTypeId)
                                                                    const qty = dayTypes[edttp.ticketTypeId] || 0
                                                                    const feeCents = TicketFeeUtils.calculateFeeInCents(edttp.price, event.isClientTaxed)
                                                                    const isLastTickets = isLastTicketsForDayAndType(eventDate.id, edttp.ticketTypeId)
                                                                    const maxQuantity = getMaxQuantity(eventDate.id, edttp.ticketTypeId, buyTicketsLimit)
                                                                    
                                                                    return (
                                                                        <div key={edttp.ticketTypeId} className="rounded-lg border border-psi-primary/20 bg-white p-3 space-y-2">
                                                                            <div className="flex items-center justify-between">
                                                                                <div className="flex-1">
                                                                                    <div className="flex items-center gap-2 mb-1">
                                                                                        <p className="text-sm font-medium text-psi-dark">{ticketType?.name || "Tipo desconhecido"}</p>
                                                                                    </div>
                                                                                    <p className="text-xs text-psi-primary font-semibold mt-1">
                                                                                        {event.isFree ? "Gratuito" : `${ValueUtils.formatPrice(edttp.price)} por ingresso`}
                                                                                    </p>
                                                                                    {!event.isFree && edttp.price > 0 && (
                                                                                        <p className="text-xs text-psi-dark/60">
                                                                                            + Taxa: {ValueUtils.centsToCurrency(feeCents)} por ingresso
                                                                                        </p>
                                                                                    )}
                                                                                    {qty > 0 && (
                                                                                        <p className="text-xs font-semibold text-psi-dark mt-1">
                                                                                            Subtotal: {ValueUtils.centsToCurrency((edttp.price + feeCents) * qty)}
                                                                                        </p>
                                                                                    )}
                                                                                </div>
                                                                                <QuantitySelector
                                                                                    value={qty}
                                                                                    onChange={(newQuantity) => {
                                                                                        if (newQuantity > maxQuantity) {
                                                                                            Toast.info("Não há mais ingressos disponíveis além dessa quantidade.")
                                                                                            newQuantity = maxQuantity
                                                                                        }
                                                                                        setSelectedDaysAndTypes(prev => {
                                                                                            const current = prev[eventDate.id] || {}
                                                                                            if (newQuantity === 0) {
                                                                                                const updated = { ...current }
                                                                                                delete updated[edttp.ticketTypeId]
                                                                                                if (Object.keys(updated).length === 0) {
                                                                                                    const newState = { ...prev }
                                                                                                    delete newState[eventDate.id]
                                                                                                    return newState
                                                                                                }
                                                                                                const result = {
                                                                                                    ...prev,
                                                                                                    [eventDate.id]: updated
                                                                                                }
                                                                                                return result
                                                                                            }
                                                                                            const result = {
                                                                                                ...prev,
                                                                                                [eventDate.id]: {
                                                                                                    ...current,
                                                                                                    [edttp.ticketTypeId]: newQuantity
                                                                                                }
                                                                                            }
                                                                                            return result
                                                                                        })
                                                                                    }}
                                                                                    max={maxQuantity}
                                                                                    min={0}
                                                                                />
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : batchHasTicketTypes && selectedBatch?.EventBatchTicketTypes ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium text-psi-dark">Selecione a quantidade por tipo</span>
                                            <span className="text-xs text-psi-dark/60">Máximo {buyTicketsLimit} por pessoa</span>
                                        </div>
                                        <div className="space-y-4">
                                            {selectedBatch.EventBatchTicketTypes.map((ebt) => {
                                                const ticketTypeName = ebt.TicketType?.name || "Tipo desconhecido"
                                                const ticketTypeDescription = ebt.TicketType?.description
                                                const qty = ticketTypeQuantities[ebt.ticketTypeId] || 0
                                                const selectedDaysForType = selectedDays[ebt.ticketTypeId] || []

                                                const getPriceForTicketTypeLocal = (eventDateId: string) => {
                                                    return CheckoutUtils.getPriceForTicketType(ebt, eventDateId, event)
                                                }
                                                
                                                const getTotalForType = () => {
                                                    return CheckoutUtils.calculateTotalForType(
                                                        ebt,
                                                        selectedDaysForType,
                                                        qty,
                                                        event,
                                                        event.isClientTaxed
                                                    )
                                                }
                                                
                                                const hasMixedDays = event?.EventDates && event.EventDates.some(ed => ed.hasSpecificPrice) && event.EventDates.some(ed => !ed.hasSpecificPrice)
                                                const displayPrice = CheckoutUtils.getDisplayPrice(
                                                    ebt,
                                                    selectedDaysForType,
                                                    event
                                                )
                                                
                                                return (
                                                    <div key={ebt.ticketTypeId} className="rounded-lg border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-3">
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <h4 className="font-semibold text-psi-dark">{ticketTypeName}</h4>
                                                                    {(() => {
                                                                        if (selectedDaysForType.length > 0) {
                                                                            const hasLastTickets = selectedDaysForType.some(dayId => 
                                                                                isLastTicketsForDayAndType(dayId, ebt.ticketTypeId)
                                                                            )
                                                                            if (hasLastTickets) {
                                                                                return (
                                                                                    <span className="px-2 py-0.5 animate-pulse bg-psi-dark/90 text-psi-light text-xs font-semibold rounded-full">
                                                                                        Últimos ingressos
                                                                                    </span>
                                                                                )
                                                                            }
                                                                        } else {
                                                                            const hasLastTicketsInAnyDay = event?.EventDates?.some(eventDate => 
                                                                                isLastTicketsForDayAndType(eventDate.id, ebt.ticketTypeId)
                                                                            )
                                                                            const hasLastTicketsForType = isLastTicketsForTicketType(ebt.ticketTypeId)
                                                                            if (hasLastTicketsInAnyDay || hasLastTicketsForType) {
                                                                                return (
                                                                                    <span className="px-2 py-0.5 animate-pulse bg-psi-dark/90 text-psi-light text-xs font-semibold rounded-full">
                                                                                        Últimos ingressos
                                                                                    </span>
                                                                                )
                                                                            }
                                                                        }
                                                                        return null
                                                                    })()}
                                                                </div>
                                                                {ticketTypeDescription && (
                                                                    <p className="text-xs text-psi-dark/60 mt-1">{ticketTypeDescription}</p>
                                                                )}
                                                                {hasMixedDays && selectedDaysForType.length === 0 ? (
                                                                    <div className="mt-2 space-y-1">
                                                                        <p className="text-sm font-medium text-psi-primary">
                                                                            Preço varia por dia
                                                                        </p>
                                                                        <p className="text-xs text-psi-dark/60">
                                                                            Selecione os dias para ver os preços
                                                                        </p>
                                                                    </div>
                                                                ) : (
                                                                    <div className="mt-2 space-y-1">
                                                                        {typeof displayPrice === "object" ? (
                                                                            <p className="text-sm font-medium text-psi-primary">
                                                                                {event.isFree ? "Gratuito" : `${ValueUtils.formatPrice(displayPrice.min)} - ${ValueUtils.formatPrice(displayPrice.max)} por ingresso`}
                                                                            </p>
                                                                        ) : (
                                                                            <p className="text-sm font-medium text-psi-primary">
                                                                                {event.isFree ? "Gratuito" : `${ValueUtils.formatPrice(displayPrice)} por ingresso`}
                                                                            </p>
                                                                        )}
                                                                        {!event.isFree && typeof displayPrice === "number" && displayPrice > 0 && (
                                                                            <p className="text-xs text-psi-dark/60">
                                                                                + Taxa: {ValueUtils.centsToCurrency(TicketFeeUtils.calculateFeeInCents(displayPrice, event.isClientTaxed))} por ingresso
                                                                            </p>
                                                                        )}
                                                                    </div>
                                                                )}
                                                                {event.EventDates && event.EventDates.length > 1 && hasMultipleDaysWithSpecificPrices && (
                                                                    <div className="mt-3 space-y-2">
                                                                        <p className="text-xs font-medium text-psi-dark/70">Selecione os dias:</p>
                                                                        {event.EventDates.map((eventDate) => {
                                                                            const isSelected = selectedDaysForType.includes(eventDate.id)
                                                                            const priceForThisDay = getPriceForTicketTypeLocal(eventDate.id)
                                                                            const feeCents = TicketFeeUtils.calculateFeeInCents(priceForThisDay, event.isClientTaxed)
                                                                            
                                                                            const isDaySelectedByOtherType = selectedBatch?.EventBatchTicketTypes?.some(otherEbt => 
                                                                                otherEbt.ticketTypeId !== ebt.ticketTypeId && 
                                                                                (selectedDays[otherEbt.ticketTypeId] || []).includes(eventDate.id)
                                                                            ) || false
                                                                            
                                                                            return (
                                                                                <div key={eventDate.id} className="flex items-center gap-3 rounded-lg border border-psi-primary/20 bg-white p-2">
                                                                                    <Checkbox
                                                                                        checked={isSelected}
                                                                                        disabled={isDaySelectedByOtherType && !isSelected}
                                                                                        onCheckedChange={(checked) => {
                                                                                            if (checked === true) {
                                                                                                setSelectedDays(prev => {
                                                                                                    const updated = { ...prev }
                                                                                                    selectedBatch?.EventBatchTicketTypes?.forEach(otherEbt => {
                                                                                                        if (otherEbt.ticketTypeId !== ebt.ticketTypeId) {
                                                                                                            const otherDays = updated[otherEbt.ticketTypeId] || []
                                                                                                            updated[otherEbt.ticketTypeId] = otherDays.filter(id => id !== eventDate.id)
                                                                                                        }
                                                                                                    })
                                                                                                    const current = updated[ebt.ticketTypeId] || []
                                                                                                    return {
                                                                                                        ...updated,
                                                                                                        [ebt.ticketTypeId]: [...current, eventDate.id]
                                                                                                    }
                                                                                                })
                                                                                            } else {
                                                                                                setSelectedDays(prev => {
                                                                                                    return {
                                                                                                        ...prev,
                                                                                                        [ebt.ticketTypeId]: (prev[ebt.ticketTypeId] || []).filter(id => id !== eventDate.id)
                                                                                                    }
                                                                                                })
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <div className="flex-1">
                                                                                        <div className="flex items-center gap-2">
                                                                                            <div className="text-sm font-medium text-psi-dark">
                                                                                                {formatDate(eventDate.date)}
                                                                                            </div>
                                                                                            {isLastTicketsForDayAndType(eventDate.id, ebt.ticketTypeId) && (
                                                                                                <span className="px-2 py-0.5 animate-pulse bg-psi-dark/90 text-psi-light text-xs font-semibold rounded-full">
                                                                                                    Últimos ingressos
                                                                                                </span>
                                                                                            )}
                                                                                        </div>
                                                                                        {eventDate.hourStart && (
                                                                                            <div className="text-xs text-psi-dark/60">
                                                                                                {formatTimeRange(eventDate.hourStart, eventDate.hourEnd)}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                    <div className="text-right">
                                                                                        <div className="text-sm font-semibold text-psi-primary">
                                                                                            {ValueUtils.formatPrice(priceForThisDay)}
                                                                                        </div>
                                                                                        {priceForThisDay > 0 && (
                                                                                            <div className="text-xs text-psi-dark/60">
                                                                                                + {ValueUtils.centsToCurrency(feeCents)} taxa
                                                                                            </div>
                                                                                        )}
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
                                                                const maxQuantity = selectedDaysForType.length > 0
                                                                    ? Math.min(...selectedDaysForType.map(dayId => 
                                                                        getMaxQuantity(dayId, ebt.ticketTypeId, buyTicketsLimit)
                                                                    ))
                                                                    : getMaxQuantity(null, ebt.ticketTypeId, buyTicketsLimit)
                                                                
                                                                if (newQuantity > maxQuantity) {
                                                                    Toast.info("Não há mais ingressos disponíveis além dessa quantidade.")
                                                                    newQuantity = maxQuantity
                                                                }
                                                                
                                                                setTicketTypeQuantities(prev => ({
                                                                    ...prev,
                                                                    [ebt.ticketTypeId]: newQuantity
                                                                }))
                                                            }}
                                                            max={selectedDaysForType.length > 0
                                                                ? Math.min(...selectedDaysForType.map(dayId => 
                                                                    getMaxQuantity(dayId, ebt.ticketTypeId, buyTicketsLimit)
                                                                ))
                                                                : getMaxQuantity(null, ebt.ticketTypeId, buyTicketsLimit)
                                                            }
                                                            min={0}
                                                            // disabled={event.EventDates && event.EventDates.length > 1 && selectedDaysForType.length === 0}
                                                        />
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {hasMultipleDaysWithSpecificPrices ? (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-psi-dark">Selecione os dias e quantidades</span>
                                                    <span className="text-xs text-psi-dark/60">Máximo {buyTicketsLimit} por pessoa</span>
                                                </div>
                                                {event.EventDates && event.EventDates.filter(ed => ed.hasSpecificPrice).map((eventDate) => {
                                                    const isSelected = selectedDaysWithoutTicketTypes.includes(eventDate.id)
                                                    const qty = dayQuantities[eventDate.id] || 0
                                                    const price = eventDate.price || 0
                                                    const feeCents = TicketFeeUtils.calculateFeeInCents(price, event.isClientTaxed)
                                                    
                                                    return (
                                                        <div key={eventDate.id} className="rounded-lg border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-3">
                                                            <div className="flex items-start justify-between">
                                                                <div className="flex-1">
                                                                    <div className="flex items-center gap-2 mb-2">
                                                                        <Checkbox
                                                                            checked={isSelected}
                                                                            onCheckedChange={(checked) => {
                                                                                if (checked === true) {
                                                                                    setSelectedDaysWithoutTicketTypes(prev => [...prev, eventDate.id])
                                                                                    setDayQuantities(prev => ({ ...prev, [eventDate.id]: 0 }))
                                                                                } else {
                                                                                    setSelectedDaysWithoutTicketTypes(prev => prev.filter(id => id !== eventDate.id))
                                                                                    setDayQuantities(prev => {
                                                                                        const newQuantities = { ...prev }
                                                                                        delete newQuantities[eventDate.id]
                                                                                        return newQuantities
                                                                                    })
                                                                                }
                                                                            }}
                                                                        />
                                                                        <div className="flex-1">
                                                                            <div className="flex items-center gap-2">
                                                                                <div className="text-sm font-medium text-psi-dark">
                                                                                    {formatDate(eventDate.date)}
                                                                                </div>
                                                                                {isLastTicketsForDay(eventDate.id) && (
                                                                                    <span className="px-2 py-0.5 animate-pulse bg-psi-dark/90 text-psi-light text-xs font-semibold rounded-full">
                                                                                        Últimos ingressos
                                                                                    </span>
                                                                                )}
                                                                            </div>
                                                                            {eventDate.hourStart && (
                                                                                <div className="text-xs text-psi-dark/60">
                                                                                    {formatTimeRange(eventDate.hourStart, eventDate.hourEnd)}
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    </div>
                                                                    {isSelected && (
                                                                        <div className="mt-2 space-y-1">
                                                                            <p className="text-sm font-medium text-psi-primary">
                                                                                {event.isFree ? "Gratuito" : `${ValueUtils.formatPrice(price)} por ingresso`}
                                                                            </p>
                                                                            {!event.isFree && price > 0 && (
                                                                                <p className="text-xs text-psi-dark/60">
                                                                                    + Taxa: {ValueUtils.centsToCurrency(feeCents)} por ingresso
                                                                                </p>
                                                                            )}
                                                                            {qty > 0 && (
                                                                                <p className="text-sm font-semibold text-psi-dark mt-2">
                                                                                    Subtotal: {ValueUtils.centsToCurrency((price + feeCents) * qty)}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                            {isSelected && (
                                                                <QuantitySelector
                                                                    value={qty}
                                                                    onChange={(newQuantity) => {
                                                                        const maxQuantity = getMaxQuantity(eventDate.id, null, buyTicketsLimit)
                                                                        if (newQuantity > maxQuantity) {
                                                                            Toast.info("Não há mais ingressos disponíveis além dessa quantidade.")
                                                                            newQuantity = maxQuantity
                                                                        }
                                                                        setDayQuantities(prev => ({
                                                                            ...prev,
                                                                            [eventDate.id]: newQuantity
                                                                        }))
                                                                    }}
                                                                    max={getMaxQuantity(eventDate.id, null, buyTicketsLimit)}
                                                                    min={0}
                                                                />
                                                            )}
                                                        </div>
                                                    )
                                                })}
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-sm font-medium text-psi-dark">Quantidade</span>
                                                        {isLastTicketsForEvent() && (
                                                            <span className="px-2 py-0.5 animate-pulse bg-psi-dark/90 text-psi-light text-xs font-semibold rounded-full">
                                                                Últimos ingressos
                                                            </span>
                                                        )}
                                                    </div>
                                                    <span className="text-xs text-psi-dark/60">Máximo {buyTicketsLimit} por pessoa</span>
                                                </div>
                                                <QuantitySelector
                                                    value={currentQuantity}
                                                    onChange={(newQuantity) => {
                                                        const maxQuantity = getMaxQuantity(null, null, buyTicketsLimit)
                                                        if (newQuantity > maxQuantity) {
                                                            Toast.info("Não há mais ingressos disponíveis além dessa quantidade.")
                                                            newQuantity = maxQuantity
                                                        }
                                                        setQuantity(newQuantity)
                                                        if (cartItem) {
                                                            addItem({
                                                                eventId: event.id,
                                                                eventName: event.name,
                                                                eventImage: event.image,
                                                                batchId: selectedBatchId,
                                                                batchName: selectedBatch?.name,
                                                                price: currentPrice,
                                                                isClientTaxed: event.isClientTaxed,
                                                                isFree: event.isFree
                                                            }, newQuantity)
                                                        }
                                                    }}
                                                    max={getMaxQuantity(null, null, buyTicketsLimit)}
                                                    min={0}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="pt-4 border-t border-psi-dark/10">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-sm text-psi-dark/70">Total</span>
                                        <span 
                                            key={totalAnimationKey}
                                            className={`text-2xl font-bold text-psi-primary ${totalAnimationKey > 0 ? 'total-animate' : ''}`}
                                        >
                                            {ValueUtils.centsToCurrency(totalValue)}
                                        </span>
                                    </div>
                                    <Button
                                        size="lg"
                                        variant="primary"
                                        className="w-full"
                                        onClick={handleAddToCart}
                                        disabled={
                                            (batchHasTicketTypes && totalQuantity === 0) || 
                                            (hasMultipleDaysWithSpecificPrices && totalQuantity === 0) ||
                                            (hasMultipleDaysWithTicketTypePrices && totalQuantity === 0) ||
                                            isLoadingCheckoutPage
                                        }
                                    >
                                        {
                                            isLoadingCheckoutPage ? (
                                                <LoadingButton />
                                            ) : (
                                                <>
                                                <span>Comprar</span>
                                                </>
                                            )
                                        }
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
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium text-psi-dark">Taxas Reduzidas</p>
                                                <DialogTaxes
                                                    isClientView={true}
                                                    trigger={
                                                        <button
                                                            type="button"
                                                            className="text-xs text-psi-primary hover:text-psi-primary/80 underline"
                                                        >
                                                            Entenda nossas taxas
                                                        </button>
                                                    }
                                                />
                                            </div>
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
        </>
    )
}

export {
    VerEventoInfo
}
