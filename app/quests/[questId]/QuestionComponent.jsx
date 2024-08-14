"use client";
import { useState, useEffect, memo } from "react";
import SideNav from "@/app/components/Reusable/SideNav";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Loader from "@/app/loader";
import UserInfoBar from "./UserInfoBar";
import QuestionImages from "./QuestionImages";
import AnswerDisplay from "./AnswerDisplay";
import AnswerButtons from "./AnswerButtons";
import ActionButtons from "./ActionButtons";
import PopupHandler from "./PopupHandler";
import QuestUI from "./QuestUI";

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
//functions begins
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
    return <Loader />;
  }

  if (!questions.length) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <section className="max-w-screen-xl mt-2 mx-auto px-4 sm:px-6 lg:px-8">
      <QuestUI />
      <UserInfoBar
        points={points}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        playPass={playPass}
      />
      <section className="max-w-[320px]">
        <QuestionImages currentQuestion={currentQuestion} />
        <AnswerDisplay
          currentQuestion={currentQuestion}
          selectedAnswers={selectedAnswers}
        />
        <AnswerButtons
          currentQuestion={currentQuestion}
          handleAnswerClick={handleAnswerClick}
        />
        <ActionButtons
          currentQuestion={currentQuestion}
          deleteLast={deleteLast}
          points={points}
          setPoints={setPoints}
        />
        <PopupHandler
          showPopup={showPopup}
          isCompleted={isCompleted}
          showComplete={showComplete}
          isCorrect={isCorrect}
        />
      </section>
      <SideNav />
      <ToastContainer />
    </section>
  );
};

export default memo(QuestionComponent);
