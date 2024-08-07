"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "@/app/components/Reusable/SideNav";

export default function CreateQuest() {
  const [quest, setQuest] = useState({
    questName: "",
    questImage: "",
    questStatus: "locked",
    questDescription: "",
  });

  const handleChange = (e) => {
    setQuest({ ...quest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quest),
      });
      if (response.ok) {
        toast.success("Quest created successfully!");
        setQuest({
          questName: "",
          questImage: "",
          questStatus: "locked",
          questDescription: "", // Reset questDescription field
        });
      } else {
        throw new Error("Failed to create quest");
      }
    } catch (error) {
      console.error("Error creating quest:", error);
      toast.error("Failed to create quest. Please try again.");
    }
  };

  return (
    <section className="mt-20">
      <div className="max-w-md mx-auto mt-10 p-6 bg-neutral-700 text-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-yellow-600">
          Create New Quest
        </h2>
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
            <label htmlFor="questStatus" className="block mb-2">
              Quest Status
            </label>
            <select
              id="questStatus"
              name="questStatus"
              value={quest.questStatus}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md">
              <option value="locked">Locked</option>
              <option value="open">Open</option>
              <option value="completed">Completed</option>
            </select>
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
            Create Quest
          </button>
        </form>
      </div>
      <ToastContainer />
      <SideNav />
    </section>
  );
}
