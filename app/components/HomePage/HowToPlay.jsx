"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../Reusable/Button";

const steps = [
  {
    step: "STEP 1",
    image: "coinsPana.svg",
    title: "Connect Wallet or Click Play on Telegram to get started",
  },
  {
    step: "STEP 2",
    image: "mainNft1.svg",
    title:
      "Choose a Quest from the list to begin the Trail Adventure and Start earning",
  },
  {
    step: "STEP 3",
    image: "/loader/loader3.png",
    title:
      "Think, Tap, Win . Earn points and NFTs for getting the correct word that represents the 4 pictures in the Quest.",
  },
  {
    step: "STEP 4",
    image: "mainNft2.svg",
    title:
      "Earn exclusive NFTs for completing a quest correctly at a go without failing!!",
  },
  {
    step: "STEP 5",
    image: "/coinbag.png",
    title: "Claim FREE Points and game Passes for Logging into the game daily.",
  },
  {
    step: "STEP 6",
    image: "mainNft3.svg",
    title: "Refer friends and earn more points.",
  },
];

const HowToPlay = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStepIndex((prevIndex) =>
        prevIndex === steps.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Change step every 2 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 max-w-xs mx-auto text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">HOW TO PLAY</h1>
      <div className="p-3 bg-dark-900 rounded-xl">
        <h3 className="text-lg font-bold mb-2">
          {steps[currentStepIndex].step}
        </h3>
        <div className="relative w-full h-48 mb-4">
          <Image
            src={steps[currentStepIndex].image}
            alt={steps[currentStepIndex].title}
            layout="fill"
            objectFit="cover"
            className="rounded-lg"
          />
        </div>
        <p className="text-sm text-gray-300 leading-6 mb-6">
          {steps[currentStepIndex].title}
        </p>
      </div>
    </div>
  );
};

export default HowToPlay;
