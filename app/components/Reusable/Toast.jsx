import { FaCheckCircle, FaTimes } from "react-icons/fa";

const Toast = ({
  icon: Icon = FaCheckCircle,
  message = "Changes saved",
  description = "Your product changes have been saved.",
  onClose,
  className = "",
  iconColor = "text-green-600",
}) => {
  return (
    <div
      role="alert"
      className={`rounded-xl border border-gray-100 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 ${className} mt-40`}>
      <div className="flex items-start gap-4">
        <span className={iconColor}>
          <Icon className="h-6 w-6" />
        </span>

        <div className="flex-1">
          <strong className="block font-medium text-gray-900 dark:text-white">
            {message}
          </strong>

          <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
            {description}
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 transition hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-500">
            <span className="sr-only">Dismiss popup</span>
            <FaTimes className="h-6 w-6" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;


// To use this component ⤵ 
// import { FaExclamationCircle } from "react-icons/fa";
// import Toast from "./Toast";

// const App = () => {
//   const handleClose = () => {
//     console.log("Toast closed");
//   };

//   return (
//     <div>
//       <Toast
//         icon={FaExclamationCircle}
//         message="Error occurred"
//         description="An error has occurred while saving the data."
//         onClose={handleClose}
//         iconColor="text-red-600"
//         className="mt-10"
//       />
//     </div>
//   );
// };

// export default App;
