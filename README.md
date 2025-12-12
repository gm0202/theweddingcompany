# 🎮 Interactive Kids Quiz App

A magical, fully interactive quiz application built for children, featuring immersive audio-visual effects, animations, and gamified elements. Built with **Next.js 15**, **Tailwind CSS**, and **Framer Motion**.

## Live Demo
https://theweddingcompany-eta.vercel.app/

## ✨ Key Features

### 🔊 Audio & Narration
- **Smart Narration**: The app reads every question aloud using a kid-friendly text-to-speech voice.
- **Interactive Sound Board** (Question 1): Clicking options triggers real animal sounds (Dog barking, Cat meowing, Pig oinking).

### 🎨 Visual & Immersive Sequences
- **Animated Popups** (Question 2): Selecting answers ("Shoes", "Ice Cream", "Book") reveals animated image clues that pop onto the screen.
- **Lava Flow Animation** (Question 3): Clicking a color triggers a full-screen liquid wave that flows down, simulating colorful lava/juice.
- **Starry Night Finale** (Question 4): Answering the final question transforms the entire app into a glowing, starry night sky.

### 🏆 Celebration
- **Grand Finale**: Completing the quiz triggers a "Yay!" cheering sound effect.
- **Confetti**: A multi-cannon confetti burst celebrates the score.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Particles**: [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Language**: TypeScript

## 🚀 Getting Started

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the app**:
   Visit http://localhost:3000

## 📂 Project Structure

- `src/app/page.tsx`: Contains the core quiz logic and all animation sequences (Lava, Stars, Audio).
- `src/components/ResultCard.tsx`: The final scorecard component with celebration effects.
- `public/sounds/`: Audio assets for narration and effects.
- `public/images/`: Visual assets for popups.
