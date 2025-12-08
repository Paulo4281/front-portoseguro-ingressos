import "./globals.css"
import "@/styles/KeyFrames.css"
import "react-toastify/dist/ReactToastify.css"
import { Poppins } from "next/font/google"
import { ToastContainer } from "react-toastify"
import { Providers } from "@/providers"
import { Menu } from "@/components/Menu/Menu"
import { Footer } from "@/components/Footer/Footer"

const systemFont = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
  weight: "400",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className="font-sans antialiased overflow-x-hidden"
      >
        <Providers>
          <ToastContainer
            position="top-center"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={true}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            className="custom-toast-container"
          />
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
