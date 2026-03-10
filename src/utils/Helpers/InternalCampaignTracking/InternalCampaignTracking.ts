const INTERNAL_CAMPAIGN_STORAGE_KEY = "internalCampaignUtmId"

class InternalCampaignTrackingClass {
    private isBrowser() {
        return typeof window !== "undefined"
    }

    readFromSessionStorage(): string | null {
        if (!this.isBrowser()) return null
        return window.sessionStorage.getItem(INTERNAL_CAMPAIGN_STORAGE_KEY)
    }

    saveToSessionStorage(utmId: string): void {
        if (!this.isBrowser()) return
        const normalized = utmId.trim()
        if (!normalized) return
        window.sessionStorage.setItem(INTERNAL_CAMPAIGN_STORAGE_KEY, normalized)
    }

    readFromSearchParams(searchParams: URLSearchParams): string | null {
        const candidates = [
            searchParams.get("utmId"),
            searchParams.get("utm_id")
        ]

        const value = candidates.find((item) => item && item.trim().length > 0)
        return value ? value.trim() : null
    }

    syncFromSearchParams(searchParams: URLSearchParams): string | null {
        const utmId = this.readFromSearchParams(searchParams)
        if (utmId) {
            this.saveToSessionStorage(utmId)
            return utmId
        }

        return this.readFromSessionStorage()
    }
}

export const InternalCampaignTracking = new InternalCampaignTrackingClass()
