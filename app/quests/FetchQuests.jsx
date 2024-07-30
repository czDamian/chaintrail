"use client";
import { useState, useEffect } from "react";
import SideNav from "../components/Reusable/SideNav";
import Button from "../components/Reusable/Button";
import Link from "next/link";

const FetchQuestsFromDb = () => {
  const [quests, setQuests] = useState([]);

  useEffect(() => {
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
    <section className="bg-gradient-to-r from-neutral-900 via-slate-600 to-neutral-900 min-h-screen text-white">
      <h1 className="flex justify-between items-center mx-4 my-4 py-2 text-yellow-300">
        <div className="font-bold text-4xl">QUESTS</div>
        <div className="flex gap-2 cursor-pointer">
          <SideNav />
        </div>
      </h1>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {quests.map((quest) => (
          <Link
            key={quest._id}
            href={`/quests/${quest._id}`}
            className="border border-gray-600 w-72 md:w-72 rounded-xl bg-gray-900 hover:bg-gray-800 mb-4 flex flex-col justify-between items-center shadow-lg transition-all duration-300">
            <img
              className="rounded-xl h-36 object-cover w-full"
              src={quest.questImage}
              alt={quest.questName}
              onError={(e) => (e.target.src = "/quest/bitcoin.jpg")}
            />
            <div className="flex justify-between items-center w-full px-3 my-2">
              <span className="uppercase font-bold text-yellow-300">
                {quest.questName}
              </span>
              <Button className="bg-yellow-400 px-4 py-2 text-black text-xs hover:bg-yellow-300 transition-colors duration-300">
                {quest.questStatus}
              </Button>
            </div>
            <div className="mx-3 pb-2 text-xs text-center">
              {quest.questDescription ||
                "Embark on Word Trails, learn about blockchain - Think, Tap, Win. Earn Tokens and NFTs"}
            </div>
            <div className="flex justify-between gap-2 items-center text-xs px-3 w-full mb-2">
              <span className="border border-gray-600 p-2 rounded-md bg-gray-800 text-yellow-300">
                {quest.questQuestions.length} questions
              </span>
              <span className="border border-gray-600 p-2 rounded-md bg-gray-800 text-yellow-300">
                {1000 * quest.questQuestions.length} points
              </span>
              <span className="p-2 font-bold text-yellow-500 border border-yellow-500 rounded-md bg-gray-800">
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
