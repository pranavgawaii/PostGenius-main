"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/ui/icons";
import {
    LayoutDashboard,
    Calendar,
    BarChart3,
    Users,
    Settings,
    Layers,
    MessageSquare,
    LogOut,
    Sparkles,
    BookOpen,
    HelpCircle,
    ShieldAlert
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppSidebar({ className }: SidebarProps) {
    const pathname = usePathname();
    const { user } = useUser();

    const sidebarItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
        },
        {
            title: "Library",
            icon: BookOpen,
            href: "/dashboard/library",
        },
        {
            title: "Schedule",
            icon: Calendar,
            href: "/dashboard/schedule",
        },
        {
            title: "Analytics",
            icon: BarChart3,
            href: "/dashboard/analytics",
            badge: "Soon"
        },
        {
            title: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
        },
        {
            title: "Help & Support",
            icon: HelpCircle,
            href: "/dashboard/support",
        }
    ];

    const [dbUser, setDbUser] = useState<any>(null);

    useEffect(() => {
        async function fetchUserData() {
            if (!user) return;
            try {
                const res = await fetch('/api/user/me');
                const result = await res.json();
                if (result.success) {
                    setDbUser(result.data);
                }
            } catch (err) {
                console.error("Error fetching user data in sidebar:", err);
            }
        }
        fetchUserData();
    }, [user]);

    // Check for admin status in DB (primary) or Clerk public metadata (fallback)
    const isAdminFromDb = dbUser?.is_admin === true;
    const isAdminFromClerk = user?.publicMetadata?.role === 'admin' || user?.publicMetadata?.is_admin === true;
    const isAdmin = isAdminFromDb || isAdminFromClerk;

    if (isAdmin) {
        sidebarItems.push({
            title: "Admin Panel",
            icon: ShieldAlert,
            href: "/dashboard/admin",
        });
    }

    const isActive = (href: string) => {
        if (href === "/dashboard") {
            return pathname === "/dashboard";
        }
        return pathname.startsWith(href);
    };

    return (
        <div className={cn("pb-12 min-h-screen w-64 border-r border-border bg-card/30 backdrop-blur-xl hidden md:flex flex-col fixed left-0 top-0 h-full z-30", className)}>
            <div className="space-y-4 py-4 flex-1">
                <div className="px-3 py-2">
                    <Link href="/dashboard" className="flex items-center gap-2 px-4 mb-8">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Icons.logo className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">Post Genius</span>
                    </Link>
                    <div className="space-y-1">
                        {sidebarItems.map((item, index) => {
                            const active = isActive(item.href);
                            const isAdminItem = item.title === "Admin Panel";

                            return (
                                <div key={item.title}>
                                    {isAdminItem && (
                                        <div className="h-px bg-border my-4 mx-4 opacity-50" />
                                    )}
                                    <Button
                                        variant={active ? "secondary" : "ghost"}
                                        className={cn(
                                            "w-full justify-between group transition-all duration-200",
                                            active && "bg-secondary/80 text-primary font-semibold shadow-sm"
                                        )}
                                        asChild
                                        disabled={item.badge === "Soon" && item.title !== "Schedule"}
                                    >
                                        <Link href={item.href} className={cn(
                                            item.badge === "Soon" && item.title !== "Schedule" && "pointer-events-none opacity-60"
                                        )}>
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn(
                                                    "h-4 w-4 transition-colors",
                                                    active ? "text-primary" : "group-hover:text-primary"
                                                )} />
                                                {item.title}
                                            </div>
                                            {item.badge && (
                                                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-5 font-bold border-primary/20 text-muted-foreground bg-primary/5">
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* User Section */}
            {user && (
                <div className="p-4 mt-auto border-t border-border/40">
                    <div className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer">
                        <Avatar className="h-9 w-9 border border-primary/20">
                            <AvatarImage src={user.imageUrl} />
                            <AvatarFallback>{user.firstName?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">
                                {user.fullName || user.firstName}
                            </span>
                            <span className="text-xs text-muted-foreground truncate">
                                {isAdmin ? "Admin Account" : "Free Plan"}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
