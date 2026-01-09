"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, FileText, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type TFileUploadProps = {
    value?: string | File | null
    onChange: (file: File | null) => void
    className?: string
    error?: string
    accept?: string
    maxSize?: number
    label?: string
    description?: string
}

const FileUpload = (
    {
        value,
        onChange,
        className,
        error,
        accept = ".pdf",
        maxSize = 10 * 1024 * 1024,
        label = "Clique para fazer upload",
        description = ""
    }: TFileUploadProps
) => {
    const [preview, setPreview] = useState<string | null>(
        value instanceof File 
            ? value.name
            : value || null
    )
    const [previewUrl, setPreviewUrl] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (value instanceof File) {
            setPreview(value.name)
            const url = URL.createObjectURL(value)
            setPreviewUrl(url)
            return () => {
                URL.revokeObjectURL(url)
            }
        } else if (typeof value === "string" && value) {
            setPreview(value)
            setPreviewUrl(value)
        } else {
            setPreview(null)
            setPreviewUrl(null)
        }
    }, [value])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > maxSize) {
                alert(`O arquivo excede o tamanho máximo de ${maxSize / (1024 * 1024)}MB`)
                if (fileInputRef.current) {
                    fileInputRef.current.value = ""
                }
                return
            }
            onChange(file)
            setPreview(file.name)
        }
    }

    const handleRemove = () => {
        onChange(null)
        setPreview(null)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleClick = () => {
        fileInputRef.current?.click()
    }

    const handleView = (e: React.MouseEvent) => {
        e.stopPropagation()
        if (previewUrl) {
            window.open(previewUrl, "_blank")
        }
    }

    const isUrl = typeof value === "string" && value.startsWith("http")
    const canView = previewUrl && (isUrl || value instanceof File)

    return (
        <div className={cn("space-y-2", className)}>
            <div
                className={cn(
                    "relative border-2 border-dashed rounded-xl transition-all duration-200",
                    error
                        ? "border-destructive bg-destructive/5"
                        : preview
                        ? "border-psi-primary/30 bg-psi-primary/5"
                        : "border-[#E4E6F0] bg-[#F3F4FB] hover:border-psi-primary/50 hover:bg-psi-primary/5",
                    "cursor-pointer"
                )}
                onClick={handleClick}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept={accept}
                    onChange={handleFileChange}
                    className="hidden"
                />

                {preview ? (
                    <div className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="rounded-lg bg-psi-primary/10 p-3">
                                <FileText className="h-6 w-6 text-psi-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-psi-dark truncate">
                                    {isUrl ? "Regulamento do evento" : preview}
                                </p>
                                {isUrl && (
                                    <p className="text-xs text-psi-dark/60 truncate">
                                        {value}
                                    </p>
                                )}
                            </div>
                            <div className="flex gap-2">
                                {canView && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={handleView}
                                        className="bg-white/90 hover:bg-white shadow-lg"
                                        title="Visualizar PDF"
                                    >
                                        <ExternalLink className="h-4 w-4" />
                                    </Button>
                                )}
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleRemove()
                                    }}
                                    className="bg-white/90 hover:bg-white shadow-lg"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-center">
                        <div className="rounded-full bg-psi-primary/10 p-4 mb-4">
                            <Upload className="h-8 w-8 text-psi-primary" />
                        </div>
                        <p className="text-sm font-medium text-psi-dark mb-1">
                            {label}
                        </p>
                        <p className="text-xs text-psi-dark/60">
                            {description}
                        </p>
                        <p className="text-xs text-psi-dark/40 mt-2">
                            PDF até {maxSize / (1024 * 1024)}MB
                        </p>
                    </div>
                )}
            </div>
            {error && (
                <p className="text-sm text-destructive">{error}</p>
            )}
        </div>
    )
}

export {
    FileUpload
}

