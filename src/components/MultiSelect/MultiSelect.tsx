"use client"

import { useState, useRef, useEffect } from "react"
import { Check, ChevronDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

type TMultiSelectOption = {
    value: string
    label: string
}

type TMultiSelectProps = {
    options: TMultiSelectOption[]
    value: string[]
    onChange: (value: string[]) => void
    placeholder?: string
    maxSelections?: number
    minSelections?: number
    className?: string
    disabled?: boolean
    required?: boolean
}

const MultiSelect = ({
    options,
    value = [],
    onChange,
    placeholder = "Selecione...",
    maxSelections,
    minSelections,
    className,
    disabled = false,
    required = false
}: TMultiSelectProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)

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

    const toggleOption = (optionValue: string) => {
        if (disabled) return

        const isSelected = value.includes(optionValue)
        let newValue: string[]

        if (isSelected) {
            if (minSelections && value.length <= minSelections) {
                return
            }
            newValue = value.filter(v => v !== optionValue)
        } else {
            if (maxSelections && value.length >= maxSelections) {
                return
            }
            newValue = [...value, optionValue]
        }

        onChange(newValue)
    }

    const removeOption = (optionValue: string, e: React.MouseEvent) => {
        e.stopPropagation()
        if (disabled) return
        if (minSelections && value.length <= minSelections) return

        const newValue = value.filter(v => v !== optionValue)
        onChange(newValue)
    }

    const selectedOptions = options.filter(opt => value.includes(opt.value))
    const displayText = selectedOptions.length > 0
        ? selectedOptions.map(opt => opt.label).join(", ")
        : placeholder

    return (
        <div ref={containerRef} className={cn("relative w-full", className)}>
            <Button
                type="button"
                variant="outline"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={cn(
                    "w-full justify-between h-9 px-3 text-left font-normal",
                    !value.length && "text-muted-foreground",
                    isOpen && "ring-2 ring-ring ring-offset-2"
                )}
            >
                <span className="truncate flex-1 text-left">
                    {displayText}
                </span>
                <div className="flex items-center gap-1 ml-2 shrink-0">
                    {value.length > 0 && (
                        <span className="text-xs text-muted-foreground">
                            ({value.length}{maxSelections ? `/${maxSelections}` : ""})
                        </span>
                    )}
                    <ChevronDown className={cn(
                        "h-4 w-4 opacity-50 transition-transform",
                        isOpen && "transform rotate-180"
                    )} />
                </div>
            </Button>

            {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-[#E4E6F0] rounded-md shadow-lg shadow-black/5 overflow-hidden">
                    <div className="max-h-60 overflow-y-auto p-1">
                        {options.map((option) => {
                            const isSelected = value.includes(option.value)
                            const isDisabled = maxSelections
                                ? !isSelected && value.length >= maxSelections
                                : false

                            return (
                                <div
                                    key={option.value}
                                    onClick={() => toggleOption(option.value)}
                                    className={cn(
                                        "relative flex items-center gap-2 px-2 py-1.5 rounded-sm cursor-pointer transition-colors",
                                        isSelected && "bg-psi-primary/10",
                                        isDisabled && "opacity-50 cursor-not-allowed",
                                        !isDisabled && !isSelected && "hover:bg-accent"
                                    )}
                                >
                                    <div className={cn(
                                        "flex items-center justify-center w-4 h-4 rounded border-2 transition-colors",
                                        isSelected
                                            ? "bg-psi-primary border-psi-primary"
                                            : "border-input"
                                    )}>
                                        {isSelected && (
                                            <Check className="h-3 w-3 text-white" />
                                        )}
                                    </div>
                                    <span className={cn(
                                        "text-sm flex-1",
                                        isSelected && "font-medium text-psi-primary"
                                    )}>
                                        {option.label}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}

            {value.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {selectedOptions.map((option) => (
                        <div
                            key={option.value}
                            className="inline-flex items-center gap-1.5 px-2 py-1 bg-psi-primary/10 text-psi-primary rounded-md text-xs font-medium"
                        >
                            <span>{option.label}</span>
                            {!disabled && (!minSelections || value.length > minSelections) && (
                                <button
                                    type="button"
                                    onClick={(e) => removeOption(option.value, e)}
                                    className="hover:bg-psi-primary/20 rounded-full p-0.5 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export { MultiSelect }
export type { TMultiSelectOption, TMultiSelectProps }

