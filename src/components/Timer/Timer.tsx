"use client"

import { useEffect, useState } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const timerVariants = cva(
    "font-mono font-semibold transition-all",
    {
        variants: {
            variant: {
                default: "text-foreground",
                badge: "inline-flex items-center justify-center px-3 py-1 rounded-full bg-muted text-muted-foreground border border-border shadow-xs",
                highlight: "inline-flex items-center justify-center px-3 py-1 rounded-md bg-psi-primary/10 text-psi-primary border border-psi-primary/20 shadow-xs",
                minimal: "text-muted-foreground"
            },
            size: {
                default: "text-sm",
                sm: "text-xs",
                lg: "text-base",
                xl: "text-lg"
            }
        },
        defaultVariants: {
            variant: "default",
            size: "default"
        }
    }
)

type TTimerProps = {
    seconds: number
    onFinish?: () => void
    variant?: VariantProps<typeof timerVariants>["variant"]
    size?: VariantProps<typeof timerVariants>["size"]
    className?: string
}

const Timer = (
    {
        seconds,
        onFinish,
        variant = "default",
        size = "default",
        className
    }: TTimerProps
) => {
    const [timeLeft, setTimeLeft] = useState(seconds)

    useEffect(() => {
        setTimeLeft(seconds)
    }, [seconds])

    useEffect(() => {
        if (timeLeft <= 0) {
            onFinish?.()
            return
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    onFinish?.()
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft, onFinish])

    const formatTime = (totalSeconds: number) => {
        const mins = Math.floor(totalSeconds / 60)
        const secs = totalSeconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    return (
        <span className={cn(timerVariants({ variant, size }), className)}>
            {formatTime(timeLeft)}
        </span>
    )
}

export {
    Timer
}
