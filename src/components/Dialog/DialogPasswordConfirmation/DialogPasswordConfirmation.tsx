"use client"

import { useState } from "react"
import { Lock, Eye, EyeOff } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { useUserCheckPassword } from "@/hooks/User/useUserCheckPassword"
import { Toast } from "@/components/Toast/Toast"
import { LoadingButton } from "@/components/Loading/LoadingButton"
import { useUserCheckPasswordAdmin } from "@/hooks/User/useUserCheckPasswordAdmin"
import { TApiResponse } from "@/types/TApiResponse"

type TDialogPasswordConfirmationProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void | Promise<void>
    title?: string
    description?: string
    isAdmin?: boolean
}

const DialogPasswordConfirmation = ({
    open,
    onOpenChange,
    onConfirm,
    title = "Confirmação de Segurança",
    description = "Por motivos de segurança, digite sua senha para prosseguir.",
    isAdmin = false
}: TDialogPasswordConfirmationProps) => {
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const { mutateAsync: checkPassword, isPending } = useUserCheckPassword()
    const { mutateAsync: checkPasswordAdmin, isPending: isPendingAdmin } = useUserCheckPasswordAdmin()

    const handleConfirm = async () => {
        if (!password.trim()) {
            setError("Por favor, digite sua senha")
            return
        }

        try {
            let response: TApiResponse

            if (isAdmin) {
                response = await checkPasswordAdmin(password)
            } else {
                response = await checkPassword(password)
            }
            
            if (response?.success === true) {
                setError(null)
                setPassword("")
                await onConfirm()
                onOpenChange(false)
            } else {
                setError("Senha incorreta. Tente novamente.")
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || "Senha incorreta. Tente novamente."
            setError(errorMessage)
            Toast.error(errorMessage)
        }
    }

    const handleCancel = () => {
        setPassword("")
        setError(null)
        onOpenChange(false)
    }

    const handleOpenChangeWrapper = (newOpen: boolean) => {
        if (!newOpen) {
            setPassword("")
            setError(null)
        }
        onOpenChange(newOpen)
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChangeWrapper}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-full bg-psi-primary/10 flex items-center justify-center">
                            <Lock className="h-5 w-5 text-psi-primary" />
                        </div>
                        {title}
                    </DialogTitle>
                    <DialogDescription className="pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <label className="block text-sm font-medium text-psi-dark mb-2">
                            Senha *
                        </label>
                        <div className="relative">
                            <Input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                    if (error) setError(null)
                                }}
                                placeholder="Digite sua senha"
                                icon={Lock}
                                className="pr-10"
                                required
                                disabled={isPending}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-psi-dark/60 hover:text-psi-dark transition-colors"
                                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                                disabled={isPending}
                            >
                                {showPassword ? (
                                    <EyeOff className="size-4" />
                                ) : (
                                    <Eye className="size-4" />
                                )}
                            </button>
                        </div>
                        {error && (
                            <p className="mt-2 text-sm text-destructive">{error}</p>
                        )}
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isPending}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={isPending || !password.trim()}
                    >
                        {isPending ? (
                            <LoadingButton />
                        ) : (
                            "Confirmar"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogPasswordConfirmation
}

