"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Download, Edit2, FileText, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface GitHubReadmeOutputProps {
    readme: string;
}

export function GitHubReadmeOutput({ readme }: GitHubReadmeOutputProps) {
    const [copied, setCopied] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(readme);

    const handleCopy = () => {
        navigator.clipboard.writeText(content);
        setCopied(true);
        toast.success("README copied to clipboard!");
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const blob = new Blob([content], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "README.md";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        toast.success("README.md downloaded!");
    };

    return (
        <Card className="max-w-4xl mx-auto border-border bg-card backdrop-blur-sm overflow-hidden shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-muted/30">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                        <FileText className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                        <CardTitle className="text-lg">GitHub README</CardTitle>
                        <p className="text-xs text-muted-foreground">{content.length} characters</p>
                    </div>
                </div>
                <Badge variant="outline" className="border-purple-500/30 text-purple-500 bg-purple-500/5">
                    Markdown
                </Badge>
            </CardHeader>

            <CardContent className="p-0">
                {isEditing ? (
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className="w-full h-[500px] p-6 bg-background text-foreground text-sm font-mono focus:outline-none resize-none"
                    />
                ) : (
                    <div className="p-6 max-h-[500px] overflow-y-auto prose prose-sm max-w-none dark:prose-invert bg-muted/10">
                        {/* Simple markdown rendering for now, can be upgraded to react-markdown later */}
                        <pre className="whitespace-pre-wrap font-mono text-sm text-foreground">
                            {content}
                        </pre>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex items-center justify-between p-4 border-t border-border bg-muted/30">
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    onClick={() => setIsEditing(!isEditing)}
                >
                    <Edit2 className="w-4 h-4" />
                    {isEditing ? "Preview" : "Edit Mode"}
                </Button>

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 border-border hover:bg-muted" onClick={handleDownload}>
                        <Download className="w-4 h-4" />
                        Download .md
                    </Button>
                    <Button size="sm" className="gap-2 bg-purple-600 hover:bg-purple-700 text-white" onClick={handleCopy}>
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? "Copied" : "Copy Code"}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
