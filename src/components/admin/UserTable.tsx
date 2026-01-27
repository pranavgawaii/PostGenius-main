"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatTimeAgo, formatCredits, truncateEmail } from "@/lib/adminHelpers";
import { ChevronLeft, ChevronRight, ArrowUpDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface User {
    id: string;
    email: string;
    plan: string;
    credits_remaining: number;
    total_generations: number;
    last_activity: string | null;
}

interface UserTableProps {
    users: User[];
}

export function UserTable({ users }: UserTableProps) {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof User; direction: 'asc' | 'desc' } | null>(null);
    const usersPerPage = 10;

    const handleSort = (key: keyof User) => {
        let direction: 'asc' | 'desc' = 'desc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
            direction = 'asc';
        }
        setSortConfig({ key, direction });
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (!sortConfig) return 0;
        const { key, direction } = sortConfig;

        const aValue = a[key] || '';
        const bValue = b[key] || '';

        if (aValue < bValue) return direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return direction === 'asc' ? 1 : -1;
        return 0;
    });

    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
    const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

    return (
        <Card className="border-border/50 dark:border-white/10 bg-white/50 dark:bg-white/[0.02] backdrop-blur-2xl overflow-hidden shadow-sm dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] border-t-white/[0.1]">
            <div className="p-4 border-b border-border/50 dark:border-white/5 flex flex-col md:flex-row gap-4 justify-between items-center bg-transparent dark:bg-white/[0.01]">
                <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="pl-9 bg-background/50 dark:bg-white/[0.03] border-border/50 dark:border-white/10 text-xs h-9 focus-visible:ring-primary/50"
                    />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {sortedUsers.length} total users
                </div>
            </div>

            <div className="overflow-x-auto">
                <Table>
                    <TableHeader className="bg-muted/50 dark:bg-white/[0.03]">
                        <TableRow className="hover:bg-transparent border-border/50 dark:border-white/10">
                            <TableHead className="w-[200px] cursor-pointer h-12 px-6" onClick={() => handleSort('email')}>
                                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
                                    User <ArrowUpDown className="w-3 h-3 opacity-30" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer h-12 px-6 text-center" onClick={() => handleSort('plan')}>
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground">
                                    Plan <ArrowUpDown className="w-3 h-3 opacity-30" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer h-12 px-6 text-center" onClick={() => handleSort('credits_remaining')}>
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
                                    Credits <ArrowUpDown className="w-3 h-3 opacity-30" />
                                </div>
                            </TableHead>
                            <TableHead className="cursor-pointer h-12 px-6 text-center" onClick={() => handleSort('total_generations')}>
                                <div className="flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
                                    Gens <ArrowUpDown className="w-3 h-3 opacity-30" />
                                </div>
                            </TableHead>
                            <TableHead className="text-right cursor-pointer h-12 px-6" onClick={() => handleSort('last_activity' as any)}>
                                <div className="flex items-center justify-end gap-2 text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground/60">
                                    Active <ArrowUpDown className="w-3 h-3 opacity-30" />
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {currentUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="h-32 text-center text-[10px] font-bold uppercase tracking-[0.2em] opacity-30">
                                    No records found matching your search
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/50 dark:hover:bg-white/[0.04] border-border/50 dark:border-white/5 transition-colors group">
                                    <TableCell className="py-4 px-6">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                                                {user.email}
                                            </span>
                                            <span className="text-[9px] text-muted-foreground font-medium">ID: {String(user.id).substring(0, 8)}...</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-center">
                                        <Badge
                                            variant="outline"
                                            className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0 border-border/50 dark:border-white/10",
                                                user.plan === 'pro' || user.plan === 'unlimited' ? "bg-primary/20 text-primary border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.1)]" : "bg-neutral-100 dark:bg-white/5 text-muted-foreground"
                                            )}
                                        >
                                            {user.plan}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-center text-[11px] font-black">
                                        <span className={cn(
                                            "tabular-nums",
                                            user.credits_remaining === 0 ? "text-rose-400" :
                                                user.credits_remaining <= 2 ? "text-amber-300" : "text-emerald-400"
                                        )}>
                                            {formatCredits(user.plan, user.credits_remaining)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="py-4 px-6 text-center text-[11px] font-black opacity-80 tabular-nums">{user.total_generations}</TableCell>
                                    <TableCell className="py-4 px-6 text-right text-[10px] font-bold opacity-40 group-hover:opacity-100 transition-opacity">
                                        {user.last_activity ? formatTimeAgo(user.last_activity) : 'Never'}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between p-4 border-t border-border/50 dark:border-white/5 bg-transparent dark:bg-white/[0.01]">
                    <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                        {indexOfFirstUser + 1}-{Math.min(indexOfLastUser, sortedUsers.length)} <span className="mx-1">/</span> {sortedUsers.length}
                    </p>
                    <div className="flex items-center gap-1.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-white/10 border border-transparent hover:border-white/10"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </Button>
                        <div className="bg-white/5 px-2.5 py-1 rounded border border-white/10">
                            <span className="text-[10px] font-black min-w-[30px] text-center">
                                {currentPage} <span className="text-muted-foreground/30 mx-0.5">/</span> {totalPages}
                            </span>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 hover:bg-white/10 border border-transparent hover:border-white/10"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            )}
        </Card>
    );
}
