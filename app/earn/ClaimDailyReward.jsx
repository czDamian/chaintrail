"use client";
import { useState, useEffect } from "react";
import Toast from "../components/Reusable/Toast";
import Button from "../components/Reusable/Button";

const ClaimDailyReward = () => {
  const [nextClaimTime, setNextClaimTime] = useState(null);
  const [canClaim, setCanClaim] = useState(false);
  const [timeLeft, setTimeLeft] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [toastBorderColor, setToastBorderColor] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      checkClaimStatus(userId);
    } else {
      console.warn("User ID not found in local storage");
    }
  }, []);

  useEffect(() => {
    if (nextClaimTime) {
      const interval = setInterval(() => {
        updateTimeLeft();
      }, 1000);

      return () => clearInterval(interval); // Clean up interval on component unmount
    }
  }, [nextClaimTime]);

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 1500); // Hide the toast after 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const updateTimeLeft = () => {
    const now = new Date();
    const nextClaimDate = new Date(nextClaimTime);
    const timeDifference = nextClaimDate - now;

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

  const checkClaimStatus = async (userId) => {
    try {
      const response = await fetch(`/api/claim?userId=${userId}`);
      const data = await response.json();
      if (response.ok) {
        if (data.message === "Daily reward and pass not available yet") {
          setCanClaim(false);
          setNextClaimTime(data.nextClaimTime);
        } else {
          setCanClaim(true);
          setNextClaimTime(null); // Claim is available immediately
        }
      } else {
        console.error("Error checking claim status:", data.message);
      }
    } catch (error) {
      console.error("Error checking claim status:", error);
    }
  };

  const claimRewardAndPass = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      console.warn("User ID not found in local storage");
      return;
    }

    try {
      const response = await fetch("/api/claim", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (response.ok) {
        setToastMessage(data.message);
        setToastBorderColor("border-green-600");
        setNextClaimTime(data.nextClaimTime);
        setCanClaim(false);
      } else {
        if (data.nextClaimTime) {
          setToastMessage("Already claimed, try again later.");
          setToastBorderColor("border-blue-600");
          setNextClaimTime(data.nextClaimTime);
        } else {
          setToastMessage(data.message);
          setToastBorderColor("border-red-600");
        }
      }
    } catch (error) {
      console.error("Error claiming reward and pass:", error);
      setToastMessage("Error claiming reward and pass");
      setToastBorderColor("border-red-600");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center my-10">
      {toastMessage && (
        <Toast message={toastMessage} borderLeftColor={toastBorderColor} />
      )}
      <div className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">DAILY BONUS</h1>
          <p className="text-sm mb-6">
            Get Free Coins and Play Pass for logging into the game daily
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="flex bg-gray-800 py-6 flex-col border border-gray-700 rounded-lg items-center">
            <img
              src="/coins.png"
              alt="Chain Points"
              className="w-12 h-12 mb-2"
            />
            <span className="text-xl mb-2 font-bold">+1200</span>
            <span className="text-sm">Chain Points</span>
          </div>
          <div className="flex bg-gray-800 py-6 flex-col border border-gray-700 rounded-lg items-center">
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
            {canClaim ? "CLAIM" : "Claimed"}
          </Button>
        </div>
        {nextClaimTime && (
          <div className="text-center mt-4">
            <p>
              Next claim time: {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClaimDailyReward;
