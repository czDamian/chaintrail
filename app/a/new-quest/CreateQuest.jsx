"use client";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "@/app/components/Reusable/SideNav";
import AdminNav from "@/app/components/Reusable/AdminNav";

export default function CreateQuest() {
  const [quest, setQuest] = useState({
    questName: "",
    questImage: "",
    questDescription: "",
  });
  const [buttonText, setButtonText] = useState("Create Quest");

  const handleChange = (e) => {
    setQuest({ ...quest, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setButtonText("Creating Quest");
    try {
      const userId = localStorage.getItem("userId");
      const response = await fetch("/api/quests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...quest, addedBy: userId, lastEditedBy: "" }),
      });
      if (response.ok) {
        toast.success("Quest created successfully!");
        setQuest({
          questName: "",
          questImage: "",
          questDescription: "",
        });
        setButtonText("Create Quest");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to create quest");
      }
    } catch (error) {
      console.error("Error creating quest:", error);
      toast.error(error.message || "Failed to create quest. Please try again.");
      setButtonText("Create Quest");
    }
  };

  return (
    <section className="my-20">
      <div className="max-w-md mx-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-xl">
        <div className="flex text-gold-500 justify-start gap-6 items-center py-4">
          <AdminNav />
          <h1 className="text-2xl font-bold">New Quest</h1>
        </div>
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
              placeholder="eg: BlockChain"
              required
              autoFocus
              className="w-full px-3 py-2 rounded-md focus:outline-none focus:ring-1 focus:ring-yellow-500 text-sm"
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
              placeholder="https:example.com/bitcoin.jpg"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm"
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
              placeholder="Learn how to make secure transactions"
              minLength={30}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 text-black py-2 px-4 rounded-md font-bold hover:bg-yellow-700 transition duration-300">
            {buttonText}
          </button>
        </form>
      </div>
      <ToastContainer />
      <SideNav />
    </section>
  );
}
