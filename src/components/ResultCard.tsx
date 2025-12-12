"use client";

import { motion, animate, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";

interface ResultCardProps {
    score: number;
    total: number;
    onRestart: () => void;
}

export function ResultCard({ score, total, onRestart }: ResultCardProps) {
    const percentage = Math.round((score / total) * 100);
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));

    // 🏆 Celebration Effect
    useEffect(() => {
        // 1. Play "Yay" Sound
        const audio = new Audio('/sounds/children-saying-yay-praise-and-worship-jesus-299607.mp3');
        audio.volume = 0.6;
        audio.play().catch(e => console.error("Audio play failed:", e));

        // 2. Burst Confetti
        const end = Date.now() + 1000;
        const colors = ['#bb0000', '#ffffff'];

        (function frame() {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: colors
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: colors
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        }());

        // Big center burst too
        confetti({
            particleCount: 150,
            spread: 100,
            origin: { y: 0.6 }
        });

    }, []);

    useEffect(() => {
        const controls = animate(count, percentage, {
            duration: 2,
            ease: "easeOut",
        });
        return controls.stop;
    }, [count, percentage]);

    return (
        <motion.div
            key="result-card"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="
                w-full h-screen 
                flex flex-col items-center justify-center
                bg-white   /* PURE WHITE BACKGROUND */
                text-center
            "
        >
            {/* Subheader Pill */}
            <div className="bg-white rounded-lg py-3 px-8 mb-10 shadow-sm border border-gray-200">
                <span className="text-[#0B1B21] font-bold text-lg">Keep Learning!</span>
            </div>

            {/* Title */}
            <h2
                className="mb-6"
                style={{
                    fontFamily: '"DM Serif Display", serif',
                    fontWeight: 600,
                    fontStyle: "italic",
                    fontSize: "60px",
                    lineHeight: "100%",
                    letterSpacing: "-2px",
                    background: "linear-gradient(90deg, #0B1B21 0%, #2A8CB0 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                }}
            >
                Your Final score is
            </h2>

            {/* Big Score Percentage */}
            <div className="flex items-baseline justify-center mb-12">
                <motion.span
                    style={{
                        fontFamily: '"DM Serif Display", serif',
                        fontWeight: 900,
                        fontSize: "150px",
                        lineHeight: 1,
                        background: "linear-gradient(90deg, #0B1B21 0%, #2A8CB0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    {rounded}
                </motion.span>

                <span
                    style={{
                        fontFamily: '"DM Serif Display", serif',
                        fontSize: "60px",
                        fontStyle: "italic",
                        background: "linear-gradient(90deg, #0B1B21 0%, #2A8CB0 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginLeft: "12px",
                    }}
                >
                    %
                </span>
            </div>

            {/* Restart Button */}
            <button
                onClick={onRestart}
                className="
                    px-12 py-4 
                    bg-[#D0F0FA] hover:bg-[#BDEAF8] 
                    text-[#0B1B21] 
                    rounded-[12px] 
                    font-extrabold text-lg
                    transition-all
                    shadow-sm
                "
            >
                Start Again
            </button>
        </motion.div>
    );
}
