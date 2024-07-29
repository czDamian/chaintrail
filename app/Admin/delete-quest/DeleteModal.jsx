const DeleteModal = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-neutral-900 p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-bold mb-4">Warning</h2>
        <p className="mb-4">
          Are you sure you want to delete this quest? This action cannot be
          undone.
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-600 text-white py-2 px-4 rounded-md font-bold hover:bg-red-700">
            I Know
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-black py-2 px-4 rounded-md font-bold hover:bg-gray-400">
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
