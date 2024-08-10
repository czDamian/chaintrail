"use client";
import Image from "next/image";
import Button from "../Reusable/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Pagination, Autoplay } from "swiper/modules";

const Daily = () => {
  const gamesImg = [
    "/loader/gameInterface.jpg",
    "/loader/moreCoins.jpg",
    "/loader/dailyReward.jpg",
  ];

  return (
    <div className="my-20 py-20">
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
                  className="hover:scale-105 opacity-80 w-fit max-w-60 min-h-[400px] md:min-h-[450px]"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination mt-6 flex justify-center"></div>
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
