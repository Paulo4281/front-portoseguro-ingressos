"use client"

import { useState, useRef, useEffect } from "react"
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type TDatePickerProps = {
    value?: string | null
    onChange: (value: string | null) => void
    className?: string
    required?: boolean
    icon?: boolean
    minDate?: string
    maxDate?: string
    disabled?: boolean
    absoluteClassName?: boolean
}

const monthNames = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
]

const weekDayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

const DatePicker = (
    {
        value,
        onChange,
        className,
        required = false,
        icon = true,
        minDate,
        maxDate,
        disabled = false,
        absoluteClassName = false
    }: TDatePickerProps
) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [viewMode, setViewMode] = useState<"date" | "month" | "year">("date")
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (value && value.trim() !== "") {
            try {
                const date = new Date(value + "T00:00:00")
                if (!isNaN(date.getTime())) {
                    setSelectedDate(date)
                    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1))
                } else {
                    setSelectedDate(null)
                }
            } catch {
                setSelectedDate(null)
            }
        } else {
            setSelectedDate(null)
        }
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear()
        const month = date.getMonth()
        const firstDay = new Date(year, month, 1)
        const lastDay = new Date(year, month + 1, 0)
        const daysInMonth = lastDay.getDate()
        const startingDayOfWeek = firstDay.getDay()

        const days: (number | null)[] = []
        
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null)
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i)
        }

        return days
    }

    const isDateDisabled = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        const dateString = date.toISOString().split("T")[0]

        if (minDate && dateString < minDate) return true
        if (maxDate && dateString > maxDate) return true

        return false
    }

    const isDateSelected = (day: number) => {
        if (!selectedDate) return false
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear()
        )
    }

    const handleDateSelect = (day: number) => {
        if (disabled || isDateDisabled(day)) return

        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
        const dateString = date.toISOString().split("T")[0]
        setSelectedDate(date)
        onChange(dateString)
        setIsOpen(false)
    }

    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
    }

    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
    }

    const goToPreviousYear = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear() - 1, currentMonth.getMonth(), 1))
    }

    const goToNextYear = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear() + 1, currentMonth.getMonth(), 1))
    }

    const handleMonthSelect = (month: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), month, 1))
        setViewMode("date")
    }

    const handleYearSelect = (year: number) => {
        setCurrentMonth(new Date(year, currentMonth.getMonth(), 1))
        setViewMode("month")
    }

    const getYearRange = () => {
        const currentYear = currentMonth.getFullYear()
        const startYear = currentYear - 10
        const endYear = currentYear + 10
        const years: number[] = []
        for (let i = startYear; i <= endYear; i++) {
            years.push(i)
        }
        return years
    }

    const formatDisplay = () => {
        if (!value || !selectedDate) return "Selecione a data"
        
        const day = selectedDate.getDate().toString().padStart(2, "0")
        const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0")
        const year = selectedDate.getFullYear()
        
        return `${day}/${month}/${year}`
    }

    const days = getDaysInMonth(currentMonth)
    const currentMonthName = monthNames[currentMonth.getMonth()]
    const currentYear = currentMonth.getFullYear()

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => {
                    if (disabled) return
                    setIsOpen(!isOpen)
                    setViewMode("date")
                }}
                disabled={disabled}
                className={cn(
                    "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-all outline-none",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "hover:border-psi-primary/50",
                    icon && "pl-10",
                    !value && "text-muted-foreground",
                    disabled && "opacity-50 cursor-not-allowed"
                )}
            >
                {icon && (
                    <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                )}
                <span className={cn("text-sm", !value && "text-muted-foreground")}>
                    {formatDisplay()}
                </span>
            </button>

            {isOpen && (
                <div className={cn(
                    `${ absoluteClassName ? "absolute" : "relative" } z-10 mt-2 w-[320px] rounded-xl border border-[#E4E6F0] bg-white shadow-lg shadow-black/10 p-4`,
                    "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200"
                )}>
                    {viewMode === "date" && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    onClick={goToPreviousMonth}
                                    className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4 text-psi-primary" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("month")}
                                    className="px-3 py-1 font-semibold text-psi-dark hover:bg-[#F3F4FB] rounded-lg transition-colors"
                                >
                                    {currentMonthName}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("year")}
                                    className="px-3 py-1 font-semibold text-psi-dark hover:bg-[#F3F4FB] rounded-lg transition-colors"
                                >
                                    {currentYear}
                                </button>
                                <button
                                    type="button"
                                    onClick={goToNextMonth}
                                    className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4 text-psi-primary" />
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-1 mb-2">
                                {weekDayNames.map((day) => (
                                    <div
                                        key={day}
                                        className="text-xs font-medium text-psi-dark/60 text-center py-1"
                                    >
                                        {day}
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {days.map((day, index) => {
                                    if (day === null) {
                                        return <div key={`empty-${index}`} className="h-9" />
                                    }

                                    const disabled = isDateDisabled(day)
                                    const selected = isDateSelected(day)

                                    return (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => handleDateSelect(day)}
                                            disabled={disabled}
                                            className={cn(
                                                "h-9 rounded-lg text-sm font-medium transition-colors",
                                                disabled
                                                    ? "text-psi-dark/20 cursor-not-allowed"
                                                    : selected
                                                    ? "bg-psi-primary text-white hover:bg-psi-primary/90"
                                                    : "text-psi-dark hover:bg-[#F3F4FB]"
                                            )}
                                        >
                                            {day}
                                        </button>
                                    )
                                })}
                            </div>
                        </>
                    )}

                    {viewMode === "month" && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    onClick={goToPreviousYear}
                                    className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4 text-psi-primary" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setViewMode("year")}
                                    className="px-3 py-1 font-semibold text-psi-dark hover:bg-[#F3F4FB] rounded-lg transition-colors"
                                >
                                    {currentYear}
                                </button>
                                <button
                                    type="button"
                                    onClick={goToNextYear}
                                    className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4 text-psi-primary" />
                                </button>
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                                {monthNames.map((month, index) => {
                                    const isCurrentMonth = index === currentMonth.getMonth()
                                    return (
                                        <button
                                            key={index}
                                            type="button"
                                            onClick={() => handleMonthSelect(index)}
                                            className={cn(
                                                "h-10 rounded-lg text-sm font-medium transition-colors",
                                                isCurrentMonth
                                                    ? "bg-psi-primary text-white hover:bg-psi-primary/90"
                                                    : "text-psi-dark hover:bg-[#F3F4FB]"
                                            )}
                                        >
                                            {month.substring(0, 3)}
                                        </button>
                                    )
                                })}
                            </div>
                        </>
                    )}

                    {viewMode === "year" && (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newYear = currentMonth.getFullYear() - 20
                                        setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1))
                                    }}
                                    className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                                >
                                    <ChevronLeft className="h-4 w-4 text-psi-primary" />
                                </button>
                                <div className="font-semibold text-psi-dark">
                                    {currentMonth.getFullYear() - 10} - {currentMonth.getFullYear() + 10}
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newYear = currentMonth.getFullYear() + 20
                                        setCurrentMonth(new Date(newYear, currentMonth.getMonth(), 1))
                                    }}
                                    className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                                >
                                    <ChevronRight className="h-4 w-4 text-psi-primary" />
                                </button>
                            </div>

                            <div className="grid grid-cols-4 gap-2 max-h-[240px] overflow-y-auto">
                                {getYearRange().map((year) => {
                                    const isCurrentYear = year === currentMonth.getFullYear()
                                    return (
                                        <button
                                            key={year}
                                            type="button"
                                            onClick={() => handleYearSelect(year)}
                                            className={cn(
                                                "h-10 rounded-lg text-sm font-medium transition-colors",
                                                isCurrentYear
                                                    ? "bg-psi-primary text-white hover:bg-psi-primary/90"
                                                    : "text-psi-dark hover:bg-[#F3F4FB]"
                                            )}
                                        >
                                            {year}
                                        </button>
                                    )
                                })}
                            </div>
                        </>
                    )}

                    <div className="mt-4 pt-4 border-t border-[#E4E6F0] flex gap-2">
                        {!required && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null)
                                    setSelectedDate(null)
                                    setIsOpen(false)
                                    setViewMode("date")
                                }}
                                className="flex-1 px-3 py-2 text-sm text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-lg transition-colors"
                            >
                                Limpar
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                setIsOpen(false)
                                setViewMode("date")
                            }}
                            className={cn(
                                "px-3 py-2 text-sm bg-psi-primary text-white rounded-lg hover:bg-psi-primary/90 transition-colors",
                                !required ? "flex-1" : "w-full"
                            )}
                        >
                            Fechar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export {
    DatePicker
}

