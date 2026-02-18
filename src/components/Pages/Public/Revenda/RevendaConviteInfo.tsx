"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { AlertCircle, ArrowLeft, Facebook, FileText, Instagram, Lock, Mail, Phone, UserCircle } from "lucide-react"
import { AuthLayout } from "@/components/Layout/AuthLayout/AuthLayout"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { PasswordStrength } from "@/components/PasswordStrength/PasswordStrength"
import { Toast } from "@/components/Toast/Toast"
import { DefaultFormErrors } from "@/utils/Errors/DefaultFormErrors"
import { useResaleVerifyInvite } from "@/hooks/Resale/useResaleVerifyInvite"
import { useUserCreateSeller } from "@/hooks/User/useUserCreateSeller"
import type { TVerifyInviteOrganizerInfo } from "@/types/Resale/TResale"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { DocumentUtils } from "@/utils/Helpers/DocumentUtils/DocumentUtils"
import TextLengthLimiter from "@/utils/Helpers/TextLengthLimiter/TextLengthLimiter"

const schema = z.object({
    firstName: z.string().min(1, DefaultFormErrors.required),
    lastName: z.string().min(1, DefaultFormErrors.required),
    email: z.string().email(DefaultFormErrors.email),
    phone: z.string().min(1, DefaultFormErrors.required),
    document: z.string().min(1, DefaultFormErrors.required),
    password: z.string().min(8, DefaultFormErrors.passwordMinLength),
    confirmPassword: z.string().min(1, DefaultFormErrors.required)
}).superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
        ctx.addIssue({ code: "custom", path: ["confirmPassword"], message: DefaultFormErrors.passwordMatch })
    }
})

type TForm = z.infer<typeof schema>

const onlyDigits = (value: string) => value.replace(/\D/g, "")

const RevendaConviteInfo = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const siid = searchParams.get("siid")
    const [inviteError, setInviteError] = useState<string | null>(null)
    const [organizerInfo, setOrganizerInfo] = useState<TVerifyInviteOrganizerInfo | null>(null)

    const { mutateAsync: verifyInvite, isPending: isVerifying } = useResaleVerifyInvite()
    const { mutateAsync: createSeller, isPending: isCreating } = useUserCreateSeller()

    const form = useForm<TForm>({
        resolver: zodResolver(schema),
        defaultValues: { firstName: "", lastName: "", email: "", phone: "", document: "", password: "", confirmPassword: "" }
    })

    useEffect(() => {
        if (!siid) return
        verifyInvite(siid)
            .then((res) => {
                if (!res?.success || !res.data?.email) {
                    setInviteError(res?.message ?? "Convite inválido ou já utilizado.")
                    return
                }
                form.setValue("email", res.data.email)
                setOrganizerInfo(res.data.organizer ?? null)
            })
            .catch(() => setInviteError("Não foi possível validar o convite."))
    }, [siid, verifyInvite, form])

    const onSubmit = async (values: TForm) => {
        if (!siid) return Toast.error("Código de convite ausente.")
        const response = await createSeller({
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            email: values.email.trim().toLowerCase(),
            phone: onlyDigits(values.phone),
            document: onlyDigits(values.document),
            password: values.password,
            invitationCode: siid
        }).catch(() => null)

        if (!response?.success) {
            Toast.error(response?.message ?? "Não foi possível concluir o cadastro.")
            return
        }

        Toast.success("Cadastro concluído com sucesso.")
        router.push("/login")
    }

    if (!siid || inviteError) {
        return (
            <AuthLayout>
                <div className="text-center">
                    <AlertCircle className="mx-auto mb-3 size-8 text-destructive" />
                    <h1 className="text-xl font-semibold text-psi-dark dark:text-white">Convite inválido</h1>
                    <p className="mt-2 text-sm text-muted-foreground">{inviteError ?? "Esta URL precisa do parâmetro siid."}</p>
                    <Button asChild variant="outline" className="mt-5">
                        <Link href="/"><ArrowLeft className="size-4" />Voltar</Link>
                    </Button>
                </div>
            </AuthLayout>
        )
    }

    if (isVerifying) {
        return <AuthLayout><p className="text-center text-muted-foreground">Validando convite...</p></AuthLayout>
    }

    return (
        <AuthLayout>
            <h1 className="mb-6 text-2xl font-semibold text-psi-dark dark:text-white">Aceitar convite de revenda</h1>
            {organizerInfo && (
                <div className="mb-6 rounded-xl border border-[#E4E6F0] bg-muted/30 p-4">
                    <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">Organizador</p>
                    <div className="flex gap-3">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-psi-primary/10">
                            {organizerInfo.logo ? (
                                <img src={ImageUtils.getOrganizerLogoUrl(organizerInfo.logo)} alt="Logo do organizador" className="h-full w-full object-cover" />
                            ) : (
                                <UserCircle className="size-8 text-psi-primary" />
                            )}
                        </div>
                        <div className="min-w-0 text-sm">
                            {organizerInfo.companyName && <p className="font-medium text-foreground">{organizerInfo.companyName}</p>}
                            {organizerInfo.companyDocument && <p className="text-muted-foreground">{DocumentUtils.formatCnpj(organizerInfo.companyDocument)}</p>}
                            {organizerInfo.companyAddress && <p className="text-muted-foreground">{organizerInfo.companyAddress}</p>}
                            {organizerInfo.description && <p className="mt-1 text-muted-foreground">{TextLengthLimiter(organizerInfo.description, 120)}</p>}
                            <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
                                {organizerInfo.instagramUrl && (
                                    <a
                                        href={organizerInfo.instagramUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-psi-primary underline underline-offset-2 transition-colors hover:text-psi-dark dark:hover:text-white"
                                    >
                                        <Instagram className="size-5" />
                                    </a>
                                )}
                                {organizerInfo.facebookUrl && (
                                    <a
                                        href={organizerInfo.facebookUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-psi-primary underline underline-offset-2 transition-colors hover:text-psi-dark dark:hover:text-white"
                                    >
                                        <Facebook className="size-5" />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <Controller name="firstName" control={form.control} render={({ field }) => <Input {...field} icon={UserCircle} placeholder="Nome" />} />
                    <Controller name="lastName" control={form.control} render={({ field }) => <Input {...field} placeholder="Sobrenome" />} />
                </div>
                <FieldError message={form.formState.errors.firstName?.message ?? form.formState.errors.lastName?.message ?? ""} />

                <Controller name="email" control={form.control} render={({ field }) => <Input {...field} icon={Mail} placeholder="E-mail" disabled />} />
                <FieldError message={form.formState.errors.email?.message ?? ""} />

                <Controller name="phone" control={form.control} render={({ field }) => <InputMask {...field} mask="(00) 00000-0000" icon={Phone} placeholder="Telefone" />} />
                <FieldError message={form.formState.errors.phone?.message ?? ""} />

                <Controller name="document" control={form.control} render={({ field }) => <InputMask {...field} mask="000.000.000-00" icon={FileText} placeholder="CPF" />} />
                <FieldError message={form.formState.errors.document?.message ?? ""} />

                <Controller name="password" control={form.control} render={({ field }) => <Input {...field} type="password" icon={Lock} placeholder="Senha" />} />
                <PasswordStrength password={form.watch("password") ?? ""} />
                <FieldError message={form.formState.errors.password?.message ?? ""} />

                <Controller name="confirmPassword" control={form.control} render={({ field }) => <Input {...field} type="password" icon={Lock} placeholder="Confirmar senha" />} />
                <FieldError message={form.formState.errors.confirmPassword?.message ?? ""} />

                <Button type="submit" variant="primary" className="w-full" disabled={isCreating}>
                    {isCreating ? "Confirmando..." : "Confirmar cadastro"}
                </Button>
            </form>
        </AuthLayout>
    )
}

export { RevendaConviteInfo }
