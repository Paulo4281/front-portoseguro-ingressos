import { create } from "zustand"
import type { TUser } from "@/types/User/TUser"
import { StoreManager } from "@/stores"

const AUTH_STORE_KEY = "auth"

type TAuthStore = {
    user: TUser | null
    isAuthenticated: boolean
    setUser: (user: TUser) => void
    removeUser: () => void
}

const loadUserFromCache = (): TUser | null => {
    return StoreManager.get<TUser>(AUTH_STORE_KEY)
}

export const useAuthStore = create<TAuthStore>((set) => {
    const cachedUser = loadUserFromCache()
    
    return {
        user: cachedUser,
        isAuthenticated: !!cachedUser,
        setUser: (user: TUser) => {
            StoreManager.add(AUTH_STORE_KEY, user)
            set({ user, isAuthenticated: true })
        },
        removeUser: () => {
            StoreManager.remove(AUTH_STORE_KEY)
            set({ user: null, isAuthenticated: false })
        },
    }
})