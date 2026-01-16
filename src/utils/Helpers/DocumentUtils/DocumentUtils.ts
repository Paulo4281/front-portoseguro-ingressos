class DocumentUtilsClass {
    formatCnpj(value: string): string {
        if (!value) return ""
        const digits = value.replace(/\D/g, "").slice(0, 14)
        return digits
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
    }

    formatCpf(value: string): string {
        if (!value) return ""
        const digits = value.replace(/\D/g, "").slice(0, 11)
        return digits
            .replace(/^(\d{3})(\d)/, "$1.$2")
            .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1-$2")
    }

    formatPhone(value: string): string {
        if (!value) return ""
        const digits = value.replace(/\D/g, "").slice(0, 13)
        if (digits.length < 11) return digits

        const country = digits.slice(0, 2)
        const area = digits.slice(2, 4)
        const firstPart = digits.slice(4, 9)
        const secondPart = digits.slice(9, 13)

        return `+${country} (${area}) ${firstPart}-${secondPart}`
    }
}

export const DocumentUtils = new DocumentUtilsClass()