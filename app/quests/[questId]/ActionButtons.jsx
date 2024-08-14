import { useState } from "react";
import { MdDelete } from "react-icons/md";
import Modal from "@/app/components/Reusable/Modal";

const ActionButtons = ({ currentQuestion, deleteLast, points, setPoints }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    type: null, // 'confirm' or 'hint'
  });

  const openConfirmModal = () => {
    if (points >= 200) {
      setModalState({ isOpen: true, type: "confirm" });
    } else {
      alert("Not enough points to get a hint!");
    }
  };

  const closeModal = () => setModalState({ isOpen: false, type: null });

  const confirmHint = () => {
    setPoints(points - 200);
    setModalState({ isOpen: true, type: "hint" });
  };

  const getModalContent = () => {
    if (modalState.type === "confirm") {
      return (
        <>
          <h2 className="text-xl font-bold text-gold-500 mb-4">Confirm Hint</h2>
          <p className="mb-4">
            Are you sure you want to spend 200 coins to get a hint?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={closeModal}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-gray-400">
              No
            </button>
            <button
              onClick={confirmHint}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Yes
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
