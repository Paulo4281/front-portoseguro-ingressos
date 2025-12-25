"use client"

import { CreditCard, AlertCircle } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type TDialogCreditCardErrorProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogCreditCardError = ({
    open,
    onOpenChange
}: TDialogCreditCardErrorProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-amber-600">
                        <AlertCircle className="h-5 w-5" />
                        Pagamento não autorizado
                    </DialogTitle>
                    <DialogDescription>
                        O pagamento com cartão de crédito não pôde ser processado
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
                        <div className="flex items-start gap-3">
                            <CreditCard className="h-5 w-5 text-amber-600 mt-0.5 shrink-0" />
                            <div className="flex-1 space-y-2">
                                <p className="text-base font-medium text-psi-dark">
                                    Infelizmente, o pagamento não foi autorizado pela operadora do cartão de crédito.
                                </p>
                                <p className="text-sm text-psi-dark/70">
                                    Não se preocupe! Isso pode acontecer por diversos motivos e não significa que há um problema com sua conta ou com a plataforma.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-3">
                        <h3 className="font-medium text-psi-dark flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-psi-primary" />
                            O que você pode fazer:
                        </h3>
                        <ul className="space-y-2 text-sm text-psi-dark/70 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="text-psi-primary mt-1">•</span>
                                <span>Tente novamente com outro cartão de crédito</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-psi-primary mt-1">•</span>
                                <span>Verifique se os dados do cartão estão corretos (número, validade, CVV e nome do portador)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-psi-primary mt-1">•</span>
                                <span>Entre em contato com a operadora do seu cartão para verificar se há alguma restrição</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-psi-primary mt-1">•</span>
                                <span>Considere utilizar a opção de pagamento via PIX, que é processado instantaneamente</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-psi-dark/10 bg-psi-dark/5 p-4 space-y-2">
                        <h3 className="font-medium text-psi-dark text-sm">
                            Possíveis motivos para a não autorização:
                        </h3>
                        <ul className="space-y-1.5 text-sm text-psi-dark/70 ml-4">
                            <li className="flex items-start gap-2">
                                <span className="text-psi-dark/40 mt-1">•</span>
                                <span>Inconsistência nas informações do cartão (dados não conferem com os cadastrados na operadora)</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-psi-dark/40 mt-1">•</span>
                                <span>Sistema de anti-fraude identificou alguma inadequação na transação</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-psi-dark/40 mt-1">•</span>
                                <span>Cartão pode estar bloqueado ou com restrições temporárias</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-psi-dark/40 mt-1">•</span>
                                <span>Limite do cartão pode estar insuficiente ou excedido</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-psi-dark/40 mt-1">•</span>
                                <span>Operadora pode estar realizando manutenção ou com instabilidade no sistema</span>
                            </li>
                        </ul>
                    </div>

                    <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-4">
                        <p className="text-sm text-psi-dark/80 leading-relaxed">
                            <strong className="text-psi-dark">Importante:</strong> Seu pedido não foi processado e nenhum valor foi cobrado. 
                            Você pode tentar novamente a qualquer momento com outro cartão ou método de pagamento.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => onOpenChange(false)}
                    >
                        Entendi, obrigado
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogCreditCardError
}
