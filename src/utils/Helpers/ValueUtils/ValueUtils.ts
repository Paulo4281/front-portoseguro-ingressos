class ValueUtilsClass {
    currencyToCents(value: string): number {
        if (!value) return 0

        const formattedValue = Number(value.replace(/\D/g, ''))

        return Math.round(formattedValue)
    }

    centsToCurrency(value: number): string {
        return new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL"
        }).format(value / 100)
    }

    getPercentageValue(total: number, percentage: number): number {
        return (total * percentage) / 100
    }

    formatPrice(value: number): string {
        if (value === 0) {
            return "Gratuito"
        }
        return this.centsToCurrency(value)
    }

    calculateInsuranceValue(totalInCents: number): number {
        const INSURANCE_THRESHOLD = 49999
        const FIXED_INSURANCE_VALUE = 1990
        const PERCENTAGE_INSURANCE = 5

        if (totalInCents < INSURANCE_THRESHOLD) {
            return FIXED_INSURANCE_VALUE
        }

        return Math.round(totalInCents * (PERCENTAGE_INSURANCE / 100))
    }
}

export const ValueUtils = new ValueUtilsClass()