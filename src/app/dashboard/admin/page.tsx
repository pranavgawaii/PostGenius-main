"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { StatCard } from "@/components/admin/StatCard";
import { ActivityFeed } from "@/components/admin/ActivityFeed";
import { UserTable } from "@/components/admin/UserTable";
import { getWorkflowIcon } from "@/lib/adminHelpers";
import { Loader2, ShieldAlert, Zap, Globe, Cpu, Database } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

export default function AdminDashboardPage() {
    const { user, isLoaded } = useUser();
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

    useEffect(() => {
        async function checkAdminAndFetchData() {
            if (!isLoaded || !user) return;

            try {
                const response = await fetch('/api/admin/stats');

                if (response.status === 403) {
                    setIsAdmin(false);
                    router.push('/dashboard');
                    return;
                }

                if (!response.ok) throw new Error('Failed to fetch stats');

                const result = await response.json();
                if (result.success) {
                    setStats(result.data);
                    setIsAdmin(true);
                } else {
                    throw new Error(result.error || 'Failed to fetch stats');
                }
            } catch (error) {
                console.error("Admin Page Error:", error);
            } finally {
                setLoading(false);
            }
        }

        checkAdminAndFetchData();

        // Auto-refresh every 30 seconds for live data
        const refreshInterval = setInterval(() => {
            if (isAdmin) {
                checkAdminAndFetchData();
            }
        }, 30000); // 30 seconds

        return () => clearInterval(refreshInterval);
    }, [user, isLoaded, router, isAdmin]);

    if (!isLoaded || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Initializing Admin Dashboard...</p>
            </div>
        );
    }

    if (isAdmin === false) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-center px-4">
                <div className="h-16 w-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mb-2">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold">Access Denied</h2>
                <p className="text-muted-foreground max-w-md">
                    You do not have administrative privileges to view this page.
                </p>
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <ShieldAlert className="w-10 h-10 text-destructive" />
                <p className="text-muted-foreground">Failed to load system metrics. Please try again.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        );
    }

    return (
        <div className="relative space-y-8 pb-20">
            {/* Premium Background Mesh */}
            <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden opacity-50">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[100px] rounded-full" />
            </div>

            {/* Header section with refined aesthetics */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-500/80">Live Engine Active</span>
                    </div>
                    <h1 className="text-4xl font-black tracking-tight bg-gradient-to-br from-foreground via-foreground to-foreground/30 bg-clip-text text-transparent">
                        System Control
                    </h1>
                </div>

                <div className="flex items-center gap-6 bg-white/50 dark:bg-white/[0.03] border border-border/50 dark:border-white/[0.05] p-1.5 rounded-full px-6 backdrop-blur-md">
                    <div className="flex flex-col items-end">
                        <span className="text-[9px] font-black uppercase opacity-40">System Health</span>
                        <div className="flex items-center gap-1.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[10px] font-bold">Optimal</span>
                        </div>
                    </div>
                    <div className="h-8 w-px bg-border/50 dark:bg-white/5" />
                    <LiveClock />
                    <div className="h-8 w-px bg-border/50 dark:bg-white/5" />
                    <Zap className="w-4 h-4 text-primary fill-primary/20" />
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-8">
                <TabsList className="bg-white/50 dark:bg-white/[0.03] border border-border/50 dark:border-white/10 p-1.5 rounded-full h-auto w-fit backdrop-blur-md">
                    <TabsTrigger value="overview" className="rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value="users" className="rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                        Users
                    </TabsTrigger>
                    <TabsTrigger value="infrastructure" className="rounded-full px-6 py-2.5 text-xs font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300">
                        Infrastructure
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-8 focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <StatCard title="Total Users" value={stats.stats.total_users} icon="👥" change={`+${stats.stats.new_users_today} today`} changeType="positive" delay={0.05} />
                        <StatCard title="Generations" value={stats.stats.total_generations} icon="📄" change={`+${stats.stats.generations_today} today`} changeType="positive" delay={0.1} />
                        <StatCard title="Active Session" value={stats.stats.active_users_today} icon="🔥" change="Live Now" changeType="neutral" delay={0.15} />
                        <StatCard title="Daily Burn" value={`$${((stats.apiCosts?.firecrawl_cost_today || 0) + (stats.apiCosts?.gemini_cost_today || 0)).toFixed(3)}`} icon="⚡" change="Burn Rate" changeType="negative" delay={0.2} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground opacity-70 h-5">
                                <Cpu className="w-3.5 h-3.5" /> Workload Distribution
                            </h2>
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-6 rounded-3xl bg-white/50 dark:bg-white/[0.02] border border-border/50 dark:border-white/[0.05] backdrop-blur-2xl shadow-sm dark:shadow-2xl"
                            >
                                <div className="space-y-6">
                                    {stats.costByWorkflow?.map((item: any) => (
                                        <div key={item.workflow} className="space-y-2">
                                            <div className="flex justify-between items-center text-[10px] uppercase font-black tracking-widest">
                                                <span className="flex items-center gap-2 opacity-70">
                                                    {getWorkflowIcon(item.workflow)} {item.workflow}
                                                </span>
                                                <span className="text-foreground font-black tabular-nums">
                                                    ${item.total_cost.toFixed(4)}
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${item.percentage}%` }}
                                                    transition={{ duration: 1, ease: "easeOut" }}
                                                    className="bg-gradient-to-r from-blue-500 via-primary to-purple-500 h-full rounded-full"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                        <div className="space-y-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground opacity-70 h-5">
                                <Globe className="w-3.5 h-3.5" /> High Impact Users
                            </h2>
                            <UserOverviewMini spenders={stats.topSpenders} />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="users" className="space-y-4 focus-visible:outline-none focus-visible:ring-0">
                    <UserTable users={stats.users} />
                </TabsContent>

                <TabsContent value="infrastructure" className="space-y-8 focus-visible:outline-none focus-visible:ring-0">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <StatCard title="API Costs (Gross)" value={`$${(stats.apiCosts?.total_cost || 0).toFixed(2)}`} icon="💵" change="Lifetime" changeType="neutral" delay={0.05} />
                        <StatCard title="Gemini 1.5 Usage" value={`$${(stats.apiCosts?.total_gemini_cost || 0).toFixed(4)}`} icon="🤖" change="LLM Cost" changeType="neutral" delay={0.1} />
                        <StatCard title="Firecrawl Scrapes" value={`$${(stats.apiCosts?.total_firecrawl_cost || 0).toFixed(4)}`} icon="🔥" change="Browser Tools" changeType="neutral" delay={0.15} />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-12 space-y-4">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 text-muted-foreground opacity-70 h-5">
                                <Database className="w-3.5 h-3.5" /> Live Activity Log
                            </h2>
                            <ActivityFeed activities={stats.recent_activity} />
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function UserOverviewMini({ spenders }: { spenders: any[] }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 rounded-3xl bg-white/50 dark:bg-white/[0.02] border border-border/50 dark:border-white/[0.05] backdrop-blur-2xl shadow-sm dark:shadow-2xl h-[284px]"
        >
            <div className="divide-y divide-border/50 dark:divide-white/[0.05]">
                {spenders?.map((spender: any, index: number) => (
                    <div key={spender.email} className="flex justify-between items-center py-3.5 first:pt-0 last:pb-0 group">
                        <div className="flex items-center gap-3">
                            <div className="h-6 w-6 rounded-full bg-neutral-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black opacity-50 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                {index + 1}
                            </div>
                            <span className="text-xs font-bold opacity-80 group-hover:opacity-100 transition-opacity">{spender.email}</span>
                        </div>
                        <div className="flex items-center gap-5">
                            <span className="text-[10px] font-black opacity-30 tabular-nums">{spender.generation_count} GENS</span>
                            <span className="text-sm font-black text-primary tabular-nums">${spender.total_spent.toFixed(3)}</span>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

function LiveClock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const istTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    }).format(time);

    return (
        <div className="flex flex-col items-end min-w-[80px]">
            <span className="text-[9px] font-black uppercase opacity-40">System Time (IST)</span>
            <span className="text-[11px] font-black tabular-nums tracking-tight text-primary">{istTime}</span>
        </div>
    );
}
