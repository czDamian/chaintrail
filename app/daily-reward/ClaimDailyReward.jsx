"use client";
import { useState, useEffect } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";

const ClaimDailyReward = () => {
  const { userInfo } = useTelegramAuth();
  const [message, setMessage] = useState("");
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [canClaimReward, setCanClaimReward] = useState(false);

  const checkRewardStatus = async () => {
    if (!userInfo || !userInfo.id) return;
    try {
      const response = await fetch(`/api/register?userId=${userInfo.id}`);
      const data = await response.json();
      if (response.ok) {
        const now = new Date();
        const nextClaimTime = new Date(data.nextClaimTime);
        if (now >= nextClaimTime) {
          setCanClaimReward(true);
        } else {
          setCanClaimReward(false);
          setNextClaimTime(new Date(data.nextClaimTime));
        }
      } else {
        console.error("Error checking reward status:", data.message);
      }
    } catch (error) {
      console.error("Error checking reward status:", error);
    }
  };

  useEffect(() => {
    checkRewardStatus();
  }, [userInfo]);

  const claimReward = async () => {
    console.log("Claim reward initiated");
    try {
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userInfo.id, type: "reward" }),
      });

      console.log("Response received from /api/register:", response);
      const data = await response.json();
      console.log("Parsed response data:", data);

      if (response.ok) {
        setMessage(data.message);
        setNextClaimTime(data.nextClaimTime);
        setCanClaimReward(false);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      setMessage("Error claiming reward");
    }
  };

  return (
    <div className="bg-neutral-950 p-2">
      <button onClick={claimReward} disabled={!canClaimReward}>
        {canClaimReward ? "Claim Daily Reward" : "Reward not available yet"}
      </button>
      {message && <p>{message}</p>}
      {nextClaimTime && (
        <p>Next claim time: {new Date(nextClaimTime).toLocaleString()}</p>
      )}
    </div>
  );
};

export default ClaimDailyReward;
