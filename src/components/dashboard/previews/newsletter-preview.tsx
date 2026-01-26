"use client";

import { useUser } from "@clerk/nextjs";
import { Mail, ArrowRight } from "lucide-react";

export function NewsletterPreview({ content }: { content: string }) {
    const { user } = useUser();

    return (
        <div className="w-full max-w-2xl mx-auto bg-white text-slate-900 border border-slate-200 rounded-sm shadow-xl overflow-hidden font-serif">
            {/* Browser Header Mock */}
            <div className="bg-slate-100 border-b border-slate-200 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                </div>
                <div className="mx-auto bg-white rounded-md border border-slate-200 px-3 py-0.5 text-[10px] text-slate-400 w-64 text-center truncate">
                    Inbox — {user?.fullName || "Post Genius"}
                </div>
            </div>

            <div className="p-8">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                    <div className="text-xl font-black italic tracking-tighter text-primary">POST GENIUS</div>
                    <div className="text-xs text-slate-400 uppercase font-sans tracking-widest">Edition #42</div>
                </div>

                <div className="max-w-prose">
                    <h1 className="text-3xl font-bold mb-6 text-slate-800 leading-tight">
                        Your Weekly Content Digest
                    </h1>

                    <div className="text-lg leading-relaxed text-slate-600 space-y-4 whitespace-pre-wrap">
                        {content}
                    </div>

                    <div className="mt-10 p-6 bg-slate-50 border border-slate-100 rounded-lg text-center">
                        <p className="font-sans font-semibold text-slate-700 mb-2">Want more insights like this?</p>
                        <button className="bg-primary text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2 mx-auto hover:scale-105 transition-transform">
                            Subscribe to the full blog <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 p-8 text-center text-slate-500 text-xs font-sans">
                <p>© 2026 Post Genius. All rights reserved.</p>
                <div className="mt-2 flex justify-center gap-4 underline">
                    <span>Unsubscribe</span>
                    <span>Preferences</span>
                    <span>View in browser</span>
                </div>
            </div>
        </div>
    );
}
