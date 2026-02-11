"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { InputMask } from "@/components/Input/InputMask"
import { Toast } from "@/components/Toast/Toast"
import { useAuthStore } from "@/stores/Auth/AuthStore"
import { useAuthLogout } from "@/hooks/Auth/useAuthLogout"
import { useUserUpdate } from "@/hooks/User/useUserUpdate"
import { useBankFind } from "@/hooks/Organizer/useBankFind"
import { useEventCache } from "@/hooks/Event/useEventCache"
import { useSellerBalanceCurrent } from "@/hooks/Resale/useSellerBalanceCurrent"
import { usePayoutList } from "@/hooks/Payout/usePayoutList"
import { usePayoutWithdrawSeller } from "@/hooks/Payout/usePayoutWithdrawSeller"
import { usePaymentMySales } from "@/hooks/Payment/usePaymentMySales"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { DateUtils } from "@/utils/Helpers/DateUtils/DateUtils"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogPasswordConfirmation } from "@/components/Dialog/DialogPasswordConfirmation/DialogPasswordConfirmation"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ShoppingBag, UserCog, LogOut, ArrowLeft, ExternalLink, Loader2, CalendarDays, MapPin, Wallet, CreditCard, ChevronUp, ChevronDown, FileText, Eye, EyeOff, Info, ArrowUp, ArrowDown, Receipt } from "lucide-react"
import Logo from "@/components/Logo/Logo"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"

type TProfileForm = {
    firstName: string
    lastName: string
    phone: string
    document: string
    street: string
    number: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
}

type TPayoutForm = {
    bankId: string
    bankAccountType: "CONTA_CORRENTE" | "CONTA_POUPANCA" | null
    bankAccountAgency: string
    bankAccountNumber: string
    bankAccountDigit: string
    bankAccountName: string
    bankAccountOwnerName: string
    bankAccountOwnerBirth: string
    bankAccountOwnerDocumentType: "CPF" | "CNPJ" | null
    bankAccountOwnerDocument: string
    pixAddressType: "CPF" | "CNPJ" | "EMAIL" | "PHONE" | "EVP" | null
    pixAddressKey: string
    payoutMethod: "PIX" | "BANK_ACCOUNT" | null
}

const DashRevendedorPannel = () => {
    const routerService = useRouter()
    const { user, removeUser, setUser } = useAuthStore()
    const { mutateAsync: logoutUser, isPending: isLoggingOut } = useAuthLogout()
    const { mutateAsync: updateUser, isPending: isUpdatingProfile } = useUserUpdate()
    const { data: banksData, isLoading: isLoadingBanks } = useBankFind()
    const { data: eventCacheData, isLoading: isLoadingEventCache, isFetching: isFetchingEventCache } = useEventCache()
    const { data: sellerBalanceData, isLoading: sellerBalanceLoading, refetch: refetchSellerBalance } = useSellerBalanceCurrent()
    const { data: payoutListData, isLoading: payoutListLoading, refetch: refetchPayoutList } = usePayoutList()
    const { mutateAsync: withdrawSeller, isPending: isWithdrawing } = usePayoutWithdrawSeller()
    const { data: mySalesData, isLoading: mySalesLoading } = usePaymentMySales()

    const [activeView, setActiveView] = useState<"home" | "profile" | "wallet" | "sales">("home")
    const [saleSheetOpen, setSaleSheetOpen] = useState(false)
    const [selectedEventSlug, setSelectedEventSlug] = useState("")
    const [openSections, setOpenSections] = useState({ bankAccount: false, pix: false })
    const [isBalanceVisible, setIsBalanceVisible] = useState(false)
    const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
    const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false)

    const sellerActive = user?.sellerActive ?? false
    const sellerCommissionRate = user?.sellerCommissionRate ?? 0

    const [profileForm, setProfileForm] = useState<TProfileForm>({
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        phone: user?.phone || "",
        document: user?.document || "",
        street: user?.Address?.street || "",
        number: user?.Address?.number || "",
        neighborhood: user?.Address?.neighborhood || "",
        city: user?.Address?.city || "",
        state: user?.Address?.state || "",
        zipCode: user?.Address?.zipCode || ""
    })

    const defaultPayoutForm: TPayoutForm = {
        bankId: user?.sellerBankId || "",
        bankAccountType: user?.sellerBankAccountType ?? null,
        bankAccountAgency: user?.sellerBankAccountAgency || "",
        bankAccountNumber: user?.sellerBankAccountNumber || "",
        bankAccountDigit: user?.sellerBankAccountDigit || "",
        bankAccountName: user?.sellerBankAccountName || "",
        bankAccountOwnerName: user?.sellerBankAccountOwnerName || "",
        bankAccountOwnerBirth: user?.sellerBankAccountOwnerBirth || "",
        bankAccountOwnerDocumentType: user?.sellerBankAccountOwnerDocumentType ?? null,
        bankAccountOwnerDocument: user?.sellerBankAccountOwnerDocument || "",
        pixAddressType: user?.sellerPixAddressType ?? null,
        pixAddressKey: user?.sellerPixAddressKey || "",
        payoutMethod: user?.sellerPayoutMethod ?? null
    }

    const [payoutForm, setPayoutForm] = useState<TPayoutForm>(defaultPayoutForm)

    const banks = useMemo(() => {
        if (banksData?.data && Array.isArray(banksData.data)) return banksData.data
        return []
    }, [banksData])

    useEffect(() => {
        if (!user) return
        setProfileForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
            document: user.document || "",
            street: user.Address?.street || "",
            number: user.Address?.number || "",
            neighborhood: user.Address?.neighborhood || "",
            city: user.Address?.city || "",
            state: user.Address?.state || "",
            zipCode: user.Address?.zipCode || ""
        })
        setPayoutForm({
            bankId: user.sellerBankId || "",
            bankAccountType: user.sellerBankAccountType ?? null,
            bankAccountAgency: user.sellerBankAccountAgency || "",
            bankAccountNumber: user.sellerBankAccountNumber || "",
            bankAccountDigit: user.sellerBankAccountDigit || "",
            bankAccountName: user.sellerBankAccountName || "",
            bankAccountOwnerName: user.sellerBankAccountOwnerName || "",
            bankAccountOwnerBirth: user.sellerBankAccountOwnerBirth || "",
            bankAccountOwnerDocumentType: user.sellerBankAccountOwnerDocumentType ?? null,
            bankAccountOwnerDocument: user.sellerBankAccountOwnerDocument || "",
            pixAddressType: user.sellerPixAddressType ?? null,
            pixAddressKey: user.sellerPixAddressKey || "",
            payoutMethod: user.sellerPayoutMethod ?? null
        })
    }, [user])

    const events = useMemo(() => eventCacheData?.data ?? [], [eventCacheData])
    const selectedEvent = useMemo(() => events.find((event) => event.slug === selectedEventSlug) || null, [events, selectedEventSlug])
    const eventUrl = selectedEvent ? `/ver-evento/${selectedEvent.slug}?seller=true` : ""

    const sellerBalance = useMemo(() => sellerBalanceData?.data?.currentValue ?? 0, [sellerBalanceData])
    const sellerBalanceList = useMemo(() => sellerBalanceData?.data?.list ?? [], [sellerBalanceData])
    const payoutList = useMemo(() => payoutListData?.data ?? [], [payoutListData])
    const mySales = useMemo(() => mySalesData?.data ?? [], [mySalesData])

    const getAccountTypeLabel = (type: string | null) => {
        if (type === "CONTA_CORRENTE") return "Conta Corrente"
        if (type === "CONTA_POUPANCA") return "Conta Poupança"
        return type || "—"
    }
    const getPixTypeLabel = (type: string | null) => {
        const labels: Record<string, string> = { CPF: "CPF", CNPJ: "CNPJ", EMAIL: "E-mail", PHONE: "Telefone", EVP: "Chave Aleatória" }
        return labels[type || ""] || type || "—"
    }

    const handleProfileField = <K extends keyof TProfileForm>(field: K, value: TProfileForm[K]) => {
        setProfileForm((prev) => ({ ...prev, [field]: value }))
    }

    const handlePayoutField = <K extends keyof TPayoutForm>(field: K, value: TPayoutForm[K]) => {
        setPayoutForm((prev) => ({ ...prev, [field]: value }))
        if (field === "bankAccountOwnerDocumentType" && !value) {
            setPayoutForm((prev) => ({ ...prev, bankAccountOwnerDocument: "" }))
        }
    }

    const hasBankAccount = Boolean(
        payoutForm.bankId && payoutForm.bankAccountType && payoutForm.bankAccountAgency?.trim() &&
        payoutForm.bankAccountNumber?.trim() && payoutForm.bankAccountDigit?.trim() &&
        payoutForm.bankAccountName?.trim() && payoutForm.bankAccountOwnerName?.trim() &&
        payoutForm.bankAccountOwnerBirth?.trim() && payoutForm.bankAccountOwnerDocumentType &&
        payoutForm.bankAccountOwnerDocument?.replace(/\D/g, "").length >= 11
    )
    const hasPix = Boolean(payoutForm.pixAddressType && payoutForm.pixAddressKey?.trim())

    const handleLogout = async () => {
        try {
            const response = await logoutUser()
            if (response?.success) {
                removeUser()
                routerService.push("/login")
                return
            }
            Toast.error("Nao foi possivel sair da conta")
        } catch {
            Toast.error("Nao foi possivel sair da conta")
        }
    }

    const handleSaveProfile = async () => {
        if (!profileForm.firstName.trim() || !profileForm.lastName.trim()) {
            Toast.error("Nome e sobrenome sao obrigatorios")
            return
        }
        const hasAnyPayout = hasBankAccount || hasPix
        if (hasAnyPayout) {
            if (hasBankAccount) {
                if (!payoutForm.bankId || !payoutForm.bankAccountType || !payoutForm.bankAccountAgency?.trim() ||
                    !payoutForm.bankAccountNumber?.trim() || !payoutForm.bankAccountDigit?.trim() ||
                    !payoutForm.bankAccountName?.trim() || !payoutForm.bankAccountOwnerName?.trim() ||
                    !payoutForm.bankAccountOwnerBirth?.trim() || !payoutForm.bankAccountOwnerDocumentType ||
                    !payoutForm.bankAccountOwnerDocument?.replace(/\D/g, "").length) {
                    Toast.error("Se preencheu conta bancária, todos os campos marcados com * são obrigatórios.")
                    return
                }
            }
            if (hasPix && (!payoutForm.pixAddressType || !payoutForm.pixAddressKey?.trim())) {
                Toast.error("Se preencheu chave PIX, tipo e chave são obrigatórios.")
                return
            }
            if (hasBankAccount && hasPix && !payoutForm.payoutMethod) {
                Toast.error("Selecione o método de pagamento preferido (PIX ou Conta Bancária).")
                return
            }
        }

        try {
            const response = await updateUser({
                firstName: profileForm.firstName,
                lastName: profileForm.lastName,
                phone: profileForm.phone || null,
                address: {
                    street: profileForm.street || null,
                    number: profileForm.number || null,
                    neighborhood: profileForm.neighborhood || null,
                    city: profileForm.city || null,
                    state: profileForm.state || null,
                    zipCode: profileForm.zipCode || null
                },
                sellerBankId: payoutForm.bankId || null,
                sellerBankAccountType: payoutForm.bankAccountType,
                sellerBankAccountAgency: payoutForm.bankAccountAgency?.trim() || null,
                sellerBankAccountNumber: payoutForm.bankAccountNumber?.trim() || null,
                sellerBankAccountDigit: payoutForm.bankAccountDigit?.trim() || null,
                sellerBankAccountName: payoutForm.bankAccountName?.trim() || null,
                sellerBankAccountOwnerName: payoutForm.bankAccountOwnerName?.trim() || null,
                sellerBankAccountOwnerBirth: payoutForm.bankAccountOwnerBirth?.trim() || null,
                sellerBankAccountOwnerDocumentType: payoutForm.bankAccountOwnerDocumentType,
                sellerBankAccountOwnerDocument: payoutForm.bankAccountOwnerDocument?.replace(/\D/g, "") || null,
                sellerPixAddressType: payoutForm.pixAddressType,
                sellerPixAddressKey: payoutForm.pixAddressKey?.trim() || null,
                sellerPayoutMethod: hasBankAccount && hasPix ? payoutForm.payoutMethod : null
            } as any)

            if (response?.success && response.data) {
                setUser(response.data)
                Toast.success("Perfil atualizado com sucesso")
                return
            }

            Toast.error("Nao foi possivel salvar o perfil")
        } catch (error: any) {
            Toast.error(error?.response?.data?.message || "Nao foi possivel salvar o perfil")
        }
    }

    return (
        <Background variant="light" className="min-h-screen py-6 pb-24">
            <div className="container px-4 sm:px-6">
                <div className="mb-[30px] flex items-center justify-center gap-2">
                    <Logo className="h-12 w-auto sm:h-14" variant="primary" />
                    <span className="
                            ms-2 text-[0.85rem]
                            xs:text-[1.12rem]
                            sm:text-2xl
                            font-extrabold
                            tracking-tight
                            text-psi-primary
                            transition-colors duration-300
                            group-hover:text-psi-dark">
                            <span className="bg-linear-to-r from-psi-primary via-psi-secondary to-psi-tertiary bg-clip-text text-transparent">
                                Porto
                            </span>{" "}
                            <span className="bg-linear-to-r from-psi-tertiary via-psi-secondary to-psi-primary bg-clip-text text-transparent">
                                Seguro
                            </span>{" "}
                            <span className="inline-block font-semibold text-psi-dark">
                                Ingressos
                            </span>
                        </span>
                </div>
                <hr />

                <div className="mx-auto mt-[30px] max-w-3xl space-y-5">
                    {activeView === "home" ? (
                        <>
                            <div className="space-y-1">
                                <h1 className="text-2xl font-semibold text-psi-primary sm:text-3xl">Painel do Revendedor</h1>
                                <p className="text-sm text-psi-dark/60">Selecione um evento e realize vendas no fluxo normal da plataforma.</p>
                                <div className="flex flex-wrap items-center gap-2">
                                    <Badge variant="secondary" className="bg-psi-dark/5 text-psi-dark/70">Revendedor</Badge>
                                    <Badge variant="secondary" className="bg-psi-primary/10 text-psi-primary">Taxa de comissao: {sellerCommissionRate}%</Badge>
                                    {!sellerActive && <Badge variant="secondary" className="bg-amber-100 text-amber-800">Vendas desativadas</Badge>}
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => sellerActive && setSaleSheetOpen(true)}
                                disabled={!sellerActive}
                                className={`w-full rounded-3xl p-6 sm:p-8 text-left shadow-lg transition-all duration-200 ${sellerActive
                                    ? "bg-psi-primary text-white shadow-psi-primary/30 hover:shadow-xl hover:shadow-psi-primary/40 hover:scale-[1.02] active:scale-[0.99]"
                                    : "bg-psi-dark/10 text-psi-dark/50 cursor-not-allowed"}`}
                            >
                                <div className="flex items-start gap-4">
                                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 ${sellerActive ? "bg-white/20" : "bg-psi-dark/20"}`}>
                                        <ShoppingBag className="h-6 w-6" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xl font-semibold sm:text-2xl">Nova venda</p>
                                        <p className="text-sm sm:text-base opacity-90">
                                            {sellerActive
                                                ? "Abra o painel, selecione um evento e continue a venda no modo revendedor."
                                                : "Voce esta impedido de revender no momento. Entre em contato com o organizador."}
                                        </p>
                                    </div>
                                </div>
                            </button>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <button
                                    type="button"
                                    onClick={() => setActiveView("sales")}
                                    className="rounded-2xl border border-[#E4E6F0] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:border-psi-primary/30 hover:bg-psi-primary/5 w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-psi-primary/10 text-psi-primary"><Receipt className="h-5 w-5" /></div>
                                        <div>
                                            <p className="font-medium text-psi-dark">Minhas vendas</p>
                                            <p className="text-xs text-psi-dark/60">Vendas realizadas e comissoes</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveView("wallet")}
                                    className="rounded-2xl border border-[#E4E6F0] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:border-psi-primary/30 hover:bg-psi-primary/5 w-full"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600"><Wallet className="h-5 w-5" /></div>
                                        <div>
                                            <p className="font-medium text-psi-dark">Carteira</p>
                                            <p className="text-xs text-psi-dark/60">Saldo e saques</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setActiveView("profile")}
                                    className="rounded-2xl border border-[#E4E6F0] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:border-psi-primary/30 hover:bg-psi-primary/5"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-psi-primary/10 text-psi-primary"><UserCog className="h-5 w-5" /></div>
                                        <div>
                                            <p className="font-medium text-psi-dark">Meu perfil</p>
                                            <p className="text-xs text-psi-dark/60">Editar dados basicos</p>
                                        </div>
                                    </div>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    disabled={isLoggingOut}
                                    className="rounded-2xl border border-[#E4E6F0] bg-white p-4 text-left shadow-sm transition-all duration-200 hover:shadow-md hover:border-red-200 hover:bg-red-50 disabled:opacity-70"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600"><LogOut className="h-5 w-5" /></div>
                                        <div>
                                            <p className="font-medium text-psi-dark">{isLoggingOut ? "Saindo..." : "Sair"}</p>
                                            <p className="text-xs text-psi-dark/60">Encerrar sessao</p>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </>
                    ) : activeView === "profile" ? (
                        <div className="space-y-5 rounded-2xl border border-[#E4E6F0] bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-xl font-semibold text-psi-dark">Meu perfil</h2>
                                    <p className="text-sm text-psi-dark/60">Dados do revendedor</p>
                                </div>
                                <Button variant="outline" onClick={() => setActiveView("home")} size="sm"><ArrowLeft className="h-4 w-4" />Voltar</Button>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Input placeholder="Nome" value={profileForm.firstName} onChange={(event) => handleProfileField("firstName", event.target.value)} />
                                <Input placeholder="Sobrenome" value={profileForm.lastName} onChange={(event) => handleProfileField("lastName", event.target.value)} />

                                <div className="sm:col-span-2">
                                    <label className="mb-1.5 block text-sm font-medium text-psi-dark">E-mail</label>
                                    <Input type="email" value={user?.email ?? ""} disabled className="bg-muted" />
                                    <p className="mt-1 text-xs text-muted-foreground">E-mail nao pode ser alterado.</p>
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-psi-dark">Telefone</label>
                                    <InputMask placeholder="(00) 00000-0000" mask="(00) 00000-0000" value={profileForm.phone} onAccept={(value) => handleProfileField("phone", String(value))} />
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-psi-dark">CPF</label>
                                    <InputMask placeholder="000.000.000-00" mask="000.000.000-00" value={profileForm.document} disabled className="bg-muted" />
                                    <p className="mt-1 text-xs text-muted-foreground">CPF nao pode ser alterado.</p>
                                </div>

                                <Input placeholder="Rua" value={profileForm.street} onChange={(event) => handleProfileField("street", event.target.value)} className="sm:col-span-2" />
                                <Input placeholder="Numero" value={profileForm.number} onChange={(event) => handleProfileField("number", event.target.value)} />
                                <Input placeholder="Bairro" value={profileForm.neighborhood} onChange={(event) => handleProfileField("neighborhood", event.target.value)} />
                                <Input placeholder="Cidade" value={profileForm.city} onChange={(event) => handleProfileField("city", event.target.value)} />
                                <Input placeholder="Estado" value={profileForm.state} onChange={(event) => handleProfileField("state", event.target.value)} />
                                <InputMask placeholder="00000-000" mask="00000-000" value={profileForm.zipCode} onAccept={(value) => handleProfileField("zipCode", String(value))} />
                            </div>

                            <Collapsible
                                open={openSections.bankAccount}
                                onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, bankAccount: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <CreditCard className="h-5 w-5 text-psi-primary" />
                                                </div>
                                                <div className="text-start">
                                                    <h2 className="text-lg font-medium text-psi-dark">Conta Bancária</h2>
                                                    <p className="text-sm text-psi-dark/60">Opcional - Se preencher, todos os campos marcados com * são obrigatórios</p>
                                                    <p className="text-xs text-psi-dark/50 mt-1">Taxa de transferência: R$ 5,00</p>
                                                </div>
                                            </div>
                                            {openSections.bankAccount ? <ChevronUp className="h-5 w-5 text-psi-dark/60" /> : <ChevronDown className="h-5 w-5 text-psi-dark/60" />}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Banco *</label>
                                                <Select
                                                    value={payoutForm.bankId || undefined}
                                                    onValueChange={(value) => handlePayoutField("bankId", value || "")}
                                                    disabled={isLoadingBanks}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Selecione o banco" /></SelectTrigger>
                                                    <SelectContent>
                                                        {banks.map((bank) => (
                                                            <SelectItem key={bank.id} value={bank.id}>{bank.name} ({bank.code})</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Tipo de conta *</label>
                                                <Select
                                                    value={payoutForm.bankAccountType ?? undefined}
                                                    onValueChange={(value) => handlePayoutField("bankAccountType", value === "CONTA_CORRENTE" || value === "CONTA_POUPANCA" ? value : null)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CONTA_CORRENTE">Conta Corrente</SelectItem>
                                                        <SelectItem value="CONTA_POUPANCA">Conta Poupança</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Agência *</label>
                                                <Input
                                                    value={payoutForm.bankAccountAgency}
                                                    onChange={(e) => handlePayoutField("bankAccountAgency", e.target.value)}
                                                    placeholder="Número da agência"
                                                    inputMode="numeric"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Número da conta *</label>
                                                <Input
                                                    value={payoutForm.bankAccountNumber}
                                                    onChange={(e) => handlePayoutField("bankAccountNumber", e.target.value)}
                                                    placeholder="Número da conta"
                                                    inputMode="numeric"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Dígito verificador *</label>
                                                <Input
                                                    value={payoutForm.bankAccountDigit}
                                                    onChange={(e) => handlePayoutField("bankAccountDigit", e.target.value)}
                                                    placeholder="Dígito"
                                                    maxLength={2}
                                                    inputMode="numeric"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Nome da conta *</label>
                                                <Input
                                                    value={payoutForm.bankAccountName}
                                                    onChange={(e) => handlePayoutField("bankAccountName", e.target.value)}
                                                    placeholder="Nome da conta"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Nome do titular *</label>
                                                <Input
                                                    value={payoutForm.bankAccountOwnerName}
                                                    onChange={(e) => handlePayoutField("bankAccountOwnerName", e.target.value)}
                                                    placeholder="Nome completo do titular"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Data de nascimento do titular *</label>
                                                <InputMask
                                                    value={payoutForm.bankAccountOwnerBirth}
                                                    onAccept={(value) => handlePayoutField("bankAccountOwnerBirth", String(value))}
                                                    mask="00/00/0000"
                                                    placeholder="DD/MM/AAAA"
                                                    icon={FileText}
                                                    inputMode="numeric"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Tipo de documento *</label>
                                                <Select
                                                    value={payoutForm.bankAccountOwnerDocumentType ?? undefined}
                                                    onValueChange={(value) => handlePayoutField("bankAccountOwnerDocumentType", value === "CPF" || value === "CNPJ" ? value : null)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CPF">CPF</SelectItem>
                                                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="lg:col-span-2">
                                                <label className="block text-sm font-medium text-psi-dark mb-2">CPF/CNPJ do titular *</label>
                                                <InputMask
                                                    value={payoutForm.bankAccountOwnerDocument}
                                                    onAccept={(value) => handlePayoutField("bankAccountOwnerDocument", String(value))}
                                                    mask={payoutForm.bankAccountOwnerDocumentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                                                    placeholder={payoutForm.bankAccountOwnerDocumentType === "CPF" ? "000.000.000-00" : "00.000.000/0000-00"}
                                                    icon={FileText}
                                                    disabled={!payoutForm.bankAccountOwnerDocumentType}
                                                    inputMode="numeric"
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            <Collapsible
                                open={openSections.pix}
                                onOpenChange={(open) => setOpenSections((prev) => ({ ...prev, pix: open }))}
                            >
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 sm:p-8 shadow-sm">
                                    <CollapsibleTrigger className="w-full">
                                        <div className="flex items-center justify-between pb-4 border-b border-psi-dark/10">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-xl bg-psi-primary/10 flex items-center justify-center">
                                                    <Wallet className="h-5 w-5 text-psi-primary" />
                                                </div>
                                                <div className="text-start">
                                                    <h2 className="text-lg font-medium text-psi-dark">Chave PIX</h2>
                                                    <p className="text-sm text-psi-dark/60">Opcional - Se preencher, todos os campos marcados com * são obrigatórios</p>
                                                    <p className="text-xs text-psi-dark/50 mt-1">Taxa de transferência: R$ 2,00</p>
                                                </div>
                                            </div>
                                            {openSections.pix ? <ChevronUp className="h-5 w-5 text-psi-dark/60" /> : <ChevronDown className="h-5 w-5 text-psi-dark/60" />}
                                        </div>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="space-y-6 pt-6">
                                        <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                                            <p className="text-sm text-amber-900">
                                                <strong>Importante:</strong> É necessário preencher pelo menos uma conta bancária ou chave PIX para receber os pagamentos.
                                            </p>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Tipo de chave PIX *</label>
                                                <Select
                                                    value={payoutForm.pixAddressType ?? undefined}
                                                    onValueChange={(value) => handlePayoutField("pixAddressType", value === "CPF" || value === "CNPJ" || value === "EMAIL" || value === "PHONE" || value === "EVP" ? value : null)}
                                                >
                                                    <SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="CPF">CPF</SelectItem>
                                                        <SelectItem value="CNPJ">CNPJ</SelectItem>
                                                        <SelectItem value="EMAIL">E-mail</SelectItem>
                                                        <SelectItem value="PHONE">Telefone</SelectItem>
                                                        <SelectItem value="EVP">Chave aleatória</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-psi-dark mb-2">Chave PIX *</label>
                                                <Input
                                                    value={payoutForm.pixAddressKey}
                                                    onChange={(e) => handlePayoutField("pixAddressKey", e.target.value)}
                                                    placeholder="Digite a chave PIX"
                                                />
                                            </div>
                                        </div>
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>

                            {hasBankAccount && hasPix && (
                                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 sm:p-8 shadow-sm">
                                    <div className="space-y-4">
                                        <h2 className="text-lg font-medium text-psi-dark">Método de Pagamento Preferido</h2>
                                        <p className="text-sm text-psi-dark/60">
                                            Você configurou tanto a conta bancária quanto a chave PIX. Selecione qual método você prefere usar para receber os repasses.
                                        </p>
                                        <div>
                                            <label className="block text-sm font-medium text-psi-dark mb-2">Método de pagamento preferido *</label>
                                            <Select
                                                value={payoutForm.payoutMethod ?? undefined}
                                                onValueChange={(value) => handlePayoutField("payoutMethod", value === "PIX" || value === "BANK_ACCOUNT" ? value : null)}
                                            >
                                                <SelectTrigger><SelectValue placeholder="Selecione o método preferido" /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="PIX">PIX</SelectItem>
                                                    <SelectItem value="BANK_ACCOUNT">Conta Bancária</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <p className="text-xs text-psi-dark/50 mt-1">Selecione como você prefere receber os pagamentos quando ambos os métodos estiverem configurados</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="text-end">
                                <Button variant="primary" onClick={handleSaveProfile} disabled={isUpdatingProfile} className="w-full sm:w-auto">
                                    {isUpdatingProfile ? "Salvando..." : "Salvar alterações"}
                                </Button>
                            </div>
                        </div>
                    ) : activeView === "wallet" ? (
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-2">
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-psi-dark sm:text-2xl">Carteira</h2>
                                    <p className="text-sm text-psi-dark/60">Saldo disponível para saque e movimentações</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsBalanceVisible(!isBalanceVisible)}
                                        aria-label={isBalanceVisible ? "Ocultar saldo" : "Mostrar saldo"}
                                    >
                                        {isBalanceVisible ? <EyeOff className="h-5 w-5 text-psi-dark/60" /> : <Eye className="h-5 w-5 text-psi-dark/60" />}
                                    </Button>
                                    <Button variant="outline" onClick={() => setActiveView("home")} size="sm"><ArrowLeft className="h-4 w-4" />Voltar</Button>
                                </div>
                            </div>

                            {!user?.sellerPayoutMethod && (
                                <div className="rounded-xl border-2 border-amber-200 bg-amber-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-900 mb-1">Método de recebimento não configurado</p>
                                            <p className="text-sm text-amber-800">
                                                Para receber seus repasses, configure uma conta bancária ou chave PIX em <button type="button" onClick={() => setActiveView("profile")} className="font-semibold underline hover:no-underline">Meu perfil</button>.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 sm:p-8 shadow-sm">
                                <div className="text-start">
                                    <div className="text-xs text-psi-dark/60">Disponível</div>
                                    <div className="mt-1 text-4xl font-extrabold text-psi-primary">
                                        {sellerBalanceLoading ? "—" : isBalanceVisible ? ValueUtils.centsToCurrency(sellerBalance) : "••••••"}
                                    </div>
                                    <hr className="my-4" />
                                    <Button
                                        variant="primary"
                                        disabled={sellerBalanceLoading || sellerBalance <= 0 || !user?.sellerPayoutMethod}
                                        onClick={() => setIsWithdrawDialogOpen(true)}
                                    >
                                        Sacar
                                    </Button>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 sm:p-8 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium text-psi-dark">Histórico</h3>
                                    <p className="text-sm text-psi-dark/60">Últimas transações</p>
                                </div>
                                {payoutListLoading && sellerBalanceLoading ? (
                                    <p className="text-sm text-psi-dark/60">Carregando histórico...</p>
                                ) : payoutList.length === 0 && sellerBalanceList.length === 0 ? (
                                    <p className="text-sm text-psi-dark/60">Nenhuma transação encontrada.</p>
                                ) : (
                                    <ul className="space-y-3">
                                        {payoutList.map((item, idx) => {
                                            const isPaid = item.status === "PAID"
                                            const isFailed = item.status === "FAILED"
                                            const isProcessing = item.status === "PROCESSING"
                                            const colorClass = isFailed ? "text-red-600" : isPaid ? "text-red-600" : "text-amber-600"
                                            const borderClass = isFailed ? "border-red-200 bg-red-50/50" : "border-[#F0F1F6] bg-white"
                                            const formattedDate = DateUtils.formatDate(item.createdAt)
                                            const formattedPaidDate = item.paidAt ? DateUtils.formatDate(item.paidAt) : null
                                            return (
                                                <li key={`p-${idx}`} className={`flex items-center justify-between p-3 rounded-lg border ${borderClass}`}>
                                                    <div className="flex items-center gap-3 flex-1">
                                                        <div className={`p-2 rounded-md ${isFailed ? "bg-red-100" : "bg-psi-primary/10"} ${colorClass}`}>
                                                            <ArrowDown className="h-4 w-4" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-2">
                                                                <div className="text-sm font-medium text-psi-dark">Saque</div>
                                                                {isFailed && <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 border border-red-200">Falhou</span>}
                                                            </div>
                                                            <div className="text-xs text-psi-dark/60">
                                                                {formattedDate}
                                                                {formattedPaidDate && ` • Pago em ${formattedPaidDate}`}
                                                            </div>
                                                            {isProcessing && <div className="text-xs text-amber-600 font-medium mt-1">Processando</div>}
                                                            {isFailed && item.failReason && (
                                                                <div className="mt-2 p-2 rounded-md bg-red-50 border border-red-100">
                                                                    <p className="text-xs font-medium text-red-800 mb-1">Motivo da falha:</p>
                                                                    <p className="text-xs text-red-700">{item.failReason}</p>
                                                                </div>
                                                            )}
                                                            {item.transactionReceiptUrl && (
                                                                <div className="mt-2">
                                                                    <a href={item.transactionReceiptUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-psi-primary hover:text-psi-primary/80 font-medium">
                                                                        Ver comprovante <ExternalLink className="h-3 w-3" />
                                                                    </a>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className={`text-sm font-medium ${colorClass}`}>
                                                            {isBalanceVisible ? `- ${ValueUtils.centsToCurrency(item.value)}` : "••••"}
                                                        </div>
                                                    </div>
                                                </li>
                                            )
                                        })}
                                        {sellerBalanceList.map((item, idx) => (
                                            <li key={`b-${idx}`} className="flex items-center justify-between p-3 rounded-lg border border-[#F0F1F6] bg-white">
                                                <div className="flex items-center gap-3">
                                                    <div className="p-2 rounded-md bg-psi-primary/10 text-emerald-600"><ArrowUp className="h-4 w-4" /></div>
                                                    <div>
                                                        <div className="text-sm font-medium text-psi-dark">Liberado</div>
                                                        <div className="text-xs text-psi-dark/60">{DateUtils.formatDate(item.createdAt)}</div>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="text-sm font-medium text-emerald-600">{isBalanceVisible ? ValueUtils.centsToCurrency(item.value) : "••••"}</div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        </div>
                    ) : activeView === "sales" ? (
                        <div className="space-y-5 rounded-2xl border border-[#E4E6F0] bg-white p-5 shadow-sm sm:p-6">
                            <div className="flex items-center justify-between gap-2">
                                <div>
                                    <h2 className="text-xl font-semibold text-psi-dark">Minhas vendas</h2>
                                    <p className="text-sm text-psi-dark/60">Vendas realizadas e comissões</p>
                                </div>
                                <Button variant="outline" onClick={() => setActiveView("home")} size="sm"><ArrowLeft className="h-4 w-4" />Voltar</Button>
                            </div>
                            {mySalesLoading ? (
                                <p className="text-sm text-psi-dark/60">Carregando vendas...</p>
                            ) : mySales.length === 0 ? (
                                <p className="text-sm text-psi-dark/60">Nenhuma venda encontrada.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {mySales.map((sale) => (
                                        <li key={sale.id} className="rounded-xl border border-[#E4E6F0] bg-psi-dark/5 p-4">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div>
                                                    <p className="font-medium text-psi-dark">{sale.event?.name ?? "Evento"}</p>
                                                    <p className="text-xs text-psi-dark/60">Código: {sale.code}</p>
                                                    {sale.customer && (
                                                        <p className="text-xs text-psi-dark/60 mt-1">
                                                            {sale.customer.firstName} {sale.customer.lastName} • {sale.customer.email}
                                                        </p>
                                                    )}
                                                    <p className="text-xs text-psi-dark/60 mt-1">{DateUtils.formatDate(sale.createdAt)}</p>
                                                </div>
                                                <div className="text-right">
                                                    {sale.totalPaidByCustomer != null && (
                                                        <p className="text-sm text-psi-dark/70">Total: {ValueUtils.centsToCurrency(sale.totalPaidByCustomer)}</p>
                                                    )}
                                                    {sale.sellerCommissionValue != null && (
                                                        <p className="text-sm font-medium text-emerald-600">Sua comissão: {ValueUtils.centsToCurrency(sale.sellerCommissionValue)}</p>
                                                    )}
                                                    {sale.sellerCommissionRate != null && (
                                                        <p className="text-xs text-psi-dark/60">Taxa: {sale.sellerCommissionRate}%</p>
                                                    )}
                                                </div>
                                            </div>
                                            {sale.tickets?.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-psi-dark/10">
                                                    <p className="text-xs font-medium text-psi-dark/70 mb-1">Ingressos</p>
                                                    <ul className="space-y-1">
                                                        {sale.tickets.map((t) => (
                                                            <li key={t.id} className="text-xs text-psi-dark/60">
                                                                {t.ticketType?.name ?? "Ingresso"} • {ValueUtils.centsToCurrency(t.price)} • {t.status}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ) : null}
                </div>
            </div>

            <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Solicitar Saque</DialogTitle>
                        <DialogDescription>Confira as informações abaixo antes de confirmar o saque</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-6 mt-4">
                        <div className="rounded-xl border border-[#E4E6F0] bg-[#F3F4FB] p-4">
                            <div className="text-sm text-psi-dark/60 mb-1">Valor disponível para saque</div>
                            <div className="text-3xl font-semibold text-psi-primary">{ValueUtils.centsToCurrency(sellerBalance)}</div>
                        </div>
                        {user?.sellerPayoutMethod === "BANK_ACCOUNT" && (
                            <div className="space-y-4">
                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 space-y-3">
                                    <h3 className="text-lg font-medium text-psi-dark">Conta Bancária</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Banco</div>
                                            <div className="text-sm font-medium text-psi-dark">{banks.find((b) => b.id === user?.sellerBankId)?.name ?? "—"}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Tipo de Conta</div>
                                            <div className="text-sm font-medium text-psi-dark">{getAccountTypeLabel(user?.sellerBankAccountType ?? null)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Agência</div>
                                            <div className="text-sm font-medium text-psi-dark">{user?.sellerBankAccountAgency ?? "—"}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Conta</div>
                                            <div className="text-sm font-medium text-psi-dark">{user?.sellerBankAccountNumber ? `${user.sellerBankAccountNumber}-${user.sellerBankAccountDigit ?? ""}` : "—"}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Nome da Conta</div>
                                            <div className="text-sm font-medium text-psi-dark">{user?.sellerBankAccountName ?? "—"}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Titular</div>
                                            <div className="text-sm font-medium text-psi-dark">{user?.sellerBankAccountOwnerName ?? "—"}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-amber-900 mb-1">Taxa e Prazo</p>
                                            <p className="text-sm text-amber-700">A taxa para transferência bancária é de <strong>R$ 5,00</strong> e o valor leva até <strong>3 dias úteis</strong> para cair na conta.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {user?.sellerPayoutMethod === "PIX" && (
                            <div className="space-y-4">
                                <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 space-y-3">
                                    <h3 className="text-lg font-medium text-psi-dark">Chave PIX</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Tipo de Chave</div>
                                            <div className="text-sm font-medium text-psi-dark">{getPixTypeLabel(user?.sellerPixAddressType ?? null)}</div>
                                        </div>
                                        <div>
                                            <div className="text-xs text-psi-dark/60 mb-1">Chave PIX</div>
                                            <div className="text-sm font-medium text-psi-dark break-all">{user?.sellerPixAddressKey ?? "—"}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                                    <div className="flex items-start gap-3">
                                        <Info className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-sm font-medium text-emerald-900 mb-1">Taxa e Prazo</p>
                                            <p className="text-sm text-emerald-700">A taxa para transferência via PIX é de <strong>R$ 2,00</strong> e o pagamento é <strong>instantâneo</strong>.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {!user?.sellerPayoutMethod && (
                            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                                <div className="flex items-start gap-3">
                                    <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                                    <p className="text-sm text-amber-700">Configure uma conta bancária ou chave PIX em Meu perfil para realizar saques.</p>
                                </div>
                            </div>
                        )}
                        <div className="flex items-center justify-end gap-3 pt-4">
                            <Button variant="ghost" onClick={() => setIsWithdrawDialogOpen(false)} disabled={isWithdrawing}>Cancelar</Button>
                            <Button
                                variant="primary"
                                disabled={!user?.sellerPayoutMethod || sellerBalance <= 0 || isWithdrawing}
                                onClick={() => { setIsWithdrawDialogOpen(false); setIsPasswordDialogOpen(true) }}
                            >
                                Confirmar Saque
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <DialogPasswordConfirmation
                open={isPasswordDialogOpen}
                onOpenChange={setIsPasswordDialogOpen}
                onConfirm={async () => {
                    try {
                        await withdrawSeller()
                        Toast.success("Saque solicitado com sucesso!")
                        setIsPasswordDialogOpen(false)
                        refetchSellerBalance()
                        refetchPayoutList()
                    } catch {
                        Toast.error("Erro ao solicitar saque")
                    }
                }}
                title="Confirmação de Segurança"
                description="Por motivos de segurança, digite sua senha para confirmar o saque."
            />

            <Sheet open={saleSheetOpen} onOpenChange={setSaleSheetOpen}>
                <SheetContent side="right" className="flex w-screen lg:max-w-[98vw] flex-col p-0">
                    <div className="shrink-0 border-b border-[#E4E6F0] bg-white px-4 py-3">
                        <div className="flex flex-col items-start gap-2">
                            <div>
                                <h2 className="text-lg font-semibold text-psi-dark">Nova venda</h2>
                                <p className="text-xs text-psi-dark/60">Selecione um evento para iniciar a venda</p>
                            </div>
                            {selectedEvent && (
                                <Button asChild variant="outline" size="sm">
                                    <Link href={eventUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" />Abrir em nova aba</Link>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
                        {(isLoadingEventCache || isFetchingEventCache) ? (
                            <div className="flex items-center gap-2 p-4 text-sm text-psi-dark/70">
                                <Loader2 className="h-4 w-4 animate-spin" />Carregando eventos do organizador...
                            </div>
                        ) : events.length === 0 ? (
                            <div className="p-4 text-sm text-psi-dark/70">Nenhum evento disponivel para revenda no momento.</div>
                        ) : (
                            <>
                                <div className="shrink-0 overflow-x-auto border-b border-[#E4E6F0] bg-psi-dark/5 px-3 py-2">
                                    <div className="flex gap-2">
                                        {events.map((event) => (
                                            <button
                                                key={event.id}
                                                type="button"
                                                onClick={() => setSelectedEventSlug(event.slug)}
                                                className={`flex shrink-0 items-center gap-2 rounded-xl border p-2 text-left transition-all ${selectedEventSlug === event.slug
                                                    ? "border-psi-primary bg-white shadow-sm ring-1 ring-psi-primary/30"
                                                    : "border-transparent bg-white/80 hover:border-psi-primary/40 hover:bg-white"}`}
                                                title={event.name}
                                            >
                                                <div className="h-10 w-14 overflow-hidden rounded-lg bg-psi-dark/10">
                                                    <img src={ImageUtils.getEventImageUrl(event.image)} alt="" className="h-full w-full object-cover" />
                                                </div>
                                                <div className="min-w-0 max-w-[120px]">
                                                    <p className="truncate text-xs font-medium text-psi-dark">{event.name}</p>
                                                    {event.EventDates?.[0]?.date && (
                                                        <p className="text-[10px] text-psi-dark/60">{new Date(event.EventDates[0].date).toLocaleDateString("pt-BR")}</p>
                                                    )}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {selectedEvent ? (
                                    <div className="min-h-0 flex-1 overflow-hidden bg-[#F0F1F6] p-2">
                                        <iframe
                                            key={eventUrl}
                                            src={eventUrl}
                                            className="h-full w-full rounded-xl border border-[#E4E6F0] bg-white"
                                            title={`Venda revendedor - ${selectedEvent.name}`}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-1 items-center justify-center p-8 text-center">
                                        <p className="text-sm text-psi-dark/60">Selecione um evento acima para abrir o fluxo de venda.</p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </SheetContent>
            </Sheet>
        </Background>
    )
}

export { DashRevendedorPannel }
