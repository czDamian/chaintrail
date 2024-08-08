"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Button from "../Reusable/Button";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle"; // Import Swiper styles
import { Pagination, Autoplay } from "swiper/modules";

const NFTSection = () => {
  const nftImages = ["/nft1.png", "/nft2.png", "/nft1.png"];
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-[#151515] py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">UNIQUE NFTS</h1>
        <p className="text-lg text-gray-300">
          Earn Unique NFTs on completing each game & quest
        </p>
      </div>

      <div className="px-4 sm:px-8">
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={30}
          slidesPerView={isMobile ? 1 : 3}
          pagination={{ clickable: true }}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          className="mySwiper">
          {nftImages.map((nftImage, index) => (
            <SwiperSlide key={index} className="flex justify-center ">
              <div className="relative">
                <Image
                  src={nftImage}
                  alt={`NFT ${index + 1}`}
                  width={800}
                  height={1200}
                  className="object-cover rounded-lg hover:scale-105 transition-transform duration-300 max-w-60 mx-auto"
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

export default NFTSection;
