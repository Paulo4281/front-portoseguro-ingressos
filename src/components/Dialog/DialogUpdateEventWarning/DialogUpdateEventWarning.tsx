"use client"

import { useState } from "react"
import { AlertTriangle, Edit } from "lucide-react"
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

type TDialogUpdateEventWarningProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
}

const DialogUpdateEventWarning = ({
    open,
    onOpenChange,
    onConfirm
}: TDialogUpdateEventWarningProps) => {
    const [confirmationText, setConfirmationText] = useState("")
    const isConfirmed = confirmationText.trim().toLowerCase() === "editar"

    const handleConfirm = () => {
        if (isConfirmed) {
            onConfirm()
            setConfirmationText("")
            onOpenChange(false)
        }
    }

    const handleCancel = () => {
        setConfirmationText("")
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        Atenção: Editar Evento Publicado
                    </DialogTitle>
                    <DialogDescription>
                        Esta ação pode causar confusão e problemas para os compradores
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                        <p className="text-sm font-semibold text-amber-900 mb-2">
                            ⚠️ Editar um evento publicado é uma ação sensível
                        </p>
                        <p className="text-sm text-amber-800">
                            Alterações em campos como <strong>datas, horários, preços e lotes</strong> podem causar 
                            confusão significativa para quem já comprou ingressos. Essas mudanças podem gerar 
                            reclamações, solicitações de reembolso e prejudicar a confiança na sua organização.
                        </p>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <p className="text-sm font-semibold text-psi-dark mb-2">
                                Campos de Alto Risco:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-psi-dark/70 ml-2">
                                <li>Datas e horários do evento</li>
                                <li>Preços e valores dos ingressos</li>
                                <li>Lotes e quantidades disponíveis</li>
                                <li>Localização do evento</li>
                            </ul>
                        </div>

                        <div>
                            <p className="text-sm font-semibold text-psi-dark mb-2">
                                Campos de Risco Moderado:
                            </p>
                            <ul className="list-disc list-inside space-y-1 text-sm text-psi-dark/70 ml-2">
                                <li>Nome do evento</li>
                                <li>Descrição e detalhes</li>
                                <li>Categorias</li>
                            </ul>
                            <p className="text-xs text-psi-dark/60 mt-2">
                                Mesmo campos considerados "mais seguros" podem causar confusão se alterados após 
                                a publicação, especialmente se já houver ingressos vendidos.
                            </p>
                        </div>

                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
                            <p className="text-sm font-semibold text-psi-dark mb-1">
                                Recomendação:
                            </p>
                            <p className="text-sm text-psi-dark/70">
                                Evite realizar alterações em eventos que já foram publicados e, principalmente, 
                                em eventos que já possuem ingressos vendidos. Se a alteração for realmente 
                                necessária, considere comunicar os compradores antecipadamente.
                            </p>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-psi-dark/10">
                        <label className="block text-sm font-medium text-psi-dark mb-2">
                            Para prosseguir, digite <strong>"Editar"</strong> abaixo:
                        </label>
                        <Input
                            value={confirmationText}
                            onChange={(e) => setConfirmationText(e.target.value)}
                            placeholder="Digite 'Editar' para confirmar"
                            icon={Edit}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={!isConfirmed}
                    >
                        Desejo prosseguir mesmo assim
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogUpdateEventWarning
}
