import { QueryProvider } from "./QueryClientProvider/QueryClientProvider"

function Providers({ children }: { children: React.ReactNode }) {
    return (
        <QueryProvider>
            {children}
        </QueryProvider>
    )
}

export {
    Providers
}