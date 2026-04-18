import redis from "./redis";

export interface DashboardStats {
    totalTasks: number;
    completedTasks: number;
    completionRate: number;
    activeProjects: number;
}

const CACHE_TTL = 60;

export async function getDashboardStats(userId: string): Promise<DashboardStats | null> {
    const key = `dashboard:stats:${userId}`;
    try {
        const cached = await redis.get(key);
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        console.error('Cached read error', error);
        return null;
    }
}

export async function setDashboardStats(userId: string, stats: DashboardStats): Promise<void> {
    const key = `dashboard:stats:${userId}`;
    try {
        await redis.setex(key, CACHE_TTL, JSON.stringify(stats));
    } catch (error) {
        console.error('Cache write error', error)
    }
}

export async function invalidateDashboardStats(userId: string): Promise<void> {
    try {
        await redis.del(`dashboard:stats:${userId}`);
    } catch (error) {
        console.error('Cache invalidation error', error);
    }
}