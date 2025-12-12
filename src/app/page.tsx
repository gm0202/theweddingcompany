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
  const [popupImage, setPopupImage] = useState<string | null>(null);
  const [liquidColor, setLiquidColor] = useState<string | null>(null);
  const [showStarryNight, setShowStarryNight] = useState(false);

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

  // 🔊 Interactive Narration Sequences
  useEffect(() => {
    if (showResult) {
      setHighlightedOption(null);
      setPopupImage(null);
      window.speechSynthesis.cancel();
      return;
    }

    let isCancelled = false;
    // Strip "1. ", "2. " from the question text
    const qText = questions[currentQuestionIndex].question.replace(/^\d+\.\s*/, '');
    const utterance = new SpeechSynthesisUtterance(qText);
    utterance.rate = 0.8; // Slower for kids

    // Helper: Option Highlight + Popup Delay
    const runVisualSequence = async () => {
      if (isCancelled) return;
      const sequence = [
        { idx: 0, img: '/images/shoes.jpeg' },
        { idx: 1, img: '/images/ice-cream.jpeg' },
        { idx: 2, img: '/images/book.png' }
      ];

      for (const step of sequence) {
        if (isCancelled) break;
        setHighlightedOption(step.idx);
        setPopupImage(step.img);

        await new Promise(resolve => setTimeout(resolve, 2000)); // Show for 2s

        if (isCancelled) break;
        setPopupImage(null);
        await new Promise(resolve => setTimeout(resolve, 300)); // Short gap
      }
      if (!isCancelled) setHighlightedOption(null);
    };

    // Helper: Option Highlight + Audio
    const runAudioSequence = () => {
      if (isCancelled) return;
      const dogAudio = new Audio('/sounds/Dog Barking.mp3');
      const catAudio = new Audio('/sounds/Cat Sound.mp3');
      const pigAudio = new Audio('/sounds/pig-oink-47167.mp3');

      const playStep = (idx: number, audio: HTMLAudioElement, next: () => void) => {
        if (isCancelled) return;
        setHighlightedOption(idx);
        audio.play().catch(e => console.error(e));
        audio.onended = () => {
          if (!isCancelled) next();
        };
      };

      playStep(0, dogAudio, () =>
        playStep(1, catAudio, () =>
          playStep(2, pigAudio, () => {
            if (!isCancelled) setHighlightedOption(null);
          })
        )
      );
    };

    utterance.onend = () => {
      if (currentQuestionIndex === 0) runAudioSequence();
      else if (currentQuestionIndex === 1) runVisualSequence();
      // else: standard narration ends, do nothing
    };

    const startSpeaking = () => {
      if (isCancelled) return;
      window.speechSynthesis.cancel();

      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        // Try to find a softer/kid-friendly voice
        const preferredVoice = voices.find(v =>
          v.name.includes('Google US English') ||
          v.name.includes('Samantha') ||
          v.name.includes('Zira')
        ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

        if (preferredVoice) utterance.voice = preferredVoice;
      }

      window.speechSynthesis.speak(utterance);
    };

    // Voice Loading Check
    const timer = setTimeout(() => {
      if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.onvoiceschanged = null;
          startSpeaking();
        };
      } else {
        startSpeaking();
      }
    }, 500);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
      window.speechSynthesis.cancel();
      // @ts-ignore
      if (window.speechSynthesis.onvoiceschanged) window.speechSynthesis.onvoiceschanged = null;
      setHighlightedOption(null);
      setPopupImage(null);
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
                        onClick={() => {
                          setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }));

                          // 🔊 Play sound on selection for Question 1
                          if (currentQuestion.id === 1) {
                            if (option === "Bhau-Bhau") new Audio('/sounds/Dog Barking.mp3').play();
                            if (option === "Meow-Meow") new Audio('/sounds/Cat Sound.mp3').play();
                            if (option === "Oink-Oink") new Audio('/sounds/pig-oink-47167.mp3').play();
                          }

                          // 🌋 Lava Flow Animation for Question 3 (Bananas)
                          if (currentQuestion.id === 3) {
                            let color = null;
                            if (option === "Blue") color = "#3b82f6";   // blue-500
                            if (option === "Yellow") color = "#eab308"; // yellow-500
                            if (option === "Red") color = "#ef4444";    // red-500

                            if (color) {
                              setLiquidColor(color);
                              setTimeout(() => setLiquidColor(null), 4000);
                            }
                          }

                          // 🌌 Starry Night Animation for Question 4 (Stars)
                          if (currentQuestion.id === 4) {
                            setShowStarryNight(true);
                            setTimeout(() => {
                              setShowStarryNight(false);
                              setShowResult(true);
                            }, 4000); // 4 seconds of awe
                          }
                        }}
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
                    onClick={() => {
                      setHighlightedOption(null);
                      setCurrentQuestionIndex((i) => Math.max(i - 1, 0));
                    }}
                    disabled={currentQuestionIndex === 0}
                    className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center disabled:opacity-50"
                  >
                    <ChevronLeft />
                  </button>

                  <button
                    onClick={() => {
                      if (answers[currentQuestion.id]) {
                        setHighlightedOption(null);
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
                  setHighlightedOption(null);
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

        {/* 🖼️ Animated Popup Image (For Q2 Visual Sequence) */}
        <AnimatePresence>
          {popupImage && !showResult && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-white p-4 rounded-3xl shadow-2xl border-4 border-cyan-200">
                <Image
                  src={popupImage}
                  alt="Visual Clue"
                  width={300}
                  height={300}
                  className="rounded-xl object-cover"
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌋 Lava Flow Overlay */}
        <AnimatePresence mode="sync">
          {liquidColor && !showResult && (
            <motion.div
              key={liquidColor} // 🔑 Force re-render on color change
              initial={{ y: "-100%" }}
              animate={{ y: "200%" }} // Go further down to clear screen
              exit={{ opacity: 0 }}
              transition={{ duration: 4, ease: [0.4, 0, 0.2, 1] }} // Custom bezier for liquid feel
              className="fixed inset-0 z-50 pointer-events-none flex flex-col justify-end"
            >
              {/* Main Liquid Body */}
              <div
                className="w-full relative grow"
                style={{ backgroundColor: liquidColor }}
              >
                {/* Wavy Leading Edge (SVG) */}
                <div className="absolute -bottom-1 w-full translate-y-[99%]">
                  <svg viewBox="0 0 1440 320" className="w-full h-auto" preserveAspectRatio="none">
                    <path
                      fill={liquidColor}
                      fillOpacity="1"
                      d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
                      transform="scale(1, -1) translate(0, -320)" // Flip to point down
                    ></path>
                  </svg>
                  {/* Dripping effects (CSS pseudo-shapes for extra irregularity) */}
                  <div className="absolute top-0 left-[20%] w-16 h-32 rounded-full -translate-y-1/2" style={{ backgroundColor: liquidColor }}></div>
                  <div className="absolute top-0 right-[30%] w-24 h-40 rounded-full -translate-y-1/2" style={{ backgroundColor: liquidColor }}></div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🌌 Starry Night Overlay */}
        <AnimatePresence>
          {showStarryNight && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="fixed inset-0 z-[60] bg-black pointer-events-none"
            >
              {[...Array(50)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: [0.2, 1, 0.2],
                    scale: [1, 1.5, 1]
                  }}
                  transition={{
                    duration: Math.random() * 2 + 1,
                    repeat: Infinity,
                    delay: Math.random() * 2
                  }}
                  className="absolute bg-white rounded-full"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${Math.random() * 3 + 1}px`,
                    height: `${Math.random() * 3 + 1}px`,
                    boxShadow: "0 0 4px white"
                  }}
                />
              ))}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                  className="text-white text-3xl font-serif tracking-widest"
                >
                  The sky represents the infinite...
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

export default Home;
