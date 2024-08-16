"use client";
import { useState, useEffect } from "react";

const QuestionLoader = () => {
  const [currentText, setCurrentText] = useState(0);
  const texts = [
    "Picking up from where you stopped",
    "Fetching questions",
    "Making sure everything is correct",
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % texts.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col justify-center items-center gap-0 z-50 pb-20 min-h-screen">
      <div className="hover:animate-background rounded-full  w-40 h-40 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 shadow-none transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] dark:shadow-gray-700/25 text-xs md:text-sm my-8 animate-spin hover:animate-spin">
        <div className="flex items-center justify-between gap-2  border border-green-900 rounded-full bg-gray-950 w-36 h-36 ml-2 mt-2"></div>
      </div>
      <div className="animate-pulse">{texts[currentText]}</div>
    </div>
  );
};

export default QuestionLoader;
