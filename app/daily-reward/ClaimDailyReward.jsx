"use client";
import { useState } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";

const ClaimDailyReward = () => {
  const { userInfo } = useTelegramAuth();
  const [message, setMessage] = useState("");
  const [nextClaimTime, setNextClaimTime] = useState(null);

  const claimReward = async () => {
    console.log("Claim reward initiated");
    try {
      console.log("Sending request to /api/register");
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
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
      setMessage("Error claiming reward");
    }
  };

  return (
    <div>
      <button onClick={claimReward}>Claim Daily Reward</button>
      {message && <p>{message}</p>}
      {nextClaimTime && (
        <p>Next claim time: {new Date(nextClaimTime).toLocaleString()}</p>
      )}
    </div>
  );
};

export default ClaimDailyReward;
