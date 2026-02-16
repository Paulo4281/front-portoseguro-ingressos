"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputMask } from "@/components/Input/InputMask"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Toast } from "@/components/Toast/Toast"
import { PaymentService } from "@/services/Payment/PaymentService"
import type { TPaymentLinkVerifyResponse } from "@/types/Payment/TPayment"
import { getPaymentStatusLabel, isPaymentValidForReceipt } from "@/types/Payment/TPayment"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { getCardBrand } from "@/utils/Helpers/CardUtils/CardUtils"
import { CreditCard, Link2, Loader2, Copy, Download, QrCode, Ticket, Mail, ShieldCheck, RefreshCw } from "lucide-react"

type TCardForm = {
    number: string
    holderName: string
    exp: string
    cvv: string
    installments: number
}

const PagamentoLinkInfo = () => {
    const searchParams = useSearchParams()
    const code = (searchParams.get("code") || "").trim()

    const [isLoading, setIsLoading] = useState(false)
    const [isPaying, setIsPaying] = useState(false)
    const [isVerifyingPayment, setIsVerifyingPayment] = useState(false)
    const [data, setData] = useState<TPaymentLinkVerifyResponse | null>(null)
    const [activeTab, setActiveTab] = useState<"PIX" | "CREDIT_CARD">("PIX")

    const [card, setCard] = useState<TCardForm>({
        number: "",
        holderName: "",
        exp: "",
        cvv: "",
        installments: 1
    })

    const payment = data?.payment
    const tickets = useMemo(() => data?.tickets ?? [], [data])
    const maxInstallments = payment?.event?.maxInstallments ?? 12

    const cardBrand = useMemo(() => getCardBrand(card.number), [card.number])

    const getCardBrandIcon = (brand: string | null | undefined): string => {
        if (!brand) return "/icons/payment/card-brand/card-unknown.png"
        const brandLower = brand.toLowerCase()
        const brandMap: Record<string, string> = {
            amex: "card-amex.png",
            discover: "card-discover.png",
            hipercard: "card-hipercard.png",
            jcb: "card-jcb.png",
            mastercard: "card-master.png",
            visa: "card-visa.png",
            elo: "card-elo.png",
            cabal: "card-cabal.png",
            banescard: "card-banescard.png",
        }
        return `/icons/payment/card-brand/${brandMap[brandLower] || "card-unknown.png"}`
    }

    const canPayByCreditCard = Boolean(payment && (payment.status === "PENDING" || payment.status === "OVERDUE"))

    const handleCopyLink = async () => {
        if (!code) return
        const url = `https://portoseguroingressos.com.br/pagamento-link?code=${encodeURIComponent(code)}`
        try {
            await navigator.clipboard.writeText(url)
            Toast.success("Link copiado!")
        } catch {
            Toast.error("Não foi possível copiar o link.")
        }
    }

    const handleCopyPixPayload = async () => {
        const payload = payment?.qrcodeData?.payload
        if (!payload) return
        try {
            await navigator.clipboard.writeText(payload)
            Toast.success("Código PIX copiado!")
        } catch {
            Toast.error("Não foi possível copiar o código PIX.")
        }
    }

    const handleDownloadQrCode = () => {
        const encoded = payment?.qrcodeData?.encodedImage
        if (!encoded) return
        const link = document.createElement("a")
        link.href = `data:image/png;base64,${encoded}`
        link.download = "qrcode-pagamento.png"
        link.click()
        Toast.success("QR Code baixado com sucesso!")
    }

    const fetchVerify = async () => {
        if (!code) return
        try {
            setIsLoading(true)
            const response = await PaymentService.verifyLink(code)
            if (response?.success) {
                setData(response.data)
                if (response.data.payment?.qrcodeData) setActiveTab("PIX")
            } else {
                Toast.error(response?.message ?? "Não foi possível carregar o pagamento.")
                setData(null)
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message ?? "Não foi possível carregar o pagamento.")
            setData(null)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchVerify()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code])

    const handleVerifyPayment = async () => {
        const billingId = payment?.externalPaymentId
        if (!billingId) {
            Toast.error("ID do pagamento (billing) não encontrado.")
            return
        }
        try {
            setIsVerifyingPayment(true)
            const response = await PaymentService.verifyPaymentStatus(billingId)
            if (response?.success && response?.data) {
                const status = (response.data as { status?: string })?.status
                if (status && isPaymentValidForReceipt(status)) {
                    Toast.success("Pagamento efetuado! Faça login para acessar todos os seus ingressos.")
                } else {
                    Toast.info("Pagamento ainda pendente.")
                }
                await fetchVerify()
            } else {
                Toast.error(response?.message ?? "Não foi possível verificar o pagamento.")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message ?? "Não foi possível verificar o pagamento.")
        } finally {
            setIsVerifyingPayment(false)
        }
    }

    const handlePayCreditCard = async () => {
        if (!payment?.id) return
        if (!card.number || !card.holderName || !card.exp || !card.cvv) {
            Toast.info("Preencha todos os campos do cartão.")
            return
        }
        try {
            setIsPaying(true)
            const response = await PaymentService.payLink({
                paymentId: payment.id,
                paymentMethod: "CREDIT_CARD",
                ccInfo: {
                    number: card.number,
                    holderName: card.holderName,
                    exp: card.exp,
                    cvv: card.cvv,
                    installments: Math.min(card.installments, maxInstallments)
                }
            })
            if (response?.success && response?.data?.isCreditCardError) {
                Toast.error("Não foi possível confirmar o pagamento no cartão. Verifique os dados e tente novamente.")
                return
            }
            if (response?.success) {
                Toast.success("Pagamento processado. Atualizando status...")
                await fetchVerify()
            } else {
                Toast.error(response?.message ?? "Não foi possível realizar o pagamento.")
            }
        } catch (error: any) {
            Toast.error(error?.response?.data?.message ?? "Não foi possível realizar o pagamento.")
        } finally {
            setIsPaying(false)
        }
    }

    return (
        <Background variant="hero" className="min-h-screen">
            <div className="mx-auto max-w-4xl px-4 py-10 space-y-6 mt-[80px]">
                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                            <h1 className="text-2xl font-semibold text-psi-primary">Pagamento</h1>
                            <p className="text-sm text-psi-dark/60">Link de pagamento</p>
                        </div>
                        <Button type="button" variant="outline" onClick={handleCopyLink} disabled={!code}>
                            <Link2 className="h-4 w-4" />
                            Copiar link
                        </Button>
                    </div>

                    {!code && (
                        <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                            <p className="text-sm text-amber-800">Código do link não informado. Use `?code=CODIGO` na URL.</p>
                        </div>
                    )}

                    {isLoading ? (
                        <div className="mt-6 flex items-center gap-2 text-sm text-psi-dark/60">
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Carregando pagamento...
                        </div>
                    ) : payment ? (
                        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
                            <div className="space-y-4">
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-5">
                                    <div className="flex items-start gap-4">
                                        {payment.event?.image ? (
                                            <img
                                                src={ImageUtils.getEventImageUrl(payment.event.image)}
                                                alt={payment.event.name}
                                                className="h-16 w-16 rounded-xl object-cover border border-psi-dark/10"
                                            />
                                        ) : (
                                            <div className="h-16 w-16 rounded-xl bg-psi-dark/5 border border-psi-dark/10 flex items-center justify-center">
                                                <Ticket className="h-6 w-6 text-psi-primary" />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-psi-dark">{payment.event?.name ?? "Evento"}</p>
                                            <p className="text-xs text-psi-dark/60">Código: <span className="font-mono">{payment.code}</span></p>
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <Badge variant="secondary" className="bg-psi-dark/5 text-psi-dark/70">
                                                    {payment.method === "PIX" ? "PIX" : payment.method === "CREDIT_CARD" ? "Cartão" : "Link"}
                                                </Badge>
                                                <Badge variant="secondary" className="bg-psi-primary/10 text-psi-primary">
                                                    {getPaymentStatusLabel(payment.status)}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-psi-dark/60">Total</p>
                                            <p className="text-2xl font-semibold text-psi-primary">
                                                {ValueUtils.centsToCurrency(payment.totalPaidByCustomer ?? 0)}
                                            </p>
                                        </div>
                                    </div>

                                    {payment.customer && (
                                        <div className="mt-4 pt-4 border-t border-psi-dark/10">
                                            <p className="text-xs font-medium text-psi-dark/60 mb-1">Comprador</p>
                                            <p className="text-sm text-psi-dark">
                                                {payment.customer.firstName} {payment.customer.lastName} • {payment.customer.email}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-5">
                                    <p className="text-sm font-medium text-psi-dark mb-3">Ingressos</p>
                                    <ul className="space-y-2">
                                        {tickets.map((t) => (
                                            <li key={t.id} className="rounded-xl border border-psi-dark/10 bg-psi-dark/2 p-3">
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="min-w-0">
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <p className="text-sm font-medium text-psi-dark truncate">{t.ticketType?.name ?? "Ingresso"}</p>
                                                            {t.isInsured && (
                                                                <Badge variant="secondary" className="text-xs bg-emerald-100 text-emerald-800 border-0 shrink-0">
                                                                    <ShieldCheck className="h-3 w-3 mr-1" />
                                                                    Seguro Contratado
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-psi-dark/60 font-mono truncate">{t.code}</p>
                                                    </div>
                                                    <div className="text-right shrink-0">
                                                        <p className="text-xs text-psi-dark/60">Valor</p>
                                                        <p className="text-sm font-semibold text-psi-dark">{ValueUtils.centsToCurrency(t.price)}</p>
                                                    </div>
                                                </div>
                                                {t.dates?.length > 0 && (
                                                    <div className="mt-2 text-xs text-psi-dark/60">
                                                        {t.dates
                                                            .filter((d) => d.date)
                                                            .map((d) => DateUtils.formatDate(String(d.date), "DD/MM/YYYY"))
                                                            .join(" • ")}
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="rounded-2xl border border-psi-primary/20 bg-psi-primary/5 p-5 space-y-3">
                                    <div className="flex items-start gap-3">
                                        <Mail className="h-5 w-5 text-psi-primary shrink-0 mt-0.5" />
                                        <div className="space-y-2">
                                            <p className="text-sm font-medium text-psi-dark">
                                                Após a confirmação do pagamento, o e-mail com o QR Code do ingresso será enviado para o endereço do comprador.
                                            </p>
                                            {tickets.length > 1 && (
                                                <div className="flex items-start gap-2 pt-1">
                                                    <ShieldCheck className="h-4 w-4 text-psi-primary shrink-0 mt-0.5" />
                                                    <p className="text-xs text-psi-dark/70">
                                                        Como esta compra possui mais de um ingresso, por questões de segurança os QR Codes dos ingressos só poderão ser acessados pelo próprio app ou site, na conta do cliente.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-5">
                                    <div className="flex rounded-lg border border-[#E4E6F0] p-0.5 bg-psi-dark/5">
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("PIX")}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex-1 ${activeTab === "PIX" ? "bg-white text-psi-dark shadow-sm" : "text-psi-dark/70 hover:text-psi-dark"}`}
                                            disabled={!payment.qrcodeData}
                                        >
                                            PIX
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setActiveTab("CREDIT_CARD")}
                                            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors flex-1 ${activeTab === "CREDIT_CARD" ? "bg-white text-psi-dark shadow-sm" : "text-psi-dark/70 hover:text-psi-dark"}`}
                                        >
                                            Cartão
                                        </button>
                                    </div>

                                    {activeTab === "PIX" && (
                                        <div className="mt-4 space-y-4">
                                            {!payment.qrcodeData ? (
                                                <p className="text-sm text-psi-dark/60">PIX não disponível para este pagamento.</p>
                                            ) : (
                                                <>
                                                    <div className="flex items-center justify-between">
                                                        <p className="text-sm font-medium text-psi-dark flex items-center gap-2">
                                                            <QrCode className="h-4 w-4 text-psi-primary" />
                                                            QR Code PIX
                                                        </p>
                                                        <div className="flex items-center gap-2">
                                                            <Button type="button" variant="outline" size="sm" onClick={handleCopyPixPayload}>
                                                                <Copy className="h-4 w-4" />
                                                                Copiar
                                                            </Button>
                                                            <Button type="button" variant="outline" size="sm" onClick={handleDownloadQrCode}>
                                                                <Download className="h-4 w-4" />
                                                                Baixar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                    <div className="p-4 bg-white rounded-xl border border-psi-dark/10 flex items-center justify-center">
                                                        <img
                                                            src={`data:image/png;base64,${payment.qrcodeData.encodedImage}`}
                                                            alt="QR Code PIX"
                                                            className="w-56 h-56 object-contain"
                                                        />
                                                    </div>
                                                    <Input value={payment.qrcodeData.payload} readOnly />
                                                    {payment.qrcodeData.expirationDate && (
                                                        <p className="text-xs text-psi-dark/60">
                                                            Expira em {new Date(payment.qrcodeData.expirationDate).toLocaleString("pt-BR")}
                                                        </p>
                                                    )}
                                                    {payment.qrcodeData.description && (
                                                        <p className="text-xs text-psi-dark/70">{payment.qrcodeData.description}</p>
                                                    )}
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        className="w-full"
                                                        onClick={handleVerifyPayment}
                                                        disabled={isVerifyingPayment || (payment != null && isPaymentValidForReceipt(payment.status))}
                                                    >
                                                        {isVerifyingPayment ? (
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <RefreshCw className="h-4 w-4" />
                                                        )}
                                                        Verificar Pagamento
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    )}

                                    {activeTab === "CREDIT_CARD" && (
                                        <div className="mt-4 space-y-3">
                                            {!canPayByCreditCard && (
                                                <p className="text-sm text-psi-dark/60">
                                                    Pagamento não disponível no cartão para o status atual ({getPaymentStatusLabel(payment.status)}).
                                                </p>
                                            )}
                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="relative flex items-center">
                                                    <InputMask
                                                        mask="0000 0000 0000 0000"
                                                        value={card.number}
                                                        onAccept={(v) => setCard((p) => ({ ...p, number: String(v) }))}
                                                        placeholder="Número do cartão"
                                                        inputMode="numeric"
                                                        disabled={!canPayByCreditCard || isPaying}
                                                        className="pr-12"
                                                    />
                                                    {cardBrand && (
                                                        <div className="absolute right-3 flex items-center pointer-events-none">
                                                            <img
                                                                src={getCardBrandIcon(cardBrand)}
                                                                alt={cardBrand}
                                                                className="h-10 w-10 object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                                <Input
                                                    value={card.holderName}
                                                    onChange={(e) => setCard((p) => ({ ...p, holderName: e.target.value }))}
                                                    placeholder="Nome impresso no cartão"
                                                    disabled={!canPayByCreditCard || isPaying}
                                                    className="uppercase"
                                                />
                                                <div className="grid grid-cols-2 gap-3">
                                                    <InputMask
                                                        mask="00/00"
                                                        value={card.exp}
                                                        onAccept={(v) => setCard((p) => ({ ...p, exp: String(v) }))}
                                                        placeholder="Validade (MM/AA)"
                                                        inputMode="numeric"
                                                        disabled={!canPayByCreditCard || isPaying}
                                                    />
                                                    <InputMask
                                                        mask="0000"
                                                        value={card.cvv}
                                                        onAccept={(v) => setCard((p) => ({ ...p, cvv: String(v) }))}
                                                        placeholder="CVV"
                                                        inputMode="numeric"
                                                        disabled={!canPayByCreditCard || isPaying}
                                                    />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 items-center">
                                                    <label className="text-sm text-psi-dark/70">Parcelas</label>
                                                    <Select
                                                        value={String(Math.min(card.installments, maxInstallments))}
                                                        onValueChange={(v) => setCard((p) => ({ ...p, installments: Number(v) }))}
                                                        disabled={!canPayByCreditCard || isPaying}
                                                    >
                                                        <SelectTrigger className="h-10 w-full">
                                                            <SelectValue placeholder="Parcelas" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {Array.from({ length: maxInstallments }).map((_, i) => (
                                                                <SelectItem key={i + 1} value={String(i + 1)}>
                                                                    {i + 1}x
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    onClick={handlePayCreditCard}
                                                    disabled={!canPayByCreditCard || isPaying}
                                                >
                                                    {isPaying ? <Loader2 className="h-4 w-4 animate-spin" /> : <CreditCard className="h-4 w-4" />}
                                                    Pagar com cartão
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : code ? (
                        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4">
                            <p className="text-sm text-red-700">Não foi possível carregar o pagamento para este código.</p>
                        </div>
                    ) : null}
                </div>
            </div>
        </Background>
    )
}

export { PagamentoLinkInfo }