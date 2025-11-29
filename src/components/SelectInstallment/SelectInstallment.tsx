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

const INSTALLMENT_FEES = {
    1: { percentage: 0, fixed: 0 },
    2: { percentage: 3.49, fixed: 49 },
    7: { percentage: 3.99, fixed: 49 },
    13: { percentage: 4.29, fixed: 49 },
}

const MIN_VALUE_FOR_INSTALLMENT = 1000

type TSelectInstallmentProps = {
    value: number
    totalValue: number
    onChange: (installments: number) => void
}

const SelectInstallment = ({
    value,
    totalValue,
    onChange
}: TSelectInstallmentProps) => {
    const maxInstallments = useMemo(() => {
        if (totalValue < MIN_VALUE_FOR_INSTALLMENT) {
            return 1
        }
        return 12
    }, [totalValue])

    const availableInstallments = useMemo(() => {
        const installments: number[] = []
        for (let i = 1; i <= maxInstallments; i++) {
            installments.push(i)
        }
        return installments
    }, [maxInstallments])

    const getInstallmentFee = (installments: number) => {
        if (installments === 1) {
            return INSTALLMENT_FEES[1]
        } else if (installments >= 2 && installments <= 6) {
            return INSTALLMENT_FEES[2]
        } else if (installments >= 7 && installments <= 12) {
            return INSTALLMENT_FEES[7]
        } else {
            return INSTALLMENT_FEES[13]
        }
    }

    const calculateTotalWithFee = (installments: number) => {
        const fee = getInstallmentFee(installments)
        const percentageFee = Math.round(totalValue * (fee.percentage / 100))
        return totalValue + percentageFee + fee.fixed
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
                Parcelas *
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
    if (installments === 1) {
        return INSTALLMENT_FEES[1]
    } else if (installments >= 2 && installments <= 6) {
        return INSTALLMENT_FEES[2]
    } else if (installments >= 7 && installments <= 12) {
        return INSTALLMENT_FEES[7]
    } else {
        return INSTALLMENT_FEES[13]
    }
}

export const calculateTotalWithInstallmentFee = (totalValue: number, installments: number) => {
    const fee = getInstallmentFee(installments)
    const percentageFee = Math.round(totalValue * (fee.percentage / 100))
    return totalValue + percentageFee + fee.fixed
}
