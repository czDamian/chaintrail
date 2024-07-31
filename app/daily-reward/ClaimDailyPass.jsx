"use client";

import { useEffect, useState } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";

const ClaimDailyPass = () => {
  const { userInfo, isLoading } = useTelegramAuth();
  const [playPass, setPlayPass] = useState(0);
  const [canClaimPass, setCanClaimPass] = useState(false);
  const [timeUntilNextClaimPass, setTimeUntilNextClaimPass] = useState(null);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      checkDailyPassStatus(userInfo.id);
    }
  }, [userInfo]);

  const claimDailyPass = async () => {
    if (!userInfo || !userInfo.id) return;

    try {
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userInfo.id }),
      });
      const data = await response.json();
      if (response.ok) {
        setPlayPass(data.playPass);
        setCanClaimPass(false);
        updateNextClaimPassTime(new Date(data.nextClaimPassTime));
      } else {
        console.error("Failed to claim daily pass:", data.message);
      }
    } catch (error) {
      console.error("Error claiming daily pass:", error);
    }
  };

  const checkDailyPassStatus = async (userId) => {
    try {
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (response.ok) {
        setCanClaimPass(true);
      } else {
        updateNextClaimPassTime(new Date(data.nextClaimPassTime));
      }
    } catch (error) {
      console.error("Error checking daily pass status:", error);
    }
  };

  const updateNextClaimPassTime = (nextClaimPassTime) => {
    const updateTimer = () => {
      const now = new Date();
      const timeDiff = nextClaimPassTime - now;
      if (timeDiff <= 0) {
        setCanClaimPass(true);
        setTimeUntilNextClaimPass(null);
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setTimeUntilNextClaimPass(`${hours}h ${minutes}m ${seconds}s`);
        setTimeout(updateTimer, 1000);
      }
    };
    updateTimer();
  };

  if (isLoading || !userInfo) {
    return <div className="text-xs">login to continue...</div>;
  }

  return (
    <div>
      <div>Play Pass: {playPass}</div>
      <button
        className="my-4 text-center border bg-blue-800 text-white block p-2 rounded-lg hover:bg-blue-700 cursor-pointer"
        onClick={claimDailyPass}
        disabled={!canClaimPass}>
        {canClaimPass
          ? "Claim Daily Pass"
          : `Next claim in ${timeUntilNextClaimPass || "Loading..."}`}
      </button>
    </div>
  );
};

export default ClaimDailyPass;
