"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { z } from "zod"
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, LogIn, AlertCircle } from "lucide-react"
import { UserConfirmPasswordValidator } from "@/validators/User/UserValidator"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { PasswordStrength } from "@/components/PasswordStrength/PasswordStrength"
import { useUserConfirmPassword } from "@/hooks/User/useUserConfirmPassword"
import { useSearchParams } from "next/navigation"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { Toast } from "@/components/Toast/Toast"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"

type TConfirmPasswordForm = z.infer<typeof UserConfirmPasswordValidator>

const DefinirSenhaInfo = () => {
    const searchParams = useSearchParams()
    const code = searchParams.get("code") ?? ""
    const { mutateAsync: confirmPassword, isPending } = useUserConfirmPassword()
    const [showPassword, setShowPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [codeError, setCodeError] = useState<string | null>(null)

    const form = useForm<TConfirmPasswordForm>({
        resolver: zodResolver(UserConfirmPasswordValidator),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })

    const passwordValue = form.watch("password")

    useEffect(() => {
        if (typeof code !== "string" || !code.trim()) {
            setCodeError("Link inválido. O código não foi informado.")
        } else {
            setCodeError(null)
        }
    }, [code])

    const handleSubmit = async (data: TConfirmPasswordForm) => {
        if (!code.trim()) {
            setCodeError("Link inválido. O código não foi informado.")
            return
        }
        setCodeError(null)
        try {
            const response = await confirmPassword({ code: code.trim(), password: data.password })
            if (response?.success && response?.data?.availableForPasswordDef === true) {
                setIsSuccess(true)
                Toast.success("Senha definida com sucesso!")
            } else {
                Toast.error("Código inválido, expirado ou senha já definida. Solicite um novo link por e-mail.")
            }
        } catch {
            Toast.error("Não foi possível definir a senha. Tente novamente.")
        }
    }

    if (isSuccess) {
        return (
            <AuthLayout>
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="size-16 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-semibold text-psi-dark dark:text-white mb-2">
                        Senha definida!
                    </h1>
                    <p className="text-muted-foreground">
                        Sua senha foi definida com sucesso. Agora você pode fazer login com seu e-mail e senha.
                    </p>
                </div>
                <Button asChild variant="primary" className="w-full" size="lg">
                    <Link href="/login" className="flex items-center justify-center">
                        <LogIn className="size-4 mr-2" />
                        Fazer login
                    </Link>
                </Button>
            </AuthLayout>
        )
    }

    if (codeError) {
        return (
            <AuthLayout>
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <AlertCircle className="size-16 text-amber-500" />
                    </div>
                    <h1 className="text-3xl font-semibold text-psi-dark dark:text-white mb-2">
                        Link inválido
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        {codeError} Acesse o link que foi enviado para o seu e-mail ou solicite um novo.
                    </p>
                    <Button asChild variant="outline" className="w-full" size="lg">
                        <Link href="/login" className="flex items-center justify-center">
                            <ArrowLeft className="size-4 mr-2" />
                            Voltar ao login
                        </Link>
                    </Button>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-psi-dark dark:text-white mb-2">
                    Definir senha
                </h1>
                <p className="text-muted-foreground">
                    Crie uma senha para acessar sua conta. Use letras, números e caracteres especiais.
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                        Nova senha
                    </label>
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <div className="relative">
                                <Input
                                    {...field}
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Sua senha"
                                    icon={Lock}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground rounded-md p-1"
                                    aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                >
                                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                </button>
                            </div>
                        )}
                    />
                    <PasswordStrength password={passwordValue || ""} />
                    <FieldError message={form.formState.errors.password?.message || ""} />
                </div>

                <div className="space-y-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                        Confirmar senha
                    </label>
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Repita a senha"
                                icon={Lock}
                            />
                        )}
                    />
                    <FieldError message={form.formState.errors.confirmPassword?.message || ""} />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    size="lg"
                    disabled={isPending}
                >
                    {isPending ? <LoadingButton /> : "Definir senha"}
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Button asChild variant="ghost" className="w-full">
                    <Link href="/login" className="flex items-center justify-center">
                        <ArrowLeft className="size-4 mr-2" />
                        Voltar ao login
                    </Link>
                </Button>
            </div>
        </AuthLayout>
    )
}

export { DefinirSenhaInfo }
