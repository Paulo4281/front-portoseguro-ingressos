"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Mail, Lock, ArrowLeft, UserPlus } from "lucide-react"
import { AuthValidator } from "@/validators/Auth/AuthValidator"
import { TAuth } from "@/types/Auth/TAuth"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { Icon } from "@/components/Icon/Icon"
import { useAuthLogin } from "@/hooks/Auth/useAuthLogin"
import { useAuthLoginWithGoogle } from "@/hooks/Auth/useAuthLoginWithGoogle"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { Toast } from "@/components/Toast/Toast"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"

declare global {
    interface Window {
        google: {
            accounts: {
                id: {
                    initialize: (config: { client_id: string; callback: (response: { credential: string }) => void }) => void
                    renderButton: (element: HTMLElement, config: any) => void
                    prompt: () => void
                }
            }
        }
    }
}

const LoginForm = () => {
    const form = useForm<TAuth>({
        resolver: zodResolver(AuthValidator)
    })

    const routerService = useRouter()
    const { mutateAsync: loginUser, isPending: isLoggingIn } = useAuthLogin()
    const { mutateAsync: loginWithGoogle, isPending: isLoggingInWithGoogle } = useAuthLoginWithGoogle()
    const { setUser } = useAuthStore()
    const googleButtonRef = useRef<HTMLDivElement>(null)
    const [isGoogleScriptLoaded, setIsGoogleScriptLoaded] = useState(false)

    const handleSubmit = async (data: TAuth) => {
        const response = await loginUser(data)
        if (response && response.success && response.data?.user) {
            setUser(response.data.user)
            if (response.data.user.role === "NOT_DEFINED") {
                routerService.push("/confirmar-social")
            } else {
                routerService.push("/")
            }
        }
    }

    const handleCredentialResponse = useCallback(async (response: { credential: string }) => {
        try {
            const authResponse = await loginWithGoogle(response.credential)
            if (authResponse && authResponse.success && authResponse.data?.user) {
                setUser(authResponse.data.user)
                if (authResponse.data.user.role === "NOT_DEFINED") {
                    routerService.push("/confirmar-social")
                } else {
                    routerService.push("/")
                }
            }
        } catch (error) {
            Toast.error("Erro ao fazer login com Google")
        }
    }, [loginWithGoogle, setUser, routerService])

    useEffect(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_SOCIAL_LOGIN_CLIENT_ID
        if (!clientId) {
            console.error("CLIENT_ID não configurado")
            return
        }

        const script = document.createElement("script")
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = () => {
            if (window.google && window.google.accounts) {
                window.google.accounts.id.initialize({
                    client_id: clientId,
                    callback: handleCredentialResponse
                })
                setIsGoogleScriptLoaded(true)
            }
        }
        document.head.appendChild(script)

        return () => {
            if (document.head.contains(script)) {
                document.head.removeChild(script)
            }
        }
    }, [handleCredentialResponse])

    useEffect(() => {
        if (isGoogleScriptLoaded && googleButtonRef.current && window.google) {
            try {
                window.google.accounts.id.renderButton(googleButtonRef.current, {
                    theme: "filled_blue",
                    type: "standard",
                    size: "large",
                    shape: "pill",
                })
            } catch (error) {
                console.error("Erro ao renderizar botão do Google:", error)
            }
        }
    }, [isGoogleScriptLoaded])

    return (
        <AuthLayout>
            <div className="mb-8">
                <h1 className="text-3xl
                font-bold
                text-psi-dark
                dark:text-white
                mb-2">
                    Entrar
                </h1>
                <p className="text-muted-foreground">
                    Acesse sua conta para continuar
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label 
                        htmlFor="email"
                        className="text-sm
                        font-medium
                        text-foreground">
                        E-mail
                    </label>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="email"
                                type="email"
                                placeholder="seu@email.com"
                                icon={Mail}
                                required
                            />
                        )}
                    />
                    <FieldError message={form.formState.errors.email?.message || ""} />
                </div>

                <div className="space-y-2">
                    <label 
                        htmlFor="password"
                        className="text-sm
                        font-medium
                        text-foreground">
                        Senha
                    </label>
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="password"
                                type="password"
                                placeholder="Sua senha"
                                icon={Lock}
                                required
                            />
                        )}
                    />
                    <FieldError message={form.formState.errors.password?.message || ""} />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    size="lg"
                    disabled={isLoggingIn}
                >
                    {
                        isLoggingIn ? (
                            <LoadingButton />
                        ) : (
                            "Entrar"
                        )
                    }
                </Button>
            </form>

            <div className="mt-6 space-y-4">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white
                        dark:bg-psi-dark
                        px-2
                        text-muted-foreground">
                            Ou
                        </span>
                    </div>
                </div>

                <div className="w-full">
                    <div ref={googleButtonRef} className="w-full flex justify-center" />
                    {isLoggingInWithGoogle && (
                        <div className="mt-2 flex justify-center">
                            <LoadingButton />
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2">
                <Button
                    asChild
                    variant="tertiary"
                    aria-label="Cadastre-se"
                >
                    <Link href="/cadastro">
                        <UserPlus className="size-4" />
                        Cadastre-se
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="light"
                    aria-label="Recuperar senha"
                >
                    <Link href="/senha-redefinir">
                        <Lock className="size-4" />
                        Recuperar senha
                    </Link>
                </Button>
            </div>

            <div className="mt-6 text-center">
                <Button
                    asChild
                    variant="ghost"
                    className="w-full"
                >
                    <Link href="/" className="flex items-center justify-center">
                        <ArrowLeft className="size-4 mr-2" />
                        Voltar ao início
                    </Link>
                </Button>
            </div>
        </AuthLayout>
    )
}

export {
    LoginForm
}
