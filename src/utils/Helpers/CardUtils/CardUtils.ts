export const getCardBrand = (cardNumber: string): string | null => {
    const cleaned = cardNumber.replace(/\D/g, "")
    
    if (!cleaned || cleaned.length < 4) return null
    
    const firstDigit = cleaned[0]
    const firstTwoDigits = cleaned.substring(0, 2)
    const firstThreeDigits = cleaned.substring(0, 3)
    const firstFourDigits = cleaned.substring(0, 4)
    const firstSixDigits = cleaned.substring(0, 6)
    
    if (firstDigit === "4") {
        return "visa"
    }
    
    if (firstTwoDigits >= "51" && firstTwoDigits <= "55") {
        return "mastercard"
    }
    
    if (firstTwoDigits === "34" || firstTwoDigits === "37") {
        return "amex"
    }
    
    if (firstTwoDigits === "36" || firstTwoDigits === "38" || (firstTwoDigits >= "30" && firstTwoDigits <= "35")) {
        return "diners"
    }
    
    if (firstFourDigits === "6011" || firstTwoDigits === "65" || (firstThreeDigits >= "622" && firstThreeDigits <= "627")) {
        return "discover"
    }
    
    if (firstFourDigits === "6062" || firstFourDigits === "6370" || firstFourDigits === "6371" || firstFourDigits === "6372") {
        return "hipercard"
    }
    
    if (firstFourDigits >= "3528" && firstFourDigits <= "3589") {
        return "jcb"
    }
    
    const eloRanges = [
        { start: "401178", end: "401179" },
        { start: "431274", end: "431274" },
        { start: "438935", end: "438935" },
        { start: "451416", end: "451416" },
        { start: "457393", end: "457393" },
        { start: "504175", end: "504175" },
        { start: "506699", end: "506699" },
        { start: "509000", end: "509999" },
        { start: "627780", end: "627780" },
        { start: "636297", end: "636297" },
        { start: "636368", end: "636368" },
        { start: "650031", end: "650033" },
        { start: "650035", end: "650051" },
        { start: "650405", end: "650439" },
        { start: "650485", end: "650538" },
        { start: "650541", end: "650598" },
        { start: "650700", end: "650718" },
        { start: "650720", end: "650727" },
        { start: "650901", end: "650978" },
        { start: "651652", end: "651679" },
        { start: "655000", end: "655019" },
        { start: "655021", end: "655058" }
    ]
    
    for (const range of eloRanges) {
        if (firstSixDigits >= range.start && firstSixDigits <= range.end) {
            return "elo"
        }
    }
    
    if (firstFourDigits >= "5041" && firstFourDigits <= "5049") {
        return "elo"
    }
    
    return null
}

export const formatCardNumber = (value: string): string => {
    const cleaned = value.replace(/\D/g, "")
    const match = cleaned.match(/.{1,4}/g)
    return match ? match.join(" ") : cleaned
}

export const formatExpiryDate = (value: string): string => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
        return `${cleaned.substring(0, 2)}/${cleaned.substring(2, 4)}`
    }
    return cleaned
}

