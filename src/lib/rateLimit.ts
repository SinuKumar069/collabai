// src/lib/rateLimit.ts
import redis from './redis';

export async function checkRateLimit(
    identifier: string,
    maxRequests: number,
    windowSeconds: number
): Promise<boolean> {
    // Sliding window bucket: unique key per time window
    const windowStart = Math.floor(Date.now() / (windowSeconds * 1000));
    const key = `ratelimit:${identifier}:${windowStart}`;

    try {
        const current = await redis.incr(key);
        // Set expiry only on first request in window
        if (current === 1) {
            await redis.expire(key, windowSeconds);
        }
        return current <= maxRequests;
    } catch (err) {
        console.error('Rate limit error:', err);
        return true; // fail-open: allow if Redis is down
    }
}