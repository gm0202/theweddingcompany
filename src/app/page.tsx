"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResultCard } from "@/components/ResultCard";
import Image from "next/image";
import { motion, AnimatePresence } from 'framer-motion';

const questions = [
  { id: 1, question: "1. What sound does a cat make?", options: ["Bhau-Bhau", "Meow-Meow", "Oink-Oink"], correctAnswer: "Meow-Meow" },
  { id: 2, question: "2. What would you probably find in your fridge?", options: ["Shoes", "Ice Cream", "Books"], correctAnswer: "Ice Cream" },
  { id: 3, question: "3. What color are bananas?", options: ["Blue", "Yellow", "Red"], correctAnswer: "Yellow" },
  { id: 4, question: "4. How many stars are in the sky?", options: ["Two", "Infinite", "One Hundred"], correctAnswer: "Infinite" },
];

const Home = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [highlightedOption, setHighlightedOption] = useState<number | null>(null);

  // Keep zoom logic
  useEffect(() => {
    document.body.style.transform = "scale(0.75)";
    document.body.style.transformOrigin = "top left";
    document.body.style.width = "133.33%";
  }, []);

  // Use white background for result page
  useEffect(() => {
    if (showResult) {
      document.body.style.background = "white";
      document.documentElement.style.background = "white";
    } else {
      document.body.style.background = "";
      document.documentElement.style.background = "";
    }
  }, [showResult]);

  // 🔊 Audio Narration Sequence for First Question
  useEffect(() => {
    // Only run for the first question and if not showing result
    if (currentQuestionIndex !== 0 || showResult) {
      setHighlightedOption(null);
      window.speechSynthesis.cancel();
      return;
    }

    let isCancelled = false;
    const utterance = new SpeechSynthesisUtterance("What sound does a cat make?");
    utterance.rate = 0.9; // Slightly slower for clarity

    // Audio instances
    const dogAudio = new Audio('/sounds/Dog Barking.mp3');
    const catAudio = new Audio('/sounds/Cat Sound.mp3');
    const pigAudio = new Audio('/sounds/pig-oink-47167.mp3');

    // Sequence Helper
    const playSequence = () => {
      if (isCancelled) return;

      // 1. Highlight Option 1 (Dog) & Play Sound
      setHighlightedOption(0);
      dogAudio.play().catch(e => console.error("Audio play failed", e));

      dogAudio.onended = () => {
        if (isCancelled) return;
        // 2. Highlight Option 2 (Cat) & Play Sound
        setHighlightedOption(1);
        catAudio.play().catch(e => console.error("Audio play failed", e));

        catAudio.onended = () => {
          if (isCancelled) return;
          // 3. Highlight Option 3 (Pig) & Play Sound
          setHighlightedOption(2);
          pigAudio.play().catch(e => console.error("Audio play failed", e));

          pigAudio.onended = () => {
            if (isCancelled) return;
            setHighlightedOption(null); // End sequence
          };
        };
      };
    };

    utterance.onend = playSequence;

    // Start Narration
    // Small delay to ensure clean start
    const timer = setTimeout(() => {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      window.speechSynthesis.cancel();
      dogAudio.pause(); dogAudio.currentTime = 0;
      catAudio.pause(); catAudio.currentTime = 0;
      pigAudio.pause(); pigAudio.currentTime = 0;
    };
  }, [currentQuestionIndex, showResult]);

  const currentQuestion = questions[currentQuestionIndex];

  const calculateScore = () =>
    questions.reduce(
      (score, q) => score + (answers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );

  return (
    <div
      className={`relative mx-auto transition-all duration-500 ${!showResult ? "rounded-[3rem] shadow-xl" : ""
        }`}
      style={{
        width: showResult ? "100%" : "calc(100% - 12rem)",
        maxWidth: showResult ? "100%" : "1600px",
        margin: showResult ? "0" : "3rem auto",

        // QUIZ PAGE = blurry glass
        background: showResult ? "white" : "rgba(255, 255, 255, 0.3)",
        backdropFilter: showResult ? "none" : "blur(20px)",
        WebkitBackdropFilter: showResult ? "none" : "blur(20px)",

        padding: showResult ? "0" : "0.5cm 1cm",
        minHeight: showResult ? "100vh" : "auto"
      }}
    >
      <div className="relative w-full">

        {/* Inner White Card on Quiz Only */}
        <div
          className={`${!showResult
            ? "bg-white rounded-3xl shadow-2xl pt-10 pb-12 px-14"
            : "h-screen flex items-center justify-center bg-white"
            } relative z-10 transition-all duration-500`}
        >

          <AnimatePresence mode="wait">
            {!showResult ? (
              <motion.div
                key="quiz"
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="w-full"
              >
                {/* Title */}
                <div className="text-center mb-10">
                  <h1 className="text-6xl font-serif italic text-teal-900 font-bold mb-3">
                    Test Your Knowledge
                  </h1>
                  <p className="text-gray-800 text-lg font-medium">
                    Answer all questions to see your results
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="flex gap-2 mb-10 max-w-2xl mx-auto w-full">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className={`h-1 rounded flex-1 ${idx <= currentQuestionIndex ? "bg-teal-700" : "bg-gray-200"
                        }`}
                    ></div>
                  ))}
                </div>

                {/* Question Section */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 max-w-3xl mx-auto w-full"
                  >
                    <div className="bg-cyan-100 rounded-xl p-5 text-center">
                      <p className="text-gray-900 text-xl font-bold">
                        {currentQuestion.question}
                      </p>
                    </div>

                    {currentQuestion.options.map((option, idx) => (
                      <div
                        key={option}
                        onClick={() =>
                          setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))
                        }
                        className={`rounded-xl p-5 text-center cursor-pointer transition-all duration-300 ${answers[currentQuestion.id] === option
                            ? "bg-cyan-100"
                            : "bg-gray-50"
                          } ${idx === highlightedOption
                            ? "ring-4 ring-yellow-400 scale-105 bg-yellow-100 shadow-xl"
                            : ""
                          }`}
                      >
                        <p className="text-gray-900 text-lg font-semibold">{option}</p>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-end gap-4 mt-10 max-w-3xl mx-auto w-full">
                  <button
                    onClick={() =>
                      setCurrentQuestionIndex((i) => Math.max(i - 1, 0))
                    }
                    disabled={currentQuestionIndex === 0}
                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    onClick={() => {
                      if (answers[currentQuestion.id]) {
                        if (currentQuestionIndex < questions.length - 1) {
                          setCurrentQuestionIndex(currentQuestionIndex + 1);
                        } else {
                          setShowResult(true);
                        }
                      }
                    }}
                    disabled={!answers[currentQuestion.id]}
                    className="w-12 h-12 rounded-full bg-cyan-200 flex items-center justify-center disabled:opacity-50"
                  >
                    <ChevronRight />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* RESULT PAGE — just clean full white background */
              <ResultCard
                score={calculateScore()}
                total={questions.length}
                onRestart={() => {
                  setAnswers({});
                  setCurrentQuestionIndex(0);
                  setShowResult(false);
                }}
              />
            )}
          </AnimatePresence>
        </div>

        {/* Cat Paw Only on First Question */}
        <AnimatePresence>
          {currentQuestionIndex === 0 && !showResult && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute left-6 bottom-2 flex flex-col items-center z-20"
            >
              {/* Speech Bubble */}
              <div className="relative bg-white rounded-2xl px-6 py-3 shadow-lg mb-2">
                <p className="text-gray-800 font-medium whitespace-nowrap">
                  Best of Luck!
                </p>
                <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-8 border-r-8 border-t-12 border-t-white"></div>
              </div>

              {/* Paw GIF */}
              <div className="relative w-32 h-32 flex items-end justify-center">
                <Image
                  src="/cat-paw.gif"
                  alt="Paw"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Home;
