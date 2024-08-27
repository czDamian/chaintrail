const Logout = ({ onLogout, onClose }) => {
  return (
    <div className="absolute top-10 right-0 w-30 bg-gray-900">
      <button
        onClick={() => {
          onLogout();
          onClose();
        }}
        className="w-full border border-gray-500 rounded-lg text-left px-4 py-3 hover:bg-gray-950">
        Logout
      </button>
    </div>
  );
};

export default Logout;
