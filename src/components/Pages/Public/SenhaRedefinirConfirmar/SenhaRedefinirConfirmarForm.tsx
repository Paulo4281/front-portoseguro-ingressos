"use client"

import { useState, useEffect } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, LogIn } from "lucide-react"
import { UserResetPasswordByCodeValidator } from "@/validators/User/UserValidator"
import { TUserResetPasswordByCode } from "@/types/User/TUser"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { PasswordStrength } from "@/components/PasswordStrength/PasswordStrength"
import { useUserResetPasswordByCode } from "@/hooks/User/useUserResetPasswordByCode"
import { useSearchParamsHook } from "@/hooks/useSearchParams"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { Toast } from "@/components/Toast/Toast"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"

type TSearchParams = {
    email?: string
    link?: string
}

const SenhaRedefinirConfirmarForm = () => {
    const searchParams = useSearchParamsHook<TSearchParams>(["email", "link"])
    const { mutateAsync: resetPassword, isPending: isResettingPassword } = useUserResetPasswordByCode()
    const [showPassword, setShowPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<TUserResetPasswordByCode>({
        resolver: zodResolver(UserResetPasswordByCodeValidator),
        defaultValues: {
            email: searchParams.email || "",
            code: "",
            password: ""
        }
    })

    useEffect(() => {
        if (searchParams.link) {
            form.setValue("code", searchParams.link)
            Toast.success("Código de verificação inserido automaticamente!")
            form.setFocus("password")
        }
    }, [searchParams.link, form])

    useEffect(() => {
        if (searchParams.email) {
            form.setValue("email", searchParams.email)
            form.setFocus("code")
        }
    }, [searchParams.email, form])

    const passwordValue = form.watch("password")

    const handleSubmit = async (data: TUserResetPasswordByCode) => {
        const response = await resetPassword(data)
        if (response && response.success) {
            setIsSuccess(true)
            Toast.success("Senha redefinida com sucesso!")
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
                        Senha Redefinida!
                    </h1>
                    <p className="text-muted-foreground">
                        Sua senha foi redefinida com sucesso. Agora você pode fazer login com sua nova senha.
                    </p>
                </div>

                <Button
                    asChild
                    variant="primary"
                    className="w-full"
                    size="lg"
                >
                    <Link href="/login" className="flex items-center justify-center">
                        <LogIn className="size-4 mr-2" />
                        Fazer Login
                    </Link>
                </Button>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-psi-dark dark:text-white mb-2">
                    Redefinir Senha
                </h1>
                <p className="text-muted-foreground">
                    Digite o código enviado para <span className="font-medium text-foreground">{searchParams.email}</span> e sua nova senha.
                </p>
            </div>

                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label 
                                htmlFor="code"
                                className="text-sm font-medium text-foreground block text-center">
                                Código de Verificação
                            </label>
                            <Controller
                                name="code"
                                control={form.control}
                                render={({ field }) => (
                                    <div className="flex justify-center">
                                        <InputOTP
                                            maxLength={6}
                                            {...field}
                                        >
                                            <InputOTPGroup>
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </div>
                                )}
                            />
                            <div className="text-center">
                                <FieldError message={form.formState.errors.code?.message || ""} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="password"
                                className="text-sm font-medium text-foreground">
                                Nova Senha
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
                                            placeholder="Sua nova senha"
                                            icon={Lock}
                                            className="pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1"
                                            aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="size-4" />
                                            ) : (
                                                <Eye className="size-4" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            />
                            <PasswordStrength password={passwordValue || ""} />
                            <FieldError message={form.formState.errors.password?.message || ""} />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            disabled={isResettingPassword}
                        >
                            {isResettingPassword ? (
                                <LoadingButton />
                            ) : (
                                "Redefinir Senha"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <Button
                            asChild
                            variant="ghost"
                            className="w-full"
                        >
                            <Link href="/login" className="flex items-center justify-center">
                                <ArrowLeft className="size-4 mr-2" />
                                Voltar ao Login
                            </Link>
                        </Button>
                    </div>
        </AuthLayout>
    )
}

export default SenhaRedefinirConfirmarForm
