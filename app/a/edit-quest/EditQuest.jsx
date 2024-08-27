"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "@/app/components/Reusable/SideNav";
import AdminNav from "@/app/components/Reusable/AdminNav";

export default function EditQuest() {
  const [quests, setQuests] = useState([]);
  const [selectedQuestId, setSelectedQuestId] = useState("");
  const [quest, setQuest] = useState({
    questName: "",
    questImage: "",
    questDescription: "",
  });
  const [buttonText, setButtonText] = useState("Update Quest");
  const router = useRouter();

  useEffect(() => {
    const fetchQuests = async () => {
      try {
        const response = await fetch("/api/quests");
        if (response.ok) {
          const questsData = await response.json();
          setQuests(questsData);
        } else {
          throw new Error("Failed to fetch quests");
        }
      } catch (error) {
        console.error("Error fetching quests:", error);
        toast.error("Failed to fetch quests. Please try again.");
      }
    };
    fetchQuests();
  }, []);

  useEffect(() => {
    if (selectedQuestId) {
      const fetchQuest = async () => {
        try {
          const response = await fetch(`/api/quests/${selectedQuestId}`);
          if (response.ok) {
            const questData = await response.json();
            setQuest({
              questName: questData.questName,
              questImage: questData.questImage,
              questDescription: questData.questDescription,
            });
          } else {
            throw new Error("Failed to fetch quest data");
          }
        } catch (error) {
          console.error("Error fetching quest data:", error);
          toast.error("Failed to fetch quest data. Please try again.");
        }
      };
      fetchQuest();
    }
  }, [selectedQuestId]);

  const handleQuestChange = (e) => {
    setSelectedQuestId(e.target.value);
  };

  const handleChange = (e) => {
    setQuest({ ...quest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Updating Quest");
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("Login to continue");
      }
      const response = await fetch(`/api/quests/${selectedQuestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          userId: userId,
        },
        body: JSON.stringify({
          ...quest,
          addedBy: userId,
          lastEditedBy: userId,
        }),
      });
      if (response.ok) {
        toast.success("Quest updated successfully!");
        // router.push("/quests");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update quest");
      }
    } catch (error) {
      console.error("Error updating quest:", error);
      toast.error(error.message || "Failed to update quest. Please try again.");
    } finally {
      setButtonText("Update Quest");
    }
  };

  return (
    <section>
      <div className="max-w-md min-w-72 my-20 mx-auto p-6 bg-slate-800 text-white rounded-lg shadow-xl">
        <div className="flex text-gold-500 justify-start gap-6 items-center py-4">
          <AdminNav />
          <h1 className="text-2xl font-bold">Edit Quest</h1>
        </div>
        <div className="mb-4">
          <label htmlFor="selectQuest" className="block mb-2">
            Select Quest to Edit
          </label>
          <select
            id="selectQuest"
            name="selectQuest"
            value={selectedQuestId}
            onChange={handleQuestChange}
            className="w-full px-3 py-2 rounded-md">
            <option value="" disabled>
              Select a quest
            </option>
            {quests.map((quest) => (
              <option key={quest._id} value={quest._id}>
                {quest.questName}
              </option>
            ))}
          </select>
        </div>
        {selectedQuestId && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="questName" className="block mb-2">
                Quest Name
              </label>
              <input
                type="text"
                id="questName"
                name="questName"
                value={quest.questName}
                onChange={handleChange}
                required
                autoFocus
                className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label htmlFor="questImage" className="block mb-2">
                Quest Image URL
              </label>
              <input
                type="text"
                id="questImage"
                name="questImage"
                value={quest.questImage}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
            </div>
            <div>
              <label htmlFor="questDescription" className="block mb-2">
                Quest Description
              </label>
              <textarea
                id="questDescription"
                name="questDescription"
                value={quest.questDescription}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-600 text-black py-2 px-4 rounded-md font-bold hover:bg-yellow-700 transition duration-300">
              {buttonText}
            </button>
          </form>
        )}
        <div className="flex justify-end mr-4 mt-20">
          <SideNav />
        </div>
      </div>
      <ToastContainer />
    </section>
  );
}
