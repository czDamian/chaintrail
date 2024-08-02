"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Button from "../Reusable/Button";

const NFTSection = () => {
  const nftImages = ["/nft1.png", "/nft01.png", "/nft2.png"];
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const isMobile = useMobileCheck();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === nftImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Change image every 2 seconds
    return () => clearInterval(interval);
  }, [nftImages.length]);

  return (
    <div className="bg-[#151515] py-12">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">UNIQUE NFTS</h1>
        <p className="text-lg text-gray-300">
          Earn Unique NFTs on completing each game & quest
        </p>
      </div>

      <div className="flex items-center justify-center px-4 sm:px-8">
        {isMobile ? (
          <div className="flex overflow-x-auto space-x-4">
            {nftImages.map((nftImage, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[180px] h-auto relative">
                <Image
                  src={nftImage}
                  alt={`NFT ${index + 1}`}
                  width={800}
                  height={1200}
                  className="object-cover rounded-lg hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </div>
        ) : (
          nftImages.map((nftImage, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-2 rounded-xl">
              <Image
                src={nftImage}
                alt={`NFT ${index + 1}`}
                width={800}
                height={1200}
                className="max-w-[120px] md:max-w-[180px] h-auto overflow-hidden object-cover rounded-lg hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))
        )}
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

const useMobileCheck = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
};

export default NFTSection;
