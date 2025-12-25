"use client"

import { useEffect, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Image from "next/image"

const LoadingScreen = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [displayLoading, setDisplayLoading] = useState(false)

    useEffect(() => {
        const handleStart = () => {
            setIsLoading(true)
            setDisplayLoading(true)
        }

        const handleComplete = () => {
            setIsLoading(false)
            setTimeout(() => {
                setDisplayLoading(false)
            }, 300)
        }

        handleStart()

        const timer = setTimeout(() => {
            handleComplete()
        }, 300)

        return () => {
            clearTimeout(timer)
        }
    }, [pathname, searchParams])

    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") return
        
        const handleClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const link = target.closest("a")
            
            if (link && link.href && !link.href.startsWith("#") && !link.hasAttribute("download")) {
                const url = new URL(link.href)
                if (url.origin === window.location.origin) {
                    setIsLoading(true)
                    setDisplayLoading(true)
                }
            }
        }

        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    if (!displayLoading) return null

    return (
        <div
            className={`fixed inset-0 bg-white flex items-center justify-center transition-opacity duration-300 ${
                isLoading ? "opacity-100" : "opacity-0"
            }`}
            style={{ 
                pointerEvents: isLoading ? "auto" : "none",
                zIndex: 9999
            }}
        >
            <div className="flex flex-col items-center gap-6">
                <div className="relative">
                    <Image
                        src="/images/logos/logo-porto-seguro-ingressos-primary.png"
                        alt="Porto Seguro Ingressos"
                        width={200}
                        height={80}
                        className="object-contain animate-pulse"
                        priority
                    />
                </div>
            </div>
        </div>
    )
}

export {
    LoadingScreen
}
