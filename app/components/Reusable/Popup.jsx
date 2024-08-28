"use client";
import Image from "next/image";
import Button from "./Button";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";

export const Success = () => {
     const [isVisible, setIsVisible] = useState(true);
     const [isAnimating, setIsAnimating] = useState(false);

     useEffect(() => {
       // Start the animation after a short delay
       const animationTimer = setTimeout(() => setIsAnimating(true), 100);

       // Hide the component after the animation
       const visibilityTimer = setTimeout(() => setIsVisible(false), 1500);

       return () => {
         clearTimeout(animationTimer);
         clearTimeout(visibilityTimer);
       };
     }, []);

     if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black  font-bold text-lg">
      <div className="relative w-screen h-screen ">
        <Image
          src="/btn/success.png"
          alt="success background"
          width={1000}
          height={1000}
          className="absolute inset-0 w-full h-full "
        />
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Image
              src="/coins.png"
              alt="coins"
              width={1000}
              height={1000}
              className="w-[70%] mx-auto"
            />
            <h1 className="text-3xl font-extrabold mb-4 mx-auto text-green-500">
              Correct!
            </h1>
            <div className="text-xl  max-w-[300px]">
              You picked the right answer and you earned +1000 coins
            </div>
            <div
              className={`fixed left-1/2 transform -translate-x-1/2 flex items-center justify-center
                     transition-all duration-1000 ease-in-out
                     ${
                       isAnimating ? "top-0 opacity-0" : "top-1/2 opacity-100"
                     }`}>
              <Image
                src="/coins.png"
                alt="coins"
                width={20}
                height={20}
                className="w-[20px]"
              />
              <div className="text-yellow-500 ml-2">+1000</div>
            </div>{" "}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Wrong = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white font-bold text-lg">
      <div className="relative w-screen h-screen ">
        <Image
          src="/btn/success.png"
          alt="success background"
          width={1000}
          height={1000}
          className="absolute inset-0 w-full h-full "
        />
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <Image
              src="/coins.png"
              alt="coins"
              width={1000}
              height={1000}
              className="w-[70%] mx-auto"
            />
            <h1 className="text-3xl font-extrabold mb-4 mx-auto">Oops!</h1>

            <div className="text-xl  max-w-[300px]">
              You picked the wrong answer and earned +0 points
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Complete = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    const timer = setTimeout(() => setShowConfetti(false), 8000);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black text-white font-bold text-lg">
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={200}
          gravity={0.1}
          colors={["#ffdd00", "#ff00cc", "#00ffcc"]}
        />
      )}

      <div className="relative w-screen h-screen">
        <Image
          src="/btn/success.png"
          alt="success background"
          width={1000}
          height={1000}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-gray-950 bg-opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white max-w-md">
            <Image
              src="/coins.png"
              alt="coins"
              width={1000}
              height={1000}
              className="w-[60%] mx-auto"
            />
            <div className="flex gap-2 justify-around items-center">
              <img src="../star.svg" alt="Chain Coins" className="w-8 h-8" />
              <h1 className="text-5xl font-extrabold mb-4 mx-auto">
                QUEST COMPLETED
              </h1>
              <img src="../star.svg" alt="Chain Coins" className="w-8 h-8" />
            </div>

            <div className="text-base px-8 font-normal">
              <p>Mint exclusive NFT when you reach a total of 20,000 points.</p>
            </div>

            <div className="flex gap-6 items-center justify-center">
              <div>
                <div className="text-xs gap-1 flex items-center">
                  <img
                    src="../chaincoins.svg"
                    alt="Chain Coins"
                    className="w-16 h-16"
                  />
                  <span className="text-2xl">40</span>
                </div>
              </div>
              <div className=" gap-1 text-2xl flex items-center">
                <img
                  src="../ticket.png"
                  alt="Play Pass"
                  className="w-16 h-16"
                />
                <span className="text-gold-500">2</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center text-xs gap-3 my-6">
              <Button
                href="/quests"
                className="bg-neutral-950 text-gold-500 hover:scale-95 z-10 py-3 border border-none w-48">
                Collection
              </Button>
              <Button
                href="/quests"
                className="bg-gold-500 text-black py-3 w-48 hover:scale-95">
                Next Quest
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
