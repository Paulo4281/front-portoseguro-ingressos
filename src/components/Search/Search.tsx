"use client"

import { Search as SearchIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

type TSearchProps = {
    className?: string
    placeholder?: string
}

const Search = (
    {
        className,
        placeholder = "Buscar por eventos, artistas ou locais"
    }: TSearchProps
) => {
    return (
        <div className={cn("w-full rounded-[40px] border border-white/70 bg-white/80 shadow-lg shadow-black/5 backdrop-blur p-4", className)}>
            <form className="flex flex-col gap-3
            md:flex-row
            md:items-center">
                <label className="flex flex-1 items-center gap-3 rounded-[32px] border border-transparent bg-[#F3F4FB] px-5 py-3 text-base text-psi-dark transition-all focus-within:border-psi-primary/30 focus-within:bg-white/90">
                    <SearchIcon className="h-5 w-5 text-psi-primary" />
                    <Input
                        type="search"
                        placeholder={placeholder}
                        aria-label="Buscar eventos"
                        required
                        className="h-auto border-0 bg-transparent p-0 text-base text-psi-dark placeholder:text-psi-dark/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                    />
                </label>

                <Button type="submit" size="lg" variant="primary" className="w-full
                md:w-auto">
                    Buscar agora
                </Button>
            </form>
        </div>
    )
}

export { Search }