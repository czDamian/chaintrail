"use client";
import Image from "next/image";
import Button from "../Reusable/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle"; // Import Swiper styles
import { Pagination, Autoplay } from "swiper/modules";

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
        <p className="text-lg text-gray-300">Think. Tap. Win. Points</p>
      </div>

      <div className="px-4 sm:px-8">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            bulletElement: "div",
            bulletClass:
              "swiper-pagination-bullet rounded-full w-3 h-3 bg-gray-400 mr-2",
            bulletActiveClass: "bg-yellow-500",
          }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          className="mySwiper">
          {gamesImg.map((img, index) => (
            <SwiperSlide key={index}>
              <div className="flex justify-center">
                <Image
                  src={img}
                  alt={`Game ${index + 1}`}
                  width={1000}
                  height={1000}
                  className="hover:scale-105 opacity-80 w-fit max-w-[240px] min-h-[400px] md:min-h-[450px]"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination mt-6 flex justify-center"></div>
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
