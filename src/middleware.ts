import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { checkRateLimit } from '@/lib/rateLimit';

export async function middleware(request: NextRequest) {
    // Use IP for rate limiting (session parsing in middleware is complex)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ?? '127.0.0.1';

    // Different limits for reads vs writes
    const isWrite = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
    const maxRequests = isWrite ? 10 : 30;
    const windowSeconds = 60;

    const allowed = await checkRateLimit(ip, maxRequests, windowSeconds);

    if (!allowed) {
        return NextResponse.json(
            { success: false, message: 'Rate limit exceeded. Try again later.' },
            { status: 429, headers: { 'Retry-After': windowSeconds.toString() } }
        );
    }

    return NextResponse.next();
}

// Apply ONLY to task API routes (prevents rate-limiting static assets/pages)
export const config = {
    matcher: '/api/tasks/:path*',
};