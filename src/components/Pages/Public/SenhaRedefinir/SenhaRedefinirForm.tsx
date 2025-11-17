"use client"

import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { Mail, ArrowLeft } from "lucide-react"
import { UserForgotPasswordValidator } from "@/validators/User/UserConfirmationValidator"
import { TUserForgotPassword } from "@/types/User/TUserConfirmation"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"

const SenhaRedefinirForm = () => {
    const form = useForm<TUserForgotPassword>({
        resolver: zodResolver(UserForgotPasswordValidator),
        defaultValues: {
            email: ""
        }
    })

    const handleSubmit = async (data: TUserForgotPassword) => {
        console.log(data)
    }

    return (
        <div className="min-h-screen flex">
            <div className="hidden relative overflow-hidden
            lg:block lg:w-1/2">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg)'
                    }}
                />
            </div>

            <div className="relative w-full flex items-center justify-center p-4
            lg:w-1/2 lg:p-12
            sm:p-6
            md:p-8
            ">
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat
                lg:hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: 'url(https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg)'
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="relative w-full max-w-md bg-white dark:bg-psi-dark rounded-lg shadow-lg p-6
                sm:p-8
                md:p-10 z-10">
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl font-bold text-psi-dark dark:text-white mb-2">
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
                        >
                            Enviar instruções
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
                </div>
            </div>
        </div>
    )
}

export {
    SenhaRedefinirForm
}