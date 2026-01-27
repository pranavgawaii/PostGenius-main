"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, ChevronLeft, ChevronRight, Plus, Clock, Linkedin, Twitter, Instagram, Facebook, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner"; // Assuming sonner is installed, or I'll use a simple alert/console for now if not.

// Mock data for initial state
const INITIAL_ACCOUNTS = [
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin, connected: false, color: 'text-blue-600', bg: 'bg-blue-600/10' },
    { id: 'twitter', name: 'Twitter', icon: Twitter, connected: false, color: 'text-sky-500', bg: 'bg-sky-500/10' },
    { id: 'instagram', name: 'Instagram', icon: Instagram, connected: false, color: 'text-pink-600', bg: 'bg-pink-600/10' },
    { id: 'facebook', name: 'Facebook', icon: Facebook, connected: false, color: 'text-blue-700', bg: 'bg-blue-700/10' },
];

export default function SchedulePage() {
    const [accounts, setAccounts] = useState(INITIAL_ACCOUNTS);
    const [isConnecting, setIsConnecting] = useState<string | null>(null);
    const [showConnectDialog, setShowConnectDialog] = useState(false);
    const [selectedPlatform, setSelectedPlatform] = useState<typeof INITIAL_ACCOUNTS[0] | null>(null);

    const handleConnect = (platformId: string) => {
        setIsConnecting(platformId);
        // Simulate API call
        setTimeout(() => {
            setAccounts(prev => prev.map(acc =>
                acc.id === platformId ? { ...acc, connected: true } : acc
            ));
            setIsConnecting(null);
            setShowConnectDialog(false);
        }, 1500);
    };

    const handleDisconnect = (platformId: string) => {
        setAccounts(prev => prev.map(acc =>
            acc.id === platformId ? { ...acc, connected: false } : acc
        ));
    };

    const openConnectModal = (platform: typeof INITIAL_ACCOUNTS[0]) => {
        setSelectedPlatform(platform);
        setShowConnectDialog(true);
    }

    return (
        <div className="space-y-6 pb-20 max-w-7xl mx-auto px-4 pt-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-3xl font-black tracking-tight">Content Calendar</h1>
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">Beta</Badge>
                    </div>
                    <p className="text-muted-foreground">Plan and schedule your AI-generated posts in one place.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center border border-border/50 rounded-md bg-card/50 backdrop-blur-sm p-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronLeft className="w-4 h-4" /></Button>
                        <span className="text-sm font-semibold px-2 min-w-[100px] text-center">October 2025</span>
                        <Button variant="ghost" size="icon" className="h-8 w-8"><ChevronRight className="w-4 h-4" /></Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Main Calendar Grid */}
                <Card className="lg:col-span-3 p-6 border-border/50 bg-card/30 backdrop-blur-xl relative overflow-hidden min-h-[600px]">
                    <div className="grid grid-cols-7 gap-px mb-4 text-center">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-xs uppercase font-bold text-muted-foreground py-2">{day}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 lg:gap-4 auto-rows-[minmax(100px,1fr)]">
                        {/* Empty Previous Month Days */}
                        {[29, 30].map(day => (
                            <div key={day} className="p-3 border border-border/20 rounded-xl bg-muted/5 opacity-30">
                                <span className="text-sm font-medium text-muted-foreground">{day}</span>
                            </div>
                        ))}

                        {/* Current Month Days */}
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <div key={day} className={cn(
                                "p-3 border border-border/40 rounded-xl bg-card/50 relative hover:border-primary/30 transition-colors group min-h-[120px]",
                                day === 14 && "ring-1 ring-primary/50 bg-primary/5"
                            )}>
                                <span className={cn(
                                    "text-sm font-medium block mb-2",
                                    day === 14 && "text-primary font-bold"
                                )}>{day}</span>

                                {/* Connect Nudge for Empty State */}
                                {day === 10 && !accounts.some(a => a.connected) && (
                                    <div className="absolute inset-0 flex items-center justify-center p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button size="sm" variant="secondary" className="text-[10px] h-6" onClick={() => setShowConnectDialog(true)}>
                                            Connect to Post
                                        </Button>
                                    </div>
                                )}

                                {/* Mock Events (Only show if connected logic is loosely applied or just purely mock for now) */}
                                {day === 3 && <MockEvent platform="linkedin" time="10:00 AM" status="scheduled" />}
                                {day === 5 && <MockEvent platform="twitter" time="2:30 PM" status="published" />}
                                {day === 14 && <MockEvent platform="twitter" time="12:00 PM" status="scheduled" variant="primary" />}
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Sidebar List */}
                <div className="space-y-6">
                    {/* Connected Accounts Section */}
                    <Card className="p-5 border-border/50 bg-card/30 backdrop-blur-xl">
                        <h3 className="font-bold text-sm uppercase tracking-wider text-muted-foreground mb-4">Connected Accounts</h3>
                        <div className="space-y-3">
                            {accounts.map((account) => {
                                const Icon = account.icon;
                                return (
                                    <div key={account.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-border/20">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center", account.bg)}>
                                                <Icon className={cn("w-4 h-4", account.color)} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">{account.name}</span>
                                                <span className={cn("text-[10px] font-medium", account.connected ? "text-green-500" : "text-muted-foreground")}>
                                                    {account.connected ? "Connected" : "Not connected"}
                                                </span>
                                            </div>
                                        </div>
                                        {account.connected ? (
                                            <Button variant="ghost" size="icon" className="h-7 w-7 opacity-50 hover:opacity-100 hover:text-red-500" onClick={() => handleDisconnect(account.id)}>
                                                <div className="h-2 w-2 rounded-full bg-green-500" />
                                                <span className="sr-only">Disconnect</span>
                                            </Button>
                                        ) : (
                                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => openConnectModal(account)}>Connect</Button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </Card>

                    <Card className="p-5 border-border/50 bg-card/30 backdrop-blur-xl">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-primary" /> Upcoming
                        </h3>
                        <div className="space-y-4">
                            {/* Only show items if relevant account is connected */}
                            {accounts.find(a => a.id === 'twitter')?.connected ? (
                                <ScheduledItem title="The Future of AI Content" date="Oct 14, 12:00 PM" platform="twitter" status="Ready" />
                            ) : (
                                <div className="p-3 rounded-lg border border-dashed border-border/50 text-center text-sm text-muted-foreground py-8">
                                    Connect Twitter to see scheduled posts
                                </div>
                            )}

                            {accounts.find(a => a.id === 'linkedin')?.connected && (
                                <ScheduledItem title="5 Tips for React Devs" date="Oct 22, 10:30 AM" platform="linkedin" status="Draft" />
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Connection Dialog */}
            <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Connect {selectedPlatform?.name || "Account"}</DialogTitle>
                        <DialogDescription>
                            Link your {selectedPlatform?.name} account to enable auto-scheduling.
                        </DialogDescription>
                    </DialogHeader>

                    <div className="py-6 flex flex-col items-center justify-center space-y-4">
                        <div className={cn("w-20 h-20 rounded-full flex items-center justify-center bg-muted/20 animate-pulse")}>
                            {selectedPlatform && <selectedPlatform.icon className={cn("w-10 h-10", selectedPlatform.color)} />}
                        </div>
                        <p className="text-sm text-center text-muted-foreground">
                            Redirecting to {selectedPlatform?.name} secure login...
                        </p>
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowConnectDialog(false)}>Cancel</Button>
                        <Button onClick={() => selectedPlatform && handleConnect(selectedPlatform.id)} disabled={!!isConnecting}>
                            {isConnecting === selectedPlatform?.id ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Connecting...
                                </>
                            ) : (
                                "Authorize App"
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

        </div>
    );
}

// ... [MockEvent and ScheduledItem components remain the same]
function MockEvent({ platform, time, status, variant }: { platform: 'linkedin' | 'twitter' | 'instagram', time: string, status: string, variant?: 'primary' }) {
    const iconMap = {
        linkedin: Linkedin,
        twitter: Twitter,
        instagram: Instagram
    };
    const Icon = (iconMap[platform] || Calendar) as any;
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "p-1.5 rounded-md border text-[10px] space-y-1 cursor-pointer hover:scale-105 transition-transform",
                variant === 'primary'
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background/80 border-border shadow-sm text-foreground",
                status === 'published' && "opacity-60 grayscale"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <Icon className="w-3 h-3" />
                    <span className="font-semibold">{time}</span>
                </div>
            </div>
            <div className="truncate opacity-80 font-medium capitalize">
                {status} Post
            </div>
        </motion.div>
    )
}

function ScheduledItem({ title, date, platform, status }: { title: string, date: string, platform: string, status: string }) {
    return (
        <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-border/30">
            <div className={cn("w-1 h-full min-h-[40px] rounded-full",
                status === 'Ready' ? "bg-green-500" :
                    status === 'Scheduled' ? "bg-primary" : "bg-amber-500"
            )} />
            <div className="space-y-1 flex-1">
                <p className="text-sm font-semibold leading-none">{title}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{date}</span>
                    <span>•</span>
                    <span className="capitalize">{platform}</span>
                </div>
            </div>
        </div>
    )
}
