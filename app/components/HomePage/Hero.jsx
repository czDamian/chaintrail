"use client";
import Image from "next/image";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import Button from "../Reusable/Button";
import { raleway } from "../Reusable/Font";
import { useState, useEffect } from "react";

const Hero = () => {
  const { userInfo, isLoading } = useTelegramAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    // Check for mobile devices
    if (
      /android|iPhone|iPad|iPod|opera mini|IEMobile|WPDesktop/i.test(userAgent)
    ) {
      setIsMobile(true);
    } else {
      setIsMobile(false);
    }
  }, []);

  return (
    <div className="relative mt-[-20px] md:mt-0 w-screen h-screen  flex flex-col items-center justify-center">
      <Image
        width={1000}
        height={1000}
        src="/loader/background.png"
        alt="background"
        className="absolute top-[-20px] xs:top-[-60px] left-[-130px] md:left-[-300px] rotate-180 w-full sm:max-w-[350px] max-h-[50vh] min-w-[100vw] object-cover scale-150 md:scale-100"
      />

      <div className="z-10 font-raleway pt-20 text-center">
        <h1
          className={`text-5xl font-cinzel md:text-7xl  mb-4 bg-gradient-to-r from-green-500 from-20% to-gold-500 bg-clip-text font-extrabold text-transparent sm:text-5xl`}>
          CHAIN TRAIL <span className="block pt-2"> STUDIO</span>
        </h1>

        <p
          className={`${raleway.className} text-white font-lato max-w-[340px] sm:max-w-[600px] mb-8 text-md md:text-xl`}>
          Embark on Word Trail, where every level takes you a step closer to a
          unique nFT.
        </p>

        {userInfo ? (
          <Button
            href="/quests"
            className="flex px-8 mb-4 mx-auto text-xs gap-2 text-black bg-gold-500 hover:bg-gold-400 transition-colors font-bold duration-300 py-3 hover:scale-105">
            Play now
          </Button>
        ) : (
          <>
            {isMobile ? (
              <Button
                href="https://t.me/ChainTrailBot"
                className="flex mx-auto text-xs gap-0.5 hover:scale-105 border items-center">
                <span>Play on</span>
                <span className="animate-pulse">
                  <Image
                    src="telegram.svg"
                    height={100}
                    width={100}
                    alt="telegram"
                    className="w-6 "
                  />
                </span>
              </Button>
            ) : (
              <>
                <Button
                  href="/"
                  className="flex px-8 mb-4 mx-auto text-xs gap-2 text-black bg-gold-500 hover:bg-gold-400 transition-colors font-bold duration-300 py-3 hover:scale-105">
                  Connect Wallet
                </Button>
                <Button
                  href="https://t.me/ChainTrailBot"
                  className="flex mx-auto text-xs gap-3 hover:scale-105 px-12 border items-center">
                  <span>Play on</span>
                  <span className="animate-pulse">
                    <Image
                      src="telegram.svg"
                      height={100}
                      width={100}
                      alt="telegram"
                      className="w-6 "
                    />
                  </span>
                </Button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Hero;
