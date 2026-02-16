"use client"

import { useMemo, useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { Toast } from "@/components/Toast/Toast"
import { ValueUtils } from "@/utils/Helpers/ValueUtils/ValueUtils"
import { Loader2, Mail, Pencil, PlusCircle, Trash2 } from "lucide-react"
import { useResaleSendInvite } from "@/hooks/Resale/useResaleSendInvite"
import { useResaleFind } from "@/hooks/Resale/useResaleFind"
import { useResaleDelete } from "@/hooks/Resale/useResaleDelete"
import { useResaleChartSalesBySeller } from "@/hooks/Resale/useResaleChartSalesBySeller"
import { useResaleSalesByEvent } from "@/hooks/Resale/useResaleSalesByEvent"
import { useSellerList } from "@/hooks/User/useSellerList"
import { useSellerUpdateCommission } from "@/hooks/User/useSellerUpdateCommission"
import { useSellerToggleActive } from "@/hooks/User/useSellerToggleActive"
import { useSellerDelete } from "@/hooks/User/useSellerDelete"
import type { TResaleFindData, TSellerInvitation, TSellerListItem } from "@/types/Resale/TResale"

const parseInvites = (payload?: TResaleFindData | TSellerInvitation[]) => {
    if (!payload) return [] as TSellerInvitation[]
    if (Array.isArray(payload)) return payload as TSellerInvitation[]
    if (Array.isArray(payload.invites)) return payload.invites
    if (Array.isArray(payload.invitations)) return payload.invitations
    return []
}

const RevendaPannel = () => {
    const [createOpen, setCreateOpen] = useState(false)
    const [commissionInfoOpen, setCommissionInfoOpen] = useState(false)
    const [newEmail, setNewEmail] = useState("")
    const [editingSellerId, setEditingSellerId] = useState<string | null>(null)
    const [editingCommission, setEditingCommission] = useState("0")
    const [sellerToToggle, setSellerToToggle] = useState<TSellerListItem | null>(null)
    const [sellerToDelete, setSellerToDelete] = useState<TSellerListItem | null>(null)
    const [inviteToDelete, setInviteToDelete] = useState<TSellerInvitation | null>(null)

    const { data: sellersRes, isLoading: sellersLoading, refetch: refetchSellers } = useSellerList()
    const { data: invitesRes, isLoading: invitesLoading } = useResaleFind()
    const { data: chartSalesRes, isLoading: chartSalesLoading } = useResaleChartSalesBySeller()
    const { data: salesByEventRes, isLoading: salesByEventLoading } = useResaleSalesByEvent()
    const sellers = sellersRes?.data ?? []
    const invites = useMemo(() => parseInvites(invitesRes?.data as TResaleFindData | TSellerInvitation[]), [invitesRes])
    const salesBySeller = chartSalesRes?.data ?? []
    const efficiencyByEvent = salesByEventRes?.data ?? []

    const chart1Data = useMemo(
        () => salesBySeller.map((s) => ({ ...s, name: s.sellerName })),
        [salesBySeller]
    )
    const chart2Data = useMemo(
        () =>
            efficiencyByEvent.map((e) => ({
                name: `${e.eventName} — ${e.resellerEmail}`,
                ticketsSold: e.ticketsSold,
                efficiencyPercent: e.efficiencyPercent ?? null
            })),
        [efficiencyByEvent]
    )

    const { mutateAsync: sendInvite, isPending: sendingInvite } = useResaleSendInvite()
    const { mutateAsync: updateCommission, isPending: updatingCommission } = useSellerUpdateCommission()
    const { mutateAsync: toggleActive, isPending: togglingActive } = useSellerToggleActive()
    const { mutateAsync: deleteSeller, isPending: deletingSeller } = useSellerDelete()
    const { mutateAsync: deleteInvite, isPending: deletingInvite } = useResaleDelete()
    const loadingMutation = sendingInvite || updatingCommission || togglingActive || deletingSeller || deletingInvite

    const onInvite = async () => {
        const email = newEmail.trim().toLowerCase()
        if (!/\S+@\S+\.\S+/.test(email)) return Toast.error("Informe um e-mail válido.")
        const res = await sendInvite({ email }).catch(() => null)
        if (!res?.success) return Toast.error(res?.message ?? "Não foi possível enviar o convite.")
        Toast.success("Convite enviado com sucesso.")
        setNewEmail("")
        setCreateOpen(false)
    }

    const onSaveCommission = async () => {
        if (!editingSellerId) return
        const value = Number(editingCommission)
        if (!Number.isInteger(value) || value < 0 || value > 100) {
            return Toast.error("Comissão inválida. Use inteiro entre 0 e 100.")
        }
        const res = await updateCommission({ sellerId: editingSellerId, sellerCommissionRate: value }).catch(() => null)
        if (!res?.success) return Toast.error(res?.message ?? "Não foi possível atualizar.")
        Toast.success("Comissão atualizada.")
        setEditingSellerId(null)
        await refetchSellers()
    }

    return (
        <Background variant="light" className="container mt-[80px] min-h-screen py-10 pb-[220px]!">
            <section className="space-y-6 px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-semibold text-psi-primary">Revenda</h1>

                <div className="flex flex-wrap gap-2">
                    <Button type="button" variant="outline" onClick={() => setCommissionInfoOpen(true)}>Como funciona o comissionamento</Button>
                    <Button type="button" variant="primary" onClick={() => setCreateOpen(true)} disabled={loadingMutation}>
                        <PlusCircle className="h-4 w-4" />Novo revendedor
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-medium text-psi-dark mb-4">Vendas por revendedor</h2>
                        <p className="text-sm text-psi-dark/60 mb-3">Ingressos vendidos e receita obtida por cada revendedor.</p>
                        {chartSalesLoading ? (
                            <div className="flex items-center justify-center gap-2 py-8 text-psi-dark/60">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm">Carregando...</span>
                            </div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={chart1Data}
                                        margin={{ top: 10, right: 30, left: 10, bottom: 60 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 11 }}
                                            angle={0}
                                            textAnchor="middle"
                                            height={70}
                                        />
                                        <YAxis yAxisId="tickets" tick={{ fontSize: 12 }} label={{ value: "Ingressos", angle: -90, position: "insideLeft" }} />
                                        <YAxis
                                            yAxisId="revenue"
                                            orientation="right"
                                            tick={{ fontSize: 11 }}
                                            tickFormatter={(v) => (v >= 100000 ? `R$ ${(v / 10000).toFixed(0)}K` : `R$ ${(v / 100).toFixed(0)}`)}
                                            label={{ value: "Receita", angle: 90, position: "insideRight" }}
                                        />
                                        <Tooltip
                                            formatter={(value: number, name: string) => {
                                                if (name === "Ingressos") return [value.toLocaleString("pt-BR"), "Ingressos"]
                                                return [ValueUtils.centsToCurrency(value), "Receita"]
                                            }}
                                            labelFormatter={(label) => String(label)}
                                            contentStyle={{ backgroundColor: "white", border: "1px solid #E4E6F0", borderRadius: "8px" }}
                                        />
                                        <Legend />
                                        <Bar yAxisId="tickets" dataKey="ticketsCount" name="Ingressos" fill="#6C4BFF" radius={[4, 4, 0, 0]} />
                                        <Bar yAxisId="revenue" dataKey="revenueCents" name="Receita" fill="#22c55e" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                                {chart1Data.length === 0 && (
                                    <p className="text-sm text-psi-dark/50 text-center py-4">Nenhuma venda por revendedor no período.</p>
                                )}
                            </>
                        )}
                    </div>

                    <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-medium text-psi-dark mb-4">Eficiência por evento</h2>
                        <p className="text-sm text-psi-dark/60 mb-3">Ingressos vendidos por revendedor em cada evento do organizador.</p>
                        {salesByEventLoading ? (
                            <div className="flex items-center justify-center gap-2 py-8 text-psi-dark/60">
                                <Loader2 className="h-5 w-5 animate-spin" />
                                <span className="text-sm">Carregando...</span>
                            </div>
                        ) : (
                            <>
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart
                                        data={chart2Data}
                                        margin={{ top: 10, right: 20, left: 10, bottom: 80 }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                        <XAxis
                                            dataKey="name"
                                            tick={{ fontSize: 10 }}
                                            angle={0}
                                            textAnchor="middle"
                                            height={80}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} label={{ value: "Ingressos", angle: -90, position: "insideLeft" }} />
                                        <Tooltip
                                            formatter={(value: number, _name: string, props: { payload?: { efficiencyPercent?: number | null } }) => {
                                                const pct = props?.payload?.efficiencyPercent
                                                const suffix = pct != null ? ` (${pct.toFixed(1)}%)` : ""
                                                return [`${value.toLocaleString("pt-BR")} ingressos${suffix}`, "Vendidos"]
                                            }}
                                            contentStyle={{ backgroundColor: "white", border: "1px solid #E4E6F0", borderRadius: "8px" }}
                                        />
                                        <Bar dataKey="ticketsSold" name="Ingressos vendidos" fill="#FF6F91" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                                {chart2Data.length === 0 && (
                                    <p className="text-sm text-psi-dark/50 text-center py-4">Nenhuma venda por evento no período.</p>
                                )}
                            </>
                        )}
                    </div>
                </div>

                <div className="space-y-3 rounded-2xl border p-4 bg-white">
                    <h2 className="font-medium text-psi-dark">Convites enviados</h2>
                    {invitesLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : invites.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum convite.</p> : invites.map((invite) => (
                        <div key={invite.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3">
                            <div className="flex items-center gap-2 min-w-0">
                                <Mail className="h-4 w-4 text-psi-primary" />
                                <span className="truncate text-sm">{invite.email}</span>
                                <Badge variant="secondary" className={invite.isUsed ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>{invite.isUsed ? "ACEITO" : "PENDENTE"}</Badge>
                            </div>
                            {!invite.isUsed && <Button type="button" size="sm" variant="outline" onClick={() => setInviteToDelete(invite)} disabled={loadingMutation}>Cancelar</Button>}
                        </div>
                    ))}
                </div>

                <div className="space-y-3 rounded-2xl border p-4 bg-white">
                    <h2 className="font-medium text-psi-dark">Revendedores</h2>
                    {sellersLoading ? <p className="text-sm text-muted-foreground">Carregando...</p> : sellers.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum revendedor.</p> : sellers.map((seller) => (
                        <div key={seller.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <p className="truncate text-sm font-medium">{seller.email}</p>
                                <Badge variant="secondary" className="mt-1">Comissão: {seller.sellerCommissionRate}%</Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Switch checked={seller.sellerActive} onCheckedChange={() => setSellerToToggle(seller)} />
                                {editingSellerId === seller.id ? (
                                    <>
                                        <div className="flex flex-col items-start gap-1">
                                            <label className="text-sm font-medium text-psi-dark">Comissão: </label>
                                            <Input type="number" min="0" max="100" step="1" value={editingCommission} onChange={(e) => setEditingCommission(e.target.value)} className="w-[100px]" />
                                        </div>
                                        <Button variant="primary" type="button" size="sm" onClick={onSaveCommission} disabled={loadingMutation}>Salvar</Button>
                                        <Button type="button" size="sm" variant="outline" onClick={() => setEditingSellerId(null)}>Cancelar</Button>
                                    </>
                                ) : (
                                    <Button type="button" size="sm" variant="outline" onClick={() => { setEditingSellerId(seller.id); setEditingCommission(String(seller.sellerCommissionRate ?? 0)) }}><Pencil className="h-4 w-4" />Editar</Button>
                                )}
                                <Button type="button" size="sm" variant="destructive" onClick={() => setSellerToDelete(seller)}><Trash2 className="h-4 w-4" />Excluir</Button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Novo convite</DialogTitle><DialogDescription>Informe o e-mail do revendedor.</DialogDescription></DialogHeader>
                    <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} type="email" placeholder="revendedor@email.com" />
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
                        <Button type="button" variant="primary" onClick={onInvite} disabled={sendingInvite}>{sendingInvite && <Loader2 className="h-4 w-4 animate-spin" />}Enviar convite</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={commissionInfoOpen} onOpenChange={setCommissionInfoOpen}>
                <DialogContent>
                    <DialogHeader><DialogTitle>Como funciona o comissionamento</DialogTitle></DialogHeader>
                    <div className="text-sm text-psi-dark/80 space-y-2">
                        <p>
                            Exemplo: Se uma venda gera <span className="font-semibold text-psi-primary">R$ 50,00</span> de lucro e a comissão do revendedor for <span className="font-semibold text-psi-secondary">10%</span>, ele recebe <span className="font-semibold text-psi-primary">R$ 5,00</span> e o organizador fica com <span className="font-semibold text-psi-primary">R$ 45,00</span>.
                        </p>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>O revendedor pode sacar os ganhos diretamente pela própria carteira.</li>
                            <li>Após aceitar o convite, a comissão começa em <span className="font-semibold text-psi-primary">0%</span> e só aceita valores inteiros de 0 a 100.</li>
                        </ul>
                    </div>
                </DialogContent>
            </Dialog>

            <DialogConfirm
                open={!!sellerToToggle}
                onOpenChange={(open) => !open && setSellerToToggle(null)}
                onConfirm={async () => {
                    if (!sellerToToggle) return
                    const res = await toggleActive({ sellerId: sellerToToggle.id, sellerActive: !sellerToToggle.sellerActive }).catch(() => null)
                    if (!res?.success) return Toast.error(res?.message ?? "Não foi possível alterar o status.")
                    Toast.success("Status atualizado.")
                    setSellerToToggle(null)
                    await refetchSellers()
                }}
                title={sellerToToggle?.sellerActive ? "Inativar revendedor" : "Ativar revendedor"}
                description={`Deseja realmente ${sellerToToggle?.sellerActive ? "inativar" : "ativar"} este revendedor?`}
                confirmText="Confirmar"
                cancelText="Cancelar"
                isLoading={togglingActive}
                variant="default"
            />

            <DialogConfirm
                open={!!sellerToDelete}
                onOpenChange={(open) => !open && setSellerToDelete(null)}
                onConfirm={async () => {
                    if (!sellerToDelete) return
                    const res = await deleteSeller({ sellerId: sellerToDelete.id }).catch(() => null)
                    if (!res?.success) return Toast.error(res?.message ?? "Não foi possível excluir.")
                    Toast.success("Revendedor excluído.")
                    setSellerToDelete(null)
                    await refetchSellers()
                }}
                title="Excluir revendedor"
                description="Esta ação faz o soft delete do revendedor."
                confirmText="Excluir"
                cancelText="Cancelar"
                isLoading={deletingSeller}
                variant="destructive"
            />

            <DialogConfirm
                open={!!inviteToDelete}
                onOpenChange={(open) => !open && setInviteToDelete(null)}
                onConfirm={async () => {
                    if (!inviteToDelete) return
                    const res = await deleteInvite(inviteToDelete.id).catch(() => null)
                    if (!res?.success) return Toast.error(res?.message ?? "Não foi possível cancelar o convite.")
                    Toast.success("Convite cancelado.")
                    setInviteToDelete(null)
                }}
                title="Cancelar convite"
                description="O link deixará de ser válido."
                confirmText="Cancelar convite"
                cancelText="Voltar"
                isLoading={deletingInvite}
                variant="destructive"
            />
        </Background>
    )
}

export { RevendaPannel }
