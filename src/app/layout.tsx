import "./globals.css"
import "@/styles/KeyFrames.css"
import { ToastContainer } from "react-toastify"
import { Providers } from "@/providers"
import { Menu } from "@/components/Menu/Menu"
import { Footer } from "@/components/Footer/Footer"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`antialiased overflow-x-hidden`}
      >
        <Providers>
          <ToastContainer />
          <Menu />
          <main className="w-full min-h-screen">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
