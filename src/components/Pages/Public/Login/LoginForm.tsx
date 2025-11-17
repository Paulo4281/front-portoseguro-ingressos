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

const LoginForm = () => {
    const form = useForm<TAuth>({
        resolver: zodResolver(AuthValidator)
    })

    const handleSubmit = async (data: TAuth) => {
        console.log(data)
    }

    return (
        <div className="min-h-screen flex">
            <div className="hidden
            lg:block
            lg:w-1/2 relative overflow-hidden">
                <div 
                    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                    style={{
                        backgroundImage: 'url(https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg)'
                    }}
                />
            </div>

            <div className="relative
            w-full
            lg:w-1/2
            flex
            items-center
            justify-center
            p-4
            sm:p-6
            md:p-8
            lg:p-12">
                <div className="absolute
                inset-0
                bg-cover
                bg-center
                bg-no-repeat
                lg:hidden">
                    <div 
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage: 'url(https://images.pexels.com/photos/2263683/pexels-photo-2263683.jpeg)'
                        }}
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="relative
                w-full
                max-w-md
                bg-white
                dark:bg-psi-dark
                rounded-lg
                shadow-lg
                p-6
                sm:p-8
                md:p-10
                z-10">
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
                        >
                            Entrar
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
                            variant="light"
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
                </div>
            </div>
        </div>
    )
}

export {
    LoginForm
}
