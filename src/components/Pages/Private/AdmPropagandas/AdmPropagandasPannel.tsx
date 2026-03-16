"use client"

import { useMemo, useState } from "react"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Toast } from "@/components/Toast/Toast"
import { useBillboardFind } from "@/hooks/Billboard/useBillboardFind"
import { useBillboardCreate } from "@/hooks/Billboard/useBillboardCreate"
import { useBillboardUpdate } from "@/hooks/Billboard/useBillboardUpdate"
import { useBillboardDelete } from "@/hooks/Billboard/useBillboardDelete"
import type { TBillboardListItem, TBillboardCreate, TBillboardUpdate } from "@/types/Billboard/TBillboard"
import { ImageUtils } from "@/utils/Helpers/ImageUtils/ImageUtils"
import { DialogConfirm } from "@/components/Dialog/DialogConfirm/DialogConfirm"
import { Megaphone, Plus, Pencil, Trash2, Copy } from "lucide-react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FRONTEND_AREA_BILLBOARD_01 } from "@/components/Billboard/Billboard"

const FRONTEND_AREAS = [FRONTEND_AREA_BILLBOARD_01] as const

const emptyForm = {
    type: "SYSTEM" as const,
    gotoLink: "",
    frontendAreaId: FRONTEND_AREA_BILLBOARD_01,
    altText: "",
    image: null as File | null
}

const AdmPropagandasPannel = () => {
    const { data, isLoading } = useBillboardFind()
    const { mutateAsync: createBillboard, isPending: isCreating } = useBillboardCreate()
    const { mutateAsync: updateBillboard, isPending: isUpdating } = useBillboardUpdate()
    const { mutateAsync: deleteBillboard, isPending: isDeleting } = useBillboardDelete()

    const [form, setForm] = useState<{
        type: "SYSTEM" | "EVENT"
        gotoLink: string
        frontendAreaId: string
        altText: string
        image: File | null
    }>(emptyForm)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [showCreate, setShowCreate] = useState(false)
    const [deleteId, setDeleteId] = useState<string | null>(null)

    const billboards = useMemo(() => {
        if (data?.data && Array.isArray(data.data)) return data.data
        return []
    }, [data])

    const handleCreate = async () => {
        if (!form.altText.trim()) {
            Toast.error("Texto alternativo é obrigatório")
            return
        }
        if (!form.image) {
            Toast.error("Selecione uma imagem")
            return
        }
        try {
            const payload: TBillboardCreate = {
                type: form.type,
                gotoLink: form.gotoLink.trim() || null,
                frontendAreaId: form.frontendAreaId,
                altText: form.altText.trim(),
                image: form.image
            }
            const res = await createBillboard(payload)
            if (res?.success) {
                Toast.success("Billboard criado com sucesso")
                setForm(emptyForm)
                setShowCreate(false)
            } else {
                Toast.error(res?.message || "Erro ao criar")
            }
        } catch {
            Toast.error("Erro ao criar billboard")
        }
    }

    const handleUpdate = async () => {
        if (!editingId || !form.altText.trim()) return
        try {
            const payload: TBillboardUpdate = {
                id: editingId,
                type: form.type,
                gotoLink: form.gotoLink.trim() || null,
                altText: form.altText.trim(),
                image: form.image ?? undefined
            }
            const res = await updateBillboard(payload)
            if (res?.success) {
                Toast.success("Billboard atualizado")
                setEditingId(null)
                setForm(emptyForm)
            } else {
                Toast.error(res?.message || "Erro ao atualizar")
            }
        } catch {
            Toast.error("Erro ao atualizar billboard")
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return
        try {
            const res = await deleteBillboard(deleteId)
            if (res?.success) {
                Toast.success("Billboard excluído")
                setDeleteId(null)
            } else {
                Toast.error(res?.message || "Erro ao excluir")
            }
        } catch {
            Toast.error("Erro ao excluir billboard")
        }
    }

    const openEdit = (b: TBillboardListItem) => {
        setEditingId(b.id)
        setForm({
            type: b.type,
            gotoLink: b.gotoLink ?? "",
            frontendAreaId: b.frontendAreaId,
            altText: b.altText,
            image: null
        })
        setShowCreate(false)
    }

    const cancelForm = () => {
        setShowCreate(false)
        setEditingId(null)
        setForm(emptyForm)
    }

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px] pb-[300px]! container">
            <section className="space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold text-psi-primary sm:text-4xl">
                            Propagandas (Billboards)
                        </h1>
                        <p className="text-psi-dark/70 max-w-3xl">
                            Gerencie os outdoors exibidos na home e em outras áreas.
                        </p>
                    </div>
                    <Button
                        type="button"
                        variant="primary"
                        onClick={() => { setShowCreate(true); setEditingId(null); setForm(emptyForm); }}
                        className="shrink-0"
                    >
                        <Plus className="h-4 w-4" />
                        Novo billboard
                    </Button>
                </div>

                {(showCreate || editingId) && (
                    <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6 shadow-lg shadow-black/5 space-y-4">
                        <h2 className="text-lg font-semibold text-psi-dark">
                            {editingId ? "Editar billboard" : "Novo billboard"}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-psi-dark">Tipo</label>
                                <Select
                                    value={form.type}
                                    onValueChange={(v: "SYSTEM" | "EVENT") => setForm((f) => ({ ...f, type: v }))}
                                >
                                    <SelectTrigger className="bg-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="SYSTEM">Sistema</SelectItem>
                                        <SelectItem value="EVENT">Evento</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-psi-dark">Área no front (frontendAreaId)</label>
                                <Select
                                    value={form.frontendAreaId}
                                    onValueChange={(v) => setForm((f) => ({ ...f, frontendAreaId: v }))}
                                    disabled={!!editingId}
                                >
                                    <SelectTrigger className="bg-white">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FRONTEND_AREAS.map((area) => (
                                            <SelectItem key={area} value={area}>{area}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">Texto alternativo (alt)</label>
                            <Input
                                value={form.altText}
                                onChange={(e) => setForm((f) => ({ ...f, altText: e.target.value }))}
                                placeholder="Descrição da imagem para acessibilidade"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">Link ao clicar (opcional)</label>
                            <Input
                                value={form.gotoLink}
                                onChange={(e) => setForm((f) => ({ ...f, gotoLink: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-psi-dark">
                                Imagem {editingId ? "(deixe vazio para manter a atual)" : "(obrigatório)"}
                            </label>
                            <Input
                                type="file"
                                accept="image/*,.gif"
                                onChange={(e) => setForm((f) => ({ ...f, image: e.target.files?.[0] ?? null }))}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="primary"
                                disabled={editingId ? isUpdating : isCreating}
                                onClick={editingId ? handleUpdate : handleCreate}
                            >
                                {editingId ? (isUpdating ? "Salvando..." : "Salvar") : (isCreating ? "Criando..." : "Criar")}
                            </Button>
                            <Button type="button" variant="outline" onClick={cancelForm}>
                                Cancelar
                            </Button>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="space-y-4">
                        {[1, 2].map((i) => (
                            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
                        ))}
                    </div>
                ) : billboards.length === 0 ? (
                    <div className="rounded-2xl border border-psi-dark/10 bg-white p-8 text-center text-psi-dark/60 flex flex-col items-center gap-3">
                        <Megaphone className="h-12 w-12 text-psi-primary/40" />
                        Nenhum billboard cadastrado. Crie um para exibir na home (área {FRONTEND_AREA_BILLBOARD_01}).
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {billboards.map((b) => (
                            <article
                                key={b.id}
                                className="rounded-2xl border border-[#E4E6F0] bg-white/90 p-4 shadow-lg shadow-black/5 space-y-3"
                            >
                                <div className="aspect-[2/1] rounded-xl overflow-hidden bg-psi-primary/5 border border-psi-primary/10">
                                    <img
                                        src={ImageUtils.getBillboardImageUrl(b.url)}
                                        alt={b.altText}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs font-mono text-psi-primary">{b.frontendAreaId}</p>
                                    <p className="text-sm text-psi-dark/80 line-clamp-2">{b.altText}</p>
                                    <p className="text-xs text-psi-dark/60">
                                        Tipo: {b.type} {b.gotoLink ? " · Com link" : ""}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => openEdit(b)}
                                    >
                                        <Pencil className="h-3 w-3" />
                                        Editar
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(b.id)
                                            Toast.success("ID copiado para a área de transferência")
                                        }}
                                    >
                                        <span className="flex items-center gap-1">
                                            <Copy className="h-3 w-3" />
                                            Copiar Id
                                        </span>
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:text-red-700"
                                        onClick={() => setDeleteId(b.id)}
                                    >
                                        <Trash2 className="h-3 w-3" />
                                        Excluir
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <DialogConfirm
                open={!!deleteId}
                onOpenChange={(open) => !open && setDeleteId(null)}
                onConfirm={handleDelete}
                title="Excluir billboard?"
                description="A imagem será removida do servidor. Esta ação não pode ser desfeita."
                confirmText="Excluir"
                variant="destructive"
                isLoading={isDeleting}
            />
        </Background>
    )
}

export {
    AdmPropagandasPannel
}
