"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "@/app/components/Reusable/SideNav";

export default function CreateQuestQuestion() {
  const [quests, setQuests] = useState([]);
  const [selectedQuestId, setSelectedQuestId] = useState("");
  const [question, setQuestion] = useState({
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    hint: "",
    questAnswer: "",
    scrambledAnswer: "",
    isAnswered: false,
  });

  useEffect(() => {
    fetchQuests();
  }, []);

  const fetchQuests = async () => {
    try {
      const response = await fetch("/api/quests");
      if (response.ok) {
        const data = await response.json();
        setQuests(data);
        if (data.length > 0) {
          setSelectedQuestId(data[0]._id);
        }
      } else {
        throw new Error("Failed to fetch quests");
      }
    } catch (error) {
      console.error("Error fetching quests:", error);
      toast.error("Failed to fetch quests. Please try again.");
    }
  };

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/quests/${selectedQuestId}/questions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(question),
      });
      if (response.ok) {
        const data = await response.json();
        toast.success("Question added successfully!");
        setQuestion({
          img1: "",
          img2: "",
          img3: "",
          img4: "",
          hint: "",
          questAnswer: "",
          scrambledAnswer: "",
          isAnswered: false,
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to add quest question:", errorData);
        throw new Error(errorData.error || "Failed to add quest question");
      }
    } catch (error) {
      console.error("Error adding quest question:", error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <section>
      <div className="flex justify-end mr-4 mt-20">
        <SideNav />
      </div>
      <div className="max-w-md mx-auto mt-4 p-6 bg-neutral-700 rounded-lg shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-yellow-600">
          Add Quest Question
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="questSelect" className="block   mb-2">
              Select Quest
            </label>
            <select
              id="questSelect"
              value={selectedQuestId}
              onChange={(e) => setSelectedQuestId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md   ">
              {quests.map((quest) => (
                <option key={quest._id} value={quest._id}>
                  {quest.questName}
                </option>
              ))}
            </select>
          </div>
          {["img1", "img2", "img3", "img4"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block   mb-2">
                {field} URL
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={question[field]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md   "
              />
            </div>
          ))}
          <div>
            <label htmlFor="hint" className="block   mb-2">
              Hint
            </label>
            <textarea
              id="hint"
              name="hint"
              value={question.hint}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md   "
            />
          </div>
          <div>
            <label htmlFor="questAnswer" className="block   mb-2">
              Correct Answer
            </label>
            <input
              type="text"
              id="questAnswer"
              name="questAnswer"
              value={question.questAnswer}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md   "
            />
          </div>
          <div>
            <label
              htmlFor="scrambledAnswer"
              className="block   mb-2">
              Scrambled Answer
            </label>
            <input
              type="text"
              id="scrambledAnswer"
              name="scrambledAnswer"
              value={question.scrambledAnswer}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md   "
            />
          </div>
          <button
            type="submit"
            className="w-full bg-yellow-600 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300">
            Add Question
          </button>
        </form>
      </div>
      <ToastContainer />
    </section>
  );
}
