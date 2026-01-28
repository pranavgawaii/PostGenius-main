"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSignIn, useAuth } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import { Glow } from "@/components/ui/glow";
import { ChevronLeft } from "lucide-react";

export default function SignInPage() {
    const { isLoaded, signIn, setActive } = useSignIn();
    const { isSignedIn } = useAuth();
    const router = useRouter();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    React.useEffect(() => {
        if (isLoaded && isSignedIn) {
            router.push("/dashboard");
        }
    }, [isLoaded, isSignedIn, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLoaded) return;
        setLoading(true);
        setError("");

        try {
            const result = await signIn.create({
                identifier: email,
                password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                router.push("/");
            } else {
                console.log(result);
            }
        } catch (err: any) {
            console.error("Sign in error:", err);
            const errorMessage = err.errors?.[0]?.longMessage || err.message || "An error occurred during sign in";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleOAuth = async (strategy: "oauth_google" | "oauth_github") => {
        if (!isLoaded) {
            console.log("Clerk not loaded yet");
            return;
        }
        console.log("Starting OAuth for:", strategy);
        setError(""); // Clear previous errors
        try {
            await signIn.authenticateWithRedirect({
                strategy,
                redirectUrl: "/sso-callback",
                redirectUrlComplete: "/dashboard",
            });
        } catch (err: any) {
            console.error("OAuth error:", err);

            // CHECK FOR "External Account Not Found"
            // This error happens when a new user tries to Sign In instead of Sign Up
            const errorCode = err.errors?.[0]?.code;
            if (errorCode === "external_account_not_found" || err.message?.includes("not found")) {
                setError("Account not found. Redirecting to Sign Up...");
                setTimeout(() => {
                    router.push("/sign-up");
                }, 1500);
                return;
            }

            const errorMessage = err.errors?.[0]?.longMessage || err.message || "An error occurred during social sign in";
            setError(errorMessage);
        }
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-background p-4 md:p-8">
            {/* Background Glow */}
            <div className="absolute inset-0 z-0">
                <Glow variant="center" />
            </div>

            <Link
                href="/"
                className="absolute left-4 top-4 md:left-8 md:top-8 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors group"
            >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span className="text-sm font-medium">Back</span>
            </Link>

            <div className="relative z-10 w-full max-w-[400px] space-y-6">
                <div className="flex flex-col items-center space-y-2 text-center">
                    <Link href="/" className="flex items-center gap-2 mb-6">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                            <Icons.logo className="h-6 w-6" />
                        </div>
                    </Link>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                        Welcome back
                    </h1>
                    <p className="text-muted-foreground">
                        Enter your email to sign in to your account
                    </p>
                </div>

                <div className="rounded-2xl border border-border/50 bg-card/50 p-6 backdrop-blur-xl shadow-2xl">
                    <div className="grid gap-6">
                        <form onSubmit={handleSubmit}>
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="email">Email</label>
                                    <input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <label className="text-sm font-medium leading-none" htmlFor="password">Password</label>
                                    <input
                                        id="password"
                                        placeholder="••••••••"
                                        type="password"
                                        autoCapitalize="none"
                                        autoComplete="current-password"
                                        autoCorrect="off"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background/50 px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    />
                                </div>
                                {error && (
                                    <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive border border-destructive/50">
                                        {error}
                                    </div>
                                )}
                                <Button variant="default" className="w-full" disabled={loading}>
                                    {loading ? "Signing in..." : "Sign In"}
                                </Button>
                            </div>
                        </form>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-muted" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground font-medium">
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <Button type="button" variant="outline" className="w-full" onClick={() => handleOAuth("oauth_github")}>
                                <Icons.gitHub className="mr-2 h-4 w-4" />
                                GitHub
                            </Button>
                            <Button type="button" variant="outline" className="w-full" onClick={() => handleOAuth("oauth_google")}>
                                <Icons.google className="mr-2 h-4 w-4" />
                                Google
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="px-8 text-center text-sm text-muted-foreground">
                    <Link
                        href="/sign-up"
                        className="hover:text-foreground underline underline-offset-4 transition-colors"
                    >
                        Don&apos;t have an account? Sign Up
                    </Link>
                </p>
            </div>
        </div>
    );
}
