"use client";
import Image from "next/image";
import Button from "../Reusable/Button";
import { useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"; // React Icons

const NFTSection = () => {
  const nftImages = ["/nft0.png", "/nft1.png", "/nft2.png"];
  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount =
        direction === "left"
          ? -carouselRef.current.offsetWidth
          : carouselRef.current.offsetWidth;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-[#151515] py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">UNIQUE NFTS</h2>
        <p className="text-lg text-gray-300">
          Earn Unique NFTS on completing each game & quest
        </p>
      </div>

      {/* Carousel Container */}
      <div className="relative">
        {/* Navigation Buttons for Mobile */}
        <button
          className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 sm:hidden z-50"
          onClick={() => scrollCarousel("left")}>
          <FiChevronLeft size={24} />
        </button>
        <button
          className="absolute top-1/2 right-0 transform -translate-y-1/2 z-50 bg-gray-700 text-white p-3 rounded-full hover:bg-gray-600 sm:hidden"
          onClick={() => scrollCarousel("right")}>
          <FiChevronRight size={24} />
        </button>

        {/* Carousel Wrapper */}
        <div
          ref={carouselRef}
          className="flex items-center justify-center snap-x scroll-smooth overflow-hidden">
          {nftImages.map((nftImage, index) => (
            <div
              key={index}
              className="flex-shrink-0 max-w-[200px] overflow-hidden snap-start md:w-80 md:h-96 flex items-center justify-center p-2 rounded-xl">
              <Image
                src={nftImage}
                alt={`NFT ${index + 1}`}
                width={800}
                height={1200}
                className="w-full hover:scale-105 h-auto overflow-hidden object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="text-center mt-10">
        <Button
          className="bg-gradient-to-b from-indigo-500 from-60% to-yellow-500 hover:from-indigo-600 hover:to-yellow-400 text-black py-3 px-6 rounded hover:scale-105"
          href="/quests">
          Play Now
        </Button>
      </div>
    </div>
  );
};

export default NFTSection;
