import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only initialize if environment variables are present
const redis = (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN)
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    : null;

/**
 * Global API Rate Limiter (IP-based)
 * 100 requests per 15 minutes per IP
 */
export const globalRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(100, "15 m"),
        analytics: true,
        prefix: "ratelimit:global",
    })
    : null;

/**
 * Generation API Rate Limiter (User-based)
 * 10 generations per hour per user
 */
export const generationRateLimiter = redis
    ? new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(10, "1 h"),
        analytics: true,
        prefix: "ratelimit:gen",
    })
    : null;

/**
 * Helper to get user IP securely
 */
export function getIP(req: Request): string {
    const xForwardedFor = req.headers.get("x-forwarded-for");
    if (xForwardedFor) {
        return xForwardedFor.split(",")[0].trim();
    }
    return req.headers.get("x-real-ip") || "unknown";
}
