"use client"

import { useState, useRef, useEffect } from "react"
import { Clock, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

type TTimePickerProps = {
    value?: string | null
    onChange: (value: string | null) => void
    className?: string
    required?: boolean
    icon?: boolean
    disabled?: boolean
}

const TimePicker = (
    {
        value,
        onChange,
        className,
        required = false,
        icon = true,
        disabled = false
    }: TTimePickerProps
) => {
    const [isOpen, setIsOpen] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false)
    const [hours, setHours] = useState("00")
    const [minutes, setMinutes] = useState("00")
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (value) {
            const [h, m] = value.split(":")
            setHours(h || "00")
            setMinutes(m || "00")
        } else {
            setHours("00")
            setMinutes("00")
        }
    }, [value])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsAnimating(false)
                setTimeout(() => setIsOpen(false), 200)
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside)
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [isOpen])

    const handleTimeChange = (newHours: string, newMinutes: string) => {
        setHours(newHours)
        setMinutes(newMinutes)
        onChange(`${newHours}:${newMinutes}`)
    }

    const incrementHours = () => {
        const newHours = String((parseInt(hours) + 1) % 24).padStart(2, "0")
        handleTimeChange(newHours, minutes)
    }

    const decrementHours = () => {
        const newHours = String((parseInt(hours) - 1 + 24) % 24).padStart(2, "0")
        handleTimeChange(newHours, minutes)
    }

    const incrementMinutes = () => {
        const currentMinutes = parseInt(minutes)
        const newMinutes = ((currentMinutes + 5) % 60)
        handleTimeChange(hours, String(newMinutes).padStart(2, "0"))
    }

    const decrementMinutes = () => {
        const currentMinutes = parseInt(minutes)
        const newMinutes = ((currentMinutes - 5 + 60) % 60)
        handleTimeChange(hours, String(newMinutes).padStart(2, "0"))
    }

    const formatDisplay = () => {
        if (!value) return "Selecione o horário"
        return `${hours}:${minutes}`
    }

    return (
        <div ref={containerRef} className={cn("relative", className)}>
            <button
                type="button"
                onClick={() => {
                    if (disabled) return
                    if (!isOpen) {
                        setIsAnimating(true)
                        setIsOpen(true)
                    } else {
                        setIsAnimating(false)
                        setTimeout(() => setIsOpen(false), 200)
                    }
                }}
                disabled={disabled}
                className={cn(
                    "w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-xs transition-all outline-none",
                    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
                    "hover:border-psi-primary/50",
                    icon && "pl-10",
                    !value && "text-muted-foreground",
                    disabled && "opacity-50 cursor-not-allowed hover:border-input"
                )}
            >
                {icon && (
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                )}
                <span className={cn("text-sm", !value && "text-muted-foreground")}>
                    {formatDisplay()}
                </span>
            </button>

            {isOpen && (
                <div className={cn(
                    "relative z-50 mt-2 w-full rounded-xl border border-[#E4E6F0] bg-white shadow-lg shadow-black/10 p-4",
                    "transition-all duration-200 ease-out",
                    isAnimating 
                        ? "animate-in fade-in-0 zoom-in-95 slide-in-from-top-2" 
                        : "animate-out fade-out-0 zoom-out-95 slide-out-to-top-2"
                )}>
                    <div className="flex items-center justify-center gap-4">
                        <div className="flex flex-col items-center gap-2">
                            <button
                                type="button"
                                onClick={incrementHours}
                                className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                            >
                                <ChevronUp className="h-4 w-4 text-psi-primary" />
                            </button>
                            <div className="text-3xl font-bold text-psi-dark min-w-[60px] text-center">
                                {hours}
                            </div>
                            <button
                                type="button"
                                onClick={decrementHours}
                                className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                            >
                                <ChevronDown className="h-4 w-4 text-psi-primary" />
                            </button>
                            <span className="text-xs text-psi-dark/60">Horas</span>
                        </div>

                        <div className="text-2xl font-bold text-psi-primary">:</div>

                        <div className="flex flex-col items-center gap-2">
                            <button
                                type="button"
                                onClick={incrementMinutes}
                                className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                            >
                                <ChevronUp className="h-4 w-4 text-psi-primary" />
                            </button>
                            <div className="text-3xl font-bold text-psi-dark min-w-[60px] text-center">
                                {minutes}
                            </div>
                            <button
                                type="button"
                                onClick={decrementMinutes}
                                className="p-2 rounded-lg hover:bg-[#F3F4FB] transition-colors"
                            >
                                <ChevronDown className="h-4 w-4 text-psi-primary" />
                            </button>
                            <span className="text-xs text-psi-dark/60">Minutos</span>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-[#E4E6F0] flex gap-2">
                        {!required && (
                            <button
                                type="button"
                                onClick={() => {
                                    onChange(null)
                                    setIsAnimating(false)
                                    setTimeout(() => setIsOpen(false), 200)
                                }}
                                className="flex-1 px-3 py-2 text-sm text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-lg transition-colors"
                            >
                                Limpar
                            </button>
                        )}
                        <button
                            type="button"
                            onClick={() => {
                                onChange(`${hours}:${minutes}`)
                                setIsAnimating(false)
                                setTimeout(() => setIsOpen(false), 200)
                            }}
                            className={cn(
                                "px-3 py-2 text-sm bg-psi-primary text-white rounded-lg hover:bg-psi-primary/90 transition-colors",
                                !required ? "flex-1" : "w-full"
                            )}
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export {
    TimePicker
}

