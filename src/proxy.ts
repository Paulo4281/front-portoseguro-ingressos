import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"
import type { MiddlewareConfig } from "next/server"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

type TPublicRoutes = {
    path: string
    whenAuthenticated: "redirect" | "next"
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
]

export default async function proxy(request: NextRequest): Promise<NextResponse> {
    const path = request.nextUrl.pathname
    const isPublicRoute = publicRoutes.find((route) => route.path === path)
    const authToken = request.cookies.get("pci_token")?.value

    try {
        if (authToken) {
            await jwtVerify(authToken, SECRET)
            if (isPublicRoute?.whenAuthenticated === "redirect") {
                const redirectUrl = request.nextUrl.clone()
                redirectUrl.pathname = "/"
                return NextResponse.redirect(redirectUrl)
              }
              return NextResponse.next()
        }
    } catch(error) {
        console.error(error)
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
        '/((?!api|_next/static|_next/image|favicon.ico|images|icons|videos).*)',
    ]
}