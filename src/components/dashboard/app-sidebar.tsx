"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import {
    LayoutDashboard,
    Calendar,
    BarChart3,
    Users,
    Settings,
    Layers,
    MessageSquare,
    LogOut
} from "lucide-react";

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function AppSidebar({ className }: SidebarProps) {
    const pathname = usePathname();

    const sidebarItems = [
        {
            title: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard",
        },
        {
            title: "Library",
            icon: Layers,
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
        },
        {
            title: "Accounts",
            icon: Users,
            href: "/dashboard/accounts",
        },
        {
            title: "Settings",
            icon: Settings,
            href: "/dashboard/settings",
        },
    ];

    return (
        <div className={cn("pb-12 min-h-screen w-64 border-r border-border bg-card/30 backdrop-blur-xl hidden md:block fixed left-0 top-0 h-full z-30", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <Link href="/" className="flex items-center gap-2 px-4 mb-8">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <Icons.logo className="h-5 w-5" />
                        </div>
                        <span className="text-lg font-bold">Post Genius</span>
                    </Link>
                    <div className="space-y-1">
                        {sidebarItems.map((item) => (
                            <Button
                                key={item.href}
                                variant={pathname === item.href ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start gap-3",
                                    pathname === item.href && "bg-secondary text-primary font-medium"
                                )}
                                asChild
                            >
                                <Link href={item.href}>
                                    <item.icon className="h-4 w-4" />
                                    {item.title}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
