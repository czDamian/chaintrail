"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../Reusable/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Autoplay } from "swiper/modules";

const Daily = () => {
  const gamesImg = [
    "/loader/gameInterface.jpg",
    "/loader/moreCoins.jpg",
    "/loader/dailyReward.jpg",
  ];

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobile(width < 500);
      setIsTablet(width >= 500 && width < 800);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slidesPerView = isMobile ? 1 : isTablet ? 2 : 3;

  return (
    <div className="my-20 py-20">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">GAMES</h1>
        <p className="text-lg text-gray-300">Think Tap & Win Points</p>
      </div>

      <div className="px-4 sm:px-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={slidesPerView}
          loop={true}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          className="mySwiper">
          {gamesImg.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="flex items-center justify-center">
                <Image
                  src={img}
                  alt={`Game ${index + 1}`}
                  width={200}
                  height={200}
                  className="object-contain"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="text-center mt-10">
        <Button
          className="bg-yellow-500 text-black py-3 px-6 rounded hover:scale-105 transition-transform duration-300"
          href="/quests">
          Play Now
        </Button>
      </div>
    </div>
  );
};

export default Daily;
