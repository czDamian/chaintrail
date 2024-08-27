"use client";
import { useState, useEffect, memo } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserInfoBar from "./UserInfoBar";
import QuestionImages from "./QuestionImages";
import AnswerDisplay from "./AnswerDisplay";
import AnswerButtons from "./AnswerButtons";
import ActionButtons from "./ActionButtons";
import PopupHandler from "./PopupHandler";
import QuestUI from "./QuestUI";
import { useRouter } from "next/navigation";
import BackButton from "@/app/components/Reusable/BackButton";
import QuestionLoader from "./QuestionLoader";

const QuestionComponent = ({ questId }) => {
  const router = useRouter();
  const [points, setPoints] = useState(0);
  const [playPass, setPlayPass] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const buttonSound =
    typeof Audio !== "undefined" ? new Audio("/btn/pick.mp3") : null;
  const SuccessSound =
    typeof Audio !== "undefined" ? new Audio("/btn/correct.mp3") : null;
  const wrongSound =
    typeof Audio !== "undefined" ? new Audio("/btn/fail.mp3") : null;
  const congratsSound =
    typeof Audio !== "undefined" ? new Audio("/btn/congrats.mp3") : null;

  // Fetch questions and user's current question index
  const fetchQuestions = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await fetch(`/api/quests/${questId}/questions`);
      const userRes = await fetch(`/api/users?userId=${userId}`);
      if (!res.ok || !userRes.ok) {
        throw new Error("Network response was not ok.");
      }
      const data = await res.json();
      const userData = await userRes.json();

      if (userData.currentQuest !== questId) {
        alert("You have not unlocked this quest.");
        router.push("/quests");
        return;
      }
      setQuestions(data);
      setPoints(userData.points);
      setPlayPass(userData.playPass);
      const userQuestIndex = userData.currentQuestion[questId] || 0;
      setCurrentQuestionIndex(
        userQuestIndex !== undefined ? userQuestIndex : 0
      );

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

  const handleSubmit = async (answers = selectedAnswers) => {
    const currentQuestion = questions[currentQuestionIndex] || {};
    const newQuestionIndex = currentQuestionIndex + 1; // Move to the next question regardless of correctness

    const isLastQuestion = newQuestionIndex >= questions.length;

    const submittedAnswer = answers.join("");
    const correct =
      submittedAnswer.toUpperCase() ===
      (currentQuestion.questAnswer || "").toUpperCase();

    if (playPass <= 0) {
      toast.error("Insufficient Play Pass");
      return;
    }

    setIsCorrect(correct);
    setShowPopup(true);

    if (isLastQuestion) {
      setIsCompleted(true);
      if (congratsSound) {
        congratsSound
          .play()
          .catch((error) => console.error("Error playing sound:", error));
      }
      setTimeout(() => {
        setShowComplete(true);
      }, 1000);
    } else {
      if (correct) {
        if (SuccessSound) {
          SuccessSound.play().catch((error) =>
            console.error("Error playing sound:", error)
          );
        }
      } else {
        if (wrongSound) {
          wrongSound
            .play()
            .catch((error) => console.error("Error playing sound:", error));
        }
      }
    }

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found in local storage");
      }

      const questsResponse = await fetch("/api/quests");
      const allQuests = await questsResponse.json();
      const currentQuestIndex = allQuests.findIndex(
        (quest) => quest._id === questId
      );
      const nextQuestId = allQuests[currentQuestIndex + 1]?._id || null;

      const updateData = {
        userId: userId,
        pointsDelta: correct ? 1000 : 0,
        playPassDelta: isLastQuestion ? -1 : 0,
        questId: questId,
        currentQuestion: {
          [questId]: newQuestionIndex,
        },
      };

      if (isLastQuestion) {
        updateData.completedQuest = questId;
        updateData.currentQuest = nextQuestId;
        if (nextQuestId) {
          updateData.currentQuestion = {
            [nextQuestId]: 0,
          };
        }
      }

      const updateResponse = await fetch("/api/claim", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });

      if (!updateResponse.ok) {
        throw new Error("Failed to update points and quest status");
      }

      const updatedUserData = await updateResponse.json();
      setPoints(updatedUserData.points);
      setPlayPass(updatedUserData.playPass);
      setCurrentQuestionIndex(newQuestionIndex);

      if (isLastQuestion) {
        setTimeout(() => {
          if (congratsSound) {
            congratsSound
              .play()
              .catch((error) => console.error("Error playing sound:", error));
          }
        }, 1000);
      } else {
        setTimeout(() => {
          handleNext();
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating points:", error);
      toast.error("An error occurred while updating points. Please try again.");
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
    return <QuestionLoader />;
  }

  if (!questions.length) {
    return <div>No questions available</div>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <section className="max-w-screen-xl mt-2 mx-auto px-4 sm:px-6 lg:px-8">
      <BackButton />
      <QuestUI />
      <UserInfoBar
        points={points}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        playPass={playPass}
      />
      <section className="max-w-[320px] mb-10">
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
      <ToastContainer />
    </section>
  );
};

export default memo(QuestionComponent);
