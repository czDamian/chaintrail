"use client";
import Image from "next/image";
import Button from "../Reusable/Button";

const Daily = () => {
  const gamesImg = [
    "/loader/gameInterface.jpg",
    "/loader/moreCoins.jpg",
    "/loader/dailyReward.jpg",
  ];

  return (
    <div className="bg-[#151515] py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4 animate__animated">GAMES</h1>
        <p className="text-lg text-gray-300">Think. Tap. Win. Points </p>
      </div>

      <div className="flex flex-row flex-wrap justify-center max-w-[200px] sm:max-w-full mx-auto w-full gap-4">
        {gamesImg.map((gamesImg, index) => (
          <Image
            key={index}
            src={gamesImg}
            alt="Games"
            width={1000}
            height={1000}
            className="hover:scale-105 opacity-80 w-fit max-w-[180px] min-h-[400px] md:max-w-[200px] md:min-h-[450px]"
          />
        ))}
      </div>

      <div className="text-center mt-10">
        <Button
          className="bg-gold-500 text-xs md:text-lg hover:scale-105 text-black py-3"
          href="/quests">
          Play Now
        </Button>
      </div>
    </div>
  );
};

export default Daily;
