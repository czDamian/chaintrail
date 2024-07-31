"use client";
import { useState, useEffect } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../components/Reusable/Button";
import { useRouter } from "next/navigation";

const ClaimDailyReward = () => {
  const { userInfo } = useTelegramAuth();
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const router = useRouter();

  useEffect(() => {
    checkClaimStatus();
  }, [userInfo]);

  useEffect(() => {
    if (nextClaimTime) {
      const interval = setInterval(() => {
        updateTimeLeft();
      }, 1000);

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [nextClaimTime]);

  const updateTimeLeft = () => {
    const now = new Date();
    const timeDifference = new Date(nextClaimTime) - now;

    if (timeDifference <= 0) {
      setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      setCanClaim(true);
      setNextClaimTime(null); // Reset next claim time when it's time to claim
    } else {
      const seconds = Math.floor((timeDifference / 1000) % 60);
      const minutes = Math.floor((timeDifference / 1000 / 60) % 60);
      const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      setTimeLeft({ days, hours, minutes, seconds });
      setCanClaim(false);
    }
  };

  const checkClaimStatus = async () => {
    if (!userInfo || !userInfo.id) return;
    try {
      const response = await fetch(`/api/register?userId=${userInfo.id}`);
      const data = await response.json();
      if (response.ok) {
        const now = new Date();
        const nextClaimTime = new Date(data.nextClaimTime);
        router.refresh();
        if (now >= nextClaimTime) {
          setCanClaim(true);
          setNextClaimTime(null);
        } else {
          setCanClaim(false);
          setNextClaimTime(nextClaimTime);
        }
      } else {
        console.error("Error checking claim status:", data.message);
      }
    } catch (error) {
      console.error("Error checking claim status:", error);
    }
  };

  const claimRewardAndPass = async () => {
    console.log("Claim reward and pass initiated");
    try {
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userInfo.id }),
      });

      console.log("Response received from /api/register:", response);
      const data = await response.json();
      console.log("Parsed response data:", data);

      if (response.ok) {
        toast.success(data.message);
        setNextClaimTime(new Date(data.nextClaimTime));
        setCanClaim(false);
      } else {
        if (data.nextClaimTime) {
          toast.info("Already claimed, try again later.");
          setNextClaimTime(new Date(data.nextClaimTime));
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error claiming reward and pass:", error);
      toast.error("Error claiming reward and pass");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-10">
      <ToastContainer />
      <div className="bg-neutral-800 p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">DAILY BONUS</h1>
          <p className="text-sm mb-6">
            Free Coins for logging into the game daily without skipping
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex bg-neutral-900 py-6 flex-col border border-neutral-500 rounded-lg items-center">
            <img
              src="/coins.png"
              alt="Chain Points"
              className="w-12 h-12 mb-2"
            />
            <span className="text-xl mb-2 font-bold">+1200</span>
            <span className="text-sm">Chain Points</span>
          </div>
          <div className="flex bg-neutral-900 py-6 flex-col border border-neutral-500 rounded-lg items-center">
            <img
              src="/ticketIcon.svg"
              alt="Play Passes"
              className="w-12 h-12 mb-2"
            />
            <span className="text-xl font-bold">4</span>
            <span className="text-sm mb-2">Play Passes</span>
          </div>
        </div>
        <div className="text-center">
          <Button
            onClick={claimRewardAndPass}
            disabled={!canClaim}
            className={`px-20 py-2 bg-yellow-500 hover:bg-yellow-400 active:scale-105 text-black font-bold rounded-md ${
              !canClaim ? "opacity-50 cursor-not-allowed text-xs" : ""
            }`}>
            {canClaim ? "CLAIM" : "Already Claimed"}
          </Button>
        </div>
        {nextClaimTime && (
          <div className="text-center mt-4">
            <p>
              Next claim time: {timeLeft.days}d {timeLeft.hours}h
              {timeLeft.minutes}m {timeLeft.seconds}s
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimDailyReward;
