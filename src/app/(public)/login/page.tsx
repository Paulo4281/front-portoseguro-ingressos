import { LoginForm } from "@/components/Pages/Public/Login/LoginForm"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Login | Porto Seguro Ingressos",
    description: "Acesse sua conta para continuar explorando eventos incríveis.",
}

const LoginPage = () => {
    return (
        <LoginForm />
    )
}

export default LoginPage