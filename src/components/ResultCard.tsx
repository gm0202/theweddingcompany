"use client";

import { motion } from "framer-motion";

interface ResultCardProps {
    score: number;
    total: number;
    onRestart: () => void;
}

export function ResultCard({ score, total, onRestart }: ResultCardProps) {
    const percentage = Math.round((score / total) * 100);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="flex flex-col items-center justify-center p-8 bg-transparent"
        >
            {/* Subheader Pill */}
            <div className="bg-white rounded-lg py-3 px-8 inline-block mb-10 shadow-sm border border-gray-100">
                <span className="text-[#15313D] font-medium text-lg">Keep Learning!</span>
            </div>

            {/* Title */}
            <h2
                className="font-display italic mb-6"
                style={{
                    fontFamily: '"DM Serif Display", serif',
                    fontWeight: 400,
                    fontStyle: 'italic',
                    fontSize: '60px',
                    lineHeight: '100%',
                    letterSpacing: '-2px',
                    background: 'linear-gradient(90deg, #15313D 0%, #3CABDA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textAlign: 'center',
                }}
            >
                Your Final score is
            </h2>

            {/* Big Score Percentage */}
            <div className="flex items-baseline justify-center mb-12">
                <span
                    className="font-display font-bold"
                    style={{
                        fontSize: '150px',
                        lineHeight: '1',
                        background: 'linear-gradient(90deg, #15313D 0%, #3CABDA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    {percentage}
                </span>
                <span
                    className="font-display italic ml-4"
                    style={{
                        fontSize: '60px',
                        color: '#3CABDA',
                        // Or using gradient? Reference image shows symbol is lighter blue? 
                        // "62 %" in reference looks same gradient or solid teal.
                        // I will apply the gradient to be consistent.
                        background: 'linear-gradient(90deg, #15313D 0%, #3CABDA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
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
                    text-[#15313D] 
                    rounded-[12px] 
                    font-bold text-lg
                    transition-all
                    shadow-sm
                "
            >
                Start Again
            </button>
        </motion.div >
    );
}
