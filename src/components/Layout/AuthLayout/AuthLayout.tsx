"use client"

import { ReactNode } from "react"

type TAuthLayoutProps = {
    children: ReactNode
}

const AuthLayout = ({ children }: TAuthLayoutProps) => {
    return (
        <div className="min-h-screen flex">
            <div className="hidden
            lg:block
            lg:w-1/2 relative overflow-hidden">
                <img 
                    className="absolute inset-0 object-cover bg-center bg-no-repeat w-full h-full"
                    src="/images/porto-seguro-ingressos-arraial-mucuge.jpg"
                    alt="Porto Seguro Ingressos Cidade"
                />
            </div>

            <div className="relative
            w-full
            lg:w-1/2
            flex
            items-center
            justify-center
            p-4
            sm:p-6
            md:p-8
            lg:p-12">
                <div className="absolute
                inset-0
                bg-cover
                bg-center
                bg-no-repeat
                lg:hidden">
                    <img 
                        className="absolute inset-0 object-cover bg-center bg-no-repeat w-full h-full"
                        src="/images/porto-seguro-ingressos-arraial-mucuge.jpg"
                        alt="Porto Seguro Ingressos Cidade"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>

                <div className="relative
                w-full
                max-w-md
                bg-white
                dark:bg-psi-dark
                rounded-lg
                shadow-lg
                p-6
                sm:p-8
                md:p-10
                z-10">
                    {children}
                </div>
            </div>
        </div>
    )
}

export {
    AuthLayout
}

