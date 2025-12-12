"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
    total: number;
    current: number;
}

export function ProgressBar({ total, current }: ProgressBarProps) {
    return (
        <div className="flex gap-2 w-full max-w-lg mx-auto mb-8">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full bg-gray-200 overflow-hidden"
                >
                    <motion.div
                        className={cn(
                            "h-full w-full origin-left bg-brand-dark",
                            i <= current ? "opacity-100" : "opacity-0"
                        )}
                        initial={false}
                        animate={{
                            scaleX: i <= current ? 1 : 0,
                        }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                    />
                </div>
            ))}
        </div>
    );
}
