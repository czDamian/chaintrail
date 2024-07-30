import { FaTimes } from "react-icons/fa";

const Modal = ({ isOpen, onClose, hintText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
      <div className="bg-gray-800 text-white rounded-lg shadow-xl w-[300px] p-2">
        <div className="flex justify-between items-center p-4">
          <h2 className="text-2xl text-yellow-400 underline decoration-dotted">
            Hint
          </h2>
          <button className="text-red-500 hover:text-red-700" onClick={onClose}>
            <FaTimes size={24} />
          </button>
        </div>
        <div className="p-4 pt-0">
          <p className="text-sm text-gray-300">{hintText}</p>
        </div>
      </div>
    </div>
  );
};

export default Modal;
