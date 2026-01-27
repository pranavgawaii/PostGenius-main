import { NextResponse } from "next/server";
import { ValidationError } from "./validators";

/**
 * Standardized secure error response.
 * Prevents internal details, API keys, and stack traces from leaking to the frontend.
 */
export function handleApiError(error: any) {
    console.error("❌ API ERROR:", error);

    // 1. Validation Errors (User fault)
    if (error instanceof ValidationError) {
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 400 });
    }

    // 2. Auth Errors
    if (error.message?.includes("Unauthorized") || error.message?.includes("Forbidden")) {
        return NextResponse.json({
            success: false,
            error: "Authentication required"
        }, { status: 401 });
    }

    // 3. Known Supabase/Gemini errors (we sanitize these)
    if (error.status === 429) {
        return NextResponse.json({
            success: false,
            error: "Rate limit exceeded. Please try again later."
        }, { status: 429 });
    }

    // 4. Fallback for Internal Server Errors
    // We log the real error server-side, but return a generic message to the user
    return NextResponse.json({
        success: false,
        error: "An unexpected system error occurred. Our team has been notified."
    }, { status: 500 });
}

/**
 * Standardized success response
 */
export function successResponse(data: any, status = 200) {
    return NextResponse.json({
        success: true,
        data
    }, { status });
}
