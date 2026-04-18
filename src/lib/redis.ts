import { Redis } from 'ioredis';

declare global {
    var _redis: Redis | undefined;
}

// Use globalThis for proper TypeScript support

const redisUri = process.env.REDIS_URL;
if (!redisUri) throw new Error("REDIS_URL is not defined");

const redis = globalThis._redis || new Redis(redisUri, {
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    enableOfflineQueue: false,
});

if (process.env.NODE_ENV !== 'production') {
    globalThis._redis = redis;
}

redis.on('error', (err) => console.error('Redis error:', err));
redis.on('connect', () => console.log('✓ Redis connected'));

export default redis;