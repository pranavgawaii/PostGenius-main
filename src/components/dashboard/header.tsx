"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { Bell, HelpCircle, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { ShortcutsModal } from "./shortcuts-modal";
import { AppSidebar } from "./app-sidebar";
import { motion, AnimatePresence } from "framer-motion";

export function DashboardHeader() {
    const { user: clerkUser } = useUser();
    const [showShortcuts, setShowShortcuts] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [userData, setUserData] = useState<any>(null);

    // Close menu when resizing to desktop
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch user data via secure API (bypassing RLS)
    useEffect(() => {
        async function fetchUserData() {
            if (!clerkUser) return;

            try {
                const res = await fetch('/api/user/me');
                if (res.ok) {
                    const json = await res.json();
                    if (json.success && json.data) {
                        setUserData(json.data);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        }

        // Initial fetch
        fetchUserData();

        // Polling interval
        const interval = setInterval(fetchUserData, 5000);

        // Listen for instant refresh events (e.g., after generation)
        const handleRefresh = () => fetchUserData();
        window.addEventListener("refresh-user-data", handleRefresh);

        return () => {
            clearInterval(interval);
            window.removeEventListener("refresh-user-data", handleRefresh);
        };

    }, [clerkUser]);

    // Determine plan type
    const userPlan = (userData?.plan || userData?.plan_type || 'free').toLowerCase();
    const isUnlimited = userPlan.includes('unlimited') || userPlan.includes('pro');

    return (
        <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background/50 px-4 sm:px-6 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden text-muted-foreground hover:text-foreground"
                    onClick={() => setIsMobileMenuOpen(true)}
                >
                    <Menu className="h-6 w-6" />
                </Button>
                <h1 className="text-lg font-semibold md:hidden">My Dashboard</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
                <div className="hidden lg:flex items-center gap-4 mr-2">
                    <div className="flex items-center gap-3 bg-muted/50 px-3 py-1.5 rounded-full border border-border/50">
                        <span className="px-2 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                            {isUnlimited ? 'PRO' : userPlan.toUpperCase()}
                        </span>

                        <div className="flex items-center gap-1.5 border-l border-border/50 pl-3">
                            <span className="text-green-500 font-bold text-sm">
                                {isUnlimited ? '∞' : `${userData?.credits_remaining ?? 0}/5`}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {isUnlimited ? 'credits' : 'credits left'}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="hidden sm:block">
                    {/* Legacy counter container */}
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground hidden xs:flex"
                    onClick={() => setShowShortcuts(true)}
                >
                    <HelpCircle className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground hidden xs:flex">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-primary" />
                </Button>
                <div className="h-6 w-px bg-border hidden xs:block" />
                <ModeToggle />
                <UserButton afterSignOutUrl="/" />

                <ShortcutsModal isOpen={showShortcuts} onClose={() => setShowShortcuts(false)} />

                {/* Mobile Sidebar Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
                            />
                            <motion.div
                                initial={{ x: "-100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "-100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed inset-y-0 left-0 z-50 w-72 bg-card shadow-2xl md:hidden"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center justify-between p-4 border-b border-border">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                                <Menu className="h-5 w-5 rotate-90" />
                                            </div>
                                            <span className="text-lg font-bold">Post Genius</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                        >
                                            <X className="h-5 w-5" />
                                        </Button>
                                    </div>
                                    <div className="flex-1 overflow-y-auto">
                                        <AppSidebar className="w-full border-r-0 static h-auto" />
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </header>
    );
}
