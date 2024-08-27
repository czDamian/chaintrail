"use client";
import { useState, useEffect } from "react";
import SideNav from "../components/Reusable/SideNav";
import Button from "../components/Reusable/Button";
import Link from "next/link";
import { QuestSkeleton } from "../components/HomePage/CustomLoader";

const FetchQuestsFromDb = () => {
  const [quests, setQuests] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestsandProgress = async () => {
      const userId = localStorage.getItem("userId");
      try {
        // Fetch quests
        const questsResponse = await fetch(`/api/quests?userId=${userId}`);

        // Fetch user data
        const userResponse = await fetch(`/api/users?userId=${userId}`);

        if (questsResponse.ok && userResponse.ok) {
          const questsData = await questsResponse.json();
          const userData = await userResponse.json();

          setQuests(questsData);
          setUserProgress(userData.currentQuestion || {});
          console.log(userData.currentQuestion);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestsandProgress();
  }, []);

  const calculateProgress = (quest) => {
    if (quest.questStatus == "completed") return 100;
    if (quest.questStatus == "locked") return 0;

    const currentQuestionNumber = userProgress[quest._id] || 0;
    console.log("currentQuestionNumber", currentQuestionNumber);
    const totalQuestions = quest.questQuestions.length;
    console.log("totalQuestions", totalQuestions);

    if (currentQuestionNumber > totalQuestions) return 100;

    return Math.round((currentQuestionNumber / totalQuestions) * 100);
  };

  return (
    <section className=" my-20 w-full">
      <h1 className="font-bold my-8 text-gold-500 text-4xl">QUESTS</h1>
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
              <div className="relative w-full">
                <img
                  className="rounded-xl h-36 object-cover w-full"
                  src={quest.questImage}
                  alt={quest.questName}
                  onError={(e) => (e.target.src = "/quest/bitcoin.jpg")}
                />
                <Button
                  className={`absolute bottom-1 right-2 px-4 py-2 text-xs transition-colors duration-300 ${
                    quest.questStatus === "locked"
                      ? "bg-neutral-900 text-gray-300 cursor-not-allowed"
                      : quest.questStatus === "completed"
                      ? "bg-blue-500 text-black hover:bg-blue-600 cursor-not-allowed tex-xs"
                      : "bg-gold-500 text-black hover:bg-yellow-600"
                  }`}>
                  {quest.questStatus}
                </Button>
              </div>

              <div className="flex justify-between items-center w-full px-3 my-2">
                <span className="uppercase font-bold text-gray-100 ">
                  {quest.questName}
                </span>
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
                <span className="border border-yellow-400 px-1 py-2 rounded-full text-gold-500 min-w-8 text-center">
                  {calculateProgress(quest)}%
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
      <SideNav />
    </section>
  );
};

export default FetchQuestsFromDb;
