"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface OptionButtonProps {
    text: string;
    selected: boolean;
    onClick: () => void;
}

export function OptionButton({ text, selected, onClick }: OptionButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.005 }}
            whileTap={{ scale: 0.995 }}
            onClick={onClick}
            className={cn(
                "w-[896px] h-[78px] rounded-[10px] text-lg font-medium transition-all duration-200 border flex items-center justify-center relative overflow-hidden",
                // Removing generic tailwind padding to use style overrides, or using arbitrary values
                "box-border",
                selected
                    ? "text-[#15313D] font-bold"
                    : "text-[#15313D]"
            )}
            style={{
                // Auto layout with flex centering (handled by classNames mostly, but enforcing height/width)
                width: "896px",
                height: "78px",
                padding: "0 24px", // Normal padding
                background: selected
                    ? "rgba(60, 171, 218, 0.1)"
                    : "linear-gradient(90deg, rgba(240, 250, 255, 0.5) 0%, rgba(250, 253, 255, 0.5) 100%)", // Very faint
                border: selected
                    ? "1px solid #3CABDA"
                    : "1px solid rgba(190, 230, 255, 0.4)", // Soft baby blue border
            }}
        >
            <span className="truncate max-w-full text-center">
                {text}
            </span>
        </motion.button>
    );
}
