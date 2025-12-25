"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { UserConfirmationForgotPasswordValidator } from "@/validators/User/UserConfirmationValidator"
import { TUserForgotPassword } from "@/types/User/TUserConfirmation"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { useUserConfirmationForgotPassword } from "@/hooks/UserConfirmation/useUserConfirmationForgotPassword"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"

const SenhaRedefinirForm = () => {
    const { mutateAsync: forgotPassword, isPending: isForgotPasswordPending } = useUserConfirmationForgotPassword()

    const routerService = useRouter()

    const form = useForm<TUserForgotPassword>({
        resolver: zodResolver(UserConfirmationForgotPasswordValidator),
        defaultValues: {
            email: ""
        }
    })

    const handleSubmit = async (data: TUserForgotPassword) => {
        const response = await forgotPassword(data)
        if (response && response.success) {
            routerService.push(`/senha-redefinir-confirmar?email=${data.email}`)
        }
    }

    return (
        <AuthLayout>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-semibold text-psi-dark dark:text-white mb-2">
                    Esqueceu sua senha?
                </h1>
                <p className="text-muted-foreground">
                    Informe seu e-mail e enviaremos instruções para redefinir sua senha.
                </p>
            </div>

                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label 
                                htmlFor="email"
                                className="text-sm font-medium text-foreground">
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
                                    />
                                )}
                            />
                            <FieldError message={form.formState.errors.email?.message || ""} />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            disabled={isForgotPasswordPending}
                        >
                            {isForgotPasswordPending ? (
                                <LoadingButton />
                            ) : (
                                "Enviar instruções"
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
                                Voltar ao login
                            </Link>
                        </Button>
                    </div>
        </AuthLayout>
    )
}

export {
    SenhaRedefinirForm
}