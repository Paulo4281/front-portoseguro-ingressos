"use client"

import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Link from "next/link"
import { ArrowLeft, Loader2, CheckCircle2, LogIn } from "lucide-react"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { Timer } from "@/components/Timer/Timer"
import { UserCreateConfirmValidator } from "@/validators/User/UserConfirmationValidator"
import { TUserCreateConfirm } from "@/types/User/TUserConfirmation"
import { Button } from "@/components/ui/button"
import { FieldError } from "@/components/FieldError/FieldError"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { useSearchParamsHook } from "@/hooks/useSearchParams"
import { useUserConfirmByCode } from "@/hooks/UserConfirmation/useUserConfirmationConfirmByCode"
import { useUserResendConfirmation } from "@/hooks/UserConfirmation/useUserConfirmationResendConfirmation"
import { Toast } from "@/components/Toast/Toast"

type TSearchParams = {
    name?: string
    email?: string
    link?: string
}

const CadastroConfirmarForm = () => {
    const searchParams = useSearchParamsHook<TSearchParams>(["name", "email", "link"])
    const { mutateAsync: confirmByCode, isPending: isConfirmingByCodeMutation } = useUserConfirmByCode()
    const { mutateAsync: resendConfirmation, isPending: isResendingConfirmation } = useUserResendConfirmation()
    const [isConfirmed, setIsConfirmed] = useState(false)
    const [canResend, setCanResend] = useState(false)
    const [timerKey, setTimerKey] = useState(0)
    const [hasResent, setHasResent] = useState(false)

    useEffect(() => {
        if (!searchParams.link && !hasResent) {
            setCanResend(false)
            setTimerKey((prev) => prev + 1)
        }
    }, [searchParams.link, hasResent])

    useEffect(() => {
        if (searchParams.link) {
            const handleConfirmByLink = async () => {
                const response = await confirmByCode({
                    code: searchParams.link!,
                    email: searchParams.email!
                })
                if (response.success && response.data?.isValid) {
                    setIsConfirmed(true)
                }
            }
            handleConfirmByLink()
        }
    }, [searchParams.link, confirmByCode])
    
    const form = useForm<TUserCreateConfirm>({
        resolver: zodResolver(UserCreateConfirmValidator),
        defaultValues: {
            code: ""
        }
    })

    const handleSubmit = async (data: TUserCreateConfirm) => {
        const response = await confirmByCode({
            code: data.code,
            email: searchParams.email!
        })
        if (response &&response.success && response.data?.isValid) {
            setIsConfirmed(true)
        }
    }

    const firstName = searchParams.name?.split(" ")[0] || "Usuário"
    const isConfirmingByLink = !!searchParams.link

    if (isConfirmed) {
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
                            <div className="flex justify-center mb-4">
                                <CheckCircle2 className="size-16 text-green-500" />
                            </div>
                            <h1 className="text-3xl
                            font-bold
                            text-psi-dark
                            dark:text-white
                            mb-2">
                                Cadastro Confirmado!
                            </h1>
                            <p className="text-muted-foreground">
                                Seu cadastro foi confirmado com sucesso.
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
                    </div>
                </div>
            </div>
        )
    }

    if (isConfirmingByLink) {
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
                                Confirmar Cadastro
                            </h1>
                            <div className="space-y-2">
                                <p className="text-muted-foreground">
                                    Olá, <span className="font-semibold text-foreground">{firstName}</span>!
                                </p>
                                <p className="text-sm text-muted-foreground mt-4">
                                    Verificando o link de confirmação...
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center py-2">
                            {isConfirmingByCodeMutation ? (
                                <>
                                    <Loader2 className="size-12 text-psi-primary animate-spin mb-4" />
                                    <p className="text-muted-foreground text-center">
                                        Aguarde enquanto validamos seu link de confirmação.
                                    </p>
                                </>
                            ) : (
                                <p className="text-muted-foreground text-center">
                                    Processando...
                                </p>
                            )}
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
                    <div className="mb-8 text-center">
                        <h1 className="text-3xl
                        font-bold
                        text-psi-dark
                        dark:text-white
                        mb-2">
                            Confirmar Cadastro
                        </h1>
                        <div className="space-y-2">
                            <p className="text-muted-foreground">
                                Olá, <span className="font-semibold text-foreground">{firstName}</span>!
                            </p>
                            <p className="text-sm text-muted-foreground mt-4">
                                Digite o código de 6 dígitos enviado para seu e-mail <span className="font-semibold text-foreground">{searchParams.email}</span> para confirmar seu cadastro.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <label 
                                htmlFor="code"
                                className="text-sm
                                font-medium
                                text-foreground
                                block
                                text-center">
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

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            size="lg"
                            disabled={isConfirmingByCodeMutation}
                        >
                            {isConfirmingByCodeMutation ? (
                                <LoadingButton />
                            ) : (
                                "Confirmar Cadastro"
                            )}
                        </Button>
                    </form>

                    <div className="mt-6 text-center space-y-4">
                        <p className="text-sm text-muted-foreground">
                            Ainda não recebeu o código?{" "}
                            {hasResent ? (
                                <span className="text-muted-foreground text-sm block">
                                    Se o código ainda não chegou aguarde. Ou entre em contato com o suporte.
                                </span>
                            ) : canResend ? (
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (hasResent) {
                                            return
                                        }
                                        try {
                                            setHasResent(true)
                                            await resendConfirmation(searchParams.email!)
                                            Toast.success("Código reenviado com sucesso!")
                                        } catch (error) {
                                            Toast.error("Erro ao reenviar código. Tente novamente.")
                                            setHasResent(true)
                                        }
                                    }}
                                    disabled={isResendingConfirmation || hasResent}
                                    className="text-psi-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isResendingConfirmation ? "Reenviando..." : "Reenviar"}
                                </button>
                            ) : (
                                <>
                                    <span className="text-muted-foreground">Reenviar em </span>
                                    <Timer
                                        key={timerKey}
                                        seconds={10}
                                        onFinish={() => setCanResend(true)}
                                        variant="badge"
                                    />
                                </>
                            )}
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

export default CadastroConfirmarForm
