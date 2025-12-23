const TAX_FIXED_CLIENT = Number(process.env.NEXT_PUBLIC_TAX_FEE_FIXED_CLIENT_CENTS ?? 0)
const TAX_PERCENTAGE = Number(process.env.NEXT_PUBLIC_TAX_FEE_PERCENTAGE ?? 0)
const TAX_FIXED = Number(process.env.NEXT_PUBLIC_TAX_FEE_FIXED ?? 0)
const TAX_THRESHOLD_CENTS = Number(process.env.NEXT_PUBLIC_TAX_THRESHOLD_CENTS ?? 3990)
const TAX_FIXED_BELOW_THRESHOLD = Number(process.env.NEXT_PUBLIC_TAX_FEE_FIXED_BELOW_THRESHOLD ?? 0)

const TicketFeeUtils = {
    calculateFeeInCents(priceInCents: number | null | undefined, isClientTaxed?: boolean | null) {
        if (!priceInCents || priceInCents <= 0) return 0

        const baseFee = TAX_FIXED_CLIENT
        if (!isClientTaxed) {
            return baseFee
        }

        if (priceInCents > TAX_THRESHOLD_CENTS) {
            return baseFee + Math.round(priceInCents * (TAX_PERCENTAGE / 100))
        } else if (priceInCents <= TAX_THRESHOLD_CENTS && isClientTaxed) {
            return baseFee + TAX_FIXED_BELOW_THRESHOLD
        }

        return baseFee + TAX_FIXED
    }
}

export {
    TicketFeeUtils
}

