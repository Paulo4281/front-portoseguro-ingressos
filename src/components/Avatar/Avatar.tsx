"use client"

import { Avatar as AvatarComponent, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

type TAvatarProps = {
    src?: string | null
    name: string
    className?: string
    size?: "sm" | "md" | "lg"
}

const sizeClasses = {
    sm: "size-8",
    md: "size-10",
    lg: "size-16"
}

const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-lg"
}

const Avatar = (
    {
        src,
        name,
        className,
        size = "md"
    }: TAvatarProps
) => {
    const getInitials = (fullName: string) => {
        const names = fullName.trim().split(" ")
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase()
        }
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }

    const initials = getInitials(name)

    return (
        <AvatarComponent className={cn(sizeClasses[size], className)}>
            {src && (
                <AvatarImage src={src} alt={name} />
            )}
            <AvatarFallback className={cn(
                "bg-psi-primary text-white font-semibold",
                textSizeClasses[size]
            )}>
                {initials}
            </AvatarFallback>
        </AvatarComponent>
    )
}

export {
    Avatar
}

