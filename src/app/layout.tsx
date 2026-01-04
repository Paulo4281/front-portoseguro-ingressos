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
import { Metadata, Viewport } from "next"

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
const ogImageUrl = `${appUrl}/images/porto-seguro-ingressos-cover-image-logo.jpg`

export const metadata: Metadata = {
  title: "Porto Seguro Ingressos",
  description: "A forma mais sofisticada de viver os eventos da capital do descobrimento. Conectamos organizadores locais e apaixonados pela cena cultural com uma experiência de compra inteligente, transparente e com taxas justas.",
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Porto Seguro Ingressos",
  },
  openGraph: {
    title: "Porto Seguro Ingressos",
    description: "A forma mais sofisticada de viver os eventos da capital do descobrimento. Conectamos organizadores locais e apaixonados pela cena cultural com uma experiência de compra inteligente, transparente e com taxas justas.",
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Porto Seguro Ingressos",
      }
    ],
    url: appUrl,
    siteName: "Porto Seguro Ingressos",
    type: "website",
    locale: "pt-BR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Porto Seguro Ingressos",
    description: "A forma mais sofisticada de viver os eventos da capital do descobrimento. Conectamos organizadores locais e apaixonados pela cena cultural com uma experiência de compra inteligente, transparente e com taxas justas.",
    images: [
      {
        url: ogImageUrl,
      }
    ],
  }
}

export const viewport: Viewport = {
  themeColor: "#6C4BFF"
}

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
