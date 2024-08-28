"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import Button from "../Reusable/Button";
import { raleway } from "../Reusable/Font";
import { useAuth } from "@/app/AuthenticationProvider";
import { CgClose } from "react-icons/cg";
import Cookies from "js-cookie";

const Hero = () => {
  const { userInfo, fetchUserInfo, handleWalletConnect, isLoading } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [isWalletPopupOpen, setIsWalletPopupOpen] = useState(false);

  const openWalletPopup = () => setIsWalletPopupOpen(true);
  const closeWalletPopup = () => setIsWalletPopupOpen(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || window.opera;
    const isMobile =
      /android|iPhone|iPad|iPod|opera mini|IEMobile|WPDesktop/i.test(userAgent);
    setIsMobile(isMobile);
  }, []);

  // Ensure userInfo is fetched on component mount if not already available
  useEffect(() => {
    if (!userInfo && !isLoading) {
      const userId = Cookies.get("userId");
      if (userId) {
        fetchUserInfo(userId);
      }
    }
  }, [userInfo, isLoading, fetchUserInfo]);

  return (
    <div className="relative mt-[-20px] md:mt-0 w-screen h-screen flex flex-col items-center justify-center">
      <Image
        width={1000}
        height={1000}
        src="/loader/background.png"
        alt="background"
        className="absolute top-[-20px] xs:top-[-60px] left-[-130px] md:left-[-300px] rotate-180 w-full sm:max-w-[350px] max-h-[50vh] min-w-[100vw] object-cover scale-150 md:scale-100"
      />

      <div className="z-10 font-raleway pt-20 text-center">
        <h1 className="text-5xl font-cinzel md:text-7xl mb-4 bg-gradient-to-r from-emerald-500 from-20% to-gold-500 bg-clip-text font-extrabold text-transparent sm:text-5xl">
          CHAIN TRAIL <span className="block overflow-hidden"> STUDIO</span>
        </h1>

        <p
          className={`${raleway.className} text-white font-lato max-w-[340px] sm:max-w-[600px] mb-8 text-md md:text-xl`}>
          Embark on Word Trail, where every level takes you a step closer to a
          unique NFT.
        </p>

        {userInfo ? (
          <div className="flex flex-col gap-3 items-center justify-center">
            <Button
              href="/quests"
              className="text-xs text-black bg-gold-500 transition-colors duration-300 py-3 hover:scale-105 w-48 text-center">
              Play now
            </Button>
            <Button
              href="/wallet"
              className="text-xs bg-slate-900 text-center transition-colors font-normal duration-300 py-3 hover:scale-105 w-48">
              Dashboard
            </Button>
          </div>
        ) : (
          <>
            {isMobile ? (
              <Button
                href="https://t.me/ChainTrailBot"
                className="flex mx-auto text-xs gap-0.5 hover:scale-105 border items-center">
                <span>Play on</span>
                <span className="animate-pulse">
                  <Image
                    src="telegram.svg"
                    height={100}
                    width={100}
                    alt="telegram"
                    className="w-6"
                  />
                </span>
              </Button>
            ) : (
              <>
                <Button
                  onClick={openWalletPopup}
                  className={`flex items-center justify-center mb-4 mx-auto text-xs text-black bg-gold-500 transition-colors duration-300  hover:scale-105 w-48 gap-3 ${
                    isLoading ? "py-3" : "py-2.5"
                  }`}>
                  <span>{isLoading ? "Connecting" : "Connect"}</span>

                  <span>
                    <Image
                      src="metamask.svg"
                      height={100}
                      width={100}
                      alt="telegram"
                      className={`w-6 ${isLoading ? "hidden" : ""}`}
                    />
                  </span>
                </Button>
                <Button
                  href="https://t.me/ChainTrailBot"
                  className="flex mx-auto text-xs gap-3 hover:scale-105 items-center w-48 justify-center bg-slate-900 py-2.5">
                  <span>Play on</span>
                  <span>
                    <Image
                      src="telegram.svg"
                      height={100}
                      width={100}
                      alt="telegram"
                      className="w-6"
                    />
                  </span>
                </Button>
              </>
            )}
          </>
        )}
      </div>

      {isWalletPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-slate-950 rounded-lg shadow-xl w-80">
            <div className="p-4">
              <div className="flex justify-end">
                <button
                  onClick={closeWalletPopup}
                  className="text-gray-500 my-2 p-1 hover:text-gray-700 text-lg">
                  <CgClose />
                </button>
              </div>
              <div className="space-y-4 py-2 text-lg">
                <div
                  onClick={() => {
                    closeWalletPopup();
                    handleWalletConnect();
                  }}
                  className="flex items-center justify-between px-2 py-4 hover:bg-slate-900 rounded cursor-pointer">
                  <p>Connect with MetaMask</p>
                  <img
                    src="metamask.svg"
                    alt="metamask"
                    width={30}
                    height={30}
                  />
                </div>
              </div>
              <div
                onClick={() => {
                  closeWalletPopup();
                  handleWalletConnect();
                }}
                className="flex items-center justify-between px-2 py-4 hover:bg-slate-900 rounded cursor-pointer">
                <p>Wallet Connect</p>
                <img src="metamask.svg" alt="metamask" width={30} height={30} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
