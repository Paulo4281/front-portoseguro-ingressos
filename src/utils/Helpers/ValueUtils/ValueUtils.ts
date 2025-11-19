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
}

export const ValueUtils = new ValueUtilsClass()