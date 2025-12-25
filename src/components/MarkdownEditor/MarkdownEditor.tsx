"use client"

import { useState } from "react"
import { FileText, Eye } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import ReactMarkdown from "react-markdown"

type TMarkdownEditorProps = {
    value?: string
    onChange: (value: string) => void
    className?: string
    placeholder?: string
    rows?: number
    required?: boolean
    maxLength?: number
}

const MarkdownEditor = (
    {
        value = "",
        onChange,
        className,
        placeholder = "Descreva seu evento...",
        rows = 6,
        required = false,
        maxLength
    }: TMarkdownEditorProps
) => {
    const [isPreview, setIsPreview] = useState(false)

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-psi-primary" />
                    <span className="text-xs text-psi-dark/60">Markdown suportado</span>
                </div>
                <button
                    type="button"
                    onClick={() => setIsPreview(!isPreview)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-psi-dark/70 hover:text-psi-dark hover:bg-[#F3F4FB] rounded-lg transition-colors"
                >
                    <Eye className="h-3.5 w-3.5" />
                    {isPreview ? "Editar" : "Preview"}
                </button>
            </div>

            {isPreview ? (
                <div className="min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-sm overflow-y-auto">
                    {value ? (
                        <div className="text-psi-dark [&>h1]:text-2xl [&>h1]:font-semibold [&>h1]:mb-2 [&>h2]:text-xl [&>h2]:font-semibold [&>h2]:mb-2 [&>h3]:text-lg [&>h3]:font-medium [&>h3]:mb-2 [&>p]:mb-2 [&>ul]:list-disc [&>ul]:ml-4 [&>ul]:mb-2 [&>ol]:list-decimal [&>ol]:ml-4 [&>ol]:mb-2 [&>li]:mb-1 [&>strong]:font-semibold [&>em]:italic [&>code]:bg-[#F3F4FB] [&>code]:px-1 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs [&>pre]:bg-[#F3F4FB] [&>pre]:p-2 [&>pre]:rounded [&>pre]:overflow-x-auto [&>pre]:mb-2 [&>blockquote]:border-l-4 [&>blockquote]:border-psi-primary/30 [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:mb-2 [&>a]:text-psi-primary [&>a]:underline">
                            <ReactMarkdown>{value}</ReactMarkdown>
                        </div>
                    ) : (
                        <span className="text-muted-foreground">Nenhum conteúdo</span>
                    )}
                </div>
            ) : (
                <Textarea
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    rows={rows}
                    required={required}
                    maxLength={maxLength}
                    className="w-full font-mono text-sm"
                />
            )}
        </div>
    )
}

export {
    MarkdownEditor
}

