"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { MdDelete } from "react-icons/md";
import SideNav from "@/app/components/Reusable/SideNav";
import Modal from "@/app/components/Reusable/Modal";
import { Success } from "@/app/components/Reusable/Popup";
import { Wrong } from "@/app/components/Reusable/Popup";
import { Complete } from "@/app/components/Reusable/Popup";
import { useTelegramAuth } from "@/app/TelegramAuthProvider";
import Loader from "@/app/loader";
import FetchPoints from "@/app/components/user/FetchPoints";
import FetchPass from "@/app/components/user/FetchPass";

const QuestionComponent = ({ questId }) => {
  const { updatePoints } = useTelegramAuth();
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
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
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
  const handleSubmit = (answers = selectedAnswers) => {
    const currentQuestion = questions[currentQuestionIndex] || {};
    const submittedAnswer = answers.join("");
    const correct =
      submittedAnswer.toUpperCase() ===
      (currentQuestion.questAnswer || "").toUpperCase();

    setIsCorrect(correct);
    setShowPopup(true);

    if (correct) {
      if (SuccessSound) {
        SuccessSound.play().catch((error) =>
          console.error("Error playing sound:", error)
        );
      }
      updatePoints(1000);
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
        <div className="flex flex-col items-center">
          <FetchPoints />
          <FetchPass />
        </div>
        <div className="flex items-center">
          <img src="../redImg.png" alt="level" className="w-12 h-11" />
          <span className="relative text-xs -ml-7 mt-1 font-bold">
            {currentQuestionIndex + 1}/{questions.length}
          </span>
        </div>
        <SideNav />
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
    </section>
  );
};

export default QuestionComponent;

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
