"use client";

import { useEffect, useState } from "react";
import { IoCopy } from "react-icons/io5";

const Referrals = () => {
  const [referralLink, setReferralLink] = useState("");
  const [referralCount, setReferralCount] = useState(0);

  useEffect(() => {
    const fetchReferralData = async () => {
      const userId = localStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(`/api/users?userId=${userId}`);
          const data = await response.json();

          if (response.ok) {
            const referralCode = data.referralCode || "0000"; // Default to "0000" if referralCode is missing
            setReferralLink(`https://t.me/ChainTrailBot?start${referralCode}`);
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

  return (
    <section className="px-8">
      <div className="text-center my-6 text-2xl">
        <h1 className="font-bold ">INVITE FRIENDS!</h1>
        <p className="text-sm my-2">Refer & earn 1000 points</p>
        <div className="bg-neutral-700 p-4 rounded-lg text-sm flex justify-center gap-2 items-center mx-auto w-[300px] my-4">
          <input
            className="bg-inherit border-none overflow-x-scroll text-neutral-200"
            type="text"
            name="referral"
            id="referral"
            value={referralLink || "Fetching ref link..."}
            readOnly
          />
          <span className="opacity-50">|</span>
          <span
            className="flex items-center gap-2 justify-between cursor-pointer"
            onClick={() => {
              navigator.clipboard.writeText(referralLink);
              alert("Referral link copied to clipboard!");
            }}>
            copy <IoCopy />
          </span>
        </div>
        <button className="bg-yellow-500 hover:bg-yellow-600 text-black py-3 px-16 rounded-xl text-sm font-bold my-8">
          SHARE
        </button>
        <div className="flex items-center justify-center gap-2">
          <span>My referrals:</span>
          <span id="referrals" className="font-bold text-yellow-500">
            {referralCount}
          </span>
        </div>
      </div>

      <div className="my-12 flex flex-col gap-4 mx-4">
        <h1>YOUR REWARDS!</h1>
        <div className="bg-neutral-700 flex gap-4 rounded-xl p-2">
          <img src="frameIq.svg" alt="iq" className="rounded-full " />
          <div className=" flex flex-col w-full text-sm gap-1">
            <p>IQ Count: Snail Lord</p>
            <div className="flex items-center justify-between text-sm">
              <span>74</span>
              <span>340</span>
            </div>
            <input
              className="accent-yellow-400"
              type="range"
              name="iqCount"
              value={74}
              max={340}
              id=""
            />
          </div>
        </div>
        <div className="bg-neutral-700 flex gap-4 rounded-xl p-2">
          <img
            src="star.svg"
            alt="iq"
            className="my-2 p-1 rounded-full bg-neutral-800"
          />
          <div className=" flex flex-col w-full text-sm gap-1">
            <p>IQ Count: Snail Lord</p>
            <div className="flex items-center justify-between text-sm">
              <span>1050</span>
              <span>3000</span>
            </div>
            <input
              className="accent-yellow-400"
              type="range"
              name="iqCount"
              value={1050}
              max={3000}
              id=""
            />
          </div>
        </div>
        <div className="bg-neutral-700 flex gap-4 rounded-xl p-2">
          <img
            src="frameIq1.svg"
            alt="iq"
            className=" p-2 my-1 rounded-full bg-neutral-800 "
          />
          <div className=" flex flex-col w-full text-sm gap-1">
            <p>IQ Count: Snail Lord</p>
            <div className="flex items-center gap-1">
              <img src="star.svg" alt="coins" />
              <p>450</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Referrals;
