"use client";
import { useState, useEffect } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";


const ClaimDailyPass = () => {
  const { userInfo } = useTelegramAuth();
  const [message, setMessage] = useState("");
  const [nextClaimPassTime, setNextClaimPassTime] = useState(null);
  const [canClaimPass, setCanClaimPass] = useState(false);

  const checkPassStatus = async () => {
    if (!userInfo || !userInfo.id) return;
    try {
      const response = await fetch(`/api/register?userId=${userInfo.id}`);
      const data = await response.json();
      if (response.ok) {
        const now = new Date();
        const nextClaimPassTime = new Date(data.nextClaimPassTime);
        if (now >= nextClaimPassTime) {
          setCanClaimPass(true);
        } else {
          setCanClaimPass(false);
          setNextClaimPassTime(nextClaimPassTime);
        }
      } else {
        console.error("Error checking pass status:", data.message);
      }
    } catch (error) {
      console.error("Error checking pass status:", error);
    }
  };

  useEffect(() => {
    checkPassStatus();
  }, [userInfo]);

  const claimPass = async () => {
    console.log("Claim pass initiated");
    try {
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
        setCanClaimPass(false);
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
      <button onClick={claimPass} disabled={!canClaimPass}>
        {canClaimPass ? "Claim Daily Pass" : "Pass not available yet"}
      </button>
      {message && <p>{message}</p>}
      {nextClaimPassTime && (
        <p>
          Next claim pass time: {new Date(nextClaimPassTime).toLocaleString()}
        </p>
      )}
      <TotalPasses/>
    </div>
  );
};

export const TotalPasses = () => {
  const { userInfo } = useTelegramAuth();
  const [playPass, setPlayPass] = useState(0);

  useEffect(() => {
    const fetchTotalPasses = async () => {
      try {
        console.log("Fetching total passes for user:", userInfo.id);
        const response = await fetch(`/api/register?userId=${userInfo.id}`);
        console.log("Response received:", response);
        const data = await response.json();
        console.log("Parsed response data:", data);

        if (response.ok) {
          setPlayPass(data.playPass);
        } else {
          console.error("Error fetching total passes:", data.message);
        }
      } catch (error) {
        console.error("Error fetching total passes:", error);
      }
    };

    if (userInfo) {
      fetchTotalPasses();
    }
  }, [userInfo]);

  return (
    <div>
      <h3>Total Passes: {playPass}</h3>
    </div>
  );
};

export default ClaimDailyPass;