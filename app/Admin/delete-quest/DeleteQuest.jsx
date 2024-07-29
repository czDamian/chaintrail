"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS for toastify
import SideNav from "@/app/components/Reusable/SideNav";
import DeleteModal from "./DeleteModal";

export default function DeleteQuest() {
  const [quests, setQuests] = useState([]);
  const [selectedQuestId, setSelectedQuestId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch quests from the server
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
        toast.error("Failed to fetch quests. Please try again.");
      }
    };

    fetchQuests();
  }, []);

  const handleChange = (e) => {
    setSelectedQuestId(e.target.value);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    if (!selectedQuestId) {
      toast.error("Please select a quest to delete.");
      return;
    }
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsModalOpen(false); // Close the modal

    try {
      const response = await fetch("/api/quests", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedQuestId }),
      });

      if (response.ok) {
        toast.success("Quest deleted successfully!");
        setSelectedQuestId(""); 
        const updatedResponse = await fetch("/api/quests");
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setQuests(updatedData);
        }
      } else {
        throw new Error("Failed to delete quest");
      }
    } catch (error) {
      console.error("Error deleting quest:", error);
      toast.error("Failed to delete quest. Please try again.");
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    toast.info("Deletion cancelled.");
  };

  return (
    <section>
      <div className="flex justify-end mr-4 mt-20">
        <SideNav />
      </div>
      <div className="max-w-md mx-auto mt-10 p-6 bg-neutral-700 text-white rounded-lg shadow-xl">
        <h2 className="text-2xl font-extrabold mb-6 ">Delete Quest</h2>
        <form onSubmit={handleDeleteClick} className="space-y-4">
          <div>
            <label htmlFor="questSelect" className="block mb-2">
              Select Quest to Delete
            </label>
            <select
              id="questSelect"
              name="questSelect"
              value={selectedQuestId}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-md bg-gray-800 text-white">
              <option value="">-- Select a Quest --</option>
              {quests.map((quest) => (
                <option key={quest._id} value={quest._id}>
                  {quest.questName}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-red-700 text-white py-2 px-4 rounded-md font-bold hover:bg-red-600 transition duration-300">
            Delete Quest
          </button>
        </form>
      </div>
      <DeleteModal
        isOpen={isModalOpen}
        onConfirm={handleConfirmDelete}
        onClose={handleCloseModal}
      />
      <ToastContainer /> {/* Add this to render toast notifications */}
    </section>
  );
}
