import { PiSpinnerGapThin } from "react-icons/pi";

const CustomLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
      <div className="flex items-center justify-center">
        <PiSpinnerGapThin className="w-16 h-16 text-5xl text-white animate-pulse" />
      </div>
    </div>
  );
};

export const QuestSkeleton = () => {
  return (
    <div className="border border-gray-700 w-72 md:w-72 rounded-xl bg-gray-900 mb-4 flex flex-col justify-between items-center shadow-md animate-pulse px-1">
      <div className="rounded-xl h-36 w-full bg-gray-700"></div>
      <div className="flex justify-between items-center w-full px-3 my-2">
        <div className="w-1/2 h- my-1 bg-gray-700 rounded"></div>
        <div className="w-1/4 h-4 bg-gray-700 rounded"></div>
      </div>
      <div className="mx-6 pb-2 h-4 bg-gray-700 rounded w-full "></div>
      <div className="flex justify-between gap-2 items-center text-xs px-3 w-full mb-2 my-2">
        <div className="w-1/3 h-4 bg-gray-700 rounded"></div>
        <div className="w-1/3 h-4 bg-gray-700 rounded"></div>
        <div className="w-1/4 h-4 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
};


export default CustomLoader;