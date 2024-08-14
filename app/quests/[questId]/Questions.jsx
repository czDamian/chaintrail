"use client";
import { useState, useEffect, memo } from "react";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import SideNav from "@/app/components/Reusable/SideNav";
import Modal from "@/app/components/Reusable/Modal";
import { Success, Wrong, Complete } from "@/app/components/Reusable/Popup";
import Loader from "@/app/loader";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const QuestionComponent = ({ questId }) => {
  const [points, setPoints] = useState(0);
  const [playPass, setPlayPass] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const buttonSound =
    typeof Audio !== "undefined" ? new Audio("/btn/pick.mp3") : null;
  const SuccessSound =
    typeof Audio !== "undefined" ? new Audio("/btn/correct.mp3") : null;
  const wrongSound =
    typeof Audio !== "undefined" ? new Audio("/btn/fail.mp3") : null;
  const congratsSound =
    typeof Audio !== "undefined" ? new Audio("/btn/congrats.mp3") : null;

  const fetchQuestions = async () => {
    try {
      const res = await fetch(`/api/quests/${questId}/questions`);
      if (!res.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await res.json();
      setQuestions(data);
      setLoading(false);

      // Fetch user's points and play pass
      await fetchUserData();
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  const fetchUserData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      const response = await fetch(`/api/users?userId=${userId}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }

      setPoints(data.points);
      setPlayPass(data.playPass);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error(
        "An error occurred while fetching user data. Please try again."
      );
    }
  };

  useEffect(() => {
    if (questId) {
      fetchQuestions();
    }
  }, [questId]);

  const handleAnswerClick = (answer) => {
    if (buttonSound) {
      buttonSound
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }

    const newSelectedAnswers = [...selectedAnswers, answer];
    setSelectedAnswers(newSelectedAnswers);

    const currentQuestion = questions[currentQuestionIndex] || {};
    if (
      currentQuestion.questAnswer &&
      newSelectedAnswers.length === currentQuestion.questAnswer.length
    ) {
      handleSubmit(newSelectedAnswers);
    }
  };

  const deleteLast = () => {
    if (buttonSound) {
      buttonSound
        .play()
        .catch((error) => console.error("Error playing sound:", error));
    }
    setSelectedAnswers(selectedAnswers.slice(0, -1));
  };

  const handleSubmit = async (answers = selectedAnswers) => {
    const currentQuestion = questions[currentQuestionIndex] || {};
    const submittedAnswer = answers.join("");
    const correct =
      submittedAnswer.toUpperCase() ===
      (currentQuestion.questAnswer || "").toUpperCase();

    // Check if the user has enough play pass before proceeding
    if (playPass <= 0) {
      toast.error("Insufficient Play Pass");
      return;
    }

    setIsCorrect(correct);
    setShowPopup(true);

    if (correct) {
      if (SuccessSound) {
        SuccessSound.play().catch((error) =>
          console.error("Error playing sound:", error)
        );
      }

      try {
        const userId = localStorage.getItem("userId");
        if (!userId) {
          throw new Error("User ID not found in local storage");
        }

        const updateResponse = await fetch("/api/claim", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: userId,
            pointsDelta: 1000,
            playPassDelta: -1,
          }),
        });

        if (!updateResponse.ok) {
          throw new Error("Failed to update points and play pass");
        }

        const updateData = await updateResponse.json();
        setPoints(updateData.points);
        setPlayPass(updateData.playPass);
      } catch (error) {
        console.error("Error updating points:", error);
        toast.error(
          "An error occurred while updating points. Please try again."
        );
      }
    } else {
      if (wrongSound) {
        wrongSound
          .play()
          .catch((error) => console.error("Error playing wrong sound:", error));
      }
    }

    if (currentQuestionIndex === questions.length - 1) {
      setIsCompleted(true);
      setTimeout(() => {
        setShowComplete(true);
        setTimeout(() => {
          if (congratsSound) {
            congratsSound
              .play()
              .catch((error) => console.error("Error playing sound:", error));
          }
        }, 1000);
      }, 4000);
    } else {
      setTimeout(() => {
        handleNext();
      }, 1500);
    }
  };

  const handleNext = () => {
    if (isCompleted || showComplete) {
      console.log("Quest completed");
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswers([]);
      setShowPopup(false);
    }
  };

  useEffect(() => {
    if (showPopup && !isCompleted) {
      const timer = setTimeout(() => {
        setShowPopup(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup, isCompleted]);

  if (loading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (!questions.length) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <section className="max-w-screen-xl mt-2 mx-auto px-4 sm:px-6 lg:px-8">
      <QuesUI />
      <div className="py-2 flex justify-between items-center text-sm">
        <div className="text-xs gap-1 flex items-center">
          <img src="../chaincoins.svg" alt="Chain Coins" className="w-6 h-6" />
          <span>{points}</span>
        </div>
        <div className="flex items-center">
          <img src="../redImg.png" alt="level" className="w-12 h-11" />
          <span className="relative text-xs -ml-7 mt-1 font-bold">
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
        <div className="text-xs gap-1 flex items-center">
          <img src="../ticket.png" alt="Chain Coins" className="w-6 h-6" />
          <span>{playPass}</span>
        </div>
      </div>
      <section className="max-w-[320px]">
        <div className="grid grid-cols-2 gap-4">
          {currentQuestion &&
            ["img1", "img2", "img3", "img4"].map(
              (key, index) =>
                currentQuestion[key] && (
                  <img
                    key={index}
                    loading="lazy"
                    src={currentQuestion[key]}
                    className="rounded-lg w-full h-32 object-cover hover:brightness-75 transition-all"
                    alt={`question ${currentQuestionIndex + 1} image ${
                      index + 1
                    }`}
                  />
                )
            )}
        </div>
        <div className="text-white py-4 flex justify-center">
          <div className="flex max-w-[300px] flex-wrap items-center gap-2">
            {currentQuestion &&
              currentQuestion.questAnswer &&
              currentQuestion.questAnswer.length > 0 &&
              Array.from({ length: currentQuestion.questAnswer.length }).map(
                (_, index) => (
                  <span
                    key={index}
                    className="w-8 h-10 bg-gray-700 rounded mx-1 flex items-center justify-center text-lg uppercase">
                    {selectedAnswers[index] || ""}
                  </span>
                )
              )}
          </div>
        </div>
        <div className="my-4">
          <div className="flex flex-wrap justify-center gap-2">
            {currentQuestion &&
              currentQuestion.scrambledAnswer &&
              currentQuestion.scrambledAnswer.split("").map((answer, index) => (
                <button
                  key={index}
                  className="bg-black hover:bg-yellow-700 active:bg-yellow-900 text-white py-2 px-4 rounded-md text-lg uppercase"
                  onClick={() => handleAnswerClick(answer)}>
                  {answer}
                </button>
              ))}
          </div>
        </div>
        <div className="flex items-center gap-4 my-4">
          <button
            onClick={openModal}
            className="flex-grow bg-white text-black py-2 px-4 rounded text-sm font-bold flex items-center justify-center">
            GET HINT WITH
            <img src="../chaincoins.svg" className="w-5 h-8 ml-2" alt="hint" />
            <span className="ml-1">200</span>
          </button>
          <Modal
            isOpen={isModalOpen}
            hintText={currentQuestion.hint || "No hint available"}
            onClose={closeModal}
          />
          <button
            className="flex-shrink-0 bg-red-700 active:bg-red-500 px-4 py-2 rounded flex flex-col items-center justify-center"
            onClick={deleteLast}>
            <MdDelete className="text-xl" />
            <span className="text-xs">Del</span>
          </button>
        </div>
        {showPopup && (
          <div>
            {isCompleted && showComplete ? (
              <Complete />
            ) : isCorrect ? (
              <Success />
            ) : (
              <Wrong />
            )}
          </div>
        )}
      </section>
      <SideNav />
      <ToastContainer />
    </section>
  );
};

export default memo(QuestionComponent);

export const QuesUI = () => {
  return (
    <div className="fixed inset-0 -z-30 flex items-center justify-center bg-black font-bold text-lg">
      <div className="relative w-screen h-screen">
        <Image
          src="/btn/success.png"
          alt="success background"
          width={1000}
          height={1000}
          className="absolute inset-0 w-full h-full"
        />
        <div className="absolute inset-0 bg-black bg-opacity-80"></div>
        <div className="absolute inset-0 flex items-center justify-center"></div>
      </div>
    </div>
  );
};
