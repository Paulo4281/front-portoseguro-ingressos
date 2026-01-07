"use client"

import { useMemo } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"

const INSTALLMENT_FEES: Record<number, { percentage: number; fixed: number }> = {
    1: { percentage: 0, fixed: 0 },
    2: { percentage: 3.49, fixed: 49 },
    3: { percentage: 5.99, fixed: 149 },
    4: { percentage: 8.99, fixed: 149 },
    5: { percentage: 11.99, fixed: 149 },
    6: { percentage: 14.99, fixed: 149 },
    7: { percentage: 18.99, fixed: 149 },
    8: { percentage: 22.99, fixed: 149 },
    9: { percentage: 26.99, fixed: 149 },
    10: { percentage: 29.99, fixed: 149 },
    11: { percentage: 32.99, fixed: 149 },
    12: { percentage: 35.99, fixed: 149 }
}

const MIN_VALUE_FOR_INSTALLMENT = 1000

type TSelectInstallmentProps = {
    value: number
    totalValue: number
    onChange: (installments: number) => void
    /** optional limit coming from the event (maxInstallments). If null/undefined, component keeps default behavior */
    maxInstallmentsFromEvent?: number | null
}

const SelectInstallment = ({
    value,
    totalValue,
    onChange,
    maxInstallmentsFromEvent
}: TSelectInstallmentProps) => {
    const maxInstallments = useMemo(() => {
        const computedMax = totalValue < MIN_VALUE_FOR_INSTALLMENT ? 1 : 12
        if (typeof maxInstallmentsFromEvent === "number" && maxInstallmentsFromEvent > 0) {
            return Math.min(computedMax, maxInstallmentsFromEvent)
        }
        return computedMax
    }, [totalValue, maxInstallmentsFromEvent])

    const availableInstallments = useMemo(() => {
        const installments: number[] = []
        for (let i = 1; i <= maxInstallments; i++) {
            installments.push(i)
        }
        return installments
    }, [maxInstallments])

    const getInstallmentFee = (installments: number) => {
        if (INSTALLMENT_FEES[installments]) {
            return INSTALLMENT_FEES[installments]
        }
    }

    const calculateTotalWithFee = (installments: number) => {
        const fee = getInstallmentFee(installments)
        const percentageFee = Math.round(totalValue * (fee!.percentage / 100))
        return totalValue + percentageFee + fee!.fixed
    }
    
    const calculateInstallmentValue = (installments: number) => {
        const totalWithFee = calculateTotalWithFee(installments)
        const installmentValue = Math.round(totalWithFee / installments)
        return installmentValue
    }

    const installmentValue = useMemo(() => {
        return calculateInstallmentValue(value)
    }, [value, totalValue])

    const totalWithFee = useMemo(() => {
        return calculateTotalWithFee(value)
    }, [value, totalValue])

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-psi-dark mb-2">
                Parcelas
            </label>
            <Select
                value={value.toString()}
                onValueChange={(val) => onChange(parseInt(val, 10))}
            >
                <SelectTrigger className="w-full">
                    <SelectValue placeholder="Selecione o número de parcelas" />
                </SelectTrigger>
                <SelectContent>
                    {availableInstallments.map((installment) => {
                        const calculatedValue = calculateInstallmentValue(installment)
                        
                        return (
                            <SelectItem key={installment} value={installment.toString()}>
                                {installment}x de {ValueUtils.centsToCurrency(calculatedValue)}
                                {installment === 1 ? " (à vista)" : ""}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
            {value > 1 && (
                <div className="text-xs text-psi-dark/60 space-y-1">
                    <p>
                        {value}x de {ValueUtils.centsToCurrency(installmentValue)}
                    </p>
                    <p className="text-psi-dark/50">
                        Total: {ValueUtils.centsToCurrency(totalWithFee)}
                    </p>
                </div>
            )}
            {value === 1 && (
                <div className="text-xs text-psi-dark/60">
                    <p>
                        Total: {ValueUtils.centsToCurrency(totalWithFee)}
                    </p>
                </div>
            )}
        </div>
    )
}

export {
    SelectInstallment
}

export const getInstallmentFee = (installments: number) => {
    if (INSTALLMENT_FEES[installments]) {
        return INSTALLMENT_FEES[installments]
    }
}

export const calculateTotalWithInstallmentFee = (totalValue: number, installments: number) => {
    const fee = getInstallmentFee(installments)
    console.log(totalValue)
    const percentageFee = ValueUtils.getPercentageValue(totalValue, fee!.percentage)
    console.log(percentageFee)
    return totalValue + percentageFee + fee!.fixed
}

export {
    INSTALLMENT_FEES
}