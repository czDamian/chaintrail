"use client";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Pagination, Autoplay } from "swiper/modules";
import { useEffect, useState } from "react";

const steps = [
  {
    step: "STEP 1",
    image: "coinsPana.svg",
    title: "Connect any web3 Wallet or Click Play on Telegram to get started",
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
      "Earn unlimited points for answering the correct questions in each Quest.",
  },
  {
    step: "STEP 4",
    image: "mainNft2.svg",
    title:
      "Earn unique and exclusive NFTs when you reach a certain point threshold",
  },
  {
    step: "STEP 5",
    image: "/coinbag.png",
    title: "Claim FREE Points and play Passes for Logging into the game daily.",
  },
  {
    step: "STEP 6",
    image: "mainNft3.svg",
    title: "Refer friends and earn more points. The more you refer, the higher you earn",
  },
];

const HowToPlay = () => {
  const [slidesPerView, setSlidesPerView] = useState(1);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 900) {
        setSlidesPerView(4);
      } else if (window.innerWidth >= 700) {
        setSlidesPerView(3);
      } else if (window.innerWidth >= 350) {
        setSlidesPerView(2);
      } else {
        setSlidesPerView(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto text-center py-12 my-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        HOW TO <span className="text-gold-500">PLAY</span>
      </h1>
      <div className="p-3 bg-gray-900 rounded-xl">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={slidesPerView}
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
          {steps.map((step, index) => (
            <SwiperSlide key={index}>
              <div className="bg-gray-800 p-4 rounded-lg h-full">
                <h3 className="text-lg font-bold mb-2">{step.step}</h3>
                <div className="relative w-full h-32 mb-4">
                  <Image
                    src={step.image}
                    alt={step.title}
                    layout="fill"
                    objectFit="contain"
                    className="rounded-lg min-w-28"
                  />
                </div>
                <p className="text-sm text-gray-300 leading-6 mb-6">
                  {step.title}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="swiper-pagination mt-6 flex justify-center"></div>
      </div>
    </div>
  );
};

export default HowToPlay;
