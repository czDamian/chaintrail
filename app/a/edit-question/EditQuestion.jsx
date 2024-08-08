"use client";
import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNav from "@/app/components/Reusable/SideNav";
import AdminNav from "@/app/components/Reusable/AdminNav";

export default function EditQuestion() {
  const [quests, setQuests] = useState([]);
  const [selectedQuestId, setSelectedQuestId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState("");
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

  useEffect(() => {
    if (selectedQuestId) {
      fetchQuestions(selectedQuestId);
    }
  }, [selectedQuestId]);

  useEffect(() => {
    if (selectedQuestionId) {
      fetchQuestionDetails(selectedQuestionId);
    }
  }, [selectedQuestionId]);

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

  const fetchQuestions = async (questId) => {
    try {
      const response = await fetch(`/api/quests/${questId}/questions`);
      if (response.ok) {
        const data = await response.json();
        setQuestions(data);
        if (data.length > 0) {
          setSelectedQuestionId(data[0]._id);
        }
      } else {
        throw new Error("Failed to fetch questions");
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast.error("Failed to fetch questions. Please try again.");
    }
  };

  const fetchQuestionDetails = async (questionId) => {
    const selectedQuestion = questions.find((q) => q._id === questionId);
    if (selectedQuestion) {
      setQuestion(selectedQuestion);
    } else {
      console.error("Question not found:", questionId);
      toast.error("Question not found. Please try again.");
    }
  };

  const handleChange = (e) => {
    setQuestion({ ...question, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `/api/quests/${selectedQuestId}/questions/${selectedQuestionId}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(question),
        }
      );
      if (response.ok) {
        toast.success("Question updated successfully!");
      } else {
        const errorData = await response.json();
        console.error("Failed to update quest question:", errorData);
        throw new Error(errorData.error || "Failed to update quest question");
      }
    } catch (error) {
      console.error("Error updating quest question:", error);
      toast.error("Server error. Please try again.");
    }
  };

  return (
    <section>
      <div className="max-w-6xl mx-auto mt-20 p-6 bg-neutral-700 rounded-lg shadow-xl">
        <div className="flex text-gold-500 justify-start gap-2 items-center p-4">
          <AdminNav />
          <h1 className="text-2xl font-bold">Edit Question</h1>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <label htmlFor="questSelect" className="block mb-2">
              Select Quest
            </label>
            <select
              id="questSelect"
              value={selectedQuestId}
              onChange={(e) => setSelectedQuestId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md">
              {quests.map((quest) => (
                <option key={quest._id} value={quest._id}>
                  {quest.questName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="questionSelect" className="block mb-2">
              Select Question
            </label>
            <select
              id="questionSelect"
              value={selectedQuestionId}
              onChange={(e) => setSelectedQuestionId(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md">
              {questions.map((question) => (
                <option key={question._id} value={question._id}>
                  {question.questAnswer}
                </option>
              ))}
            </select>
          </div>
          {["img1", "img2", "img3", "img4"].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block mb-2">
                {field} URL
              </label>
              <input
                type="text"
                id={field}
                name={field}
                value={question[field]}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
          ))}
          <div className="md:col-span-2">
            <label htmlFor="hint" className="block mb-2">
              Hint
            </label>
            <textarea
              id="hint"
              name="hint"
              value={question.hint}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="questAnswer" className="block mb-2">
              Correct Answer
            </label>
            <input
              type="text"
              id="questAnswer"
              name="questAnswer"
              value={question.questAnswer}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label htmlFor="scrambledAnswer" className="block mb-2">
              Scrambled Answer
            </label>
            <input
              type="text"
              id="scrambledAnswer"
              name="scrambledAnswer"
              value={question.scrambledAnswer}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full bg-yellow-600 text-black font-bold py-2 px-4 rounded-md hover:bg-yellow-700 transition duration-300">
              Update Question
            </button>
          </div>
        </form>
      </div>
      <SideNav />
      <ToastContainer />
    </section>
  );
}
