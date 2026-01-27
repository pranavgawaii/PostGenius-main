"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getWorkflowIcon, formatTimeAgo, truncateEmail } from "@/lib/adminHelpers";
import { ExternalLink } from "lucide-react";

interface Activity {
    id: string;
    user_email: string;
    workflow: string;
    url: string;
    created_at: string;
}

interface ActivityFeedProps {
    activities: Activity[];
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
    return (
        <Card className="border-border/50 dark:border-white/[0.05] bg-white/50 dark:bg-white/[0.01] backdrop-blur-md h-full">
            <CardHeader className="border-b border-border/50 dark:border-white/[0.03] py-2 px-4">
                <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 opacity-50">
                    <span>🔥</span> Recent Pulse
                </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
                <div className="max-h-[350px] overflow-y-auto divide-y divide-border/50 dark:divide-white/[0.02]">
                    {activities.length === 0 ? (
                        <div className="p-6 text-center text-[10px] font-bold uppercase tracking-widest opacity-20">
                            No active pulses
                        </div>
                    ) : (
                        activities.map((activity, index) => (
                            <motion.div
                                key={activity.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.03 }}
                                className="p-3 hover:bg-muted/50 dark:hover:bg-white/[0.02] transition-colors group"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <div className="h-7 w-7 shrink-0 flex items-center justify-center rounded-md bg-neutral-100 dark:bg-white/[0.05] text-sm">
                                            {getWorkflowIcon(activity.workflow)}
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-[11px] font-bold text-foreground leading-none break-all">
                                                {activity.user_email}
                                            </p>
                                            <p className="text-[9px] font-black uppercase tracking-tighter opacity-40 mt-0.5">
                                                {activity.workflow.replace('_', ' ')}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p className="text-[9px] font-bold opacity-30">
                                            {formatTimeAgo(activity.created_at)}
                                        </p>
                                        <a
                                            href={activity.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[9px] font-black text-primary hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            SOURCE <ExternalLink className="w-2 h-2" />
                                        </a>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
