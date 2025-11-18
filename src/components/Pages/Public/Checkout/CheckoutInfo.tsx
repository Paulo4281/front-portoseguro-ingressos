"use client"

import { useState, useMemo } from "react"
import { useCart } from "@/contexts/CartContext"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useEventFind } from "@/hooks/Event/useEventFind"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/Input/Input"
import { InputMask } from "@/components/Input/InputMask"
import { QuantitySelector } from "@/components/QuantitySelector/QuantitySelector"
import { ValueUtilsClass } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { DateUtilsClass } from "@/utils/Helpers/DateUtils/DateUtils"
import { getCardBrand } from "@/utils/Helpers/CardUtils/CardUtils"
import { 
    User, 
    Mail, 
    Phone, 
    FileText, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    Trash2,
    ChevronRight,
    ChevronLeft,
    Receipt,
    Calendar,
    Clock,
    Check
} from "lucide-react"
import { useRouter } from "next/navigation"
import { CTAButton } from "@/components/CTAButton/CTAButton"

type TPaymentMethod = "pix" | "credit" | "boleto"

const CheckoutInfo = () => {
    const { items, updateQuantity, removeItem, getTotal } = useCart()
    const { user } = useAuthStore()
    const router = useRouter()
    const [currentStep, setCurrentStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState<TPaymentMethod>("pix")
    
    const [buyerData, setBuyerData] = useState({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        document: user?.document || "",
        street: user?.address?.street || "",
        number: user?.address?.number || "",
        complement: user?.address?.complement || "",
        neighborhood: user?.address?.neighborhood || "",
        zipcode: user?.address?.zipcode || "",
        city: user?.address?.city || "",
        state: user?.address?.state || "",
        country: user?.address?.country || "BR",
    })
    
    const [cardData, setCardData] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: "",
    })
    
    const cardBrand = useMemo(() => {
        return getCardBrand(cardData.number)
    }, [cardData.number])
    
    const total = getTotal()
    
    const { data: allEvents } = useEventFind()
    
    const eventsData = useMemo(() => {
        if (!allEvents) return []
        const eventIds = [...new Set(items.map(item => item.eventId))]
        return eventIds.map(id => allEvents.find(e => e.id === id)).filter(Boolean)
    }, [items, allEvents])
    
    const handleNext = () => {
        if (currentStep < 4) {
            setCurrentStep(currentStep + 1)
        }
    }
    
    const handlePrevious = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1)
        }
    }
    
    const handleFinalize = () => {
        console.log("Finalizando compra...")
    }
    
    if (items.length === 0) {
        return (
            <Background variant="light" className="min-h-screen">
                <div className="container py-12 mt-[100px]">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <h1 className="text-2xl font-semibold text-psi-dark">Carrinho vazio</h1>
                        <p className="text-psi-dark/60">Adicione ingressos ao carrinho antes de finalizar a compra.</p>
                        <Button onClick={() => router.push("/")} variant="primary">
                            Voltar para eventos
                        </Button>
                    </div>
                </div>
            </Background>
        )
    }
    
    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[100px]
            sm:py-12">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-psi-dark mb-2
                        sm:text-4xl">
                            Checkout
                        </h1>
                        <p className="text-psi-dark/60">
                            Finalize sua compra de ingressos
                        </p>
                    </div>
                    
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            {[
                                { number: 1, label: "Dados do Comprador", icon: User },
                                { number: 2, label: "Pagamento", icon: CreditCard },
                                { number: 3, label: "Resumo", icon: Receipt },
                                { number: 4, label: "Finalização", icon: CheckCircle2 }
                            ].map((step, index) => {
                                const isActive = currentStep === step.number
                                const isCompleted = currentStep > step.number
                                const StepIcon = step.icon
                                
                                return (
                                    <div key={step.number} className="flex items-center flex-1">
                                        <div className="flex flex-col items-center flex-1">
                                            <div className={`flex items-center justify-center size-10 rounded-full border-2 transition-all ${
                                                isActive
                                                    ? "border-psi-primary bg-psi-primary text-white"
                                                    : isCompleted
                                                    ? "border-psi-primary bg-psi-primary text-white"
                                                    : "border-psi-dark/20 bg-white text-psi-dark/40"
                                            }`}>
                                                {isCompleted ? (
                                                    <Check className="size-5" />
                                                ) : (
                                                    <StepIcon className="size-5" />
                                                )}
                                            </div>
                                            <span className={`mt-2 text-xs font-medium text-center
                                            sm:text-sm ${
                                                isActive
                                                    ? "text-psi-primary"
                                                    : isCompleted
                                                    ? "text-psi-primary"
                                                    : "text-psi-dark/40"
                                            }`}>
                                                {step.label}
                                            </span>
                                        </div>
                                        {index < 3 && (
                                            <div className={`flex-1 h-0.5 mx-2 transition-all ${
                                                isCompleted
                                                    ? "bg-psi-primary"
                                                    : "bg-psi-dark/20"
                                            }`} />
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    
                    <div className="grid gap-8
                    lg:grid-cols-[1fr_400px]">
                        <div className="space-y-6">
                            {currentStep === 1 && (
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <h2 className="text-xl font-semibold text-psi-dark mb-6">Dados do Comprador</h2>
                                    
                                    <div className="space-y-4">
                                        <div className="grid gap-4
                                        sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Nome *
                                                </label>
                                                <Input
                                                    value={buyerData.firstName}
                                                    onChange={(e) => setBuyerData({ ...buyerData, firstName: e.target.value })}
                                                    icon={User}
                                                    required
                                                />
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Sobrenome *
                                                </label>
                                                <Input
                                                    value={buyerData.lastName}
                                                    onChange={(e) => setBuyerData({ ...buyerData, lastName: e.target.value })}
                                                    icon={User}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                E-mail *
                                            </label>
                                            <Input
                                                type="email"
                                                value={buyerData.email}
                                                onChange={(e) => setBuyerData({ ...buyerData, email: e.target.value })}
                                                icon={Mail}
                                                required
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                Telefone *
                                            </label>
                                            <InputMask
                                                mask="(00) 00000-0000"
                                                value={buyerData.phone}
                                                onAccept={(value) => setBuyerData({ ...buyerData, phone: value as string })}
                                                placeholder="(00) 00000-0000"
                                                icon={Phone}
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">
                                                CPF/CNPJ *
                                            </label>
                                            <InputMask
                                                mask="000.000.000-00"
                                                value={buyerData.document}
                                                onAccept={(value) => setBuyerData({ ...buyerData, document: value as string })}
                                                placeholder="000.000.000-00"
                                                icon={FileText}
                                            />
                                        </div>
                                        
                                        <div className="pt-4 border-t border-psi-dark/10">
                                            <h3 className="text-lg font-semibold text-psi-dark mb-4">Endereço</h3>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    CEP *
                                                </label>
                                                <InputMask
                                                    mask="00000-000"
                                                    value={buyerData.zipcode}
                                                    onAccept={(value) => setBuyerData({ ...buyerData, zipcode: value as string })}
                                                    placeholder="00000-000"
                                                    icon={MapPin}
                                                />
                                            </div>
                                            
                                            <div className="grid gap-4
                                            sm:grid-cols-2 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Rua *
                                                    </label>
                                                    <Input
                                                        value={buyerData.street}
                                                        onChange={(e) => setBuyerData({ ...buyerData, street: e.target.value })}
                                                        icon={MapPin}
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Número
                                                    </label>
                                                    <Input
                                                        value={buyerData.number}
                                                        onChange={(e) => setBuyerData({ ...buyerData, number: e.target.value })}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Complemento
                                                </label>
                                                <Input
                                                    value={buyerData.complement}
                                                    onChange={(e) => setBuyerData({ ...buyerData, complement: e.target.value })}
                                                />
                                            </div>
                                            
                                            <div className="mt-4">
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Bairro *
                                                </label>
                                                <Input
                                                    value={buyerData.neighborhood}
                                                    onChange={(e) => setBuyerData({ ...buyerData, neighborhood: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="grid gap-4
                                            sm:grid-cols-3 mt-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Cidade *
                                                    </label>
                                                    <Input
                                                        value={buyerData.city}
                                                        onChange={(e) => setBuyerData({ ...buyerData, city: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Estado *
                                                    </label>
                                                    <Input
                                                        value={buyerData.state}
                                                        onChange={(e) => setBuyerData({ ...buyerData, state: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        País *
                                                    </label>
                                                    <Input
                                                        value={buyerData.country}
                                                        onChange={(e) => setBuyerData({ ...buyerData, country: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {currentStep === 2 && (
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <h2 className="text-xl font-semibold text-psi-dark mb-6">Forma de Pagamento</h2>
                                    
                                    <div className="space-y-4 mb-6">
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("pix")}
                                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                                paymentMethod === "pix"
                                                    ? "border-psi-primary bg-psi-primary/5"
                                                    : "border-psi-dark/10 hover:border-psi-primary/30"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`size-4 rounded-full border-2 ${
                                                    paymentMethod === "pix"
                                                        ? "border-psi-primary bg-psi-primary"
                                                        : "border-psi-dark/30"
                                                }`}>
                                                    {paymentMethod === "pix" && (
                                                        <div className="size-full rounded-full bg-white scale-50" />
                                                    )}
                                                </div>
                                                <span className="font-semibold text-psi-dark">PIX</span>
                                            </div>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("credit")}
                                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                                paymentMethod === "credit"
                                                    ? "border-psi-primary bg-psi-primary/5"
                                                    : "border-psi-dark/10 hover:border-psi-primary/30"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`size-4 rounded-full border-2 ${
                                                    paymentMethod === "credit"
                                                        ? "border-psi-primary bg-psi-primary"
                                                        : "border-psi-dark/30"
                                                }`}>
                                                    {paymentMethod === "credit" && (
                                                        <div className="size-full rounded-full bg-white scale-50" />
                                                    )}
                                                </div>
                                                <span className="font-semibold text-psi-dark">Cartão de Crédito</span>
                                            </div>
                                        </button>
                                        
                                        <button
                                            type="button"
                                            onClick={() => setPaymentMethod("boleto")}
                                            className={`w-full p-4 rounded-xl border-2 transition-all text-left ${
                                                paymentMethod === "boleto"
                                                    ? "border-psi-primary bg-psi-primary/5"
                                                    : "border-psi-dark/10 hover:border-psi-primary/30"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`size-4 rounded-full border-2 ${
                                                    paymentMethod === "boleto"
                                                        ? "border-psi-primary bg-psi-primary"
                                                        : "border-psi-dark/30"
                                                }`}>
                                                    {paymentMethod === "boleto" && (
                                                        <div className="size-full rounded-full bg-white scale-50" />
                                                    )}
                                                </div>
                                                <span className="font-semibold text-psi-dark">Boleto Bancário</span>
                                            </div>
                                        </button>
                                    </div>
                                    
                                    {paymentMethod === "credit" && (
                                        <div className="space-y-4 pt-6 border-t border-psi-dark/10">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Número do Cartão *
                                                </label>
                                                <div className="relative">
                                                    <InputMask
                                                        mask="0000 0000 0000 0000"
                                                        value={cardData.number}
                                                        onAccept={(value) => setCardData({ ...cardData, number: value as string })}
                                                        placeholder="0000 0000 0000 0000"
                                                        icon={CreditCard}
                                                    />
                                                    {cardBrand && (
                                                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                            <div className={`size-10 rounded flex items-center justify-center text-xs font-bold ${
                                                                cardBrand === "visa" ? "bg-[#1434CB] text-white" :
                                                                cardBrand === "mastercard" ? "bg-[#EB001B] text-white" :
                                                                cardBrand === "amex" ? "bg-[#006FCF] text-white" :
                                                                cardBrand === "elo" ? "bg-[#FFCB05] text-[#231F20]" :
                                                                cardBrand === "hipercard" ? "bg-[#DF0F50] text-white" :
                                                                "bg-gray-600 text-white"
                                                            }`}>
                                                                {cardBrand === "visa" ? "VISA" :
                                                                 cardBrand === "mastercard" ? "MC" :
                                                                 cardBrand === "amex" ? "AMEX" :
                                                                 cardBrand === "elo" ? "ELO" :
                                                                 cardBrand === "hipercard" ? "HIPER" :
                                                                 cardBrand.toUpperCase().substring(0, 4)}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">
                                                    Nome no Cartão *
                                                </label>
                                                <Input
                                                    value={cardData.name}
                                                    onChange={(e) => setCardData({ ...cardData, name: e.target.value.toUpperCase() })}
                                                    placeholder="NOME COMO ESTÁ NO CARTÃO"
                                                    required
                                                />
                                            </div>
                                            
                                            <div className="grid gap-4
                                            sm:grid-cols-2">
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        Validade *
                                                    </label>
                                                    <InputMask
                                                        mask="00/00"
                                                        value={cardData.expiry}
                                                        onAccept={(value) => setCardData({ ...cardData, expiry: value as string })}
                                                        placeholder="MM/AA"
                                                    />
                                                </div>
                                                
                                                <div>
                                                    <label className="block text-sm font-medium text-psi-dark mb-2">
                                                        CVV *
                                                    </label>
                                                    <InputMask
                                                        mask="000"
                                                        value={cardData.cvv}
                                                        onAccept={(value) => setCardData({ ...cardData, cvv: value as string })}
                                                        placeholder="000"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            
                            {currentStep === 3 && (
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <h2 className="text-xl font-semibold text-psi-dark mb-6">Resumo da Compra</h2>
                                    
                                    <div className="space-y-4">
                                        {items.map((item) => {
                                            const event = eventsData.find(e => e?.id === item.eventId)
                                            if (!event) return null
                                            
                                            return (
                                                <div key={`${item.eventId}-${item.batchId}`} className="border border-psi-dark/10 rounded-xl p-4">
                                                    <div className="flex gap-4">
                                                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-psi-dark/5 shrink-0">
                                                            <img
                                                                src={event.image}
                                                                alt={event.name}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        
                                                        <div className="flex-1 space-y-2">
                                                            <h3 className="font-semibold text-psi-dark">{event.name}</h3>
                                                            
                                                            {item.batchName && (
                                                                <p className="text-sm text-psi-dark/60">Lote: {item.batchName}</p>
                                                            )}
                                                            
                                                            {event.dates.length > 0 && (
                                                                <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                                                    <Calendar className="size-4" />
                                                                    <span>
                                                                        {DateUtilsClass.formatDate(event.dates[0].date, "DD [de] MMMM [de] YYYY")}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            
                                                            {event.dates[0]?.hourStart && (
                                                                <div className="flex items-center gap-2 text-sm text-psi-dark/70">
                                                                    <Clock className="size-4" />
                                                                    <span>
                                                                        {event.dates[0].hourStart}
                                                                        {event.dates[0].hourEnd && ` - ${event.dates[0].hourEnd}`}
                                                                    </span>
                                                                </div>
                                                            )}
                                                            
                                                            <div className="flex items-center justify-between pt-2">
                                                                <div className="flex items-center gap-3">
                                                                    <span className="text-sm text-psi-dark/60">Quantidade:</span>
                                                                    <QuantitySelector
                                                                        value={item.quantity}
                                                                        onChange={(qty) => updateQuantity(item.eventId, item.batchId, qty)}
                                                                        min={1}
                                                                        max={10}
                                                                    />
                                                                </div>
                                                                
                                                                <button
                                                                    type="button"
                                                                    onClick={() => removeItem(item.eventId, item.batchId)}
                                                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                                                                >
                                                                    <Trash2 className="size-4" />
                                                                </button>
                                                            </div>
                                                            
                                                            <div className="pt-2 border-t border-psi-dark/10">
                                                                <p className="text-lg font-semibold text-psi-primary">
                                                                    {ValueUtilsClass.centsToCurrency(item.price * item.quantity)}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    
                                    <div className="mt-6 p-4 rounded-xl bg-psi-primary/5 border border-psi-primary/20">
                                        <div className="flex items-start gap-3">
                                            <Receipt className="size-5 text-psi-primary shrink-0 mt-0.5" />
                                            <div className="space-y-1">
                                                <p className="font-semibold text-psi-dark">Importante</p>
                                                <p className="text-sm text-psi-dark/70">
                                                    Os ingressos serão enviados para o seu e-mail juntamente com o comprovante de pagamento após a confirmação.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            {currentStep === 4 && (
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                                sm:p-8 shadow-sm">
                                    <div className="text-center space-y-4 mb-6">
                                        <div className="inline-flex items-center justify-center size-16 rounded-full bg-psi-primary/10">
                                            <CheckCircle2 className="size-8 text-psi-primary" />
                                        </div>
                                        <h2 className="text-2xl font-semibold text-psi-dark">Finalizar Compra</h2>
                                        <p className="text-psi-dark/60">
                                            Revise todas as informações antes de confirmar
                                        </p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-xl bg-psi-dark/5">
                                            <h3 className="font-semibold text-psi-dark mb-2">Resumo</h3>
                                            <div className="space-y-1 text-sm text-psi-dark/70">
                                                <p><strong>Total:</strong> {ValueUtilsClass.centsToCurrency(total)}</p>
                                                <p><strong>Itens:</strong> {items.reduce((sum, item) => sum + item.quantity, 0)} ingresso(s)</p>
                                                <p><strong>Pagamento:</strong> {paymentMethod === "pix" ? "PIX" : paymentMethod === "credit" ? "Cartão de Crédito" : "Boleto Bancário"}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex justify-center">
                                            <Button
                                                type="button"
                                                onClick={handleFinalize}
                                                variant="primary"
                                                size="lg"
                                                className=""
                                            >
                                                <Check className="size-4" />
                                                Finalizar Compra
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                            
                            <div className="flex items-center justify-between pt-6">
                                {currentStep > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handlePrevious}
                                    >
                                        <ChevronLeft className="size-4" />
                                        Voltar
                                    </Button>
                                )}
                                
                                {currentStep < 4 && (
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={handleNext}
                                        className="ml-auto"
                                    >
                                        Continuar
                                        <ChevronRight className="size-4" />
                                    </Button>
                                )}
                            </div>
                        </div>
                        
                        <div className="lg:sticky lg:top-[100px] lg:h-fit">
                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="font-semibold text-psi-dark mb-4">Resumo do Pedido</h3>
                                
                                <div className="space-y-3 mb-4">
                                    {items.map((item) => (
                                        <div key={`${item.eventId}-${item.batchId}`} className="flex items-center justify-between text-sm">
                                            <span className="text-psi-dark/70">
                                                {item.eventName} x{item.quantity}
                                            </span>
                                            <span className="font-semibold text-psi-dark">
                                                {ValueUtilsClass.centsToCurrency(item.price * item.quantity)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="pt-4 border-t border-psi-dark/10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold text-psi-dark">Total</span>
                                        <span className="text-2xl font-bold text-psi-primary">
                                            {ValueUtilsClass.centsToCurrency(total)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    CheckoutInfo
}

