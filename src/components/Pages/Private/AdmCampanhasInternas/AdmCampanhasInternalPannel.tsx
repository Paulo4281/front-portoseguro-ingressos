"use client"

import { useEffect, useMemo, useState } from "react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Toast } from "@/components/Toast/Toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { QRCodeCanvas } from "qrcode.react"
import { Copy, Download, Edit3, Link as LinkIcon, QrCode, TrendingUp, Globe, MonitorSmartphone, Trash2 } from "lucide-react"
import { BarChart, Bar, LineChart, Line, ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { useInternalCampaignFind } from "@/hooks/InternalCampaign/useInternalCampaignFind"
import { useInternalCampaignCreate } from "@/hooks/InternalCampaign/useInternalCampaignCreate"
import { useInternalCampaignDelete } from "@/hooks/InternalCampaign/useInternalCampaignDelete"
import { useInternalCampaignUpdate } from "@/hooks/InternalCampaign/useInternalCampaignUpdate"
import { InternalCampaignService } from "@/services/InternalCampaign/InternalCampaignService"
import type {
    TInternalCampaignListItem,
    TInternalCampaignCreate,
    TInternalCampaignUpdate,
    TInternalCampaignStatsResponse
} from "@/types/InternalCampaign/TInternalCampaign"

type TFormState = {
    name: string
    utmCampaign: string
    utmSource: string
    utmContent: string
    utmTerm: string
}

const defaultFormState: TFormState = {
    name: "",
    utmCampaign: "",
    utmSource: "",
    utmContent: "",
    utmTerm: ""
}

type TEditFormState = {
    id: string
    name: string
    utmCampaign: string
    utmSource: string
    utmContent: string
    utmTerm: string
}

const AdmCampanhasInternalPannel = () => {
    const { data, isLoading } = useInternalCampaignFind({ offset: 0 })
    const { mutateAsync: createCampaign, isPending: isCreating } = useInternalCampaignCreate()
    const { mutateAsync: deleteCampaign, isPending: isDeleting } = useInternalCampaignDelete()
    const { mutateAsync: updateCampaign, isPending: isUpdating } = useInternalCampaignUpdate()
    const [form, setForm] = useState<TFormState>(defaultFormState)
    const [generatedLink, setGeneratedLink] = useState<string>("")
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [campaignToDelete, setCampaignToDelete] = useState<TInternalCampaignListItem | null>(null)
    const [editDialogOpen, setEditDialogOpen] = useState(false)
    const [editForm, setEditForm] = useState<TEditFormState | null>(null)
    const [qrDialogOpen, setQrDialogOpen] = useState(false)
    const [qrValue, setQrValue] = useState("")
    const [qrCampaignName, setQrCampaignName] = useState("")
    const [campaignStatsMap, setCampaignStatsMap] = useState<Record<string, TInternalCampaignStatsResponse>>({})
    const [isLoadingStats, setIsLoadingStats] = useState(false)

    const campaigns = useMemo<Array<TInternalCampaignListItem & { link: string }>>(() => {
        if (data?.data?.data && Array.isArray(data.data.data)) {
            return data.data.data
        }
        return []
    }, [data])

    useEffect(() => {
        const loadStats = async () => {
            if (campaigns.length === 0) {
                setCampaignStatsMap({})
                return
            }

            setIsLoadingStats(true)
            try {
                const responses = await Promise.all(
                    campaigns.map(async (campaign) => {
                        const response = await InternalCampaignService.getStats(campaign.id)
                        return {
                            campaignId: campaign.id,
                            response
                        }
                    })
                )

                const nextStatsMap: Record<string, TInternalCampaignStatsResponse> = {}
                responses.forEach(({ campaignId, response }) => {
                    if (response.success && response.data) {
                        nextStatsMap[campaignId] = response.data
                    }
                })

                setCampaignStatsMap(nextStatsMap)
            } finally {
                setIsLoadingStats(false)
            }
        }

        loadStats()
    }, [campaigns])

    const totalAccesses = useMemo(
        () => campaigns.reduce((acc, item) => acc + item.accessesTotal, 0),
        [campaigns]
    )

    const averageAccessesByCampaign = campaigns.length > 0
        ? Math.round(totalAccesses / campaigns.length)
        : 0

    const bestCampaign = useMemo(() => {
        return campaigns
            .slice()
            .sort((a, b) => b.accessesTotal - a.accessesTotal)[0] || null
    }, [campaigns])

    const efficiencyByCampaignData = useMemo(() => {
        return campaigns
            .map((item) => ({
                name: item.name,
                accesses: item.accessesTotal,
                sales: item.salesTotal,
                efficiency: item.efficiencyPercent
            }))
            .sort((a, b) => b.accesses - a.accesses)
            .slice(0, 8)
    }, [campaigns])

    const locationData = useMemo(() => {
        const map = new Map<string, { accesses: number }>()

        campaigns.forEach((campaign) => {
            const stats = campaignStatsMap[campaign.id]
            ;(stats?.locationStats || []).forEach((item) => {
                const current = map.get(item.location) || { accesses: 0 }
                map.set(item.location, {
                    accesses: current.accesses + item.accesses
                })
            })
        })

        return Array.from(map.entries())
            .map(([location, values]) => ({
                location,
                accesses: values.accesses
            }))
            .sort((a, b) => b.accesses - a.accesses)
            .slice(0, 6)
    }, [campaigns, campaignStatsMap])

    const deviceByCampaignData = useMemo(() => {
        return campaigns
            .slice()
            .sort((a, b) => b.accessesTotal - a.accessesTotal)
            .slice(0, 8)
            .map((campaign) => {
                const stats = campaignStatsMap[campaign.id]
                const desktop = (stats?.deviceStats || []).find((item) => item.device.toLowerCase() === "desktop")?.accesses || 0
                const mobile = (stats?.deviceStats || []).find((item) => item.device.toLowerCase() === "mobile")?.accesses || 0
                const tablet = (stats?.deviceStats || []).find((item) => item.device.toLowerCase() === "tablet")?.accesses || 0

                return {
                    name: campaign.name,
                    desktop,
                    mobile,
                    tablet
                }
            })
    }, [campaigns, campaignStatsMap])

    const dailyTrendData = useMemo(() => {
        const map = new Map<string, { accesses: number }>()

        campaigns.forEach((campaign) => {
            const stats = campaignStatsMap[campaign.id]
            ;(stats?.dailyStats || []).forEach((item) => {
                const current = map.get(item.date) || { accesses: 0 }
                map.set(item.date, {
                    accesses: current.accesses + item.accesses
                })
            })
        })

        return Array.from(map.entries())
            .map(([date, values]) => ({
                date,
                accesses: values.accesses
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }, [campaigns, campaignStatsMap])

    const handleFormFieldChange = (field: keyof TFormState, value: string) => {
        if (field === "name") {
            const utmCampaign = InternalCampaignService.toUtmCampaign(value)
            setForm((prev) => ({
                ...prev,
                name: value,
                utmCampaign
            }))
            return
        }

        setForm((prev) => ({
            ...prev,
            [field]: value
        }))
    }

    const handleCreateCampaign = async () => {
        if (!form.name.trim()) {
            Toast.error("Nome da campanha é obrigatório")
            return
        }

        const normalizedUtmCampaign = InternalCampaignService.toUtmCampaign(
            form.utmCampaign || form.name
        )

        if (!normalizedUtmCampaign) {
            Toast.error("utmCampaign inválido")
            return
        }

        const payload: TInternalCampaignCreate = {
            name: form.name.trim(),
            utmCampaign: normalizedUtmCampaign,
            utmSource: form.utmSource.trim() || null,
            utmContent: form.utmContent.trim() || null,
            utmTerm: form.utmTerm.trim() || null
        }

        try {
            const response = await createCampaign(payload)
            if (response.success && response.data) {
                setGeneratedLink(response.data.link)
                Toast.success("Campanha interna criada com sucesso")
                setForm(defaultFormState)
            } else {
                Toast.error(response.message || "Não foi possível criar a campanha")
            }
        } catch {
            Toast.error("Não foi possível criar a campanha")
        }
    }

    const openDeleteDialog = (campaign: TInternalCampaignListItem) => {
        setCampaignToDelete(campaign)
        setDeleteDialogOpen(true)
    }

    const openEditDialog = (campaign: TInternalCampaignListItem) => {
        setEditForm({
            id: campaign.id,
            name: campaign.name,
            utmCampaign: campaign.utmCampaign,
            utmSource: campaign.utmSource || "",
            utmContent: campaign.utmContent || "",
            utmTerm: campaign.utmTerm || ""
        })
        setEditDialogOpen(true)
    }

    const handleEditFieldChange = (field: keyof TEditFormState, value: string) => {
        setEditForm((prev) => {
            if (!prev) return prev

            if (field === "name") {
                return {
                    ...prev,
                    name: value,
                    utmCampaign: InternalCampaignService.toUtmCampaign(value)
                }
            }

            return {
                ...prev,
                [field]: value
            }
        })
    }

    const handleUpdateCampaign = async () => {
        if (!editForm) return
        if (!editForm.name.trim()) {
            Toast.error("Nome da campanha é obrigatório")
            return
        }

        const payload: TInternalCampaignUpdate = {
            id: editForm.id,
            name: editForm.name.trim(),
            utmCampaign: InternalCampaignService.toUtmCampaign(editForm.utmCampaign || editForm.name),
            utmSource: editForm.utmSource.trim() || null,
            utmContent: editForm.utmContent.trim() || null,
            utmTerm: editForm.utmTerm.trim() || null
        }

        try {
            const response = await updateCampaign(payload)
            if (response.success) {
                Toast.success("Campanha atualizada com sucesso")
                setEditDialogOpen(false)
                setEditForm(null)
            } else {
                Toast.error(response.message || "Não foi possível atualizar a campanha")
            }
        } catch {
            Toast.error("Não foi possível atualizar a campanha")
        }
    }

    const handleConfirmDelete = async () => {
        if (!campaignToDelete) return

        try {
            const response = await deleteCampaign(campaignToDelete.id)
            if (response.success) {
                Toast.success("Campanha excluída com sucesso")
                setDeleteDialogOpen(false)
                setCampaignToDelete(null)
            } else {
                Toast.error(response.message || "Não foi possível excluir a campanha")
            }
        } catch {
            Toast.error("Não foi possível excluir a campanha")
        }
    }

    const copyToClipboard = async (value: string) => {
        try {
            await navigator.clipboard.writeText(value)
            Toast.success("Link copiado")
        } catch {
            Toast.error("Não foi possível copiar o link")
        }
    }

    const openQrDialog = (link: string, campaignName: string) => {
        setQrValue(link)
        setQrCampaignName(campaignName)
        setQrDialogOpen(true)
    }

    const handleDownloadQrCode = () => {
        const canvas = document.getElementById("internal-campaign-qr-canvas") as HTMLCanvasElement | null
        if (!canvas) {
            Toast.error("Não foi possível gerar o QR Code para download")
            return
        }

        const url = canvas.toDataURL("image/png")
        const anchor = document.createElement("a")
        anchor.href = url
        anchor.download = `qrcode-${(qrCampaignName || "campanha").toLowerCase().replace(/[^a-z0-9]+/g, "-")}.png`
        anchor.click()
    }

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px] pb-[220px]! container">
            <section className="space-y-8 px-4 sm:px-6 lg:px-8">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-semibold text-psi-primary">Campanhas Internas</h1>
                    <p className="text-psi-dark/70 mt-2 max-w-3xl">
                        Crie campanhas com parâmetros UTM para impulsionar a própria plataforma e acompanhe a eficiência por campanha com métricas reais de acessos, localização e device.
                    </p>
                </div>

                <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm space-y-5">
                    <h2 className="text-xl font-medium text-psi-dark">Nova campanha interna</h2>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">Nome da campanha *</label>
                            <Input
                                value={form.name}
                                onChange={(event) => handleFormFieldChange("name", event.target.value)}
                                placeholder="Ex: Black Friday Ingressos"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">utmCampaign (snake_case) *</label>
                            <Input
                                value={form.utmCampaign}
                                placeholder="black_friday_ingressos"
                                readOnly
                            />
                            <p className="text-xs text-psi-dark/55">Gerado automaticamente a partir do nome.</p>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">utmSource (opcional)</label>
                            <Input
                                value={form.utmSource}
                                onChange={(event) => handleFormFieldChange("utmSource", event.target.value)}
                                placeholder="instagram"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">utmContent (opcional)</label>
                            <Input
                                value={form.utmContent}
                                onChange={(event) => handleFormFieldChange("utmContent", event.target.value)}
                                placeholder="stories"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">utmTerm (opcional)</label>
                            <Input
                                value={form.utmTerm}
                                onChange={(event) => handleFormFieldChange("utmTerm", event.target.value)}
                                placeholder="evento_verao"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button type="button" variant="primary" onClick={handleCreateCampaign} disabled={isCreating}>
                            {isCreating ? "Criando..." : "Criar campanha"}
                        </Button>
                    </div>

                    {generatedLink && (
                        <div className="rounded-xl border border-psi-primary/20 bg-psi-primary/5 p-4">
                            <p className="text-sm font-medium text-psi-dark mb-2 flex items-center gap-2">
                                <LinkIcon className="h-4 w-4 text-psi-primary" />
                                Link gerado
                            </p>
                            <div className="flex items-center gap-2">
                                <Input value={generatedLink} readOnly />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => copyToClipboard(generatedLink)}
                                    aria-label="Copiar link gerado"
                                >
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => openQrDialog(generatedLink, "link-gerado")}
                                    className="min-w-[130px]"
                                >
                                    <QrCode className="h-4 w-4" />
                                    QR Code
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {isLoading || isLoadingStats ? (
                    <div className="space-y-4">
                        <Skeleton className="h-32 w-full rounded-2xl" />
                        <Skeleton className="h-80 w-full rounded-2xl" />
                    </div>
                ) : (
                    <>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <MetricCard
                                title="Campanhas"
                                value={campaigns.length.toString()}
                                subtitle="Total criado"
                                icon={<TrendingUp className="h-5 w-5 text-psi-primary" />}
                            />
                            <MetricCard
                                title="Acessos"
                                value={totalAccesses.toLocaleString("pt-BR")}
                                subtitle="Total agregado"
                                icon={<Globe className="h-5 w-5 text-psi-primary" />}
                            />
                            <MetricCard
                                title="Média por campanha"
                                value={averageAccessesByCampaign.toLocaleString("pt-BR")}
                                subtitle="Acessos médios"
                                icon={<MonitorSmartphone className="h-5 w-5 text-psi-primary" />}
                            />
                            <MetricCard
                                title="Campanha líder"
                                value={bestCampaign ? bestCampaign.accessesTotal.toLocaleString("pt-BR") : "0"}
                                subtitle="Maior volume de acessos"
                                icon={<TrendingUp className="h-5 w-5 text-psi-primary" />}
                            />
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-medium text-psi-dark mb-4">Eficiência por campanha</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <ComposedChart data={efficiencyByCampaignData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis yAxisId="accesses" tick={{ fontSize: 12 }} />
                                        <YAxis yAxisId="efficiency" orientation="right" tick={{ fontSize: 12 }} unit="%" />
                                        <Tooltip
                                            formatter={(value: number, name: string) => {
                                                if (name === "Eficiência") return [`${value.toFixed(1)}%`, name]
                                                return [value.toLocaleString("pt-BR"), name]
                                            }}
                                        />
                                        <Legend />
                                        <Bar yAxisId="accesses" dataKey="accesses" name="Acessos" fill="#6C4BFF" radius={[8, 8, 0, 0]} />
                                        <Bar yAxisId="accesses" dataKey="sales" name="Vendas" fill="#4ECDC4" radius={[8, 8, 0, 0]} />
                                        <Line yAxisId="efficiency" type="monotone" dataKey="efficiency" name="Eficiência" stroke="#FF6F91" strokeWidth={2} dot={{ r: 3 }} />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-medium text-psi-dark mb-4">Dispositivos por campanha</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={deviceByCampaignData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                        <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="desktop" stackId="device" name="Desktop" fill="#6C4BFF" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="mobile" stackId="device" name="Mobile" fill="#FF6F91" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="tablet" stackId="device" name="Tablet" fill="#4ECDC4" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-medium text-psi-dark mb-4">Localização dos acessos</h3>
                                <ResponsiveContainer width="100%" height={320}>
                                    <BarChart data={locationData} layout="vertical">
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                        <XAxis type="number" tick={{ fontSize: 12 }} />
                                        <YAxis dataKey="location" type="category" width={120} tick={{ fontSize: 11 }} />
                                        <Tooltip />
                                        <Bar dataKey="accesses" name="Acessos" fill="#6C4BFF" radius={[0, 8, 8, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-medium text-psi-dark mb-4">Evolução diária</h3>
                                <ResponsiveContainer width="100%" height={320}>
                                    <LineChart data={dailyTrendData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="#E4E6F0" />
                                        <XAxis
                                            dataKey="date"
                                            tick={{ fontSize: 12 }}
                                            tickFormatter={(value) => new Date(value).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                                        />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip
                                            labelFormatter={(value) => new Date(value).toLocaleDateString("pt-BR")}
                                        />
                                        <Line type="monotone" dataKey="accesses" name="Acessos" stroke="#6C4BFF" strokeWidth={2} dot={{ r: 3 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-sm">
                            <h3 className="text-lg font-medium text-psi-dark mb-4">Campanhas criadas</h3>
                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[920px]">
                                    <thead>
                                        <tr className="border-b border-[#E4E6F0] text-left text-xs uppercase tracking-wide text-psi-dark/60">
                                            <th className="py-3 pr-4">Campanha</th>
                                            <th className="py-3 pr-4">utm_campaign</th>
                                            <th className="py-3 pr-4">utm_id</th>
                                            <th className="py-3 pr-4">Acessos</th>
                                            <th className="py-3 pr-4">Link</th>
                                            <th className="py-3 pr-4">Ações</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {campaigns.map((campaign) => (
                                            <tr key={campaign.id} className="border-b border-[#F1F2F7]">
                                                <td className="py-3 pr-4 text-sm text-psi-dark">{campaign.name}</td>
                                                <td className="py-3 pr-4 text-sm text-psi-dark/80">{campaign.utmCampaign}</td>
                                                <td className="py-3 pr-4 text-sm text-psi-dark/80">{campaign.utmId}</td>
                                                <td className="py-3 pr-4 text-sm text-psi-dark/80">{campaign.accessesTotal.toLocaleString("pt-BR")}</td>
                                                <td className="py-3 pr-4 text-sm">
                                                    <button
                                                        type="button"
                                                        onClick={() => copyToClipboard(campaign.link)}
                                                        className="inline-flex items-center gap-1 text-psi-primary hover:underline"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                        Copiar link
                                                    </button>
                                                </td>
                                                <td className="py-3 pr-4 text-sm">
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={() => openEditDialog(campaign)}
                                                            className="inline-flex items-center gap-1 text-psi-secondary hover:underline"
                                                        >
                                                            <Edit3 className="h-4 w-4" />
                                                            Editar
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openQrDialog(campaign.link, campaign.name)}
                                                            className="inline-flex items-center gap-1 text-psi-primary hover:underline"
                                                        >
                                                            <QrCode className="h-4 w-4" />
                                                            QR Code
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={() => openDeleteDialog(campaign)}
                                                            className="inline-flex items-center gap-1 text-destructive hover:underline"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Excluir
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </section>

            <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogContent className="sm:max-w-[680px]">
                    <DialogHeader>
                        <DialogTitle>Editar campanha interna</DialogTitle>
                    </DialogHeader>

                    {editForm && (
                        <div className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-psi-dark">Nome da campanha *</label>
                                    <Input
                                        value={editForm.name}
                                        onChange={(event) => handleEditFieldChange("name", event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-psi-dark">utmCampaign (snake_case) *</label>
                                    <Input
                                        value={editForm.utmCampaign}
                                        onChange={(event) => handleEditFieldChange("utmCampaign", event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-psi-dark">utmSource</label>
                                    <Input
                                        value={editForm.utmSource}
                                        onChange={(event) => handleEditFieldChange("utmSource", event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-psi-dark">utmContent</label>
                                    <Input
                                        value={editForm.utmContent}
                                        onChange={(event) => handleEditFieldChange("utmContent", event.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-psi-dark">utmTerm</label>
                                    <Input
                                        value={editForm.utmTerm}
                                        onChange={(event) => handleEditFieldChange("utmTerm", event.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center justify-end gap-2">
                                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button type="button" variant="primary" onClick={handleUpdateCampaign} disabled={isUpdating}>
                                    {isUpdating ? "Salvando..." : "Salvar alterações"}
                                </Button>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>

            <DialogConfirm
                open={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleConfirmDelete}
                title="Excluir campanha interna"
                description={`Deseja excluir a campanha "${campaignToDelete?.name || ""}"? Esta ação não poderá ser desfeita.`}
                confirmText="Excluir campanha"
                cancelText="Cancelar"
                isLoading={isDeleting}
                variant="destructive"
            />

            <Dialog open={qrDialogOpen} onOpenChange={setQrDialogOpen}>
                <DialogContent className="sm:max-w-[420px]">
                    <DialogHeader>
                        <DialogTitle>QR Code da campanha</DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="rounded-xl border border-[#E4E6F0] bg-white p-4 flex items-center justify-center">
                            {qrValue && (
                                <QRCodeCanvas
                                    id="internal-campaign-qr-canvas"
                                    value={qrValue}
                                    size={260}
                                    includeMargin
                                />
                            )}
                        </div>

                        <Input value={qrValue} readOnly />

                        <div className="flex items-center justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => copyToClipboard(qrValue)}>
                                <Copy className="h-4 w-4" />
                                Copiar link
                            </Button>
                            <Button type="button" variant="primary" onClick={handleDownloadQrCode}>
                                <Download className="h-4 w-4" />
                                Baixar QR Code
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </Background>
    )
}

type TMetricCardProps = {
    title: string
    value: string
    subtitle: string
    icon: React.ReactNode
}

const MetricCard = ({ title, value, subtitle, icon }: TMetricCardProps) => {
    return (
        <div className="rounded-2xl border border-[#E4E6F0] bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-psi-dark/45">{subtitle}</p>
                    <p className="text-sm text-psi-dark/70 mt-1">{title}</p>
                    <p className="text-3xl font-semibold text-psi-dark mt-1">{value}</p>
                </div>
                <div className="h-11 w-11 rounded-xl bg-psi-primary/10 text-psi-primary flex items-center justify-center">
                    {icon}
                </div>
            </div>
        </div>
    )
}

export {
    AdmCampanhasInternalPannel
}