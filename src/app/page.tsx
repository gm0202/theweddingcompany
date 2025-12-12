"use client";

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ResultCard } from "@/components/ResultCard";
import Image from "next/image";

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

  // 🔥 Keep only the zoom logic (fullscreen removed)
  useEffect(() => {
    document.body.style.transform = "scale(0.75)";
    document.body.style.transformOrigin = "top left";
    document.body.style.width = "133.33%";
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const calculateScore = () =>
    questions.reduce(
      (score, q) => score + (answers[q.id] === q.correctAnswer ? 1 : 0),
      0
    );

  return (
    <div
      className="relative mx-auto rounded-[3rem] shadow-xl"
      style={{
        width: "calc(100% - 12rem)",
        maxWidth: "1600px",
        margin: "3rem auto",
        background: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        padding: "0.5cm 1cm"
      }}
    >
      <div className="relative w-full">

        {/* Main White Card */}
        <div className="bg-white rounded-3xl shadow-2xl pt-10 pb-12 px-14 relative">

          {!showResult ? (
            <>
              {/* Title */}
              <div className="text-center mb-10">
                <h1 className="text-6xl font-serif italic text-teal-700 mb-3">
                  Test Your Knowledge
                </h1>
                <p className="text-gray-600 text-lg">
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
              <div className="space-y-4 max-w-3xl mx-auto w-full">
                <div className="bg-cyan-100 rounded-xl p-5 text-center">
                  <p className="text-gray-800 text-xl font-medium">
                    {currentQuestion.question}
                  </p>
                </div>

                {currentQuestion.options.map((option) => (
                  <div
                    key={option}
                    onClick={() =>
                      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: option }))
                    }
                    className={`rounded-xl p-5 text-center cursor-pointer transition-all ${answers[currentQuestion.id] === option
                      ? "bg-cyan-100"
                      : "bg-gray-50"
                      }`}
                  >
                    <p className="text-gray-800 text-lg">{option}</p>
                  </div>
                ))}
              </div>

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
            </>
          ) : (
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
        </div>

        {/* 🔥 Cat Paw with Speech Bubble — positioned on the main canvas corner */}
        <div className="absolute left-6 bottom-2 flex flex-col items-center z-20">

          {/* Speech Bubble */}
          <div className="relative bg-white rounded-2xl px-6 py-3 shadow-lg mb-2">
            <p className="text-gray-800 font-medium whitespace-nowrap">
              Best of Luck!
            </p>
            <div className="absolute -bottom-3 left-8 w-0 h-0 border-l-8 border-r-8 border-t-12 border-t-white"></div>
          </div>

          {/* Cat Paw GIF */}
          <div className="relative w-32 h-32 flex items-end justify-center">
            <Image
              src="/cat-paw.gif"
              alt="Paw"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>

        </div>

      </div>
    </div>
  );
};

export default Home;
