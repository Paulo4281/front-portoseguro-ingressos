"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Background } from "@/components/Background/Background"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Toast } from "@/components/Toast/Toast"
import { usePartnerFind } from "@/hooks/Partner/usePartnerFind"
import { usePartnerUpdate } from "@/hooks/Partner/usePartnerUpdate"
import type { TPartner, TPartnerUpdate } from "@/types/Partner/TPartner"
import { queryClient } from "@/providers/QueryClientProvider/QueryClientProvider"

type TEditablePartner = TPartner & {
    description: string
    logo: string
    link: string
}

const AdmParceirosPannel = () => {
    const { data, isLoading } = usePartnerFind()
    const { mutateAsync: updatePartner } = usePartnerUpdate()
    const [partners, setPartners] = useState<TEditablePartner[]>([])
    const [dirtyPartners, setDirtyPartners] = useState<Record<string, boolean>>({})
    const [savingPartners, setSavingPartners] = useState<Record<string, boolean>>({})

    const partnersFromApi = useMemo(() => {
        if (data?.data && Array.isArray(data.data)) {
            return data.data
        }

        return []
    }, [data])

    useEffect(() => {
        setPartners(
            partnersFromApi.map((partner) => ({
                ...partner,
                description: partner.description || "",
                logo: partner.logo || "",
                link: partner.link || ""
            }))
        )
    }, [partnersFromApi])

    const markDirty = (partnerId: string) => {
        setDirtyPartners((prev) => ({
            ...prev,
            [partnerId]: true
        }))
    }

    const handleFieldChange = <K extends keyof TEditablePartner>(partnerId: string, field: K, value: TEditablePartner[K]) => {
        setPartners((prev) =>
            prev.map((partner) =>
                partner.id === partnerId ? { ...partner, [field]: value } : partner
            )
        )
        markDirty(partnerId)
    }

    const handleSavePartner = async (partnerId: string) => {
        const partner = partners.find((item) => item.id === partnerId)

        if (!partner) return
        if (!partner.name.trim()) {
            Toast.error("Nome do parceiro é obrigatório")
            return
        }

        setSavingPartners((prev) => ({
            ...prev,
            [partnerId]: true
        }))

        const payload: TPartnerUpdate = {
            id: partner.id,
            name: partner.name.trim(),
            description: partner.description.trim() || null,
            logo: partner.logo.trim() || null,
            link: partner.link.trim() || null
        }

        try {
            const response = await updatePartner(payload)

            if (response.success) {
                Toast.success("Parceiro atualizado com sucesso")
                setDirtyPartners((prev) => ({
                    ...prev,
                    [partnerId]: false
                }))
                queryClient.invalidateQueries({ queryKey: ["partners"] })
            } else {
                Toast.error(response.message || "Não foi possível atualizar o parceiro")
            }
        } catch (error) {
            Toast.error("Não foi possível atualizar o parceiro")
        } finally {
            setSavingPartners((prev) => ({
                ...prev,
                [partnerId]: false
            }))
        }
    }

    return (
        <Background variant="light" className="min-h-screen py-10 mt-[80px] pb-[300px]! container">
            <section className="space-y-8 px-4 sm:px-6 lg:px-8">
                <div className="space-y-3">
                    <h1 className="text-3xl font-semibold text-psi-primary sm:text-4xl">
                        Administração de parceiros
                    </h1>
                    <p className="text-psi-dark/70 max-w-3xl">
                        Atualize os parceiros cadastrados, ajustando nome, descrição, logo e link exibidos na página pública.
                    </p>
                </div>

                {isLoading ? (
                    <div className="space-y-4">
                        {Array.from({ length: 3 }).map((_, index) => (
                            <Skeleton key={index} className="h-64 w-full rounded-2xl" />
                        ))}
                    </div>
                ) : partners.length === 0 ? (
                    <div className="rounded-2xl border border-psi-dark/10 bg-white p-8 text-center text-psi-dark/60">
                        Nenhum parceiro cadastrado.
                    </div>
                ) : (
                    <div className="space-y-5">
                        {partners.map((partner) => {
                            const isDirty = dirtyPartners[partner.id]
                            const isSaving = savingPartners[partner.id]

                            return (
                                <article
                                    key={partner.id}
                                    className="rounded-2xl border border-[#E4E6F0] bg-white/90 p-6 md:p-8 shadow-lg shadow-black/5 space-y-5"
                                >
                                    <div className="flex items-center justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-4">
                                            <div className="relative h-20 w-20 shrink-0 flex items-center justify-center rounded-xl border border-psi-dark/10 bg-white overflow-hidden">
                                                {partner.logo ? (
                                                    <Image
                                                        src={partner.logo}
                                                        alt={`Logo ${partner.name}`}
                                                        width={80}
                                                        height={80}
                                                        className="object-contain object-center"
                                                        unoptimized
                                                        onError={(e) => {
                                                            const wrapper = e.currentTarget.closest(".relative")
                                                            const fallback = wrapper?.querySelector("[data-logo-fallback]") as HTMLElement
                                                            if (wrapper && fallback) {
                                                                e.currentTarget.style.setProperty("display", "none")
                                                                fallback.classList.remove("hidden")
                                                                fallback.classList.add("flex")
                                                            }
                                                        }}
                                                    />
                                                ) : null}
                                                <span
                                                    data-logo-fallback
                                                    className={`absolute inset-0 flex items-center justify-center text-xs font-medium text-psi-dark/60 px-1 text-center ${partner.logo ? "hidden" : "flex"}`}
                                                >
                                                    Sem logo
                                                </span>
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-medium text-psi-dark">
                                                    {partner.name}
                                                </h2>
                                                <p className="text-sm text-psi-dark/60">
                                                    Cliques: {partner.clickCount || 0}
                                                </p>
                                            </div>
                                        </div>
                                        {isDirty && (
                                            <span className="text-xs font-medium rounded-full bg-amber-100 text-amber-700 px-3 py-1">
                                                Alterações pendentes
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-psi-dark">Nome</label>
                                            <Input
                                                value={partner.name}
                                                onChange={(event) => handleFieldChange(partner.id, "name", event.target.value)}
                                                placeholder="Nome do parceiro"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-psi-dark">Link</label>
                                            <Input
                                                value={partner.link}
                                                onChange={(event) => handleFieldChange(partner.id, "link", event.target.value)}
                                                placeholder="https://site-do-parceiro.com.br"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-psi-dark">URL da logo</label>
                                        <Input
                                            value={partner.logo}
                                            onChange={(event) => handleFieldChange(partner.id, "logo", event.target.value)}
                                            placeholder="https://cdn.site/logo.png"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-psi-dark">Descrição</label>
                                        <Textarea
                                            value={partner.description}
                                            onChange={(event) => handleFieldChange(partner.id, "description", event.target.value)}
                                            placeholder="Descrição exibida na página pública"
                                            rows={4}
                                        />
                                    </div>

                                    <div className="flex justify-end">
                                        <Button
                                            type="button"
                                            variant="primary"
                                            disabled={!isDirty || isSaving}
                                            onClick={() => handleSavePartner(partner.id)}
                                        >
                                            {isSaving ? "Salvando..." : "Salvar alterações"}
                                        </Button>
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}
            </section>
        </Background>
    )
}

export {
    AdmParceirosPannel
}