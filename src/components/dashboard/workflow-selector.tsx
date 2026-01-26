"use client";

import { workflows, WorkflowType } from "@/lib/workflows";
import { WorkflowCard } from "./workflow-card";

interface WorkflowSelectorProps {
    selectedWorkflow: WorkflowType | null;
    onSelect: (id: WorkflowType) => void;
}

export function WorkflowSelector({ selectedWorkflow, onSelect }: WorkflowSelectorProps) {
    return (
        <div className="space-y-6">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-2xl font-bold tracking-tight">Choose Your Workflow</h2>
                <p className="text-muted-foreground">Select what you want to create today</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
                {/* Top Row: 3 Items */}
                {workflows.slice(0, 3).map((workflow) => (
                    <WorkflowCard
                        key={workflow.id}
                        workflow={workflow}
                        isSelected={selectedWorkflow === workflow.id}
                        onClick={() => onSelect(workflow.id)}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
                {/* Bottom Row: 2 Items Centered */}
                {workflows.slice(3, 5).map((workflow) => (
                    <WorkflowCard
                        key={workflow.id}
                        workflow={workflow}
                        isSelected={selectedWorkflow === workflow.id}
                        onClick={() => onSelect(workflow.id)}
                    />
                ))}
            </div>
        </div>
    );
}
