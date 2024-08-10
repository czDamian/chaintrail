import { FaTimes } from "react-icons/fa";

const Toast = ({
  message = "Congratulations",
  className = "",
  borderLeftColor = "border-green-600",
}) => {
  return (
    <div
      role="alert"
      className={`rounded-lg rounded-l-none z-50 border-l-4 right-0 ${borderLeftColor} p-4 bg-slate-950 fixed top-12 ${className}`}>
      <div className="flex items-center gap-4">
        <div className="text-sm">{message}</div>

        <button className="text-gray-500 transition hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500">
          <FaTimes className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default Toast;
