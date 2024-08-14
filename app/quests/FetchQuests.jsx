"use client";
import { useState, useEffect } from "react";
import SideNav from "../components/Reusable/SideNav";
import Button from "../components/Reusable/Button";
import Link from "next/link";
import { QuestSkeleton } from "../components/HomePage/CustomLoader";

const FetchQuestsFromDb = () => {
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestsandProgress = async () => {
      const userId = localStorage.getItem("userId");
      try {
        const response = await fetch(`/api/quests`);
        const userData = await fetch(`/api/users?userId=${userId}`);
        if (response.ok && userData.ok) {
          const data = await response.json();
          const { currentQuest, currentQuestion, completedQuests } =
            await userData.json();

          // Update quests with status based on user progress
          const updatedQuests = data.map((quest) => {
            let questStatus = "locked";
            let isLinkDisabled = true;

            if (completedQuests.includes(quest._id)) {
              questStatus = "completed";
              isLinkDisabled = true;
            } else if (quest._id === currentQuest) {
              questStatus = "open";
              isLinkDisabled = false;
            }

            return { ...quest, questStatus, isLinkDisabled };
          });

          // Sort quests: Completed first, then open, then locked
          const sortedQuests = updatedQuests.sort((a, b) => {
            if (
              a.questStatus === "completed" &&
              b.questStatus !== "completed"
            ) {
              return -1;
            }
            if (a.questStatus === "open" && b.questStatus !== "open") {
              return b.questStatus === "completed" ? 1 : -1;
            }
            if (a.questStatus === "locked" && b.questStatus !== "locked") {
              return 1;
            }
            return 0;
          });

          setQuests(sortedQuests);
        } else {
          throw new Error("Failed to fetch quests");
        }
      } catch (error) {
        console.error("Error fetching quests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestsandProgress();
  }, []);

  return (
    <section className="bg-gray-900 mb-20">
      <div className="flex justify-between items-center mx-4 my-4 py-2 text-gray-300">
        <h1 className="font-bold text-gold-500 text-4xl">QUESTS</h1>
        <div className="flex gap-2 cursor-pointer">
          <SideNav />
        </div>
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <QuestSkeleton key={index} />
          ))
        ) : quests.length === 0 ? (
          <div className="text-center text-gray-300 col-span-full">
            <p className=" min-h-[70vh] ">No quests available for now</p>
          </div>
        ) : (
          quests.map((quest) => (
            <Link
              key={quest._id}
              href={quest.isLinkDisabled ? "#" : `/quests/${quest._id}`}
              className={`border border-gray-700 w-72 md:w-72 rounded-xl bg-gray-900 hover:bg-gray-800 mb-4 flex flex-col justify-between items-center shadow-md transition-all duration-300 ${
                quest.isLinkDisabled ? "cursor-not-allowed" : ""
              }`}
              onClick={(e) => quest.isLinkDisabled && e.preventDefault()}>
              <img
                className="rounded-xl h-36 object-cover w-full"
                src={quest.questImage}
                alt={quest.questName}
                onError={(e) => (e.target.src = "/quest/bitcoin.jpg")}
              />
              <div className="flex justify-between items-center w-full px-3 my-2">
                <span className="uppercase font-bold text-gray-100">
                  {quest.questName}
                </span>
                <Button
                  className={`px-4 py-2 text-xs transition-colors duration-300 ${
                    quest.isLinkDisabled
                      ? "bg-neutral-900 text-gray-400 cursor-not-allowed"
                      : "bg-gold-500 text-black hover:bg-yellow-500"
                  }`}>
                  {quest.questStatus}
                </Button>
              </div>
              <div className="mx-3 pb-2 text-xs text-justify">
                {quest.questDescription ||
                  "Embark on Word Trails, learn about blockchain - Think, Tap, Win. Earn Tokens and NFTs"}
              </div>
              <div className="flex justify-between gap-1 items-center text-xs px-3 w-full mb-2">
                <span className="border border-gray-700 p-2 rounded-md bg-gray-700 text-gray-300">
                  {quest.questQuestions.length} questions
                </span>
                <div className="flex items-center border gap-1 border-gray-700 px-2 py-1.5 rounded-md bg-gray-700 text-gray-300">
                  <span>{1000 * quest.questQuestions.length}</span>
                  <img src="coins.png" width={20} alt="points" />
                </div>
                <span className="border border-yellow-400 px-1 py-2 rounded-full text-gold-500">
                  {Math.round(
                    ((quest.questQuestions.length + 51) * 100) /
                      100
                  )}
                  %
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </section>
  );
};

export default FetchQuestsFromDb;
