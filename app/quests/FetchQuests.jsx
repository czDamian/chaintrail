"use client";
import { useState, useEffect } from "react";
import SideNav from "../components/Reusable/SideNav";
import Button from "../components/Reusable/Button";
import Link from "next/link";
import { QuestSkeleton } from "../components/HomePage/CustomLoader";

const FetchQuestsFromDb = () => {
  const [quests, setQuests] = useState([]);
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = localStorage.getItem("userId");

        if (!userId) {
          throw new Error("User ID not found in local storage");
        }

        const [questsResponse, userProgressResponse] = await Promise.all([
          fetch("/api/quests"),
          fetch(`/api/users/progress?userId=${userId}`),
        ]);

        if (questsResponse.ok && userProgressResponse.ok) {
          const questsData = await questsResponse.json();
          const userProgressData = await userProgressResponse.json();

          const updatedQuests = questsData.map((quest, index) => {
            const isUnlocked =
              index === 0 ||
              userProgressData.completedQuests.includes(
                questsData[index - 1]._id
              );

            return {
              ...quest,
              status: userProgressData.completedQuests.includes(quest._id)
                ? "completed"
                : isUnlocked
                ? "unlocked"
                : "locked",
            };
          });

          setQuests(updatedQuests);
          setUserProgress(userProgressData);
        } else {
          throw new Error("Failed to fetch data");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("error fetching quests");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getQuestLink = (quest) => {
    if (quest.status === "locked" || quest.status === "completed") {
      return "#";
    }
    if (quest._id === userProgress?.currentQuest) {
      return `/quests/${quest._id}/questions/${userProgress.currentQuestion}`;
    }
    return `/quests/${quest._id}`;
  };

  const calculateCompletionRate = (quest) => {
    const totalQuestions = quest.questQuestions.length;
    const completedQuestions = userProgress.completedQuests.includes(quest._id)
      ? totalQuestions
      : userProgress.currentQuest === quest._id
      ? userProgress.currentQuestion
      : 0;

    return (completedQuestions / totalQuestions) * 100;
  };

  return (
    <section className="bg-gray-900 mb-20">
      <div className="flex justify-between items-center mx-4 my-4 py-2 text-gray-300">
        <h1 className="font-bold text-gold-500 text-4xl">QUESTS</h1>
        <SideNav />
      </div>
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {loading
          ? Array.from({ length: 6 }).map((_, index) => (
              <QuestSkeleton key={index} />
            ))
          : quests.map((quest) => (
              <Link
                key={quest._id}
                href={getQuestLink(quest)}
                className={`border border-gray-700 w-72 md:w-72 rounded-xl bg-gray-900 hover:bg-gray-800 mb-4 flex flex-col justify-between items-center shadow-md transition-all duration-300 ${
                  quest.status === "locked"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}>
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
                      quest.status === "completed"
                        ? "bg-green-500 text-white"
                        : quest.status === "unlocked"
                        ? "bg-gold-500 text-black hover:bg-yellow-500"
                        : "bg-gray-500 text-white"
                    }`}>
                    {quest.status.charAt(0).toUpperCase() +
                      quest.status.slice(1)}
                  </Button>
                </div>
                <div className="mx-3 pb-2 text-xs text-justify">
                  {quest.questDescription ||
                    "Embark on Word Trails, learn about blockchain - Think, Tap, Win. Earn Tokens and NFTs"}
                </div>
                {quest.status !== "locked" && (
                  <div className="w-full px-3 mb-2">
                    <div className="bg-gray-700 h-2 rounded-full">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${calculateCompletionRate(quest)}%`,
                        }}></div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      {calculateCompletionRate(quest).toFixed(0)}% completed
                    </p>
                  </div>
                )}
              </Link>
            ))}
      </div>
    </section>
  );
};

export default FetchQuestsFromDb;
