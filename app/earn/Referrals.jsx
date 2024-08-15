"use client";

import { useEffect, useState } from "react";
import {
  IoCopy,
  IoCheckmarkCircle,
  IoTimeOutline,
  IoStar,
} from "react-icons/io5";
import Toast from "../components/Reusable/Toast";

const Referrals = () => {
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchReferralData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(`/api/users?userId=${userId}`);
          const data = await response.json();

          if (response.ok) {
            const referralCode = data.referralCode || "0000"; // Default to "0000" if referralCode is missing
            setReferralLink(`https://t.me/ChainTrailBot?start=${referralCode}`);
            setReferralCount(data.referralCount || 0); // Set referral count if available
          } else {
            console.error("Failed to fetch referral code:", data.message);
          }
        } catch (error) {
          console.error("Error fetching referral code:", error);
        }
      } else {
        console.error("No userId found in localStorage");
      }
    };

    fetchReferralData();
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const getAchievementIcon = (isComplete) => {
    return isComplete ? (
      <IoCheckmarkCircle className="text-yellow-400 text-3xl" />
    ) : (
      <IoTimeOutline className="text-gray-500 text-3xl" />
    );
  };

  return (
    <section className="px-8">
      <div className="text-center my-6 text-2xl">
        <h1 className="font-bold">
          INVITE <span className="text-gold-500">FRIENDS!</span>
        </h1>
        <p className="text-sm my-2">Refer & earn 1000 points</p>

        <div className="hover:animate-background rounded-xl bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 p-0.5 shadow-xl transition hover:bg-[length:400%_400%] hover:shadow-sm hover:[animation-duration:_4s] dark:shadow-gray-700/25 text-xs md:text-sm my-8">
          <div className="flex items-center justify-between gap-2 rounded-[10px] p-4 bg-gray-900">
            <input
              className="bg-inherit border-none overflow-x-scroll text-neutral-200"
              type="text"
              name="referral"
              id="referral"
              value={referralLink || "Fetching link..."}
              readOnly
            />
            <span className="opacity-50">|</span>
            <span
              className="flex items-center gap-2 justify-between cursor-pointer"
              onClick={copyReferralLink}>
              <div>copy</div>
              <IoCopy />
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <span>My referrals:</span>
          <span id="referrals" className="font-bold text-yellow-500">
            {referralCount}
          </span>
        </div>
      </div>

      <div className="my-12 flex flex-col gap-4 mx-4">
        <h1 className="text-xl font-semibold text-gray-300">
          YOUR ACHIEVEMENTS!
        </h1>

        {/* Achievement 1 */}
        <div className="bg-gray-800 flex gap-4 rounded-xl p-4 items-center">
          {getAchievementIcon(referralCount >= 1)}
          <div className="flex flex-col w-full text-sm gap-1">
            <p className="font-medium">Snail Lord</p>
            <span>Get 1 referral</span>
            <input
              className="accent-yellow-400"
              type="range"
              name="iqCount"
              value={Math.min(referralCount, 1)}
              max={1}
              readOnly
            />
          </div>
        </div>

        {/* Achievement 2 */}
        <div className="bg-gray-800 flex gap-4 rounded-xl p-4 items-center">
          {getAchievementIcon(referralCount >= 10)}
          <div className="flex flex-col w-full text-sm gap-1">
            <p className="font-medium">Rising Star</p>
            <span>Get 10 referrals</span>
            <input
              className="accent-yellow-400"
              type="range"
              name="iqCount"
              value={Math.min(referralCount, 10)}
              max={10}
              readOnly
            />
          </div>
        </div>

        {/* Achievement 3 */}
        <div className="bg-gray-800 flex gap-4 rounded-xl p-4 items-center">
          {getAchievementIcon(referralCount >= 100)}
          <div className="flex flex-col w-full text-sm gap-1">
            <p className="font-medium">Mastermind</p>
            <span>Get 100 referrals</span>
            <input
              className="accent-yellow-400"
              type="range"
              name="iqCount"
              value={Math.min(referralCount, 100)}
              max={100}
              readOnly
            />
          </div>
        </div>
      </div>

      {showToast && (
        <Toast
          message="Referral link copied to clipboard!"
          borderLeftColor="border-blue-500"
          className="animate-slide-in-right"
        />
      )}
    </section>
  );
};

export default Referrals;
