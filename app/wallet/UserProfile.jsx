"use client";
import { useState } from "react";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { format } from "date-fns";

export default function UserProfile() {
  const { userInfo, isLoading, fetchUserInfo } = useTelegramAuth();
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [showPrivateKey, setShowPrivateKey] = useState(false);

  if (isLoading || !userInfo || !userInfo.userId) {
    return <div>Loading...</div>;
  }

  const formattedDate = format(new Date(userInfo.createdAt), "MMMM dd, yyyy");

  return (
    <div className="flex flex-col items-center mt-20">
      <div className="w-full max-w-4xl p-6 bg-neutral-800 rounded-lg shadow-md">
        <div className="mb-6 flex items-center gap-2 text-gold-500">
          <h2 className="text-2xl font-semibold">My Profile</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <p>
            <span className="font-bold">Username:</span>
            {userInfo.username || "Username not set"}
          </p>
          <p>
            <span className="font-bold">Points:</span> {userInfo.points}
          </p>
          <p>
            <span className="font-bold">Play Pass left:</span>{" "}
            {userInfo.playPass}
          </p>
          <p>
            <span className="font-bold">Referrals:</span>
            {userInfo.referralCount}
          </p>
          <p>
            <span className="font-bold">Referral Link:</span>
            https://t.me/ChainTrailBot?start{userInfo.referralCode}
          </p>
          <p>
            <span className="font-bold">User since:</span> {formattedDate}
          </p>

          <div className="flex items-center">
            <label className="block font-bold mb-2 w-32">Private Key</label>
            <div className="flex flex-1 items-center relative">
              <input
                type={showPrivateKey ? "text" : "password"}
                value={userInfo.privateKey}
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-neutral-800"
              />
              <button
                type="button"
                onClick={() => setShowPrivateKey(!showPrivateKey)}
                className="px-3 flex items-center text-gray-500">
                {showPrivateKey ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center mt-4">
            <label className="block font-bold mb-2 w-32">Wallet Address</label>
            <div className="flex flex-1 items-center relative">
              <input
                type={showWalletAddress ? "text" : "password"}
                value={userInfo.walletAddress}
                readOnly
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-neutral-800"
              />
              <button
                type="button"
                onClick={() => setShowWalletAddress(!showWalletAddress)}
                className="px-3 flex items-center text-gray-500">
                {showWalletAddress ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
