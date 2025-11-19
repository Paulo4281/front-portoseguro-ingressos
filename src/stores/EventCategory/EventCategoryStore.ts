import { create } from "zustand"
import type { TEventCategory } from "@/types/Event/TEventCategory"
import { StoreManager } from "@/stores"

const EVENT_CATEGORY_STORE_KEY = "event-categories"
const CACHE_EXPIRATION_MS = 8 * 60 * 60 * 1000

type TEventCategoryCache = {
    data: TEventCategory[]
    timestamp: number
}

type TEventCategoryStore = {
    eventCategories: TEventCategory[]
    setEventCategories: (eventCategories: TEventCategory[]) => void
    isCacheExpired: () => boolean
    getCachedCategories: () => TEventCategory[] | null
}

const loadEventCategoriesFromCache = (): TEventCategoryCache | null => {
    return StoreManager.get<TEventCategoryCache>(EVENT_CATEGORY_STORE_KEY) ?? null
}

const isCacheExpired = (cache: TEventCategoryCache | null): boolean => {
    if (!cache) return true
    
    const now = Date.now()
    const cacheAge = now - cache.timestamp
    
    return cacheAge >= CACHE_EXPIRATION_MS
}

export const useEventCategoryStore = create<TEventCategoryStore>((set, get) => {
    const cachedData = loadEventCategoriesFromCache()
    const initialCategories = cachedData && !isCacheExpired(cachedData) ? cachedData.data : []

    return {
        eventCategories: initialCategories,
        setEventCategories: (eventCategories: TEventCategory[]) => {
            const cacheData: TEventCategoryCache = {
                data: eventCategories,
                timestamp: Date.now()
            }
            StoreManager.add(EVENT_CATEGORY_STORE_KEY, cacheData)
            set({ eventCategories })
        },
        isCacheExpired: () => {
            const cache = loadEventCategoriesFromCache()
            return isCacheExpired(cache)
        },
        getCachedCategories: () => {
            const cache = loadEventCategoriesFromCache()
            if (cache && !isCacheExpired(cache)) {
                return cache.data
            }
            return null
        }
    }
})