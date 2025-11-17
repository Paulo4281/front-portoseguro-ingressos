"use client"

import { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { User, Building2, Mail, Phone, UserCircle, ArrowLeft, Lock, Eye, EyeOff } from "lucide-react"
import { UserValidator } from "@/validators/User/UserValidator"
import { TUserCreate, UserRoles } from "@/types/User/TUser"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { PasswordStrength } from "@/components/PasswordStrength/PasswordStrength"
import { useUserCreate } from "@/hooks/User/useUserCreate"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/Loading/LoadingButton"

const CadastroForm = () => {
    const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "ORGANIZER" | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const form = useForm<TUserCreate>({
        resolver: zodResolver(UserValidator),
        defaultValues: {
            role: undefined,
            password: ""
        }
    })

    const routerService = useRouter()

    const { mutateAsync: createUser, isPending: isCreatingUser } = useUserCreate()

    const passwordValue = form.watch("password")

    const handleRoleSelect = (role: "CUSTOMER" | "ORGANIZER") => {
        setSelectedRole(role)
        form.setValue("role", role)
    }

    const handleBack = () => {
        setSelectedRole(null)
        form.reset()
    }

    const handleSubmit = async (data: TUserCreate) => {
        const response = await createUser(data)
        if (response.success) {
            routerService.push(
                `/cadastro-confirmar?name=${data.firstName}&email=${data.email}`
            )
        }
    }

    if (!selectedRole) {
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
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl
                            font-bold
                            text-psi-dark
                            dark:text-white
                            mb-2">
                                Criar Conta
                            </h1>
                            <p className="text-muted-foreground">
                                Escolha o tipo de cadastro
                            </p>
                        </div>

                        <div className="space-y-4">
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-auto p-6 flex flex-col items-center justify-center gap-3"
                                onClick={() => handleRoleSelect("CUSTOMER")}
                            >
                                <User className="size-8" />
                                <div className="text-center">
                                    <div className="font-semibold text-lg">Cliente</div>
                                    <div className="text-sm text-muted-foreground">
                                        Compre ingressos para eventos
                                    </div>
                                </div>
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full h-auto p-6 flex flex-col items-center justify-center gap-3"
                                onClick={() => handleRoleSelect("ORGANIZER")}
                            >
                                <Building2 className="size-8" />
                                <div className="text-center">
                                    <div className="font-semibold text-lg">Organizador de Eventos</div>
                                    <div className="text-sm text-muted-foreground">
                                        Crie e gerencie seus eventos
                                    </div>
                                </div>
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
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="text-3xl
                            font-bold
                            text-psi-dark
                            dark:text-white">
                                Criar Conta
                            </h1>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={handleBack}
                            >
                                <ArrowLeft className="size-4" />
                            </Button>
                        </div>
                        <p className="text-muted-foreground">
                            {selectedRole === "CUSTOMER" ? "Cadastro como Cliente" : "Cadastro como Organizador"}
                        </p>
                    </div>

                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label 
                                    htmlFor="firstName"
                                    className="text-sm
                                    font-medium
                                    text-foreground">
                                    Nome
                                </label>
                                <Controller
                                    name="firstName"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="firstName"
                                            type="text"
                                            placeholder="Seu nome"
                                            icon={UserCircle}
                                        />
                                    )}
                                />
                                <FieldError message={form.formState.errors.firstName?.message || ""} />
                            </div>

                            <div className="space-y-2">
                                <label 
                                    htmlFor="lastName"
                                    className="text-sm
                                    font-medium
                                    text-foreground">
                                    Sobrenome
                                </label>
                                <Controller
                                    name="lastName"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id="lastName"
                                            type="text"
                                            placeholder="Seu sobrenome"
                                        />
                                    )}
                                />
                                <FieldError message={form.formState.errors.lastName?.message || ""} />
                            </div>
                        </div>

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
                                    />
                                )}
                            />
                            <FieldError message={form.formState.errors.email?.message || ""} />
                        </div>

                        <div className="space-y-2">
                            <label 
                                htmlFor="phone"
                                className="text-sm
                                font-medium
                                text-foreground">
                                Telefone
                            </label>
                            <Controller
                                name="phone"
                                control={form.control}
                                render={({ field }) => (
                                    <InputMask
                                        {...field}
                                        id="phone"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        mask="(00) 00000-0000"
                                        icon={Phone}
                                    />
                                )}
                            />
                            <FieldError message={form.formState.errors.phone?.message || ""} />
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
                                            className="absolute
                                            right-3
                                            top-1/2
                                            transform
                                            -translate-y-1/2
                                            text-muted-foreground
                                            hover:text-foreground
                                            transition-colors
                                            focus:outline-none
                                            focus:ring-2
                                            focus:ring-ring
                                            focus:ring-offset-2
                                            rounded-md
                                            p-1"
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
                            disabled={isCreatingUser}
                        >
                            {isCreatingUser ? (
                                <LoadingButton />
                            ) : (
                                "Criar Conta"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            Já tem uma conta?{" "}
                            <Link href="/login" className="text-psi-primary hover:underline">
                                Entrar
                            </Link>
                        </p>
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
    CadastroForm
}
