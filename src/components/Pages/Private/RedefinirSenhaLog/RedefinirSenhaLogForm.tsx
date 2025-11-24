"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserResetPasswordValidator } from "@/validators/User/UserValidator"
import type { TUserResetPassword } from "@/types/User/TUser"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { PasswordStrength } from "@/components/PasswordStrength/PasswordStrength"
import { useUserResetPassword } from "@/hooks/User/useUserResetPassword"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react"
import { Toast } from "@/components/Toast/Toast"
import { useRouter } from "next/navigation"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"

const RedefinirSenhaLogForm = () => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const routerService = useRouter()

    const form = useForm<TUserResetPassword>({
        resolver: zodResolver(UserResetPasswordValidator),
        defaultValues: {
            currentPassword: "",
            password: ""
        }
    })

    const { mutateAsync: resetPassword, isPending: isResettingPassword } = useUserResetPassword()

    const passwordValue = form.watch("password")

    const handleSubmit = async (data: TUserResetPassword) => {
        const response = await resetPassword(data)
        if (response && response.success) {
            setIsSuccess(true)
            Toast.success("Senha redefinida com sucesso!")
            form.reset()
        }
    }

    if (isSuccess) {
        return (
            <AuthLayout>
                <div className="mb-8 text-center">
                    <div className="flex justify-center mb-4">
                        <CheckCircle2 className="size-16 text-green-500" />
                    </div>
                    <h1 className="text-3xl font-bold text-psi-dark dark:text-white mb-2">
                        Senha Redefinida!
                    </h1>
                    <p className="text-muted-foreground">
                        Sua senha foi redefinida com sucesso.
                    </p>
                </div>

                <Button
                    type="button"
                    variant="primary"
                    className="w-full"
                    size="lg"
                    onClick={() => routerService.push("/")}
                >
                    Voltar
                </Button>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-psi-dark dark:text-white mb-2">
                    Redefinir Senha
                </h1>
                <p className="text-muted-foreground">
                    Digite sua senha atual e escolha uma nova senha
                </p>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <label 
                        htmlFor="currentPassword"
                        className="text-sm font-medium text-foreground">
                        Senha Atual
                    </label>
                    <div className="relative">
                        <Controller
                            name="currentPassword"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="currentPassword"
                                    type={showCurrentPassword ? "text" : "password"}
                                    placeholder="Digite sua senha atual"
                                    icon={Lock}
                                    className="pr-10"
                                    required
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showCurrentPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
                    <FieldError message={form.formState.errors.currentPassword?.message || ""} />
                </div>

                <div className="space-y-2">
                    <label 
                        htmlFor="password"
                        className="text-sm font-medium text-foreground">
                        Nova Senha
                    </label>
                    <div className="relative">
                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="password"
                                    type={showNewPassword ? "text" : "password"}
                                    placeholder="Digite sua nova senha"
                                    icon={Lock}
                                    className="pr-10"
                                    required
                                />
                            )}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={showNewPassword ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {showNewPassword ? (
                                <EyeOff className="size-4" />
                            ) : (
                                <Eye className="size-4" />
                            )}
                        </button>
                    </div>
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

                <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    size="lg"
                    onClick={() => routerService.push("/")}
                >
                    Voltar
                </Button>
            </form>
        </AuthLayout>
    )
}

export {
    RedefinirSenhaLogForm
}