"use client";
import Image from "next/image";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { FaTelegram } from "react-icons/fa";
import Button from "../Reusable/Button";
import Loader from "@/app/loader";
import { raleway } from "../Reusable/Font";
import { cinzel } from "../Reusable/Font";
const Hero = () => {
  const { userInfo, isLoading } = useTelegramAuth();

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="relative mt-[-20px] md:mt-0 w-screen h-screen  flex flex-col items-center justify-center bg-black">
      <Image
        width={1000}
        height={1000}
        src="/loader/background.png"
        alt="background"
        className="absolute top-[-60px] left-[-130px] rotate-180 w-full sm:max-w-[750px] max-h-[50vh] min-w-[100vw] object-cover scale-150"
      />

      <div className="z-10 font-raleway pt-20 text-center">
        <h1
          className={`${cinzel.className} text-5xl font-cinzel md:text-7xl  mb-4`}>
          CHAIN TRAIL <span className="mt-4 block">STUDIO</span>
        </h1>

        <p
          className={`${raleway.className} text-white font-lato max-w-[340px] sm:max-w-[600px] mb-8 text-md md:text-xl`}>
          Embark on Word Trail, where every level takes you a step closer to a
          unique nFT.
        </p>
        <Button
          href="/quests"
          className="flex px-8 mb-4 mx-auto text-xs gap-2 text-black bg-gold-500 hover:bg-gold-400 transition-colors duration-300 py-3 hover:scale-105">
          play now
        </Button>

        {userInfo ? (
          <Button
            href="/quests"
            className="flex mx-auto text-xs gap-2 md:text-2xl hover:scale-105">
            play now
            <span className="animate-pulse text-xl">
              <FaTelegram />
            </span>
          </Button>
        ) : (
          <Button
            href="https://t.me/ChainTrailBot"
            className="flex mx-auto text-xs gap-2 bg-black hover:bg-neutral-950 text-white border border-white transition-colors duration-300 hover:scale-105">
            Play on
            <span className="animate-pulse text-xl">
              <FaTelegram />
            </span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default Hero;
