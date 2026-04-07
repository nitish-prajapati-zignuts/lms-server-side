import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {

    const { pathname } = request.nextUrl

    if (pathname === "/") {
        return NextResponse.redirect(new URL("/login", request.nextUrl))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/", "/login", "/register"]
}