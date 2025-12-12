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
    const qText = questions[currentQuestionIndex].question;
    const utterance = new SpeechSynthesisUtterance(qText);
    utterance.rate = 0.9;

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
        const preferredVoice = voices.find(v => v.lang.startsWith('en')) || voices[0];
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

      </div>
    </div>
  );
};

export default Home;
