"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { RepurposeInput } from "@/components/dashboard/repurpose-input";
import { PlatformPreview } from "@/components/dashboard/platform-preview";
import { GenerationProgress } from "@/components/dashboard/generation-progress";
import { ErrorAlert } from "@/components/dashboard/error-alert";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { TipsSection } from "@/components/dashboard/tips-section";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Crown, Sparkles, ArrowRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// New Workflows
import { WorkflowSelector } from "@/components/dashboard/workflow-selector";
import { GitHubReadmeOutput } from "@/components/dashboard/outputs/github-readme-output";
import { ResumeBulletsOutput } from "@/components/dashboard/outputs/resume-bullets-output";
import { StudyNotesOutput } from "@/components/dashboard/outputs/study-notes-output";
import { LinkedInPostOutput } from "@/components/dashboard/outputs/linkedin-post-output";
import { WorkflowType, workflows } from "@/lib/workflows";
import { validateInput } from "@/lib/workflowHelpers";
import { UpgradeBanner } from "@/components/dashboard/upgrade-banner";
import { PageLoader } from "@/components/ui/logo-loader";

export default function DashboardPage() {
    const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowType | null>(null);
    const [url, setUrl] = useState("");
    const [showResults, setShowResults] = useState(false);
    const [generatedData, setGeneratedData] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [validationError, setValidationError] = useState<string | null>(null);
    const [generations, setGenerations] = useState<any[]>([]);
    const [loadingGenerations, setLoadingGenerations] = useState(true);

    // Credit Warning State
    const [creditsRemaining, setCreditsRemaining] = useState<number | null>(null);
    const [userPlan, setUserPlan] = useState<string>('free');
    const [loadingUser, setLoadingUser] = useState(true);
    const resultsRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to results when they appear
    useEffect(() => {
        if (showResults && resultsRef.current) {
            // Delay slightly to allow the results to render and animations to start
            setTimeout(() => {
                resultsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 300); // Increased delay for stability
        }
    }, [showResults]);

    // Fetch generations on mount
    useEffect(() => {
        const fetchGenerations = async () => {
            // Artificial delay to ensure loader is seen (Premium Feel)
            const minLoadTime = 1500;
            const startTime = Date.now();

            try {
                const res = await fetch("/api/user/generations");
                if (res.ok) {
                    const data = await res.json();
                    setGenerations(data.data || data.generations || []);
                }
            } catch (error) {
                console.error("Failed to fetch generations", error);
            } finally {
                const elapsedTime = Date.now() - startTime;
                const remainingTime = Math.max(0, minLoadTime - elapsedTime);

                setTimeout(() => {
                    setLoadingGenerations(false);
                }, remainingTime);
            }
        };
        fetchGenerations();
    }, []);

    // Fetch user credits for the warning banner
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch("/api/user/me");
                if (res.ok) {
                    const data = await res.json();
                    if (data.success && data.data) {
                        setCreditsRemaining(data.data.credits_remaining);
                        setUserPlan(data.data.plan || data.data.plan_type || 'free');
                    }
                }
            } catch (e) {
                console.error("Failed to fetch user data for dashboard", e);
            } finally {
                setLoadingUser(false);
            }
        };
        fetchUserData();

        const handleRefresh = () => fetchUserData();
        window.addEventListener("refresh-user-data", handleRefresh);
        return () => window.removeEventListener("refresh-user-data", handleRefresh);
    }, []);

    // Failsafe: Ensure loader disappears after 10s no matter what
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoadingGenerations(false);
            setLoadingUser(false);
        }, 10000);
        return () => clearTimeout(timer);
    }, []);

    const handleGenerate = useCallback(async (targetUrl: string) => {
        if (!selectedWorkflow) {
            setError("Please select a workflow first");
            return;
        }

        const urlToUse = targetUrl || url;
        const valError = validateInput(selectedWorkflow, urlToUse);
        setValidationError(valError);

        if (valError && !valError.startsWith('💡')) {
            // Block if error, allow if just a warning
            return;
        }

        setLoading(true);
        setError(null);
        setGeneratedData(null);
        setShowResults(false);
        setCurrentStep(1);

        try {
            // Step 1: Checking Cache
            setTimeout(() => setCurrentStep(2), 2000);

            // Using existing endpoint but passing workflow type
            const res = await fetch("/api/generate-captions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    blogUrl: urlToUse,
                    workflow: selectedWorkflow
                }),
            });

            setTimeout(() => setCurrentStep(3), 5000);
            setTimeout(() => setCurrentStep(4), 10000);

            if (!res.ok) {
                const errData = await res.json();
                throw new Error(errData.error || "Generation failed");
            }

            const responseJson = await res.json();
            console.log('📦 Full API Response:', responseJson);

            const payload = responseJson.data;
            console.log('📦 Payload:', payload);
            console.log('📦 Payload.output:', payload?.output);

            // Handle output (Backend consistently sends 'output')
            const outputData = payload?.output || payload || responseJson.output;
            console.log('📦 Final outputData:', outputData);

            setGeneratedData(outputData);

            setShowResults(true);
            console.log('✅ showResults set to true, generatedData:', outputData);

            // Refetch generations to update history
            const resUpdated = await fetch("/api/user/generations");
            if (resUpdated.ok) {
                const dataUpdated = await resUpdated.json();
                setGenerations(dataUpdated.data || dataUpdated.generations || []);
            }

            // Trigger immediate header update (credits)
            window.dispatchEvent(new Event("refresh-user-data"));

        } catch (err: any) {
            console.error(err);
            setError(err.message || "An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
            setCurrentStep(0);
        }
    }, [url, selectedWorkflow]);

    useKeyboardShortcuts({
        onGenerate: () => handleGenerate(url),
        onFocusInput: () => {
            window.dispatchEvent(new CustomEvent("focus-repurpose-input", { detail: { focusInput: true } }));
        },
        onCloseModal: () => {
            setError(null);
            setShowResults(false);
        }
    });

    const currentWorkflowDef = workflows.find(w => w.id === selectedWorkflow);
    const showUpgradeBanner = creditsRemaining === 0 && userPlan !== 'unlimited' && userPlan !== 'pro';

    // --- Splash Screen Loader ---
    // Show loader while initial critical data (generations or user data) is fetching
    if (loadingGenerations || loadingUser) {
        return <PageLoader />;
    }

    return (
        <div className={cn(
            "space-y-2 pb-24 max-w-5xl mx-auto px-4",
            showUpgradeBanner ? "pt-0" : "pt-2"
        )}>

            {/* Zero Credits Banner */}
            <AnimatePresence>
                {showUpgradeBanner && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 24 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                    >
                        <UpgradeBanner />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <div className="text-center space-y-4 pt-0 pb-2">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/30 border border-secondary/50 text-[10px] font-medium text-muted-foreground backdrop-blur-sm"
                >
                    <Sparkles className="w-3 h-3 text-primary" />
                    AI Repurposing Engine v2.0
                </motion.div>

                <div className="flex flex-col items-center space-y-2">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tighter bg-gradient-to-b from-foreground to-foreground/60 bg-clip-text text-transparent text-center">
                        Turn any link into social gold.
                    </h1>

                    <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed text-center">
                        Paste an article, YouTube video, or blog URL. Our AI will instantly create viral posts for LinkedIn, X, and Instagram.
                    </p>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {!selectedWorkflow ? (
                    <motion.div
                        key="workflow-selector"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ type: "spring", duration: 0.5 }}
                        className="mb-8"
                    >
                        <WorkflowSelector
                            selectedWorkflow={selectedWorkflow}
                            onSelect={(id) => {
                                setSelectedWorkflow(id);
                                setError(null);
                                setValidationError(null);
                                setShowResults(false);
                            }}
                        />
                    </motion.div>
                ) : (
                    <motion.div
                        key="input-card"
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            stiffness: 100,
                            damping: 20
                        }}
                        className="relative z-10 max-w-3xl mx-auto"
                    >
                        {/* Premium Glow Effects */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 via-purple-500/30 to-primary/30 rounded-[2rem] blur-xl opacity-40 dark:opacity-30" />

                        <div className="relative flex flex-col items-center rounded-[2rem] bg-card/80 dark:bg-[#0A0A0A]/90 backdrop-blur-xl border border-gray-200 dark:border-white/10 shadow-xl overflow-hidden">

                            {/* Card Background Elements */}
                            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10" />
                            <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-black/5 dark:via-white/20 to-transparent" />

                            {/* Back Button */}
                            <button
                                onClick={() => setSelectedWorkflow(null)}
                                className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                                title="Change Workflow"
                            >
                                <ArrowRight className="w-4 h-4 rotate-180" />
                            </button>

                            <div className="w-full px-6 py-10 md:px-10 md:py-12 flex flex-col items-center text-center space-y-6">

                                {/* Dynamic Workflow Header */}
                                <div className="space-y-3">
                                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-secondary/50 border border-secondary text-[10px] font-medium text-secondary-foreground backdrop-blur-sm">
                                        <Sparkles className="w-2.5 h-2.5" />
                                        <span>AI Repurposing Engine v2.0</span>
                                    </div>

                                    <div className="flex flex-col items-center gap-2">
                                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/20">
                                            <Zap className="h-6 w-6" />
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70">
                                            {currentWorkflowDef?.name}
                                        </h2>
                                        <p className="text-base text-muted-foreground max-w-md">
                                            {currentWorkflowDef?.inputPlaceholder || "Paste your link below to get started."}
                                        </p>
                                    </div>
                                </div>

                                {/* Input Component */}
                                <div className="w-full max-w-xl transform transition-all">
                                    <RepurposeInput
                                        url={url}
                                        setUrl={setUrl}
                                        onGenerate={handleGenerate}
                                        isGenerating={loading}
                                        error={error || validationError}
                                    />
                                </div>

                                <ErrorAlert
                                    message={error || validationError}
                                    onDismiss={() => { setError(null); setValidationError(null); }}
                                    type={validationError?.startsWith('💡') ? 'warning' : (error?.includes("limit") ? "warning" : "error")}
                                />

                                <GenerationProgress
                                    currentStep={currentStep}
                                    isGenerating={loading}
                                    workflow={selectedWorkflow}
                                />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Tips Section (show only if no workflow or social media selected) */}
            {(!selectedWorkflow || selectedWorkflow === 'social_media') && (
                <ScrollReveal delay={0.1}>
                    <div className="mb-12">
                        <TipsSection onTryExample={(exampleUrl) => {
                            setSelectedWorkflow('social_media');
                            setUrl(exampleUrl);
                        }} />
                    </div>
                </ScrollReveal>
            )}

            {/* STEP 3: RESULTS DISPLAY (Conditional) */}
            {showResults && generatedData && (
                <div ref={resultsRef} className="scroll-mt-48">
                    <ScrollReveal delay={0.1}>
                        <div className="mb-12">
                            {selectedWorkflow === 'social_media' && (
                                <PlatformPreview visible={true} data={generatedData} />
                            )}
                            {selectedWorkflow === 'github_readme' && (
                                <GitHubReadmeOutput readme={generatedData} />
                            )}
                            {selectedWorkflow === 'resume' && (
                                <ResumeBulletsOutput bullets={generatedData} />
                            )}
                            {selectedWorkflow === 'notes' && (
                                <StudyNotesOutput notes={generatedData} />
                            )}
                            {selectedWorkflow === 'linkedin' && (
                                <LinkedInPostOutput post={generatedData} />
                            )}
                        </div>
                    </ScrollReveal>
                </div>
            )}
        </div>
    );
}
