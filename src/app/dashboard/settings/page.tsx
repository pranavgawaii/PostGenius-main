"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Bell, Shield, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { ProfileSection } from "@/components/dashboard/settings/profile-section";
import { NotificationsSection } from "@/components/dashboard/settings/notifications-section";
import { SecuritySection } from "@/components/dashboard/settings/security-section";
import { PlanSection } from "@/components/dashboard/settings/plan-section";

type SettingsTab = "profile" | "notifications" | "security" | "plan";

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");

    const tabs = [
        { id: "profile", label: "Profile", icon: User },
        { id: "notifications", label: "Notifications", icon: Bell },
        { id: "security", label: "Security", icon: Shield },
        { id: "plan", label: "Plan", icon: Zap },
    ];

    return (
        <div className="space-y-8 pb-20 max-w-5xl mx-auto px-4 pt-8">
            <div>
                <h1 className="text-3xl font-black tracking-tight">Settings</h1>
                <p className="text-muted-foreground">Manage your account preferences and subscription.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-8">
                {/* Settings Sidebar */}
                <div className="md:w-64 flex-shrink-0">
                    <div className="sticky top-24 space-y-1">
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as SettingsTab)}
                                    className={cn(
                                        "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-sm"
                                            : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <Icon className={cn("w-4 h-4", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 min-w-0">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            {activeTab === "profile" && <ProfileSection />}
                            {activeTab === "notifications" && <NotificationsSection />}
                            {activeTab === "security" && <SecuritySection />}
                            {activeTab === "plan" && <PlanSection />}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
