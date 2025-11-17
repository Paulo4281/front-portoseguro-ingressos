import { create } from "zustand"
import { persist } from "zustand/middleware"

type TCacheStore = {
    cache: Record<string, unknown>
    add: <T>(key: string, value: T) => void
    remove: (key: string) => void
    update: <T>(key: string, value: T) => void
    get: <T>(key: string) => T | null
    getAll: () => Record<string, unknown>
    clear: () => void
}

const useCacheStore = create<TCacheStore>()(
    persist(
        (set, get) => ({
            cache: {},
            add: <T>(key: string, value: T) => {
                set((state) => ({
                    cache: {
                        ...state.cache,
                        [key]: value
                    }
                }))
            },
            remove: (key: string) => {
                set((state) => {
                    const newCache = { ...state.cache }
                    delete newCache[key]
                    return { cache: newCache }
                })
            },
            update: <T>(key: string, value: T) => {
                set((state) => {
                    if (state.cache[key] !== undefined) {
                        return {
                            cache: {
                                ...state.cache,
                                [key]: value
                            }
                        }
                    }
                    return state
                })
            },
            get: <T>(key: string): T | null => {
                const value = get().cache[key]
                return value !== undefined ? (value as T) : null
            },
            getAll: () => {
                return get().cache
            },
            clear: () => {
                set({ cache: {} })
            }
        }),
        {
            name: "persist_pci"
        }
    )
)

export class StoreManager {
    static add<T>(key: string, value: T): void {
        useCacheStore.getState().add(key, value)
    }

    static remove(key: string): void {
        useCacheStore.getState().remove(key)
    }

    static update<T>(key: string, value: T): void {
        useCacheStore.getState().update(key, value)
    }

    static get<T>(key: string): T | null {
        return useCacheStore.getState().get<T>(key)
    }

    static getAll(): Record<string, unknown> {
        return useCacheStore.getState().getAll()
    }

    static clear(): void {
        useCacheStore.getState().clear()
    }
}
