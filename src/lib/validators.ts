import { z } from "zod";

// --- Internal Auth Schemas ---

export const ClerkWebhookSchema = z.object({
    data: z.any(),
    object: z.string(),
    type: z.string()
});

// --- Generation API Schemas ---

export const GenerationRequestSchema = z.object({
    url: z.string().url("Invalid URL format").max(2048, "URL is too long"),
    workflow: z.enum(["social_media", "github_readme", "linkedin", "resume", "twitter_tweet", "instagram_feed", "notes"], {
        message: "Invalid workflow type"
    }),
    platform: z.string().optional(),
    tone: z.string().optional(),
    additionalContext: z.string().max(1000, "Context too long").optional()
});

// --- Admin API Schemas ---

export const AdminStatsQuerySchema = z.object({
    timeframe: z.enum(["today", "weekly", "monthly", "all"]).optional().default("today"),
});

// --- User Profile Schemas ---

export const UserUpdateSchema = z.object({
    plan: z.enum(["free", "pro", "unlimited"]).optional(),
    credits_remaining: z.number().min(0).optional(),
    is_admin: z.boolean().optional(),
});

/**
 * Validates data against a schema and throws a standardized error if invalid.
 */
export async function validateRequest<T>(schema: z.Schema<T>, data: any): Promise<T> {
    try {
        return await schema.parseAsync(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            const firstError = error.issues[0]?.message || "Invalid input data";
            throw new ValidationError(firstError);
        }
        throw error;
    }
}

export class ValidationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}
