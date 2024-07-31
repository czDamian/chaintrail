"use client";
import Image from "next/image";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { FaTelegram } from "react-icons/fa";
import Button from "../Reusable/Button";
import CustomLoader from "./CustomLoader";

const Hero = () => {
  const { userInfo, isLoading } = useTelegramAuth();

  if (isLoading) {
    return <CustomLoader />;
  }

  return (
    <div className="relative mt-[-20px] md:mt-0 w-screen h-screen  flex flex-col items-center justify-center bg-black">
      <Image
        width={1000}
        height={1000}
        src="/bg0.png"
        alt="background"
        className="absolute pt-4  max-w-[400px] max-h-[430px] sm:max-w-[750px] object-fill inset-0 w-full h-screen "
      />

      <div className="z-10 mt-[-150px] text-center">
        <h1 className="text-5xl md:text-7xl  mb-4">
          CHAIN TRAIL <span className="mt-4 block">STUDIO</span>
        </h1>

        <p className="text-white font-lato mb-12 mx-12 text-lg md:text-xl">
          Embark on Word Trails, learn about blockchain
        </p>
        <Button
          href="/quests"
          className="flex px-8 mb-4 mx-auto text-sm gap-2 text-black bg-yellow-500 hover:bg-yellow-400 transition-colors duration-300 py-3 hover:scale-105">
          play now
        </Button>

        {userInfo ? (
          <Button
            href="/quests"
            className="flex mx-auto text-sm gap-2 md:text-2xl hover:scale-105">
            play now
            <span className="animate-pulse text-xl">
              <FaTelegram />
            </span>
          </Button>
        ) : (
          <Button
            href="https://t.me/ChainTrailBot"
            className="flex mx-auto text-sm gap-2 bg-black hover:bg-neutral-950 text-white border border-white transition-colors duration-300 hover:scale-105">
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
