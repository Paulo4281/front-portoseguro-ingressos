"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { InputCurrency } from "@/components/Input/InputCurrency"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { TicketFeeUtils } from "@/utils/Helpers/FeeUtils/TicketFeeUtils"
import { Info, TrendingDown, Users, Calculator } from "lucide-react"

const TAX_FIXED_CLIENT = Number(process.env.NEXT_PUBLIC_TAX_FEE_FIXED_CLIENT_CENTS ?? 0)
const TAX_PERCENTAGE = Number(process.env.NEXT_PUBLIC_TAX_FEE_PERCENTAGE ?? 0)
const TAX_FIXED = Number(process.env.NEXT_PUBLIC_TAX_FEE_FIXED_BELOW_THRESHOLD ?? 0)
const TAX_THRESHOLD_CENTS = Number(process.env.NEXT_PUBLIC_TAX_THRESHOLD_CENTS ?? 3990)

type TDialogTaxesProps = {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  isClientView?: boolean
}

const DialogTaxes = ({
  trigger,
  open,
  onOpenChange,
  isClientView = false
}: TDialogTaxesProps) => {
  const [examplePrice, setExamplePrice] = useState(5000)
  const [isClientTaxed, setIsClientTaxed] = useState(true)

  const clientFee = TAX_FIXED_CLIENT
  
  const organizerFee = examplePrice > TAX_THRESHOLD_CENTS
    ? Math.round(examplePrice * (TAX_PERCENTAGE / 100))
    : TAX_FIXED

  const totalClientPaid = examplePrice + clientFee + (isClientTaxed ? organizerFee : 0)

  const thresholdInReais = ValueUtils.centsToCurrency(TAX_THRESHOLD_CENTS)

  const dialogContent = (
    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-psi-primary" />
          Como funcionam nossas taxas
        </DialogTitle>
        <DialogDescription>
          {isClientView ? "Entenda como calculamos as taxas para compradores" : "Entenda como calculamos as taxas para organizadores"}
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-6 py-4">
        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-psi-primary" />
            <h3 className="font-semibold text-psi-dark">Taxa do Cliente (Comprador)</h3>
          </div>
          
          <div className="space-y-2 text-sm text-psi-dark/70">
            <p>
              A taxa do cliente é uma taxa fixa aplicada a cada ingresso comprado:
            </p>
            
            <div className="mt-3 p-3 rounded-lg bg-white border border-psi-primary/10">
              <p className="text-xs font-medium text-psi-dark mb-1">
                Taxa do cliente:
              </p>
              <p className="text-lg font-semibold text-psi-primary">
                {ValueUtils.centsToCurrency(TAX_FIXED_CLIENT)} por ingresso
              </p>
              <p className="text-xs text-psi-dark/60 mt-1">
                Taxa fixa aplicada a todos os ingressos
              </p>
            </div>
            
            {isClientView && (
              <>
                <div className="mt-3 p-4 rounded-xl bg-linear-to-br from-green-50 via-yellow-50 to-blue-50 border-2 border-psi-primary/30 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="shrink-0 text-3xl" aria-label="Bandeira do Brasil">
                      <img
                        src="/icons/flags/brazil.png"
                        alt="Bandeira do Brasil"
                        width={32}
                        height={32}
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-psi-dark mb-1.5">
                        Uma das menores taxas do Brasil
                      </p>
                      <p className="text-xs text-psi-dark/70 leading-relaxed">
                        Nossa taxa de serviço é uma das mais competitivas do mercado nacional, 
                        garantindo que você pague menos e aproveite mais seus eventos favoritos.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 p-3 rounded-lg bg-white border border-psi-primary/10">
                  <p className="text-xs text-psi-dark/60 leading-relaxed">
                    <strong className="text-psi-dark">Nota:</strong> Taxas adicionais podem estar inclusas no valor final do ingresso por decisão da organização do evento. 
                    Essas taxas são definidas pelo organizador se são repassadas ao cliente ou absorvidas por ele.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {!isClientView && (
          <>
            <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-psi-primary" />
                <h3 className="font-semibold text-psi-dark">Taxa do Organizador (Vendedor)</h3>
              </div>
              
              <div className="space-y-2 text-sm text-psi-dark/70">
                <p>
                  A taxa do organizador varia conforme o valor do ingresso e é aplicada sobre cada ingresso vendido. 
                  O organizador pode escolher se essa taxa será repassada ao cliente ou não:
                </p>
                
                <div className="space-y-2 mt-3">
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-psi-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-psi-dark">
                        Ingressos acima de {thresholdInReais}:
                      </p>
                      <p className="text-xs text-psi-dark/60">
                        Taxa de {TAX_PERCENTAGE}% sobre o valor do ingresso
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-psi-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="font-medium text-psi-dark">
                        Ingressos até {thresholdInReais}:
                      </p>
                      <p className="text-xs text-psi-dark/60">
                        Taxa fixa de {ValueUtils.centsToCurrency(TAX_FIXED)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-3 p-3 rounded-lg bg-white border border-psi-primary/10">
                  <p className="text-xs text-psi-dark/60">
                    <strong className="text-psi-dark">Nota:</strong> O organizador decide na criação do evento se essa taxa será repassada ao cliente ou absorvida por ele.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-psi-primary/20 bg-white p-4 space-y-3">
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-psi-primary" />
                <h3 className="font-semibold text-psi-dark">Exemplo de Cálculo</h3>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-psi-dark mb-2">
                    Valor do ingresso:
                  </label>
                  <InputCurrency
                    value={ValueUtils.centsToCurrency(examplePrice)}
                    onChangeValue={(value) => {
                      const cents = ValueUtils.currencyToCents(value)
                      setExamplePrice(cents)
                    }}
                    className="w-full"
                  />
                </div>
                
                <div className="flex items-center gap-3 rounded-lg border border-psi-primary/20 bg-psi-primary/5 p-3">
                  <Checkbox
                    id="simulate-client-taxed"
                    checked={isClientTaxed}
                    onCheckedChange={(checked) => setIsClientTaxed(checked === true)}
                  />
                  <label htmlFor="simulate-client-taxed" className="text-sm font-medium text-psi-dark cursor-pointer">
                    Repassar taxa do organizador ao cliente
                  </label>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-psi-primary/5 border border-psi-primary/20">
                    <p className="text-xs text-psi-dark/60 mb-1">Taxa do Cliente</p>
                    <p className="text-lg font-semibold text-psi-primary">
                      {ValueUtils.centsToCurrency(clientFee)}
                    </p>
                    <p className="text-xs text-psi-dark/60 mt-1">
                      Taxa fixa
                    </p>
                  </div>
                  
                  <div className="p-3 rounded-lg bg-psi-primary/5 border border-psi-primary/20">
                    <p className="text-xs text-psi-dark/60 mb-1">Taxa do Organizador</p>
                    <p className="text-lg font-semibold text-psi-primary">
                      {ValueUtils.centsToCurrency(organizerFee)}
                    </p>
                    <p className="text-xs text-psi-dark/60 mt-1">
                      {examplePrice > TAX_THRESHOLD_CENTS 
                        ? `${TAX_PERCENTAGE}% sobre o ingresso`
                        : `Taxa fixa`
                      }
                    </p>
                  </div>
                </div>
                
                <div className="p-3 rounded-lg bg-psi-primary/10 border border-psi-primary/20">
                  <p className="text-xs text-psi-dark/60 mb-1">Total pago pelo cliente</p>
                  <p className="text-xl font-bold text-psi-primary">
                    {ValueUtils.centsToCurrency(totalClientPaid)}
                  </p>
                  <p className="text-xs text-psi-dark/60 mt-1">
                    {ValueUtils.centsToCurrency(examplePrice)} (ingresso) + {ValueUtils.centsToCurrency(clientFee)} (taxa cliente)
                    {isClientTaxed && ` + ${ValueUtils.centsToCurrency(organizerFee)} (taxa organizador)`}
                  </p>
                </div>
                
                {!isClientTaxed && (
                  <div className="p-3 rounded-lg bg-psi-primary/5 border border-psi-primary/20">
                    <p className="text-xs text-psi-dark/60 mb-1">Taxa do organizador (absorvida pelo organizador)</p>
                    <p className="text-lg font-semibold text-psi-primary">
                      {ValueUtils.centsToCurrency(organizerFee)}
                    </p>
                    <p className="text-xs text-psi-dark/60 mt-1">
                      Esta taxa não é cobrada do cliente
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
              <p className="text-xs text-psi-dark/70 leading-relaxed">
                <strong className="text-psi-dark">Importante:</strong> O cliente sempre paga uma taxa fixa de {ValueUtils.centsToCurrency(TAX_FIXED_CLIENT)} por ingresso. 
                A taxa do organizador varia conforme o valor do ingresso (percentual acima de {thresholdInReais} ou fixa abaixo desse valor), 
                mas o organizador pode escolher se essa taxa será repassada ao cliente ou absorvida por ele.
              </p>
            </div>
          </>
        )}
      </div>
    </DialogContent>
  )

  if (trigger) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
          {trigger}
        </DialogTrigger>
        {dialogContent}
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {dialogContent}
    </Dialog>
  )
}

export {
  DialogTaxes
}
