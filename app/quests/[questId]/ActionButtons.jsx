import { useState } from "react";
import { MdDelete } from "react-icons/md";
import { FaSpinner } from "react-icons/fa";
import Modal from "@/app/components/Reusable/Modal";

const ActionButtons = ({
  currentQuestion,
  deleteLast,
  points,
  setPoints,
  userId,
}) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'confirm' or 'hint'
  });
    const [isLoading, setIsLoading] = useState(false);


  const openConfirmModal = () => {
    if (points >= 200) {
      setModalState({ isOpen: true, type: "confirm" });
    } else {
      alert("Not enough points to get a hint!");
    }
  };

  const closeModal = () => setModalState({ isOpen: false, type: null });

  const confirmHint = async () => {
    try {
      setIsLoading(true);
      if (!userId) {
        throw new Error("User ID not provided");
      }
      const response = await fetch("/api/claim", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          pointsDelta: -200, 
          playPassDelta: 0,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update points");
      }

      const data = await response.json();
      setPoints(data.points);
      setIsLoading(false);
      setModalState({ isOpen: true, type: "hint" });
    } catch (error) {
      console.error("Error updating points:", error);
      alert("Failed to update points. Please try again.");
      closeModal();
      setIsLoading(false);
    }
  };

  const getModalContent = () => {
    if (modalState.type === "confirm") {
      return (
        <>
          <h2 className="text-xl font-bold mb-4">Confirm Hint</h2>
          <p className="mb-4">
            Are you sure you want to spend 200 coins to get a hint?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeModal}
              className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
              disabled={isLoading}>
              Cancel
            </button>
            <button
              onClick={confirmHint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center justify-center px-7">
                  <FaSpinner className="animate-spin cursor-not-allowed"/>
                  
                </span>
              ) : (
                "Confirm"
              )}
            </button>
          </div>
        </>
      );
    } else if (modalState.type === "hint") {
      return (
        <>
          <h2 className="text-xl font-bold mb-4">Hint</h2>
          <p className="mb-4">{currentQuestion.hint || "No hint available"}</p>
          <button
            onClick={closeModal}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Close
          </button>
        </>
      );
    }
    return null;
  };

  return (
    <div className="flex items-center gap-4 my-4">
      <button
        onClick={openConfirmModal}
        className="flex-grow bg-white text-black py-2 px-4 rounded text-sm font-bold flex items-center justify-center">
        GET HINT WITH
        <img src="../chaincoins.svg" className="w-5 h-8 ml-2" alt="hint" />
        <span className="ml-1">200</span>
      </button>

      <Modal isOpen={modalState.isOpen} onClose={closeModal}>
        <div className="p-4">{getModalContent()}</div>
      </Modal>

      <button
        className="flex-shrink-0 bg-red-700 active:bg-red-500 px-4 py-2 rounded flex flex-col items-center justify-center"
        onClick={deleteLast}>
        <MdDelete className="text-xl" />
        <span className="text-xs">Del</span>
      </button>
    </div>
  );
};

export default ActionButtons;
