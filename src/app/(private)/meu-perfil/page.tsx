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

  return (
    <>
    <meta
        name="description"
        content="Gerencie suas informações pessoais e de contato. Atualize seu perfil, senha e muito mais."
    />

      {user.role === "CUSTOMER" && <MeuPerfilCustomer />}
      {(user.role === "ORGANIZER" || user.role === "ADMIN") && (
        <MeuPerfilOrganizer />
      )}
    </>
  )
}

export default MeuPerfilPage
