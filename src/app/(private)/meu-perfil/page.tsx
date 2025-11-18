"use client"

import { useAuthStore } from "@/stores/Auth/AuthStore"
import { MeuPerfilCustomer } from "@/components/Pages/Private/MeuPerfil/MeuPerfilCustomer"
import { MeuPerfilOrganizer } from "@/components/Pages/Private/MeuPerfil/MeuPerfilOrganizer"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

const MeuPerfilPage = () => {
    const { user, isAuthenticated } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated) {
            router.push("/login")
        }
    }, [isAuthenticated, router])

    if (!isAuthenticated || !user) {
        return null
    }

    if (user.role === "CUSTOMER") {
        return <MeuPerfilCustomer />
    }

    if (user.role === "ORGANIZER" || user.role === "ADMIN") {
        return <MeuPerfilOrganizer />
    }

    return null
}

export default MeuPerfilPage
