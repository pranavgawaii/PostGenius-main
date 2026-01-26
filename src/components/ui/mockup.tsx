import React from "react";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

const mockupVariants = cva(
    "flex relative z-10 overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_50px_-12px_rgba(0,0,0,0.5)] border border-white/10 bg-card/50 backdrop-blur-sm",
    {
        variants: {
            type: {
                mobile: "rounded-[48px] max-w-[350px]",
                responsive: "rounded-xl",
            },
        },
        defaultVariants: {
            type: "responsive",
        },
    },
);

export interface MockupProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof mockupVariants> { }

const Mockup = React.forwardRef<HTMLDivElement, MockupProps>(
    ({ className, type, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(mockupVariants({ type, className }))}
            {...props}
        />
    ),
);
Mockup.displayName = "Mockup";

const frameVariants = cva(
    "bg-accent/5 flex relative z-10 overflow-hidden rounded-2xl",
    {
        variants: {
            size: {
                small: "p-2",
                large: "p-4",
            },
        },
        defaultVariants: {
            size: "small",
        },
    },
);

export interface MockupFrameProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof frameVariants> { }

const MockupFrame = React.forwardRef<HTMLDivElement, MockupFrameProps>(
    ({ className, size, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(frameVariants({ size, className }))}
            {...props}
        />
    ),
);
MockupFrame.displayName = "MockupFrame";

export { Mockup, MockupFrame };
