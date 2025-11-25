"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

type TDialogConfirmProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void | Promise<void>
    title?: string
    description?: string
    confirmText?: string
    cancelText?: string
    isLoading?: boolean
    variant?: "default" | "destructive"
}

const DialogConfirm = ({
    open,
    onOpenChange,
    onConfirm,
    title = "Tem certeza?",
    description = "Esta ação não pode ser desfeita.",
    confirmText = "Confirmar",
    cancelText = "Cancelar",
    isLoading = false,
    variant = "default"
}: TDialogConfirmProps) => {
    const handleConfirm = async () => {
        await onConfirm()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                            <AlertTriangle className="h-5 w-5 text-amber-600" />
                        </div>
                        <DialogTitle>{title}</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        {description}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        {cancelText}
                    </Button>
                    <Button
                        type="button"
                        variant={variant === "destructive" ? "destructive" : "primary"}
                        onClick={handleConfirm}
                        disabled={isLoading}
                    >
                        {confirmText}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogConfirm
}
