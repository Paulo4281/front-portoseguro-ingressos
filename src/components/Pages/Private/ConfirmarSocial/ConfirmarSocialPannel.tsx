"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { User, Building2, Mail, Phone, UserCircle, ArrowLeft, Lock, Eye, EyeOff, FileText } from "lucide-react"
import { UserConfirmSocialValidator } from "@/validators/User/UserValidator"
import { TUserConfirmSocial } from "@/types/User/TUser"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { PasswordStrength } from "@/components/PasswordStrength/PasswordStrength"
import { useUserConfirmSocial } from "@/hooks/User/useUserConfirmSocial"
import { useRouter } from "next/navigation"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"
import { useAuthStore } from "@/stores/Auth/AuthStore"

const ConfirmarSocialPannel = () => {
    const [selectedRole, setSelectedRole] = useState<"CUSTOMER" | "ORGANIZER" | null>(null)
    const [showPassword, setShowPassword] = useState(false)
    const { user } = useAuthStore()
    const routerService = useRouter()

    const form = useForm<TUserConfirmSocial>({
        resolver: zodResolver(UserConfirmSocialValidator),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            role: undefined,
            password: ""
        }
    })

    const { mutateAsync: confirmSocial, isPending: isConfirmingSocial } = useUserConfirmSocial()
    const { setUser } = useAuthStore()

    const passwordValue = form.watch("password")

    useEffect(() => {
        if (user) {
            form.setValue("firstName", user.firstName)
            form.setValue("lastName", user.lastName)
            form.setValue("email", user.email)
        }
    }, [user, form])

    useEffect(() => {
        if (user && user.role !== "NOT_DEFINED") {
            routerService.push("/")
        }
    }, [user, routerService])

    const handleRoleSelect = (role: "CUSTOMER" | "ORGANIZER") => {
        setSelectedRole(role)
        form.setValue("role", role)
    }

    const handleBack = () => {
        setSelectedRole(null)
        form.reset({
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            role: undefined,
            password: ""
        })
    }

    const handleSubmit = async (data: TUserConfirmSocial) => {
        const response = await confirmSocial(data)
        if (response && response.success && response.data?.user) {
            setUser(response.data.user)
            routerService.push("/")
        }
    }

    if (!user) {
        return null
    }

    if (!selectedRole) {
        return (
            <AuthLayout>
                <div className="mb-8 text-center">
                    <h1 className="text-3xl
                    font-semibold
                    text-psi-dark
                    dark:text-white
                    mb-2">
                        Complete seu Cadastro
                    </h1>
                    <p className="text-muted-foreground">
                        Escolha o tipo de cadastro
                    </p>
                </div>

                <div className="space-y-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg w-full h-auto p-6 flex flex-col items-center justify-center gap-3"
                        onClick={() => handleRoleSelect("CUSTOMER")}
                    >
                        <User className="size-8" />
                        <div className="text-left">
                            <div className="font-medium text-lg">Cliente</div>
                            <div className="text-sm text-muted-foreground">
                                Compre ingressos para eventos
                            </div>
                        </div>
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        className="rounded-lg w-full h-auto p-6 flex flex-col items-center justify-center gap-3"
                        onClick={() => handleRoleSelect("ORGANIZER")}
                    >
                        <Building2 className="size-8" />
                        <div className="text-left">
                            <div className="font-medium text-lg">Organizador de Eventos</div>
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
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <h1 className="text-3xl
                    font-semibold
                    text-psi-dark
                    dark:text-white">
                        Complete seu Cadastro
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
                                    disabled
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
                                    disabled
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
                                disabled
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
                                required
                            />
                        )}
                    />
                    <FieldError message={form.formState.errors.phone?.message || ""} />
                </div>

                <div className="space-y-2">
                    <label 
                        htmlFor="document"
                        className="text-sm
                        font-medium
                        text-foreground">
                        CPF
                    </label>
                    <Controller
                        name="document"
                        control={form.control}
                        render={({ field }) => (
                            <InputMask
                                {...field}
                                id="document"
                                type="text"
                                placeholder="000.000.000-00"
                                mask="000.000.000-00"
                                icon={FileText}
                                required
                            />
                        )}
                    />
                    <FieldError message={form.formState.errors.document?.message || ""} />
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
                                    required
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
                    disabled={isConfirmingSocial}
                >
                    {isConfirmingSocial ? (
                        <LoadingButton />
                    ) : (
                        "Confirmar Cadastro"
                    )}
                </Button>
            </form>

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
    ConfirmarSocialPannel
}
