"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Code2,
    Book,
    Copy,
    Check,
    ChevronRight,
    Home,
    Key,
    Zap,
    Shield,
    AlertCircle,
    Terminal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default function APIReferencePage() {
    const [activeEndpoint, setActiveEndpoint] = useState("generate-captions");
    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const copyToClipboard = (code: string, id: string) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(id);
        setTimeout(() => setCopiedCode(null), 2000);
    };

    const endpoints = [
        {
            id: "generate-captions",
            title: "Generate Captions",
            method: "POST",
            path: "/api/generate-captions",
            description: "Generate social media captions from any URL using AI.",
            auth: "Required",
            rateLimit: "10 requests/minute per user",
            request: {
                body: {
                    blogUrl: "string (required) - URL of the content to repurpose",
                    workflow: "string (required) - Type of content to generate"
                },
                example: `{
  "blogUrl": "https://example.com/article",
  "workflow": "social_media"
}`
            },
            response: {
                success: {
                    generation_id: "number - Unique ID of the generation",
                    workflow: "string - Workflow type used",
                    output: "object - Generated content",
                    requests_remaining: "number - Credits remaining"
                },
                example: `{
  "success": true,
  "data": {
    "generation_id": 123,
    "workflow": "social_media",
    "output": {
      "instagram": {
        "text": "Your caption here...",
        "hashtags": ["#ai", "#content"]
      },
      "linkedin": {
        "text": "Professional post..."
      },
      "twitter": {
        "text": "Tweet text..."
      },
      "facebook": {
        "text": "Facebook post..."
      }
    },
    "requests_remaining": 4
  }
}`
            },
            workflows: [
                { value: "social_media", label: "Social Media Captions", credits: 1 },
                { value: "linkedin", label: "LinkedIn Post", credits: 1 },
                { value: "github_readme", label: "GitHub README", credits: 2 },
                { value: "notes", label: "Study Notes", credits: 1 },
                { value: "resume", label: "Resume Bullets", credits: 1 }
            ],
            errors: [
                { code: 401, message: "Unauthorized - Invalid or missing authentication" },
                { code: 402, message: "Payment Required - Credits exhausted" },
                { code: 429, message: "Too Many Requests - Rate limit exceeded" },
                { code: 500, message: "Internal Server Error - Generation failed" }
            ]
        },
        {
            id: "user-me",
            title: "Get Current User",
            method: "GET",
            path: "/api/user/me",
            description: "Retrieve authenticated user's profile and credit information.",
            auth: "Required",
            rateLimit: "60 requests/minute per user",
            request: {
                body: null,
                example: "No request body required"
            },
            response: {
                success: {
                    id: "number - User ID",
                    email: "string - User email",
                    plan: "string - Subscription plan (free/pro/unlimited)",
                    credits_remaining: "number - Available credits",
                    is_admin: "boolean - Admin status"
                },
                example: `{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "plan": "pro",
      "credits_remaining": 45,
      "is_admin": false,
      "created_at": "2024-01-01T00:00:00Z",
      "last_activity": "2024-01-15T10:30:00Z"
    }
  }
}`
            },
            errors: [
                { code: 401, message: "Unauthorized - Not authenticated" },
                { code: 404, message: "Not Found - User not found" }
            ]
        },
        {
            id: "user-generations",
            title: "Get User Generations",
            method: "GET",
            path: "/api/user/generations",
            description: "Retrieve all generations created by the authenticated user.",
            auth: "Required",
            rateLimit: "30 requests/minute per user",
            request: {
                body: null,
                example: "No request body required"
            },
            response: {
                success: {
                    generations: "array - List of generation objects"
                },
                example: `{
  "success": true,
  "data": {
    "generations": [
      {
        "id": 123,
        "workflow": "social_media",
        "blog_url": "https://example.com/article",
        "blog_title": "Article Title",
        "output": { /* Generated content */ },
        "created_at": "2024-01-15T10:30:00Z",
        "credits_used": 1
      }
    ]
  }
}`
            },
            errors: [
                { code: 401, message: "Unauthorized - Not authenticated" }
            ]
        },
        {
            id: "admin-stats",
            title: "Admin Statistics",
            method: "GET",
            path: "/api/admin/stats",
            description: "Get platform-wide statistics (Admin only).",
            auth: "Required (Admin)",
            rateLimit: "10 requests/minute",
            request: {
                body: null,
                example: "No request body required"
            },
            response: {
                success: {
                    stats: "object - Platform statistics",
                    users: "array - User list",
                    recent_activity: "array - Recent generations",
                    apiCosts: "object - API cost breakdown"
                },
                example: `{
  "success": true,
  "data": {
    "stats": {
      "total_users": 1250,
      "new_users_today": 15,
      "total_generations": 5420,
      "generations_today": 87,
      "active_users_today": 42
    },
    "apiCosts": {
      "total_cost": 125.50,
      "total_firecrawl_cost": 45.20,
      "total_gemini_cost": 80.30
    }
  }
}`
            },
            errors: [
                { code: 401, message: "Unauthorized - Not authenticated" },
                { code: 403, message: "Forbidden - Admin access required" }
            ]
        }
    ];

    const activeEndpointData = endpoints.find(e => e.id === activeEndpoint);

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <div className="border-b border-border/50 bg-card/30 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/dashboard/support" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                                <Home className="w-4 h-4" />
                                Support
                            </Link>
                            <ChevronRight className="w-4 h-4 text-muted-foreground" />
                            <div className="flex items-center gap-2">
                                <Code2 className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-sm">API Reference</span>
                            </div>
                        </div>
                        <Link href="/dashboard/support/docs">
                            <Button variant="outline" size="sm" className="gap-2">
                                <Book className="w-3.5 h-3.5" />
                                Documentation
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-6">
                            {/* Authentication Info */}
                            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                                <div className="flex items-start gap-3">
                                    <Key className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                                    <div className="space-y-1">
                                        <p className="text-xs font-bold text-amber-500">Authentication</p>
                                        <p className="text-xs text-muted-foreground">All API requests require Clerk authentication via session cookies.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Endpoints Navigation */}
                            <nav className="space-y-1">
                                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 px-3">Endpoints</p>
                                {endpoints.map((endpoint) => (
                                    <button
                                        key={endpoint.id}
                                        onClick={() => setActiveEndpoint(endpoint.id)}
                                        className={cn(
                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all",
                                            activeEndpoint === endpoint.id
                                                ? "bg-primary/10 text-primary border border-primary/20 font-semibold"
                                                : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                                        )}
                                    >
                                        <span className="truncate">{endpoint.title}</span>
                                        <span className={cn(
                                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                                            endpoint.method === "GET" ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500"
                                        )}>
                                            {endpoint.method}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        {activeEndpointData && (
                            <motion.div
                                key={activeEndpoint}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="space-y-6"
                            >
                                {/* Endpoint Header */}
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className={cn(
                                            "text-xs font-black px-2 py-1 rounded",
                                            activeEndpointData.method === "GET" ? "bg-blue-500/20 text-blue-500" : "bg-green-500/20 text-green-500"
                                        )}>
                                            {activeEndpointData.method}
                                        </span>
                                        <code className="text-sm font-mono text-muted-foreground">{activeEndpointData.path}</code>
                                    </div>
                                    <h1 className="text-3xl font-black tracking-tight">{activeEndpointData.title}</h1>
                                    <p className="text-muted-foreground">{activeEndpointData.description}</p>

                                    <div className="flex items-center gap-4 text-xs">
                                        <div className="flex items-center gap-2">
                                            <Shield className="w-3.5 h-3.5 text-primary" />
                                            <span className="text-muted-foreground">Auth: <span className="font-semibold text-foreground">{activeEndpointData.auth}</span></span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-3.5 h-3.5 text-amber-500" />
                                            <span className="text-muted-foreground">Rate Limit: <span className="font-semibold text-foreground">{activeEndpointData.rateLimit}</span></span>
                                        </div>
                                    </div>
                                </div>

                                {/* Workflows (if applicable) */}
                                {activeEndpointData.workflows && (
                                    <div className="p-6 rounded-2xl bg-card/40 border border-border/50">
                                        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                            <Terminal className="w-4 h-4 text-primary" />
                                            Available Workflows
                                        </h2>
                                        <div className="space-y-2">
                                            {activeEndpointData.workflows.map((workflow) => (
                                                <div key={workflow.value} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/30">
                                                    <div>
                                                        <code className="text-sm font-mono text-primary">{workflow.value}</code>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{workflow.label}</p>
                                                    </div>
                                                    <span className="text-xs font-bold text-muted-foreground">{workflow.credits} credit{workflow.credits > 1 ? 's' : ''}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Request */}
                                <div className="p-6 rounded-2xl bg-card/40 border border-border/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-primary" />
                                            Request
                                        </h2>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(activeEndpointData.request.example, `request-${activeEndpoint}`)}
                                            className="gap-2"
                                        >
                                            {copiedCode === `request-${activeEndpoint}` ? (
                                                <><Check className="w-3.5 h-3.5" /> Copied</>
                                            ) : (
                                                <><Copy className="w-3.5 h-3.5" /> Copy</>
                                            )}
                                        </Button>
                                    </div>

                                    {activeEndpointData.request.body && (
                                        <div className="mb-4 space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Body Parameters</p>
                                            {Object.entries(activeEndpointData.request.body).map(([key, value]) => (
                                                <div key={key} className="text-sm">
                                                    <code className="text-primary font-mono">{key}</code>
                                                    <span className="text-muted-foreground ml-2">- {value as string}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="relative">
                                        <pre className="p-4 rounded-lg bg-black/40 border border-white/10 overflow-x-auto">
                                            <code className="text-xs text-green-400 font-mono">{activeEndpointData.request.example}</code>
                                        </pre>
                                    </div>
                                </div>

                                {/* Response */}
                                <div className="p-6 rounded-2xl bg-card/40 border border-border/50">
                                    <div className="flex items-center justify-between mb-4">
                                        <h2 className="text-lg font-bold flex items-center gap-2">
                                            <Code2 className="w-4 h-4 text-primary" />
                                            Response
                                        </h2>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => copyToClipboard(activeEndpointData.response.example, `response-${activeEndpoint}`)}
                                            className="gap-2"
                                        >
                                            {copiedCode === `response-${activeEndpoint}` ? (
                                                <><Check className="w-3.5 h-3.5" /> Copied</>
                                            ) : (
                                                <><Copy className="w-3.5 h-3.5" /> Copy</>
                                            )}
                                        </Button>
                                    </div>

                                    {activeEndpointData.response.success && (
                                        <div className="mb-4 space-y-2">
                                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Success Response (200)</p>
                                            {Object.entries(activeEndpointData.response.success).map(([key, value]) => (
                                                <div key={key} className="text-sm">
                                                    <code className="text-primary font-mono">{key}</code>
                                                    <span className="text-muted-foreground ml-2">- {value as string}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <div className="relative">
                                        <pre className="p-4 rounded-lg bg-black/40 border border-white/10 overflow-x-auto">
                                            <code className="text-xs text-green-400 font-mono">{activeEndpointData.response.example}</code>
                                        </pre>
                                    </div>
                                </div>

                                {/* Error Codes */}
                                <div className="p-6 rounded-2xl bg-card/40 border border-border/50">
                                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-red-500" />
                                        Error Codes
                                    </h2>
                                    <div className="space-y-2">
                                        {activeEndpointData.errors.map((error) => (
                                            <div key={error.code} className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/20">
                                                <code className="text-sm font-bold text-red-500 mt-0.5">{error.code}</code>
                                                <p className="text-sm text-muted-foreground">{error.message}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
