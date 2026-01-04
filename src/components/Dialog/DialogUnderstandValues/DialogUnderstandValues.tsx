"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ArrowRight, Minus, Plus, Equal, Calculator, Info } from "lucide-react"
import type { TPaymentAdminListResponse } from "@/types/Payment/TPayment"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"

type TDialogUnderstandValuesProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
    payment: TPaymentAdminListResponse | null
}

const DialogUnderstandValues = ({
    open,
    onOpenChange,
    payment
}: TDialogUnderstandValuesProps) => {
    if (!payment) return null

    const grossValue = payment.grossValue || 0
    const discountedValue = payment.discountedValue || 0
    const customerFee = payment.customerFee || 0
    const customerPaymentFee = payment.customerPaymentFee || 0
    const organizerFee = payment.organizerFee || 0
    const platformPaymentFee = payment.platformPaymentFee || 0
    const gatewayFeeGain = payment.gatewayFeeGain || 0
    const organizerPayout = payment.organizerPayout || 0
    const netValue = payment.netValue || 0
    const totalPaidByCustomer = payment.totalPaidByCustomer || payment.grossValue

    const valueAfterDiscount = grossValue - discountedValue

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-psi-primary/10 flex items-center justify-center">
                            <Calculator className="h-5 w-5 text-psi-primary" />
                        </div>
                        <DialogTitle>Como os Valores são Calculados</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        Entenda o fluxo de cálculo desde o valor bruto até o total pago pelo cliente
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    <div className="space-y-4">
                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-5 space-y-3">
                            <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                <span className="text-lg font-bold text-psi-primary">1.</span>
                                Valor Bruto
                            </h3>
                            <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                É a soma de todos os ingressos comprados pelo cliente. Este é o valor base antes de qualquer desconto ou taxa.
                            </p>
                            <div className="pl-7 pt-2 border-t border-psi-primary/20">
                                <p className="text-sm font-semibold text-psi-primary">
                                    {ValueUtils.centsToCurrency(grossValue)}
                                </p>
                                <p className="text-xs font-mono text-psi-dark/60 mt-1">
                                    Valor Bruto = Soma de todos os ingressos
                                </p>
                            </div>
                        </div>

                        {discountedValue > 0 && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
                                <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                    <span className="text-lg font-bold text-emerald-600">2.</span>
                                    Desconto
                                </h3>
                                <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                    Se o cliente utilizou um cupom de desconto, este valor é subtraído do valor bruto. O desconto pode ser um valor fixo ou percentual.
                                </p>
                                <div className="pl-7 pt-2 border-t border-emerald-200">
                                    <p className="text-sm font-semibold text-emerald-600">
                                        -{ValueUtils.centsToCurrency(discountedValue)}
                                    </p>
                                    <p className="text-xs font-mono text-psi-dark/60 mt-1 flex items-center gap-2">
                                        <span>Valor após desconto = {ValueUtils.centsToCurrency(grossValue)}</span>
                                        <Minus className="h-3 w-3" />
                                        <span>{ValueUtils.centsToCurrency(discountedValue)}</span>
                                        <Equal className="h-3 w-3" />
                                        <span className="font-semibold">{ValueUtils.centsToCurrency(valueAfterDiscount)}</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {customerFee > 0 && (
                            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5 space-y-3">
                                <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                    <span className="text-lg font-bold text-amber-600">{discountedValue > 0 ? "3." : "2."}</span>
                                    Taxa do Cliente
                                </h3>
                                <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                    Taxa adicional cobrada do cliente. Esta taxa é somada ao valor dos ingressos e faz parte do total pago pelo cliente.
                                </p>
                                <div className="pl-7 pt-2 border-t border-amber-200">
                                    <p className="text-sm font-semibold text-amber-600">
                                        {ValueUtils.centsToCurrency(customerFee)}
                                    </p>
                                    <p className="text-xs font-mono text-psi-dark/60 mt-1">
                                        Taxa do Cliente = Calculada sobre o valor base
                                    </p>
                                </div>
                            </div>
                        )}

                        {customerPaymentFee > 0 && (
                            <div className="rounded-xl border border-purple-200 bg-purple-50/50 p-5 space-y-3">
                                <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                    <span className="text-lg font-bold text-purple-600">
                                        {discountedValue > 0 
                                            ? (customerFee > 0 ? "4." : "3.") 
                                            : (customerFee > 0 ? "3." : "2.")}
                                    </span>
                                    Taxa de Pagamento do Cliente
                                </h3>
                                <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                    Taxa relacionada ao método de pagamento escolhido ({payment.method === "PIX" ? "PIX" : "Cartão de Crédito"}). Esta taxa cobre os custos de processamento da transação pelo gateway de pagamento e é adicionada ao valor total.
                                </p>
                                <div className="pl-7 pt-2 border-t border-purple-200">
                                    <p className="text-sm font-semibold text-purple-600">
                                        {ValueUtils.centsToCurrency(customerPaymentFee)}
                                    </p>
                                    <p className="text-xs font-mono text-psi-dark/60 mt-1">
                                        Taxa de Pagamento = Varia conforme o método ({payment.method === "PIX" ? "PIX" : "Cartão"})
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-5 space-y-3">
                            <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                <span className="text-lg font-bold text-psi-primary">
                                    {discountedValue > 0 
                                        ? (customerFee > 0 && customerPaymentFee > 0 ? "5." : customerFee > 0 || customerPaymentFee > 0 ? "4." : "3.")
                                        : (customerFee > 0 && customerPaymentFee > 0 ? "4." : customerFee > 0 || customerPaymentFee > 0 ? "3." : "2.")}
                                </span>
                                Total Pago pelo Cliente
                            </h3>
                            <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                É o valor final que o cliente paga, incluindo todos os ingressos, descontos e taxas.
                            </p>
                            <div className="pl-7 pt-2 border-t border-psi-primary/20">
                                <p className="text-lg font-bold text-psi-primary">
                                    {ValueUtils.centsToCurrency(totalPaidByCustomer)}
                                </p>
                                <p className="text-xs font-mono text-psi-dark/60 mt-2 flex items-center gap-2 flex-wrap">
                                    <span>Total Pago = {ValueUtils.centsToCurrency(grossValue)}</span>
                                    {discountedValue > 0 && (
                                        <>
                                            <Minus className="h-3 w-3" />
                                            <span>{ValueUtils.centsToCurrency(discountedValue)}</span>
                                        </>
                                    )}
                                    {customerFee > 0 && (
                                        <>
                                            <Plus className="h-3 w-3" />
                                            <span>{ValueUtils.centsToCurrency(customerFee)}</span>
                                        </>
                                    )}
                                    {customerPaymentFee > 0 && (
                                        <>
                                            <Plus className="h-3 w-3" />
                                            <span>{ValueUtils.centsToCurrency(customerPaymentFee)}</span>
                                        </>
                                    )}
                                    {gatewayFeeGain > 0 && (
                                        <>
                                            <Plus className="h-3 w-3" />
                                            <span>{ValueUtils.centsToCurrency(gatewayFeeGain)}</span>
                                        </>
                                    )}
                                    <Equal className="h-3 w-3" />
                                    <span className="font-semibold">{ValueUtils.centsToCurrency(totalPaidByCustomer)}</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-psi-dark/10">
                        <h4 className="text-sm font-semibold text-psi-dark uppercase tracking-wide mb-4">Cálculo dos Repasses e Ganhos</h4>
                        
                        {organizerFee > 0 && (
                            <div className="rounded-xl border border-orange-200 bg-orange-50/50 p-5 space-y-3">
                                <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                    <span className="text-lg font-bold text-orange-600">A.</span>
                                    Taxa do Organizador
                                </h3>
                                <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                    Taxa cobrada do organizador do evento. Esta taxa é calculada sobre o valor bruto (após desconto, se houver) e é deduzida do valor que será repassado ao organizador.
                                </p>
                                <div className="pl-7 pt-2 border-t border-orange-200">
                                    <p className="text-sm font-semibold text-orange-600">
                                        {ValueUtils.centsToCurrency(organizerFee)}
                                    </p>
                                    <p className="text-xs font-mono text-psi-dark/60 mt-1">
                                        Taxa do Organizador = Calculada sobre {ValueUtils.centsToCurrency(valueAfterDiscount)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {organizerPayout > 0 && (
                            <div className="rounded-xl border border-emerald-200 bg-emerald-50/50 p-5 space-y-3">
                                <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                    <span className="text-lg font-bold text-emerald-600">B.</span>
                                    Repasse Organizador
                                </h3>
                                <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                    Valor líquido que será repassado ao organizador após a dedução de todas as taxas.
                                </p>
                                <div className="pl-7 pt-2 border-t border-emerald-200">
                                    <p className="text-lg font-bold text-emerald-600">
                                        {ValueUtils.centsToCurrency(organizerPayout)}
                                    </p>
                                    <p className="text-xs font-mono text-psi-dark/60 mt-2 flex items-center gap-2 flex-wrap">
                                        <span>Repasse = {ValueUtils.centsToCurrency(grossValue)}</span>
                                        {discountedValue > 0 && (
                                            <>
                                                <Minus className="h-3 w-3" />
                                                <span>{ValueUtils.centsToCurrency(discountedValue)}</span>
                                            </>
                                        )}
                                        {organizerFee > 0 && (
                                            <>
                                                <Minus className="h-3 w-3" />
                                                <span>{ValueUtils.centsToCurrency(organizerFee)}</span>
                                            </>
                                        )}
                                        <Equal className="h-3 w-3" />
                                        <span className="font-semibold">{ValueUtils.centsToCurrency(organizerPayout)}</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {platformPaymentFee > 0 && (
                            <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-5 space-y-3">
                                <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                    <span className="text-lg font-bold text-psi-primary">C.</span>
                                    Taxa da Plataforma
                                </h3>
                                <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                    Taxa que a plataforma cobra para manter os serviços operacionais. Esta taxa é calculada sobre o valor da transação.
                                </p>
                                <div className="pl-7 pt-2 border-t border-psi-primary/20">
                                    <p className="text-sm font-semibold text-psi-primary">
                                        {ValueUtils.centsToCurrency(platformPaymentFee)}
                                    </p>
                                    <p className="text-xs font-mono text-psi-dark/60 mt-1">
                                        Taxa da Plataforma = Calculada sobre o valor base
                                    </p>
                                </div>
                            </div>
                        )}

                        {gatewayFeeGain > 0 && (
                            <div className="rounded-xl border border-green-200 bg-green-50/50 p-5 space-y-3">
                                <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                    <span className="text-lg font-bold text-green-600">D.</span>
                                    Ganho do Gateway
                                </h3>
                                <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                    Valor que a plataforma recebe como margem sobre as taxas do gateway de pagamento. Representa a diferença entre o que é cobrado do cliente e o que é pago ao gateway.
                                </p>
                                <div className="pl-7 pt-2 border-t border-green-200">
                                    <p className="text-sm font-semibold text-green-600">
                                        {ValueUtils.centsToCurrency(gatewayFeeGain)}
                                    </p>
                                    <p className="text-xs font-mono text-psi-dark/60 mt-1">
                                        Ganho do Gateway = Margem sobre a taxa de pagamento
                                    </p>
                                </div>
                            </div>
                        )}

                        {netValue !== null && netValue !== undefined && (
                            <div className="rounded-xl border border-blue-200 bg-blue-50/50 p-5 space-y-3">
                                <h3 className="text-base font-semibold text-psi-dark flex items-center gap-2">
                                    <span className="text-lg font-bold text-blue-600">E.</span>
                                    Ganho Líquido
                                </h3>
                                <p className="text-sm text-psi-dark/70 leading-relaxed pl-7">
                                    É o valor líquido que a plataforma recebe após todas as deduções. Representa o ganho real da transação para a plataforma.
                                </p>
                                <div className="pl-7 pt-2 border-t border-blue-200">
                                    <p className="text-lg font-bold text-blue-600">
                                        {ValueUtils.centsToCurrency(netValue)}
                                    </p>
                                    <p className="text-xs font-mono text-psi-dark/60 mt-2 flex items-center gap-2 flex-wrap">
                                        <span>Ganho Líquido =</span>
                                        {platformPaymentFee > 0 && (
                                            <>
                                                <span>{ValueUtils.centsToCurrency(platformPaymentFee)}</span>
                                            </>
                                        )}
                                        {gatewayFeeGain > 0 && (
                                            <>
                                                <Plus className="h-3 w-3" />
                                                <span>{ValueUtils.centsToCurrency(gatewayFeeGain)}</span>
                                            </>
                                        )}
                                        {customerFee > 0 && (
                                            <>
                                                <Plus className="h-3 w-3" />
                                                <span>{ValueUtils.centsToCurrency(customerFee)}</span>
                                            </>
                                        )}
                                        {organizerFee > 0 && (
                                            <>
                                                <Plus className="h-3 w-3" />
                                                <span>{ValueUtils.centsToCurrency(organizerFee)}</span>
                                            </>
                                        )}
                                        <Equal className="h-3 w-3" />
                                        <span className="font-semibold">{ValueUtils.centsToCurrency(netValue)}</span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="rounded-lg border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-2">
                        <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-psi-primary" />
                            <p className="text-xs font-medium text-psi-dark">Importante</p>
                        </div>
                        <p className="text-xs text-psi-dark/70 leading-relaxed">
                            Todos os cálculos são realizados automaticamente pela plataforma. As taxas podem variar conforme o método de pagamento escolhido pelo cliente (PIX ou Cartão de Crédito) e conforme as configurações de cada evento.
                        </p>
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t border-psi-dark/10">
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => onOpenChange(false)}
                    >
                        Entendi
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export {
    DialogUnderstandValues
}
