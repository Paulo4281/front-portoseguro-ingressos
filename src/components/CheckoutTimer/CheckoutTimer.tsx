"use client"

import { useEffect, useState } from "react"
import { Clock, AlertCircle } from "lucide-react"
import { Timer } from "@/components/Timer/Timer"

type TCheckoutTimerProps = {
    expiresAt: string | null
    onExpire: () => void
}

const CheckoutTimer = ({ expiresAt, onExpire }: TCheckoutTimerProps) => {
    const [secondsLeft, setSecondsLeft] = useState<number | null>(null)
    const [isExpired, setIsExpired] = useState(false)

    useEffect(() => {
        if (!expiresAt) {
            setSecondsLeft(null)
            return
        }

        const updateTimer = () => {
            const now = new Date().getTime()
            const expiry = new Date(expiresAt).getTime()
            const diff = Math.floor((expiry - now) / 1000)

            if (diff <= 0) {
                setSecondsLeft(0)
                setIsExpired(true)
                onExpire()
                return
            }

            setSecondsLeft(diff)
            setIsExpired(false)
        }

        updateTimer()
        const interval = setInterval(updateTimer, 1000)

        return () => clearInterval(interval)
    }, [expiresAt, onExpire])

    if (!expiresAt || secondsLeft === null) {
        return null
    }

    if (isExpired) {
        return (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 flex items-center gap-3">
                <AlertCircle className="size-5 text-amber-600 shrink-0" />
                <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900">
                        Tempo esgotado
                    </p>
                    <p className="text-xs text-amber-700">
                        Os ingressos foram liberados novamente. Não garantimos mais a disponibilidade.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 flex items-center gap-3">
            <Clock className="size-5 text-psi-primary shrink-0" />
            <div className="flex-1">
                <p className="text-sm font-semibold text-psi-dark">
                    Seus ingressos estão reservados
                </p>
                <p className="text-sm text-psi-dark/70">
                    Tempo restante: <Timer seconds={secondsLeft} variant="highlight" size="sm" />
                </p>
            </div>
        </div>
    )
}

export {
    CheckoutTimer
}