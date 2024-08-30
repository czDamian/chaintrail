"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/bundle";
import { Autoplay } from "swiper/modules";

const NFTSection = () => {
  const nftImages = ["/nft1.png", "/nft2.png", "/nft1.png"];
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
    <div className="bg-slate-900 w-full py-12 px-2 overflow-visible">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">UNIQUE NFTS</h1>
        <p className="text-lg text-gray-300">
          Earn Unique NFTs when you reach a certain points threshold
        </p>
      </div>

      <div className="px-4 sm:px-8">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={10}
          slidesPerView={slidesPerView}
          autoplay={{ delay: 2000, disableOnInteraction: false }}
          className="mySwiper">
          {nftImages.map((nftImage, index) => (
            <SwiperSlide key={index} className="flex justify-center">
              <div className="">
                <Image
                  src={nftImage}
                  alt={`NFT ${index + 1}`}
                  width={800}
                  height={1200}
                  className="object-cover rounded-lg transition-transform duration-300  max-w-56 mx-auto"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
};

export default NFTSection;
