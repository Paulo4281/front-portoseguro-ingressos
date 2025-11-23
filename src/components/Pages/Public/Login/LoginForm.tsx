"use client"

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
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { Toast } from "@/components/Toast/Toast"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"

const LoginForm = () => {
    const form = useForm<TAuth>({
        resolver: zodResolver(AuthValidator)
    })

    const routerService = useRouter()
    const { mutateAsync: loginUser, isPending: isLoggingIn } = useAuthLogin()
    const { setUser } = useAuthStore()

    const handleSubmit = async (data: TAuth) => {
        const response = await loginUser(data)
        if (response && response.success && response.data?.user) {
            setUser(response.data.user)
            routerService.push("/")
        }
    }

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

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    size="lg"
                >
                    <Icon
                        icon="google"
                        className="size-6"
                    />
                    Continuar com o Google
                </Button>
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
