"use client";
import Image from "next/image";
import Button from "../Reusable/Button";

const NFTSection = () => {
  const nftImages = ["/nft1.png", "/nft01.png", "/nft2.png"];

  return (
    <div className="bg-[#151515] py-12">
      <div className="text-center mb-8">
        <h2 className="text-4xl font-bold mb-4">UNIQUE NFTS</h2>
        <p className="text-lg text-gray-300">
          Earn Unique NFTs on completing each game & quest
        </p>
      </div>

      <div className="grid grid-cols-3 gap-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-8 place-content-center  place-items-center">
        {nftImages.map((nftImage, index) => (
          <div
            key={index}
            className="flex items-center justify-center p-2 rounded-xl">
            <Image
              src={nftImage}
              alt={`NFT ${index + 1}`}
              width={800}
              height={1200}
              className="w-full h-auto overflow-hidden object-cover rounded-lg hover:scale-105 transition-transform max-w-[150px] md:max-w-[180px] duration-300"
            />
          </div>
        ))}
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
