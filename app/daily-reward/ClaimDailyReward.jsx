"use client";

import { useEffect, useState } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";

const ClaimDailyReward = () => {
  const { userInfo, isLoading } = useTelegramAuth();
  const [userPoints, setUserPoints] = useState(0);
  const [canClaimReward, setCanClaimReward] = useState(false);
  const [timeUntilNextClaim, setTimeUntilNextClaim] = useState(null);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      checkDailyRewardStatus(userInfo.id);
    }
  }, [userInfo]);

  const claimDailyReward = async () => {
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
        setUserPoints(data.points);
        setCanClaimReward(false);
        updateNextClaimTime(new Date(data.nextClaimTime));
      } else {
        console.error("Failed to claim daily reward:", data.message);
      }
    } catch (error) {
      console.error("Error claiming daily reward:", error);
    }
  };

  const checkDailyRewardStatus = async (userId) => {
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
        setCanClaimReward(true);
      } else {
        updateNextClaimTime(new Date(data.nextClaimTime));
      }
    } catch (error) {
      console.error("Error checking daily reward status:", error);
    }
  };

  const updateNextClaimTime = (nextClaimTime) => {
    const updateTimer = () => {
      const now = new Date();
      const timeDiff = nextClaimTime - now;
      if (timeDiff <= 0) {
        setCanClaimReward(true);
        setTimeUntilNextClaim(null);
      } else {
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        setTimeUntilNextClaim(`${hours}h ${minutes}m ${seconds}s`);
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
      <div>Points: {userPoints}</div>
      <button
        className="my-4 text-center border bg-yellow-800 text-white block p-2 rounded-lg hover:bg-yellow-700 cursor-pointer"
        onClick={claimDailyReward}
        disabled={!canClaimReward}>
        {canClaimReward
          ? "Claim Daily Reward"
          : `Next claim in ${timeUntilNextClaim || "Loading..."}`}
      </button>
    </div>
  );
};

export default ClaimDailyReward;
