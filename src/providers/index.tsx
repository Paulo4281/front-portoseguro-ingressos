import { QueryProvider } from "./QueryClientProvider/QueryClientProvider"
import { CartProvider } from "@/contexts/CartContext"

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </QueryProvider>
    )
}

export {
    Providers
}