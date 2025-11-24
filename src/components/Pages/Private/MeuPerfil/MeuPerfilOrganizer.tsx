"use client"

import { Background } from "@/components/Background/Background"

const MeuPerfilOrganizer = () => {
    return (
        <Background variant="light" className="min-h-screen">
            <div className="container py-8 mt-[100px]
            sm:py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-psi-primary mb-2
                            sm:text-4xl">
                                Meu Perfil
                            </h1>
                            <p className="text-psi-dark/60">
                                Área do organizador
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#E4E6F0] bg-white p-6
                        sm:p-8 shadow-sm">
                            <p className="text-psi-dark/60">
                                Funcionalidade em desenvolvimento
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </Background>
    )
}

export {
    MeuPerfilOrganizer
}

