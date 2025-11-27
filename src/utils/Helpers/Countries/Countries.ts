type TCountry = {
    value: string
    label: string
}

let countriesCache: TCountry[] | null = null

export const getCountries = async (): Promise<TCountry[]> => {
    if (countriesCache) {
        return countriesCache
    }

    try {
        const response = await fetch("https://restcountries.com/v3.1/all?fields=name,translations")
        
        if (!response.ok) {
            throw new Error("Erro ao buscar países")
        }
        
        const data = await response.json()

        const countries: TCountry[] = data.map((country: any) => {
            const portugueseName = country.translations?.por?.common || country.name.common || country.name.official
            return {
                value: portugueseName,
                label: portugueseName
            }
        }).filter((country: TCountry) => country.value && country.label)

        countries.sort((a, b) => {
            if (a.label === "Brasil" || a.value === "Brasil") return -1
            if (b.label === "Brasil" || b.value === "Brasil") return 1
            return a.label.localeCompare(b.label, "pt-BR", { sensitivity: "base" })
        })

        countriesCache = countries
        return countries
    } catch (error) {
        console.error("Erro ao buscar países:", error)
        return [
            { value: "Brasil", label: "Brasil" }
        ]
    }
}

export const getCountriesSync = (): TCountry[] => {
    if (countriesCache) {
        return countriesCache
    }
    return [
        { value: "Brasil", label: "Brasil" }
    ]
}

