import { NextRequest, NextResponse } from "next/server"
import { jwtVerify, decodeJwt } from "jose"
import type { MiddlewareConfig } from "next/server"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)
const SECRET_ADMIN = new TextEncoder().encode(process.env.JWT_SECRET_ADMIN)

type TPublicRoutes = {
    path: string
    whenAuthenticated: "redirect" | "next"
}

type TJwtDecoded = {
    id: string
    role: "CUSTOMER" | "ORGANIZER" | "ADMIN" | "NOT_DEFINED"
    customerId?: string
    organizer?: string
}

const publicRoutes: TPublicRoutes[] = [
    { path: "/", whenAuthenticated: "next" },
    { path: "/login", whenAuthenticated: "redirect" },
    { path: "/cadastro", whenAuthenticated: "redirect" },
    { path: "/cadastro-confirmar", whenAuthenticated: "redirect" },
    { path: "/senha-redefinir", whenAuthenticated: "redirect" },
    { path: "/senha-redefinir-confirmar", whenAuthenticated: "redirect" },
    { path: "/ver-evento", whenAuthenticated: "next" },
    { path: "/recursos", whenAuthenticated: "next" },
    { path: "/checkout", whenAuthenticated: "next" },
    { path: "/ver-eventos", whenAuthenticated: "next" },
    { path: "/conheca", whenAuthenticated: "next" },
    { path: "/qr-scanner-link", whenAuthenticated: "next" },
    { path: "/casos-de-uso", whenAuthenticated: "next" },
    { path: "/politica-de-privacidade", whenAuthenticated: "next" },
    { path: "/termos-e-condicoes", whenAuthenticated: "next" },
    { path: "/ajuda", whenAuthenticated: "next" }
]

export default async function proxy(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname
    
    if (path.startsWith("/sitemap") || path === "/robots.txt") {
        return NextResponse.next()
    }
    
    const isPublicRoute = publicRoutes.find((route) => path === route.path || path.startsWith(route.path + "/"))
    
    const allCookies = request.cookies.getAll()
    let authToken = request.cookies.get("psi_token")?.value

    if (!authToken) {
        const cookieHeader = request.headers.get("cookie")
        if (cookieHeader) {
            const cookies = cookieHeader.split(";").map(c => c.trim())
            const psiTokenCookie = cookies.find(c => c.startsWith("psi_token="))
            if (psiTokenCookie) {
                authToken = psiTokenCookie.split("=")[1]
            }
        }
    }

    if (process.env.NODE_ENV === "production" && !isPublicRoute && !authToken) {
        console.log("Middleware - Path:", path)
        console.log("Middleware - Cookies disponíveis:", allCookies.map(c => c.name))
        console.log("Middleware - psi_token presente:", !!authToken)
        console.log("Middleware - Cookie header:", request.headers.get("cookie")?.substring(0, 100))
    }

    if (authToken) {
        try {
            const decoded = decodeJwt(authToken) as TJwtDecoded
            const { id, role, customerId = null, organizer = null } = decoded

            if (!role) {
                throw new Error("Token sem role definida")
            }

            if (role === "ADMIN") {
                await jwtVerify(authToken, SECRET_ADMIN)
            } else {
                await jwtVerify(authToken, SECRET)
            }

            if (isPublicRoute?.whenAuthenticated === "redirect") {
                const redirectUrl = request.nextUrl.clone()
                redirectUrl.pathname = "/"
                return NextResponse.redirect(redirectUrl)
            }

            return NextResponse.next()
        } catch(error) {
            console.error("Erro ao verificar token:", error)
            
            const response = NextResponse.next()
            response.cookies.delete("psi_token")
            
            if (!isPublicRoute) {
                const redirectUrl = request.nextUrl.clone()
                redirectUrl.pathname = "/login"
                return NextResponse.redirect(redirectUrl)
            }
            
            return response
        }
    }

    if (!isPublicRoute) {
        const redirectUrl = request.nextUrl.clone()
        redirectUrl.pathname = "/login"
        return NextResponse.redirect(redirectUrl)
    }
    
    return NextResponse.next()
}

export const config: MiddlewareConfig = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|manifest.webmanifest|manifest.json|service-worker.js|robots.txt|sitemap.*|images|icons|videos).*)',
    ]
}