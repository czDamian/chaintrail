"use client";
import { useRouter } from "next/navigation";
import { RxCaretLeft } from "react-icons/rx";
const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center justify-center  hover:bg-gray-600 text-white rounded-full transition duration-300 ease-in-out">
      <RxCaretLeft className="text-3xl" />
    </button>
  );
};

export default BackButton;
