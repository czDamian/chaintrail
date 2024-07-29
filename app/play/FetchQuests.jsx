"use client";
import { useState, useEffect } from "react";
import SideNav from "../components/Reusable/SideNav";
import Button from "../components/Reusable/Button";
import Link from "next/link";

const FetchQuestsFromDb = () => {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
    // Fetch quests from the API
    const fetchQuests = async () => {
      try {
        const response = await fetch("/api/quests");
        if (response.ok) {
          const data = await response.json();
          setQuests(data);
        } else {
          throw new Error("Failed to fetch quests");
        }
      } catch (error) {
        console.error("Error fetching quests:", error);
      }
    };

    fetchQuests();
  }, []);

  return (
    <section>
      <h1 className="flex justify-between items-center mx-4 my-2 py-2">
        <div className="font-bold text-2xl">QUESTS</div>
        <div className="flex gap-2 cursor-pointer">
          <SideNav />
        </div>
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
        {quests.map((quest, index) => (
          <Link
            key={quest._id}
            href={`/play/quest-${index + 1}`} // Incrementing URL based on index
            className="border border-neutral-400 w-72 md:w-72 rounded-xl pb-3 bg-[#363636] hover:bg-neutral-800 mb-2 flex flex-col justify-between items-center">
            <img
              className="rounded-xl h-32 object-cover w-full"
              src={quest.questImage}
              alt={quest.questName}
              onError={(e) => (e.target.src = "/quest/bitcoin.jpg")} // Replace with your fallback image path
            />
            <div className="flex justify-between items-center w-full px-2 my-2">
              <span className="uppercase font-bold">{quest.questName}</span>
              <Button className="bg-yellow-500 px-3 text-black text-xs">
                {quest.questStatus}
              </Button>
            </div>
            <div className="mx-2 pb-2 text-xs text-justify">
              {quest.questDescription ||
                "Embark on Word Trails, learn about blockchain - Think, Tap, Win. Earn Tokens and NFTs"}
            </div>

            <div className="flex justify-between gap-2 items-center text-xs px-2 w-full">
              <span className="border border-neutral-900 p-2 rounded-md">
                {quest.questQuestions.length} questions
              </span>
              <span className="border border-neutral-900 p-2 rounded-md">
                {1000 * quest.questQuestions.length} points
              </span>
              <span className="p-2 font-bold text-yellow-500 border border-yellow-500 rounded-md">
                1 NFT
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FetchQuestsFromDb;
