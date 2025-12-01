"use client"

import React, { useMemo } from "react"
import { Button } from "@/components/ui/button"
import { useWalletCurrent } from "@/hooks/Wallet/useWalletCurrent"
import { useWalletHistory } from "@/hooks/Wallet/useWalletHistory"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { ArrowUp, ArrowDown } from "lucide-react"
import { Background } from "@/components/Background/Background"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"

const CarteiraPannel = () => {
    const { data: walletData, isLoading: walletLoading } = useWalletCurrent()
    const { data: historyData, isLoading: historyLoading } = useWalletHistory()

    const balance = useMemo(() => {
        return walletData?.data?.value ?? 0
    }, [walletData])

    const history = useMemo(() => {
        return historyData?.data ?? []
    }, [historyData])

    return (
        <Background variant="hero" className="min-h-screen">
        <div className="space-y-6 container mt-[80px]">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-psi-primary
                        sm:text-4xl">Carteira</h1>
                        <p className="text-sm text-psi-dark/60">Saldo disponível para saque e movimentações</p>
                    </div>
            <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6 sm:p-8">
                <div className="
                lg:flex lg:items-start lg:justify-between
                ">
                    <div className="text-start">
                        <div className="text-xs text-psi-dark/60">Disponível</div>
                        <div className="mt-1 text-4xl font-extrabold text-psi-primary">
                            {walletLoading ? "—" : ValueUtils.centsToCurrency(balance)}
                        </div>
                        <hr className="my-4" />
                        <div className="mt-4">
                            <Button variant="primary" disabled={walletLoading || balance <= 0}>
                                Sacar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="rounded-2xl border border-[#E4E6F0] bg-white/95 backdrop-blur-md shadow-lg shadow-black/5 p-6 sm:p-8">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-psi-dark">Histórico</h3>
                    <p className="text-sm text-psi-dark/60">Últimas transações</p>
                </div>

                {historyLoading ? (
                    <p className="text-sm text-psi-dark/60">Carregando histórico...</p>
                ) : history.length === 0 ? (
                    <p className="text-sm text-psi-dark/60">Nenhuma transação encontrada.</p>
                ) : (
                    <ul className="space-y-3">
                        {history.map((item, idx) => {
                            const isReceived = item.type === "RECEIVED"
                            const sign = isReceived ? "+" : "-"
                            const colorClass = isReceived ? "text-emerald-600" : "text-destructive"
                            const formattedDate = DateUtils.formatDate(item.date)

                            return (
                                <li key={idx} className="flex items-center justify-between p-3 rounded-lg border border-[#F0F1F6] bg-white">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-md bg-psi-primary/10 ${isReceived ? "text-emerald-600" : "text-destructive"}`}>
                                            {isReceived ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium text-psi-dark">{isReceived ? "Recebimento" : "Saque"}</div>
                                            {
                                                item.eventName && (
                                                    <div className="text-sm text-gray-600">{item.eventName}</div>
                                                )
                                            }
                                            <div className="text-xs text-psi-dark/60">{formattedDate}</div>
                                        </div>
                                    </div>

                                    <div className="text-right">
                                        <div className={`text-sm font-semibold ${colorClass}`}>{sign} {ValueUtils.centsToCurrency(item.value)}</div>
                                    </div>
                                </li>
                            )
                        })}
                    </ul>
                )}
            </div>
        </div>
        </Background>
    )
}

export {
    CarteiraPannel
}