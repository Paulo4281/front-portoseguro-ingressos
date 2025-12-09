import * as React from "react"
import { cn } from "@/lib/utils"

const Alert = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        variant?: "default" | "info" | "warning" | "destructive"
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
        default: "bg-white border-psi-dark/10",
        info: "bg-blue-50 border-blue-200",
        warning: "bg-amber-50 border-amber-200",
        destructive: "bg-red-50 border-red-200"
    }

    return (
        <div
            ref={ref}
            className={cn(
                "rounded-lg border p-4",
                variantClasses[variant],
                className
            )}
            {...props}
        />
    )
})
Alert.displayName = "Alert"

const AlertDescription = React.forwardRef<
    HTMLParagraphElement,
    React.HTMLAttributes<HTMLParagraphElement> & {
        variant?: "default" | "info" | "warning" | "destructive"
    }
>(({ className, variant = "default", ...props }, ref) => {
    const variantClasses = {
        default: "text-psi-dark/70",
        info: "text-blue-800",
        warning: "text-amber-800",
        destructive: "text-red-800"
    }

    return (
        <p
            ref={ref}
            className={cn("text-sm", variantClasses[variant], className)}
            {...props}
        />
    )
})
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertDescription }

