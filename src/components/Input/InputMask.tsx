"use client"

import { type ComponentType } from "react"
import { IMaskInput, IMaskInputProps } from "react-imask"
import { cn } from "@/lib/utils"

type TInputMaskProps = IMaskInputProps<any> & {
    icon?: ComponentType<{ className?: string }>
}

function InputMaskComponent(
    {
        className,
        icon: Icon,
        ...props
    }: TInputMaskProps
) {
    return (
        <div className="relative">
            {Icon && (
                <Icon className="absolute
                left-3
                top-1/2
                transform
                -translate-y-1/2
                size-4
                text-muted-foreground
                pointer-events-none" />
            )}
            <IMaskInput
                { ...props }
                className={cn(
                    "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    Icon && "pl-10",
                    className
                )}
            />
        </div>
    )
}

export {
    InputMaskComponent as InputMask
}