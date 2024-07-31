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

export default CustomLoader;
