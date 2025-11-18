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
        maxDate
    }: TDatePickerProps
) => {
    const [isOpen, setIsOpen] = useState(false)
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
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
        if (isDateDisabled(day)) return

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
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-all outline-none",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "hover:border-psi-primary/50",
                    icon && "pl-10",
                    !value && "text-muted-foreground"
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
                <div className="absolute z-50 mt-2 w-[320px] rounded-xl border border-[#E4E6F0] bg-white shadow-lg shadow-black/10 p-4">
                    <div className="flex items-center justify-between mb-4">
                        <button
                            type="button"
                            onClick={goToPreviousMonth}
                            className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                        >
                            <ChevronLeft className="h-4 w-4 text-psi-primary" />
                        </button>
                        <div className="font-semibold text-psi-dark">
                            {currentMonthName} {currentYear}
                        </div>
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

                    <div className="mt-4 pt-4 border-t border-[#E4E6F0] flex gap-2">
                        {!required && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null)
                                    setSelectedDate(null)
                                    setIsOpen(false)
                                }}
                                className="flex-1 px-3 py-2 text-sm text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-lg transition-colors"
                            >
                                Limpar
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => setIsOpen(false)}
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

