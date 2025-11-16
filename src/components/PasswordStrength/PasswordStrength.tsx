"use client"

import { Check, X } from "lucide-react"

type TPasswordStrengthProps = {
    password: string
}

const PasswordStrengthComponent = (
    {
        password
    }: TPasswordStrengthProps
) => {
    const checks = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasSpecialChar: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)
    }

    const allValid = checks.minLength && checks.hasUppercase && checks.hasSpecialChar

    if (!password) {
        return null
    }

    return (
        <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-sm">
                {checks.minLength ? (
                    <Check className="size-4 text-green-500" />
                ) : (
                    <X className="size-4 text-red-500" />
                )}
                <span className={checks.minLength ? "text-green-500" : "text-muted-foreground"}>
                    8 caracteres
                </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                {checks.hasUppercase ? (
                    <Check className="size-4 text-green-500" />
                ) : (
                    <X className="size-4 text-red-500" />
                )}
                <span className={checks.hasUppercase ? "text-green-500" : "text-muted-foreground"}>
                    1 letra maiúscula
                </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
                {checks.hasSpecialChar ? (
                    <Check className="size-4 text-green-500" />
                ) : (
                    <X className="size-4 text-red-500" />
                )}
                <span className={checks.hasSpecialChar ? "text-green-500" : "text-muted-foreground"}>
                    1 caractere especial
                </span>
            </div>
            {allValid && (
                <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-md border border-green-200 dark:border-green-800">
                    <p className="text-sm text-green-700 dark:text-green-400 font-medium">
                        Senha válida!
                    </p>
                </div>
            )}
        </div>
    )
}

export {
    PasswordStrengthComponent as PasswordStrength
}

