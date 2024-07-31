"use client";
import { useState } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";

const ClaimDailyPass = () => {
  const { userInfo } = useTelegramAuth();
  const [message, setMessage] = useState("");
  const [nextClaimPassTime, setNextClaimPassTime] = useState(null);

  const claimPass = async () => {
    console.log("Claim pass initiated");
    try {
      console.log("Sending request to /api/register");
      const response = await fetch("/api/register", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: userInfo.id, type: "pass" }),
      });

      console.log("Response received from /api/register:", response);
      const data = await response.json();
      console.log("Parsed response data:", data);

      if (response.ok) {
        setMessage(data.message);
        setNextClaimPassTime(data.nextClaimPassTime);
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.error("Error claiming pass:", error);
      setMessage("Error claiming pass");
    }
  };

  return (
    <div>
      <button onClick={claimPass}>Claim Daily Pass</button>
      {message && <p>{message}</p>}
      {nextClaimPassTime && (
        <p>
          Next claim pass time: {new Date(nextClaimPassTime).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default ClaimDailyPass;
