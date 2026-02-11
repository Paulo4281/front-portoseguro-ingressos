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
import { useEventCache } from "@/hooks/Event/useEventCache"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { ShoppingBag, UserCog, LogOut, ArrowLeft, ExternalLink, Loader2, CalendarDays, MapPin } from "lucide-react"
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

const DashRevendedorPannel = () => {
    const routerService = useRouter()
    const { user, removeUser, setUser } = useAuthStore()
    const { mutateAsync: logoutUser, isPending: isLoggingOut } = useAuthLogout()
    const { mutateAsync: updateUser, isPending: isUpdatingProfile } = useUserUpdate()
    const { data: eventCacheData, isLoading: isLoadingEventCache, isFetching: isFetchingEventCache } = useEventCache()

    const [activeView, setActiveView] = useState<"home" | "profile">("home")
    const [saleSheetOpen, setSaleSheetOpen] = useState(false)
    const [selectedEventSlug, setSelectedEventSlug] = useState("")

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
    }, [user])

    const events = useMemo(() => eventCacheData?.data ?? [], [eventCacheData])
    const selectedEvent = useMemo(() => events.find((event) => event.slug === selectedEventSlug) || null, [events, selectedEventSlug])
    const eventUrl = selectedEvent ? `/ver-evento/${selectedEvent.slug}?seller=true` : ""

    const handleProfileField = <K extends keyof TProfileForm>(field: K, value: TProfileForm[K]) => {
        setProfileForm((prev) => ({ ...prev, [field]: value }))
    }

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
                }
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
                    <span className="ms-2 text-[0.85rem] xs:text-[1.12rem] sm:text-2xl font-extrabold tracking-tight text-psi-primary">
                        Porto Seguro Ingressos
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
                    ) : (
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

                            <Button variant="primary" onClick={handleSaveProfile} disabled={isUpdatingProfile} className="w-full sm:w-auto">
                                {isUpdatingProfile ? "Salvando..." : "Salvar alteracoes"}
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            <Sheet open={saleSheetOpen} onOpenChange={setSaleSheetOpen}>
                <SheetContent side="right" className="w-[98vw] overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle>Nova venda</SheetTitle>
                        <SheetDescription>Selecione um evento do organizador para abrir o fluxo com `seller=true`.</SheetDescription>
                    </SheetHeader>

                    <div className="space-y-4 px-4 pb-4">
                        {(isLoadingEventCache || isFetchingEventCache) ? (
                            <div className="flex items-center gap-2 rounded-xl border border-[#E4E6F0] bg-white p-4 text-sm text-psi-dark/70">
                                <Loader2 className="h-4 w-4 animate-spin" />Carregando eventos do organizador...
                            </div>
                        ) : events.length === 0 ? (
                            <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 text-sm text-psi-dark/70">Nenhum evento disponivel para revenda no momento.</div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    {events.map((event) => (
                                        <button
                                            key={event.id}
                                            type="button"
                                            onClick={() => setSelectedEventSlug(event.slug)}
                                            className={`rounded-2xl border p-3 text-left transition-all ${selectedEventSlug === event.slug
                                                ? "border-psi-primary bg-psi-primary/5"
                                                : "border-[#E4E6F0] bg-white hover:border-psi-primary/40"}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="h-16 w-24 overflow-hidden rounded-lg bg-psi-dark/5">
                                                    <img src={ImageUtils.getEventImageUrl(event.image)} alt={event.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1 space-y-1">
                                                    <p className="truncate text-sm font-medium text-psi-dark">{event.name}</p>
                                                    {event.location && <p className="flex items-center gap-1 text-xs text-psi-dark/60"><MapPin className="h-3 w-3" /><span className="truncate">{event.location}</span></p>}
                                                    {event.EventDates?.[0]?.date && <p className="flex items-center gap-1 text-xs text-psi-dark/60"><CalendarDays className="h-3 w-3" />{new Date(event.EventDates[0].date).toLocaleDateString("pt-BR")}</p>}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                {selectedEvent && (
                                    <div className="space-y-3 rounded-2xl border border-[#E4E6F0] bg-white p-3">
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <p className="text-sm font-medium text-psi-dark">Visualizando: {selectedEvent.name}</p>
                                            <Button asChild variant="outline" size="sm">
                                                <Link href={eventUrl} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" />Abrir em nova aba</Link>
                                            </Button>
                                        </div>
                                        <div className="overflow-hidden rounded-xl border border-[#E4E6F0]">
                                            <iframe key={eventUrl} src={eventUrl} className="h-[70vh] w-full" title={`Venda revendedor - ${selectedEvent.name}`} />
                                        </div>
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
