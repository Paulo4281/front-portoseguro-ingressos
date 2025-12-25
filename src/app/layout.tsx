import "./globals.css"
import "@/styles/KeyFrames.css"
import "react-toastify/dist/ReactToastify.css"
import { Poppins } from "next/font/google"
import { ToastContainer } from "react-toastify"
import { Suspense } from "react"
import { Providers } from "@/providers"
import { Menu } from "@/components/Menu/Menu"
import { Footer } from "@/components/Footer/Footer"
import { LoadingScreen } from "@/components/LoadingScreen/LoadingScreen"

const systemFont = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "auto",
  weight: "500",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body
        className={`${systemFont.variable} font-sans antialiased overflow-x-hidden`}
      >
        <Providers>
          <Suspense fallback={null}>
            <LoadingScreen />
          </Suspense>
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
