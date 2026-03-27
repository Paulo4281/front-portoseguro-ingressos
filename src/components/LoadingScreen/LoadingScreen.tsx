"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"

const SLOW_THRESHOLD_MS = 5000

const LoadingScreen = () => {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [displayLoading, setDisplayLoading] = useState(false)
    const [isSlow, setIsSlow] = useState(false)
    const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const clearSlowTimer = () => {
        if (slowTimerRef.current) {
            clearTimeout(slowTimerRef.current)
            slowTimerRef.current = null
        }
    }

    useEffect(() => {
        const handleStart = () => {
            setIsLoading(true)
            setDisplayLoading(true)
            setIsSlow(false)
            clearSlowTimer()
            slowTimerRef.current = setTimeout(() => setIsSlow(true), SLOW_THRESHOLD_MS)
        }

        const handleComplete = () => {
            setIsLoading(false)
            setIsSlow(false)
            clearSlowTimer()
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
            clearSlowTimer()
        }
    }, [pathname, searchParams])

    useEffect(() => {
        if (typeof window === "undefined" || typeof document === "undefined") return

        const handleClick = (e: MouseEvent) => {
            const link = (e.target as HTMLElement).closest("a")
            if (!link?.href || link.href.startsWith("#") || link.hasAttribute("download")) return
            if (link.target === "_blank" || e.ctrlKey || e.metaKey || e.button === 1) return
            try {
                const url = new URL(link.href)
                if (url.origin === window.location.origin) {
                    setIsLoading(true)
                    setDisplayLoading(true)
                    setIsSlow(false)
                    clearSlowTimer()
                    slowTimerRef.current = setTimeout(() => setIsSlow(true), SLOW_THRESHOLD_MS)
                }
            } catch {
                // href inválido
            }
        }

        document.addEventListener("click", handleClick)
        return () => {
            document.removeEventListener("click", handleClick)
        }
    }, [])

    useEffect(() => {
        return () => {
            clearSlowTimer()
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

                <div
                    className={`flex flex-col items-center gap-3 transition-all duration-500 ${
                        isSlow ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none"
                    }`}
                >
                    <p className="text-sm text-psi-dark/60 text-center">
                        Está demorando mais que o normal...
                    </p>
                    <div className="flex gap-2">
                        <Link
                            href="/"
                            className="inline-flex items-center justify-center rounded-xl border border-psi-primary/30 bg-white px-4 py-2 text-sm font-medium text-psi-primary shadow-sm transition-colors hover:bg-psi-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-psi-primary"
                        >
                            Ir para home
                        </Link>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="inline-flex items-center justify-center rounded-xl border border-psi-primary/30 bg-white px-4 py-2 text-sm font-medium text-psi-primary shadow-sm transition-colors hover:bg-psi-primary/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-psi-primary"
                        >
                            Recarregar página
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export {
    LoadingScreen
}
