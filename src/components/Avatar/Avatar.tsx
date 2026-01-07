"use client"

import { useRef, useState } from "react"
import { Avatar as AvatarComponent, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Camera } from "lucide-react"
import { cn } from "@/lib/utils"

type TAvatarProps = {
    src?: string | null
    name: string
    className?: string
    size?: "sm" | "md" | "lg"
    onChange?: (file: File | null) => void
    editable?: boolean
    accept?: string
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
        size = "md",
        onChange,
        editable = false,
        accept = "image/*"
    }: TAvatarProps
) => {
    const [isHovered, setIsHovered] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const getInitials = (fullName: string) => {
        const names = fullName.trim().split(" ")
        if (names.length === 1) {
            return names[0].charAt(0).toUpperCase()
        }
        return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file && file.type.startsWith("image/")) {
            onChange?.(file)
        }
    }

    const handleClick = () => {
        if (editable || onChange) {
            fileInputRef.current?.click()
        }
    }

    const initials = getInitials(name)
    const isEditable = editable || !!onChange

    return (
        <div
            className={cn("relative inline-block", isEditable && "cursor-pointer")}
            onMouseEnter={() => isEditable && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleClick}
        >
            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
            />
            <AvatarComponent className={cn(sizeClasses[size], className)}>
                {src && (
                    <AvatarImage src={src} alt={name} className="object-cover" />
                )}
                <AvatarFallback className={cn(
                    "bg-psi-primary text-white font-medium",
                    textSizeClasses[size]
                )}>
                    {initials}
                </AvatarFallback>
            </AvatarComponent>
            {isEditable && isHovered && (
                <div className={cn(
                    "absolute inset-0 rounded-full bg-black/50 flex items-center justify-center transition-opacity z-10",
                    sizeClasses[size]
                )}>
                    <Camera className={cn(
                        "text-white",
                        size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"
                    )} />
                </div>
            )}
        </div>
    )
}

export {
    Avatar
}

