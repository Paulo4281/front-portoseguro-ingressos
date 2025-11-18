"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TQuantitySelectorProps = {
    value: number
    onChange: (value: number) => void
    min?: number
    max?: number
    className?: string
    disabled?: boolean
}

const QuantitySelector = (
    {
        value,
        onChange,
        min = 1,
        max = 10,
        className,
        disabled = false
    }: TQuantitySelectorProps
) => {
    const handleDecrement = () => {
        if (value > min) {
            onChange(value - 1)
        }
    }

    const handleIncrement = () => {
        if (value < max) {
            onChange(value + 1)
        }
    }

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={disabled || value <= min}
                className="h-9 w-9 shrink-0"
            >
                <Minus className="h-4 w-4" />
            </Button>
            
            <span className="w-12 text-center font-semibold text-psi-dark text-lg">
                {value}
            </span>
            
            <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={disabled || value >= max}
                className="h-9 w-9 shrink-0"
            >
                <Plus className="h-4 w-4" />
            </Button>
        </div>
    )
}

export {
    QuantitySelector
}

