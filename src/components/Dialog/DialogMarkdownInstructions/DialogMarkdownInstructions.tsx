"use client"

import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import {
    Type,
    Heading1,
    List,
    Link as LinkIcon,
    Image as ImageIcon,
    Code,
    Table,
    CheckSquare,
    Quote,
    Hash,
    Minus,
    Copy,
    Check,
} from "lucide-react"

type TDialogMarkdownInstructionsProps = {
    open: boolean
    onOpenChange: (open: boolean) => void
}

const DialogMarkdownInstructions = ({
    open,
    onOpenChange,
}: TDialogMarkdownInstructionsProps) => {
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

    const copyToClipboard = (text: string, index: number) => {
        navigator.clipboard.writeText(text)
        setCopiedIndex(index)
        setTimeout(() => setCopiedIndex(null), 2000)
    }

    const examples = [
        {
            title: "Texto",
            icon: Type,
            items: [
                {
                    name: "Negrito",
                    syntax: "**texto**",
                    example: "**texto**",
                },
                {
                    name: "Itálico",
                    syntax: "*texto*",
                    example: "*texto*",
                },
                {
                    name: "Riscado",
                    syntax: "~~texto~~",
                    example: "~~texto~~",
                },
                {
                    name: "Código inline",
                    syntax: "`código`",
                    example: "`código`",
                },
                {
                    name: "Quebra de linha",
                    syntax: "Duas espaços no final  \nou linha vazia",
                    example: "Linha 1  \nLinha 2",
                },
                {
                    name: "Separador horizontal",
                    syntax: "---",
                    example: "---",
                },
            ],
        },
        {
            title: "Títulos",
            icon: Heading1,
            items: [
                {
                    name: "Título 1",
                    syntax: "# Título 1",
                    example: "# Título 1",
                },
                {
                    name: "Título 2",
                    syntax: "## Título 2",
                    example: "## Título 2",
                },
                {
                    name: "Título 3",
                    syntax: "### Título 3",
                    example: "### Título 3",
                },
                {
                    name: "Título 4",
                    syntax: "#### Título 4",
                    example: "#### Título 4",
                },
            ],
        },
        {
            title: "Listas",
            icon: List,
            items: [
                {
                    name: "Lista comum",
                    syntax: "- Item\n- Item\n- Item",
                    example: "- Item\n- Item\n- Item",
                },
                {
                    name: "Lista numerada",
                    syntax: "1. Item\n2. Item\n3. Item",
                    example: "1. Item\n2. Item\n3. Item",
                },
                {
                    name: "Lista com checkbox",
                    syntax: "- [x] Concluído\n- [ ] Pendente",
                    example: "- [x] Concluído\n- [ ] Pendente",
                },
            ],
        },
        {
            title: "Links",
            icon: LinkIcon,
            items: [
                {
                    name: "Link simples",
                    syntax: "[Texto do link](https://site.com)",
                    example: "[Texto do link](https://site.com)",
                },
                {
                    name: "Link com título",
                    syntax: '[Link](https://site.com "Título do link")',
                    example: '[Link](https://site.com "Título do link")',
                },
            ],
        },
        {
            title: "Imagens",
            icon: ImageIcon,
            items: [
                {
                    name: "Imagem simples",
                    syntax: "![Descrição](https://imagem.com/img.png)",
                    example: "![Descrição](https://imagem.com/img.png)",
                },
                {
                    name: "Imagem com link",
                    syntax: "[![Alt](img.png)](https://link.com)",
                    example: "[![Alt](img.png)](https://link.com)",
                },
            ],
        },
        {
            title: "Blocos de Código",
            icon: Code,
            items: [
                {
                    name: "Código simples",
                    syntax: "```\nconsole.log('Olá mundo')\n```",
                    example: "```\nconsole.log('Olá mundo')\n```",
                },
                {
                    name: "Código com linguagem",
                    syntax: "```js\nconsole.log('Olá mundo')\n```",
                    example: "```js\nconsole.log('Olá mundo')\n```",
                },
            ],
        },
        {
            title: "Tabelas",
            icon: Table,
            items: [
                {
                    name: "Tabela básica",
                    syntax: "| Nome | Idade |\n|------|--------|\n| João | 20     |\n| Ana  | 22     |",
                    example: "| Nome | Idade |\n|------|--------|\n| João | 20     |\n| Ana  | 22     |",
                },
                {
                    name: "Tabela alinhada",
                    syntax: "| Esquerda | Centro | Direita |\n|:--------|:------:|--------:|\n| Texto   | Texto  | Texto   |",
                    example: "| Esquerda | Centro | Direita |\n|:--------|:------:|--------:|\n| Texto   | Texto  | Texto   |",
                },
            ],
        },
        {
            title: "Citações",
            icon: Quote,
            items: [
                {
                    name: "Citação simples",
                    syntax: "> Isso é uma citação",
                    example: "> Isso é uma citação",
                },
                {
                    name: "Citação múltipla",
                    syntax: "> Primeira linha\n> Segunda linha",
                    example: "> Primeira linha\n> Segunda linha",
                },
            ],
        }
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold text-psi-dark">
                        Guia de Markdown
                    </DialogTitle>
                    <DialogDescription className="text-base text-psi-dark/70">
                        Aprenda a criar descrições impressionantes usando Markdown. 
                        Clique no botão de copiar para usar os exemplos.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    {examples.map((section, sectionIndex) => {
                        const Icon = section.icon
                        return (
                            <div
                                key={sectionIndex}
                                className="rounded-xl border border-psi-primary/20 bg-linear-to-br from-psi-primary/5 via-white to-psi-primary/10 p-6 space-y-4"
                            >
                                <div className="flex items-center gap-3 pb-2 border-b border-psi-primary/10">
                                    <div className="h-10 w-10 rounded-lg bg-psi-primary/10 flex items-center justify-center">
                                        <Icon className="h-5 w-5 text-psi-primary" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-psi-dark">
                                        {section.title}
                                    </h3>
                                </div>

                                <div className="space-y-3">
                                    {section.items.map((item, itemIndex) => {
                                        const globalIndex = sectionIndex * 100 + itemIndex
                                        return (
                                            <div
                                                key={itemIndex}
                                                className="rounded-lg border border-psi-primary/10 bg-white p-4 space-y-2"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-sm font-medium text-psi-dark">
                                                        {item.name}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 w-7 p-0"
                                                        onClick={() =>
                                                            copyToClipboard(
                                                                item.syntax,
                                                                globalIndex
                                                            )
                                                        }
                                                    >
                                                        {copiedIndex === globalIndex ? (
                                                            <Check className="h-4 w-4 text-green-600" />
                                                        ) : (
                                                            <Copy className="h-4 w-4 text-psi-primary" />
                                                        )}
                                                    </Button>
                                                </div>
                                                <div className="rounded-md bg-psi-dark/5 p-3 font-mono text-xs text-psi-dark break-all">
                                                    <pre className="whitespace-pre-wrap">
                                                        {item.syntax}
                                                    </pre>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}

                    <div className="rounded-xl border-2 border-psi-primary/30 bg-linear-to-br from-psi-primary/10 via-white to-psi-tertiary/10 p-6 space-y-3">
                        <div className="flex items-center gap-2">
                            <Minus className="h-5 w-5 text-psi-primary" />
                            <h3 className="text-lg font-semibold text-psi-dark">
                                Dicas Extras
                            </h3>
                        </div>
                        <ul className="space-y-2 text-sm text-psi-dark/70 list-disc list-inside">
                            <li>
                                Use <code className="bg-psi-dark/10 px-1.5 py-0.5 rounded">**negrito**</code> para destacar informações importantes
                            </li>
                            <li>
                                Organize o conteúdo com títulos para melhor leitura
                            </li>
                            <li>
                                Use listas para apresentar informações de forma clara
                            </li>
                            <li>
                                Adicione imagens para tornar a descrição mais atrativa
                            </li>
                            <li>
                                Combine diferentes elementos para criar descrições profissionais
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export { DialogMarkdownInstructions }
