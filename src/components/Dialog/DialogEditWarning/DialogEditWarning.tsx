"use client"

import { AlertTriangle, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TChangeItem = {
    field: string
    severity: "low" | "medium" | "high" | "critical"
}

type TDialogEditWarningProps = {
    changes: TChangeItem[]
    riskScore: number
    isOpen: boolean
    onClose: () => void
}

const DialogEditWarning = ({ changes, riskScore, isOpen, onClose }: TDialogEditWarningProps) => {
    if (!isOpen || changes.length === 0) return null

    const getRiskLevel = () => {
        if (riskScore >= 80) return { label: "Extremamente Prejudicial!", color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive" }
        if (riskScore >= 50) return { label: "Altamente Prejudicial", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-300" }
        if (riskScore >= 20) return { label: "Moderadamente Prejudicial", color: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-300" }
        return { label: "Pouco Prejudicial", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-300" }
    }

    const getSeverityLabel = (severity: TChangeItem["severity"]) => {
        switch (severity) {
            case "critical": return { label: "Crítico", color: "text-destructive", icon: AlertTriangle }
            case "high": return { label: "Alto", color: "text-orange-600", icon: AlertTriangle }
            case "medium": return { label: "Médio", color: "text-yellow-600", icon: AlertTriangle }
            case "low": return { label: "Baixo", color: "text-blue-600", icon: CheckCircle2 }
        }
    }

    const riskLevel = getRiskLevel()
    const SeverityIcon = riskLevel.color.includes("destructive") ? AlertTriangle : CheckCircle2

    return (
        <div className="fixed
        bottom-4
        right-4
        w-full
        max-w-sm
        rounded-xl
        border
        shadow-lg
        bg-white
        p-4
        space-y-3" style={{ zIndex: 9999! }}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <AlertTriangle className={cn("h-5 w-5", riskLevel.color)} />
                    <h3 className="text-sm font-medium text-psi-dark">Alterações Detectadas</h3>
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-6 w-6 p-0"
                >
                    <X className="h-4 w-4" />
                </Button>
            </div>

            <div className={cn("rounded-lg p-3 border", riskLevel.bg, riskLevel.border)}>
                <div className="flex items-center gap-2 mb-2">
                    <SeverityIcon className={cn("h-4 w-4", riskLevel.color)} />
                    <span className={cn("text-xs font-medium", riskLevel.color)}>
                        {riskLevel.label}
                    </span>
                </div>
                <div className="w-full bg-psi-dark/10 rounded-full h-2">
                    <div
                        className={cn("h-2 rounded-full transition-all", riskLevel.bg.includes("destructive") ? "bg-destructive" : riskLevel.bg.includes("orange") ? "bg-orange-500" : riskLevel.bg.includes("yellow") ? "bg-yellow-500" : "bg-blue-500")}
                        style={{ width: `${Math.min(riskScore, 100)}%` }}
                    />
                </div>
                <p className="text-xs text-psi-dark/60 mt-1">
                    Pontuação de risco: {riskScore}/100
                </p>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto">
                <p className="text-xs font-medium text-psi-dark/70">Campos alterados:</p>
                {changes.map((change, index) => {
                    const severityInfo = getSeverityLabel(change.severity)
                    const Icon = severityInfo.icon
                    return (
                        <div key={index} className="flex items-center gap-2 text-xs">
                            <Icon className={cn("h-3 w-3 shrink-0", severityInfo.color)} />
                            <span className="text-psi-dark/80">{change.field}</span>
                            <span className={cn("text-xs font-medium ml-auto", severityInfo.color)}>
                                {severityInfo.label}
                            </span>
                        </div>
                    )
                })}
            </div>

            <p className="text-xs text-psi-dark/60 pt-2 border-t border-psi-dark/10">
                Alterações em campos sensíveis podem causar confusão aos compradores e invalidar ingressos já vendidos.
            </p>
        </div>
    )
}

export { DialogEditWarning }
export type { TChangeItem }

