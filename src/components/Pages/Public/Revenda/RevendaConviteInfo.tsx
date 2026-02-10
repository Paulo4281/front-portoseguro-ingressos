"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { z } from "zod"
import {
    UserCircle,
    ArrowLeft,
    Lock,
    Eye,
    EyeOff,
    FileText,
    Mail,
    AlertCircle,
    Phone
} from "lucide-react"
import type { TOrganizerInfo } from "@/types/Resale/TResale"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { PasswordStrength } from "@/components/PasswordStrength/PasswordStrength"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"

const RevendaConviteFormValidator = z
    .object({
        firstName: z.string().min(1, DefaultFormErrors.required),
        lastName: z.string().min(1, DefaultFormErrors.required),
        email: z.string().min(1, DefaultFormErrors.required).email({ message: DefaultFormErrors.email }),
        document: z.string().min(1, DefaultFormErrors.required),
        password: z.string().min(1, DefaultFormErrors.required),
        confirmPassword: z.string().min(1, DefaultFormErrors.required)
    })
    .superRefine((data, ctx) => {
        if (!data.password) return
        if (data.password.length < 8) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: DefaultFormErrors.passwordMinLength
            })
            return
        }
        if (!/[A-Z]/.test(data.password)) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: DefaultFormErrors.passwordUppercase
            })
            return
        }
        if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(data.password)) {
            ctx.addIssue({
                code: "custom",
                path: ["password"],
                message: DefaultFormErrors.passwordSpecialChar
            })
        }
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: DefaultFormErrors.passwordMatch
            })
        }
    })

type TRevendaConviteForm = z.infer<typeof RevendaConviteFormValidator>

/** Mock: simula validação do siid, e-mail e dados do organizador. No futuro virá do backend. */
const mockFetchInviteBySiid = async (
    siid: string
): Promise<{ valid: boolean; email: string; organizer: TOrganizerInfo }> => {
    await new Promise((r) => setTimeout(r, 400))
    if (!siid || siid.trim() === "") {
        return { valid: false, email: "", organizer: { name: "", phone: "", email: "", image: null } }
    }
    return {
        valid: true,
        email: `convite-${siid.slice(0, 8)}@revenda.mock`,
        organizer: {
            name: "Organizador Porto Seguro",
            phone: "(11) 98765-4321",
            email: "organizador@portoseguro-ingressos.mock",
            image: null
        }
    }
}

const RevendaConviteInfo = () => {
    const searchParams = useSearchParams()
    const siid = searchParams.get("siid")

    const [showPassword, setShowPassword] = useState(false)
    const [inviteLoading, setInviteLoading] = useState(!!siid)
    const [inviteError, setInviteError] = useState<string | null>(null)
    const [inviteEmail, setInviteEmail] = useState<string | null>(null)
    const [inviteOrganizer, setInviteOrganizer] = useState<TOrganizerInfo | null>(null)
    const [submitSuccess, setSubmitSuccess] = useState(false)

    const form = useForm<TRevendaConviteForm>({
        resolver: zodResolver(RevendaConviteFormValidator),
        defaultValues: {
            firstName: "",
            lastName: "",
            email: "",
            document: "",
            password: "",
            confirmPassword: ""
        }
    })

    useEffect(() => {
        if (!siid) return
        let cancelled = false
        setInviteLoading(true)
        setInviteError(null)
        mockFetchInviteBySiid(siid)
            .then((res) => {
                if (cancelled) return
                if (!res.valid) {
                    setInviteError("Convite inválido ou expirado.")
                    return
                }
                setInviteEmail(res.email)
                setInviteOrganizer(res.organizer)
                form.setValue("email", res.email)
            })
            .catch(() => {
                if (!cancelled) setInviteError("Não foi possível validar o convite. Tente novamente.")
            })
            .finally(() => {
                if (!cancelled) setInviteLoading(false)
            })
        return () => {
            cancelled = true
        }
    }, [siid])

    const passwordValue = form.watch("password")

    const handleSubmit = async (data: TRevendaConviteForm) => {
        await new Promise((r) => setTimeout(r, 600))
        setSubmitSuccess(true)
    }

    if (siid === null || siid === undefined) {
        return (
            <AuthLayout>
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                        <AlertCircle className="size-6" />
                    </div>
                    <h1 className="text-2xl font-semibold text-psi-dark dark:text-white mb-2">
                        Link inválido
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Esta página exige um código de convite (siid) na URL. Verifique o link que você recebeu.
                    </p>
                    <Button asChild variant="outline" className="w-full max-w-xs mx-auto">
                        <Link href="/" className="flex items-center justify-center">
                            <ArrowLeft className="size-4 mr-2" />
                            Voltar ao início
                        </Link>
                    </Button>
                </div>
            </AuthLayout>
        )
    }

    if (inviteLoading) {
        return (
            <AuthLayout>
                <div className="mb-8 text-center">
                    <p className="text-muted-foreground">Validando convite...</p>
                    <div className="mt-4 h-8 w-8 animate-spin rounded-full border-2 border-psi-primary border-t-transparent mx-auto" />
                </div>
            </AuthLayout>
        )
    }

    if (inviteError) {
        return (
            <AuthLayout>
                <div className="mb-8 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-4">
                        <AlertCircle className="size-6" />
                    </div>
                    <h1 className="text-2xl font-semibold text-psi-dark dark:text-white mb-2">
                        Convite inválido
                    </h1>
                    <p className="text-muted-foreground mb-6">{inviteError}</p>
                    <Button asChild variant="outline" className="w-full max-w-xs mx-auto">
                        <Link href="/" className="flex items-center justify-center">
                            <ArrowLeft className="size-4 mr-2" />
                            Voltar ao início
                        </Link>
                    </Button>
                </div>
            </AuthLayout>
        )
    }

    if (submitSuccess) {
        return (
            <AuthLayout>
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold text-psi-dark dark:text-white mb-2">
                        Cadastro recebido
                    </h1>
                    <p className="text-muted-foreground mb-6">
                        Em breve você poderá acessar a plataforma com seu e-mail e senha. (Mock)
                    </p>
                    <Button asChild variant="primary" className="w-full max-w-xs mx-auto">
                        <Link href="/login">Ir para o login</Link>
                    </Button>
                </div>
            </AuthLayout>
        )
    }

    return (
        <AuthLayout>
            <div className="mb-8">
                <h1 className="text-3xl font-semibold text-psi-dark dark:text-white">
                    Aceitar convite – Revendedor
                </h1>
                <p className="text-muted-foreground mt-1">
                    Preencha seus dados para concluir o cadastro como revendedor.
                </p>
            </div>

            {inviteOrganizer && (
                <div className="rounded-xl border border-[#E4E6F0] bg-muted/30 p-4 mb-6">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                        Quem está convidando
                    </p>
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-psi-primary/10 flex items-center justify-center overflow-hidden shrink-0">
                            {inviteOrganizer.image ? (
                                <img
                                    src={inviteOrganizer.image}
                                    alt=""
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <UserCircle className="size-8 text-psi-primary" />
                            )}
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="font-medium text-foreground truncate">{inviteOrganizer.name}</p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1 truncate">
                                    <Mail className="size-3.5 shrink-0" />
                                    {inviteOrganizer.email}
                                </span>
                                {inviteOrganizer.phone && (
                                    <span className="flex items-center gap-1">
                                        <Phone className="size-3.5 shrink-0" />
                                        {inviteOrganizer.phone}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label
                            htmlFor="revenda-firstName"
                            className="text-sm font-medium text-foreground"
                        >
                            Nome
                        </label>
                        <Controller
                            name="firstName"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="revenda-firstName"
                                    type="text"
                                    placeholder="Seu nome"
                                    icon={UserCircle}
                                />
                            )}
                        />
                        <FieldError message={form.formState.errors.firstName?.message ?? ""} />
                    </div>
                    <div className="space-y-2">
                        <label
                            htmlFor="revenda-lastName"
                            className="text-sm font-medium text-foreground"
                        >
                            Sobrenome
                        </label>
                        <Controller
                            name="lastName"
                            control={form.control}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id="revenda-lastName"
                                    type="text"
                                    placeholder="Seu sobrenome"
                                />
                            )}
                        />
                        <FieldError message={form.formState.errors.lastName?.message ?? ""} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="revenda-email"
                        className="text-sm font-medium text-foreground"
                    >
                        E-mail
                    </label>
                    <Controller
                        name="email"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="revenda-email"
                                type="email"
                                placeholder="seu@email.com"
                                icon={Mail}
                                disabled
                            />
                        )}
                    />
                    <p className="text-xs text-muted-foreground">
                        E-mail definido no convite (não editável).
                    </p>
                    <FieldError message={form.formState.errors.email?.message ?? ""} />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="revenda-document"
                        className="text-sm font-medium text-foreground"
                    >
                        CPF
                    </label>
                    <Controller
                        name="document"
                        control={form.control}
                        render={({ field }) => (
                            <InputMask
                                {...field}
                                id="revenda-document"
                                type="text"
                                placeholder="000.000.000-00"
                                mask="000.000.000-00"
                                icon={FileText}
                                inputMode="numeric"
                            />
                        )}
                    />
                    <FieldError message={form.formState.errors.document?.message ?? ""} />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="revenda-password"
                        className="text-sm font-medium text-foreground"
                    >
                        Senha
                    </label>
                    <Controller
                        name="password"
                        control={form.control}
                        render={({ field }) => (
                            <div className="relative">
                                <Input
                                    {...field}
                                    id="revenda-password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Sua senha"
                                    icon={Lock}
                                    className="pr-10"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md p-1"
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
                    <PasswordStrength password={passwordValue ?? ""} />
                    <FieldError message={form.formState.errors.password?.message ?? ""} />
                </div>

                <div className="space-y-2">
                    <label
                        htmlFor="revenda-confirmPassword"
                        className="text-sm font-medium text-foreground"
                    >
                        Confirmar senha
                    </label>
                    <Controller
                        name="confirmPassword"
                        control={form.control}
                        render={({ field }) => (
                            <Input
                                {...field}
                                id="revenda-confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Repita a senha"
                                icon={Lock}
                            />
                        )}
                    />
                    <FieldError message={form.formState.errors.confirmPassword?.message ?? ""} />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    className="w-full"
                    size="lg"
                >
                    Confirmar
                </Button>
            </form>

            <div className="mt-6 text-center">
                <Button asChild variant="ghost" className="w-full">
                    <Link href="/" className="flex items-center justify-center">
                        <ArrowLeft className="size-4 mr-2" />
                        Voltar ao início
                    </Link>
                </Button>
            </div>
        </AuthLayout>
    )
}

export { RevendaConviteInfo }
